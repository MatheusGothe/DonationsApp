"use client"

import { useRef } from "react"
import type { DonationType } from "./donation-point-context"

interface MapMarkerProps {
  type: DonationType
  lat: number
  lng: number
}

export default function MapMarker({ type, lat, lng }: MapMarkerProps) {
  const markerRef = useRef<HTMLDivElement>(null)

  let bgColor = "bg-green-500"
  if (type === "food") {
    bgColor = "bg-orange-500"
  } else if (type === "clothes") {
    bgColor = "bg-blue-500"
  }

  return (
    <div
      ref={markerRef}
      className={`w-6 h-6 ${bgColor} rounded-full border-2 border-white shadow-md flex items-center justify-center text-white text-xs font-bold`}
      style={{
        position: "absolute",
        transform: "translate(-50%, -50%)",
      }}
    />
  )
}
