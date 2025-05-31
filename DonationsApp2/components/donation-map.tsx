"use client";

import { useEffect, useState } from "react";
import { MapPin, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DonationPointList from "./donation-point-list";
import DonationPointForm from "./donation-point-form";
import Map from "./map";
import { useDonationPoints } from "./donation-point-context";
import { Input } from "./ui/input";

export default function DonationMap() {
  const [showForm, setShowForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchPoints, setSearchPoints] = useState<string>("");

  const {
    userLocation,
    setUserLocation,
    donationPoints, // lista original vinda do contexto
    selectedLocation,
    setSelectedLocation,
    setSelectingLocation,
    pointClicked,
    setPointClicked,
  } = useDonationPoints();

  const [filteredPoints, setFilteredPoints] = useState(donationPoints);
  const [locationResponse, setLocationResponse] = useState<boolean>(false);
  
  console.log(donationPoints,"from map.tsx")


  // Atualiza filteredPoints sempre que donationPoints, activeFilter ou searchPoints mudam
  useEffect(() => {
    let points = donationPoints;

    if (activeFilter !== "all") {
      points = points.filter((point) => point.type === activeFilter);
    }

    if (searchPoints.trim().length > 0) {
      points = points.filter((point) =>
        point.name.toLowerCase().includes(searchPoints.toLowerCase())
      );
    }

    setFilteredPoints(points);
  }, [donationPoints, activeFilter, searchPoints]);

  const requestUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Localização obtida:", position.coords);
          setUserLocation(position.coords);
          setLocationResponse(true);
        },
        (error) => {
          console.log("Erro ao obter localização:", error);
          setUserLocation(null);
          setLocationResponse(true);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
        }
      );
    } else {
      console.warn("Geolocalização não suportada neste navegador.");
    }
  };

  useEffect(() => {
    requestUserLocation();
  }, []);

  const handleCancelClick = () => {
    setShowForm(false);
    setSelectedLocation(null);
  };

  return (
    <div className="flex flex-col  md:h-[650px]">
      <header className="bg-white border-b p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-green-600" />
          <h1 className="text-xl font-bold">Pontos de Doação</h1>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Cadastrar Ponto
        </Button>
      </header>

      <div className="flex flex-col md:h-[550px] md:flex-row  ">
        {/* Conteúdo esquerdo (lista + form) - mobile fica acima do mapa, mas no md fica lado a lado */}
        <div className="w-full md:w-1/3 md:h-[550px] h-full p-4 overflow-y-auto order-2 md:order-1">
          <Tabs
            defaultValue="all"
            className="mb-4"
            onValueChange={(value) => setActiveFilter(value)}
          >
            <TabsList className="grid grid-cols-3">
              <TabsTrigger disabled={showForm} value="all">
                Todos
              </TabsTrigger>
              <TabsTrigger disabled={showForm} value="food">
                Comida
              </TabsTrigger>
              <TabsTrigger disabled={showForm} value="clothes">
                Roupas
              </TabsTrigger>
            </TabsList>
          </Tabs>
          {!showForm && (
            <>
              <div className="relative mb-2 h-auto">
                <Input
                  value={searchPoints}
                  onChange={(e) => setSearchPoints(e.target.value)}
                  type="text"
                  placeholder="Pesquisar pontos"
                  className="pl-10 pr-3 py-2 border rounded w-full"
                />
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
              <DonationPointList points={filteredPoints} />
            </>
          )}

          {/* Formulário aparece abaixo da lista em mobile e md */}
          {showForm && (
            <div className="bg-white rounded-lg shadow p-4 mt-4">
              <h2 className="text-lg font-semibold mb-4">
                Cadastrar Novo Ponto
              </h2>
              <DonationPointForm onComplete={handleCancelClick} />
            </div>
          )}
        </div>

        {/* Mapa */}
        <div className="flex-1 h-[400px]   order-1 md:order-2">
          {locationResponse && (
            <Map
              points={filteredPoints}
              requestUserLocation={requestUserLocation}
              className="h-full"
            />
          )}
        </div>
      </div>
    </div>
  );
}
