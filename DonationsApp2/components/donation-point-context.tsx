"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import type { ReactNode } from "react";
import { addPoint,removePoint, updatePoint } from '@/services/pointService.js';
export type DonationType = "food" | "clothes" | "both";

interface PointClicked {
  id: string;
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface DonationPoint {
  id: string;
  name: string;
  address: string;
  type: DonationType;
  description: string;
  contactInfo: string;
  latitude: number;
  longitude: number;
  openingDays: string[];       // Dias da semana, ex: ["Segunda-feira", "Quarta-feira"]
  openingHourStart: string;    // Ex: "09:00"
  openingHourEnd: string;      // Ex: "14:30"
  period: string;              // Período (se você usa, pode deixar como string vazia)
}


interface Location {
  lat: number;
  lng: number;
}

interface DonationPointContextType {
  donationPoints: DonationPoint[];
  setDonationPoints: (points: DonationPoint[]) => void;
  addDonationPoint: (point: Omit<DonationPoint, 'id'>) => void;
  editDonationPoint: (id: string, updatedData: Omit<DonationPoint, 'id'>) => Promise<boolean>;
  selectingLocation: boolean;
  setSelectingLocation: (value: boolean) => void;
  selectedLocation: Location | null;
  setSelectedLocation: (location: Location) => void;
  pointClicked: PointClicked | null;
  setPointClicked: (point: PointClicked | null) => void;
  registerMap: (map: L.Map) => void;
  removeDonationPoint: (id: string, removeFromDB?: boolean) => void;
  userLocation: GeolocationCoordinates | null
  setUserLocation: (loc: GeolocationCoordinates | null) => void
  pointToEdit: DonationPoint | null;
  setPointToEdit: (point: DonationPoint | null) => void
}

const DonationPointContext = createContext<DonationPointContextType | undefined>(undefined);

export const DonationPointProvider = ({ children, initialPoints = [] }: { children: ReactNode; initialPoints?: DonationPoint[] }) => {
  const [donationPoints, setDonationPoints] = useState<DonationPoint[]>(initialPoints);
  const [selectingLocation, setSelectingLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [pointClicked, setPointClicked] = useState<PointClicked | null>(null);
  const [userLocation, setUserLocation] = useState<GeolocationCoordinates | null>(null);
  const [pointToEdit, setPointToEdit] = useState<DonationPoint | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  const addDonationPoint = async(point: Omit<DonationPoint, 'id'>) => {
    
    try {
      const id = await addPoint(point); // função que grava no Firebase e retorna o id
      const newPoint: DonationPoint = { ...point, id };
      setDonationPoints(prev => [...prev, newPoint]);
      return true;
    } catch (error) {
      console.error("Erro ao adicionar ponto no Firebase:", error);
      return false;
    }
  };

  const registerMap = useCallback((map: L.Map) => {
    mapRef.current = map;
  }, []);

  const editDonationPoint = async (id: string, updatedData: Omit<DonationPoint, 'id'>) => {
    try {
      await updatePoint(id, updatedData); // Atualiza no banco
      setDonationPoints(prev =>
        prev.map(point =>
          point.id === id ? { ...updatedData, id } : point
        )
      );
      return true;
    } catch (error) {
      console.error("Erro ao editar ponto no Firebase:", error);
      return false;
    }
  };

  const removeDonationPoint = async (id: string, removeFromDB = true) => {

    if (removeFromDB) {
      try {
        const response = await removePoint(id); // Remove do banco
        setDonationPoints(prev => prev.filter(point => point.id !== id));
        return response;
      } catch (error) {
        console.error("Erro ao remover ponto no Firebase:", error);
      }
    } else {
      // Só remove do estado local, sem tocar no banco
      setDonationPoints(prev => prev.filter(point => point.id !== id));
    }
  };
  


  return (
    <DonationPointContext.Provider
      value={{
        donationPoints,
        setDonationPoints,
        addDonationPoint,
        selectingLocation,
        setSelectingLocation,
        selectedLocation,
        setSelectedLocation,
        pointClicked,
        setPointClicked,
        registerMap,
        removeDonationPoint,
        userLocation,
        setUserLocation,
        pointToEdit,
        setPointToEdit,
        editDonationPoint,
      }}
    >
      {children}
    </DonationPointContext.Provider>
  );
};

export const useDonationPoints = (): DonationPointContextType => {
  const context = useContext(DonationPointContext);
  if (!context) throw new Error("useDonationPoints must be used within DonationPointProvider");
  return context;
};
