"use client"

import { useEffect, useState } from "react"
import { MapPin, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DonationPointList from "./donation-point-list"
import DonationPointForm from "./donation-point-form"
import Map from "./map"
import { useDonationPoints } from "./donation-point-context"

export default function DonationMap() {
  const [userLocation, setUserLocation] = useState<GeolocationCoordinates | null>(null);
  const [showForm, setShowForm] = useState(false)
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const { donationPoints } = useDonationPoints()

  const filteredPoints =
    activeFilter === "all" ? donationPoints : donationPoints.filter((point) => point.type === activeFilter)

    useEffect(() => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation(position.coords);
            console.log(position)
          },
          (error) => {
            console.error("Erro ao obter localização:", error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
          }
        );
      } else {
        console.warn("Geolocalização não suportada neste navegador.");
      }
    }, []);  
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white border-b p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-green-600" />
          <h1 className="text-xl font-bold">Pontos de Doação</h1>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Cadastrar Ponto
        </Button>
      </header>

      <div className="flex flex-col md:flex-row h-full">
        <div className="w-full md:w-1/3 p-4 overflow-y-auto">
          <Tabs defaultValue="all" className="mb-4">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="all" onClick={() => setActiveFilter("all")}>
                Todos
              </TabsTrigger>
              <TabsTrigger value="food" onClick={() => setActiveFilter("food")}>
                Comida
              </TabsTrigger>
              <TabsTrigger value="clothes" onClick={() => setActiveFilter("clothes")}>
                Roupas
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {showForm ? (
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <h2 className="text-lg font-semibold mb-4">Cadastrar Novo Ponto</h2>
              <DonationPointForm onComplete={() => setShowForm(false)} />
            </div>
          ) : null}

          <DonationPointList points={filteredPoints} />
        </div>

        <div className="flex-1 h-full">
         <Map points={filteredPoints} userLocation={userLocation} />
        </div>
      </div>
    </div>
  )
}
