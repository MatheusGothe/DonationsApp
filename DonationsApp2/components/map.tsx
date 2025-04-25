"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { Info } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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

const TRACESTACK_URL =
  "https://tile.tracestrack.com/_/{z}/{x}/{y}.png?key=2b0f1068c0d006ba5e2d0583a6c953be";
const TRACESTACK_ATTRIB =
  '&copy; <a href="https://tracestrack.com/">Tracestrack</a> contributors | Map data © <a href="https://openstreetmap.org">OpenStreetMap</a>';

export default function MapComponent({ userLocation }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const userLocationMarkerRef = useRef<L.Marker | null>(null);
  const { toast } = useToast();
  const [points, setPoints] = useState<DonationPoint[]>([]);

  useEffect(() => {
    const initMap = async () => {
      const L = await import("leaflet");

      if (!mapRef.current || mapInstanceRef.current) return;

      const map = L.map(mapRef.current).setView([-23.55, -46.63], 12);
      L.tileLayer(TRACESTACK_URL, { attribution: TRACESTACK_ATTRIB }).addTo(map);

      mapInstanceRef.current = map;
    };

    initMap();

    return () => mapInstanceRef.current?.remove();
  }, []);

  useEffect(() => {
    const updateMarkers = async () => {
      if (!mapInstanceRef.current || points.length === 0) return;
      const L = await import("leaflet");

      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      points.forEach((point) => {
        const marker = L.marker([point.latitude, point.longitude])
          .bindPopup(`<div style="max-width:200px"><h3 style="font-weight:bold;">${point.name}</h3><p>${point.address}</p><p>${point.openingHours}</p></div>`)
          .addTo(mapInstanceRef.current);
        markersRef.current.push(marker);
      });

      const bounds = L.latLngBounds(points.map((p) => [p.latitude, p.longitude]));
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    };

    updateMarkers();
  }, [points]);

  useEffect(() => {
    const updateUserMarker = async () => {
      if (!userLocation || !mapInstanceRef.current) return;
      const { latitude, longitude } = userLocation;
      const L = await import("leaflet");

      userLocationMarkerRef.current?.remove();
      userLocationMarkerRef.current = L.marker([latitude, longitude], {
        icon: L.icon({
          iconUrl: "https://cdn-icons-png.flaticon.com/512/61/61168.png",
          iconSize: [30, 30],
        }),
      })
        .bindPopup("Você está aqui")
        .addTo(mapInstanceRef.current);

      if (points.length === 0) mapInstanceRef.current.setView([latitude, longitude], 15);
    };

    updateUserMarker();
  }, [userLocation]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full">
        <div className="flex items-center justify-center h-full bg-gray-100">
          <p className="text-gray-500">Carregando mapa...</p>
        </div>
      </div>

      <Alert className="absolute top-4 left-4 z-[1000] max-w-md mx-auto">
        <Info className="h-4 w-4" />
        <AlertTitle>Modo de Simulação</AlertTitle>
        <AlertDescription>
          A geolocalização real está desativada neste ambiente. Estamos usando
          localizações simuladas em São Paulo.
        </AlertDescription>
      </Alert>
    </div>
  );
}