import { useEffect, useRef, useState, useCallback } from "react";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface DonationPoint {
  id: string;
  name: string;
  address: string;
  openingHours: string;
  type: "food" | "clothes" | "others";
  latitude: number;
  longitude: number;
}

interface MapProps {
  userLocation?: GeolocationCoordinates | null;
}

const leafletRef = { current: null as typeof import("leaflet") | null };

const TRACESTACK_URL =
  "https://tile.tracestrack.com/_/{z}/{x}/{y}.png?key=2b0f1068c0d006ba5e2d0583a6c953be";
const TRACESTACK_ATTRIB =
  '&copy; <a href="https://tracestrack.com/">Tracestrack</a> contributors | Map data © <a href="https://openstreetmap.org">OpenStreetMap</a>';

export default function MapComponent({ userLocation }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const userLocationMarkerRef = useRef<L.Marker | null>(null);
  const { toast } = useToast();
  const [points, setPoints] = useState<DonationPoint[]>([]);

  const loadLeaflet = async () => {
    if (!leafletRef.current) {
      leafletRef.current = (await import("leaflet")).default;
    }
    return leafletRef.current;
  };

  // Inicializa o mapa
  useEffect(() => {
    const initMap = async () => {
      const L = await loadLeaflet();
      const { latitude, longitude } = userLocation;

      if (!mapRef.current || mapInstanceRef.current) return;

      // Criar o mapa
      const map = L.map(mapRef.current).setView([-23.55, -46.63], 12);
      L.tileLayer(TRACESTACK_URL, { attribution: TRACESTACK_ATTRIB }).addTo(map);

      // Referência do mapa já foi inicializada
      mapInstanceRef.current = map;

      // Adicionar marcador de localização do usuário
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

      // Adicionar o botão de centralizar sobre o mapa após o mapa ser inicializado
      const button = L.control({ position: "topleft" });

      button.onAdd = () => {
        const btn = L.DomUtil.create("button", "leaflet-control custom-btn");
        btn.classList.add("p-2", "bg-white", "shadow", "rounded-md", "cursor-pointer");
        
        // Adicionando o ícone MapPin diretamente como HTML
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C8.13 2 5 5.13 5 8c0 3.31 3.25 6.76 7 10 3.75-3.24 7-6.69 7-10 0-2.87-3.13-6-7-6zm0 8c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2-.9 2-2 2z"></path></svg>`;
        btn.onclick = () => goToUserLocation(map); // Passa o mapa para a função
        return btn;
      };

      button.addTo(mapInstanceRef.current);
      const style = document.createElement('style');
      style.innerHTML = `
        .leaflet-control.custom-btn {
          cursor: pointer !important;
        }
      `;
      document.head.appendChild(style);
    }

    initMap();
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, [userLocation]);

  // Atualiza os pontos de doação
  const updateMarkers = useCallback(async () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const L = await loadLeaflet();
    const newIds = new Set(points.map((p) => p.id));

    // Remove marcadores que não existem mais
    Object.keys(markersRef.current).forEach((id) => {
      if (!newIds.has(id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });

    // Adiciona novos marcadores
    points.forEach((point) => {
      if (!markersRef.current[point.id]) {
        const marker = L.marker([point.latitude, point.longitude])
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

    // Ajusta os bounds se houver pontos
    if (points.length) {
      const latLngs = points.map((p) => [p.latitude, p.longitude] as [number, number]);
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [points]);

  useEffect(() => {
    updateMarkers();
  }, [updateMarkers]);

  // Função para centralizar no usuário
  const goToUserLocation = () => {
    if (!userLocation || !mapInstanceRef.current) return;
    const { latitude, longitude } = userLocation;
    mapInstanceRef.current.setView([latitude, longitude], 15);
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
