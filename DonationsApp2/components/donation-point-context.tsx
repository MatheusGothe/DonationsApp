"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import type { ReactNode } from "react";
import { addPoint,removePoint } from '@/services/pointService.js';
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
  openingHours: string;
}

interface Location {
  lat: number;
  lng: number;
}

interface DonationPointContextType {
  donationPoints: DonationPoint[];
  setDonationPoints: (points: DonationPoint[]) => void;
  addDonationPoint: (point: Omit<DonationPoint, 'id'>) => void;
  selectingLocation: boolean;
  setSelectingLocation: (value: boolean) => void;
  selectedLocation: Location | null;
  setSelectedLocation: (location: Location) => void;
  pointClicked: PointClicked | null;
  setPointClicked: (point: PointClicked | null) => void;
  registerMap: (map: L.Map) => void;
  removeDonationPoint: (id: string) => void;
  userLocation: GeolocationCoordinates | null
  setUserLocation: (loc: GeolocationCoordinates | null) => void
}

const DonationPointContext = createContext<DonationPointContextType | undefined>(undefined);

export const DonationPointProvider = ({ children, initialPoints = [] }: { children: ReactNode; initialPoints?: DonationPoint[] }) => {
  const [donationPoints, setDonationPoints] = useState<DonationPoint[]>(initialPoints);
  const [selectingLocation, setSelectingLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [pointClicked, setPointClicked] = useState<PointClicked | null>(null);
  const [userLocation, setUserLocation] = useState<GeolocationCoordinates | null>(null);
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

  const removeDonationPoint = async(id: string) => {
    
    try {
      const response = await removePoint(id);
      setDonationPoints(prev => prev.filter(point => point.id !== id));
      return response

    } catch (error) {
      console.error("Erro ao remover ponto no Firebase:", error);
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
        setUserLocation
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
