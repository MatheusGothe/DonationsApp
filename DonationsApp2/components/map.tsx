import { useEffect, useRef, useCallback } from "react";
import "leaflet/dist/leaflet.css";
import { useToast } from "@/components/ui/use-toast";
import { useDonationPoints } from "./donation-point-context";
import { MapPin } from "lucide-react";

interface MapProps {
  userLocation?: GeolocationCoordinates | null;
  points: any[];
  requestUserLocation: () => void;
}

const leafletRef = { current: null as typeof import("leaflet") | null };
const TRACESTACK_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const TRACESTACK_ATTRIB =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

/*
const TRACESTACK_URL =
  "https://tile.tracestrack.com/_/{z}/{x}/{y}.png?key=2b0f1068c0d006ba5e2d0583a6c953be";
const TRACESTACK_ATTRIB =
  '&copy; <a href="https://tracestrack.com/">Tracestrack</a> contributors | Map data © <a href="https://openstreetmap.org">OpenStreetMap</a>';
*/
export default function MapComponent({
  points,
  requestUserLocation,
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const {
    selectingLocation,
    setSelectingLocation,
    setSelectedLocation,
    selectedLocation,
    pointClicked,
    userLocation,
  } = useDonationPoints();
  const selectingLocationRef = useRef(selectingLocation);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const userLocationMarkerRef = useRef<L.Marker | null>(null);

  const temporaryMarkerRef = useRef<L.Marker | null>(null); // Marcador temporário durante a seleção

  const { toast } = useToast();
  const loadLeaflet = async () => {
    if (!leafletRef.current) {
      leafletRef.current = (await import("leaflet")).default;
    }
    return leafletRef.current;
  };

  useEffect(() => {
    selectingLocationRef.current = selectingLocation;
  }, [selectingLocation]);

  useEffect(() => {
    const initMap = async () => {
      const L = await loadLeaflet();

      // Define coordenadas padrão
      const defaultCoords = { latitude: -20.27105, longitude: -40.28518 };

      // Usa a localização do usuário se disponível, senão usa padrão
      const { latitude, longitude } = userLocation ?? defaultCoords;

      if (!mapRef.current || mapInstanceRef.current) return;

      const bounds = L.latLngBounds(
        L.latLng(-90, -180), // latitude mínima, longitude mínima (sudoeste)
        L.latLng(90, 180) // latitude máxima, longitude máxima (nordeste)
      );

      const map = L.map(mapRef.current, {
        minZoom: 1, // ou o mínimo que você quiser
        maxBounds: bounds,
        maxBoundsViscosity: 1.0, // trava o mapa para não sair dos bounds
      }).setView([latitude, longitude], 5); // zoom inicial que quiser

      L.tileLayer(TRACESTACK_URL, { attribution: TRACESTACK_ATTRIB }).addTo(
        map
      );

      mapInstanceRef.current = map;

      // Adiciona marcador se houver localização do usuário
      if (userLocation) {
        userLocationMarkerRef.current = L.marker([latitude, longitude], {
          icon: L.icon({
            iconUrl: "https://cdn-icons-png.flaticon.com/512/61/61168.png",
            iconSize: [30, 30],
          }),
        })
          .bindPopup("Você está aqui")
          .addTo(mapInstanceRef.current);
      }
      // Botão para centralizar na localização do usuário
      const button = L.control({ position: "topleft" });
      button.onAdd = () => {
        const btn = L.DomUtil.create("button", "leaflet-control custom-btn");
        btn.classList.add(
          "p-2",
          "bg-white",
          "shadow",
          "rounded-md",
          "cursor-pointer"
        );
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C8.13 2 5 5.13 5 8c0 3.31 3.25 6.76 7 10 3.75-3.24 7-6.69 7-10 0-2.87-3.13-6-7-6zm0 8c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2-.9 2-2 2z"></path></svg>`;
        btn.onclick = () => goToUserLocation(map);
        return btn;
      };
      button.addTo(mapInstanceRef.current);

      const style = document.createElement("style");
      style.innerHTML = `
          .leaflet-control.custom-btn {
            cursor: pointer !important;
          }
        `;
      document.head.appendChild(style);

      map.on("click", (e: L.LeafletMouseEvent) => {
        if (selectingLocationRef.current) {
          setSelectedLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
          setSelectingLocation(false);

          if (temporaryMarkerRef.current) {
            mapInstanceRef.current?.removeLayer(temporaryMarkerRef.current);
          }

          temporaryMarkerRef.current = L.marker([e.latlng.lat, e.latlng.lng], {
            icon: L.icon({
              iconUrl: "/gps.png",
              iconSize: [30, 30],
            }),
          })
            .addTo(map)
            .bindPopup("Local selecionado")
            .openPopup();
        }
      });

      await updateMarkers();
      if (userLocation) {
        goToUserLocation();
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, []);

  const updateMarkers = useCallback(async () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const L = await loadLeaflet();
    const newIds = new Set(points.map((p) => p.id));

    // Remove marcadores antigos
    Object.keys(markersRef.current).forEach((id) => {
      if (!newIds.has(id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });

    // Adiciona novos marcadores
    points.forEach((point) => {
      if (!markersRef.current[point.id]) {
        const marker = L.marker([point.latitude, point.longitude], {
          icon: L.icon({
            iconUrl: "/gps.png", // Ícone dos pontos de doação
            iconSize: [30, 30], // Tamanho do ícone, ajuste conforme necessário
          }),
        })
          .bindPopup(
            `<div style="max-width:200px">
                                          <h3 style="font-weight:bold;">${point.name}</h3>
                                          <p>${point.address}</p>
                                          <p>${point.openingHours}</p>
                                        </div>`
          )
          .addTo(map);
        markersRef.current[point.id] = marker;
      }
    });
  }, [points]);

  useEffect(() => {
    if (mapInstanceRef.current && points.length > 0) {
      updateMarkers();
    }
  }, [updateMarkers]);

  useEffect(() => {
    goToPointLocation(pointClicked);
  }, [pointClicked]);

  useEffect(() => {
    const mapContainer = mapRef.current;
    if (!mapContainer) return;

    mapContainer.style.cursor = selectingLocation ? "pointer" : "";
  }, [selectingLocation]);

  useEffect(() => {
    if (selectedLocation == null) {
      mapInstanceRef.current?.removeLayer(temporaryMarkerRef.current);
    }
  }, [selectedLocation]);

  const goToUserLocation = () => {
    console.log("pa ta caindo aq/????");
    if (!userLocation || !mapInstanceRef.current) {
      toast({
        title: "Permissão de localização necessária",
        description:
          "Ative a localização do navegador ou atualize as permissões para visualizar sua posição no mapa.",
        variant: "destructive", // ou "default", se preferir
        duration: 3000, // 3 segundos
      });
      return;
    }
    const { latitude, longitude } = userLocation;
    mapInstanceRef.current.setView([latitude, longitude], 15);
  };

  const goToPointLocation = () => {
    if (!pointClicked || !mapInstanceRef.current) return;
    const { latitude, longitude } = pointClicked;
    mapInstanceRef.current.setView([latitude, longitude], 15);
  };

  return (
    <div className="relative w-full h-auto">
      <div
        ref={mapRef}
        className="w-full h-[400px] sm:h-[400px] md:h-[550px]"
      />
    </div>
  );
}
