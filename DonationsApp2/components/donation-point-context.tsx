"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import type { ReactNode } from "react";

export type DonationType = "food" | "clothes" | "both";

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
  addDonationPoint: (point: Omit<DonationPoint, 'id'>) => void;
  selectingLocation: boolean;
  setSelectingLocation: (value: boolean) => void;
  selectedLocation: Location | null;
  setSelectedLocation: (location: Location) => void;
  pointClicked: string | null;
  setPointClicked: (id: string | null) => void;
  registerMap: (map: L.Map) => void;
}

const DonationPointContext = createContext<DonationPointContextType | undefined>(undefined);

export const DonationPointProvider = ({ children, initialPoints = [] }: { children: ReactNode; initialPoints?: DonationPoint[] }) => {
  const [donationPoints, setDonationPoints] = useState<DonationPoint[]>(initialPoints);
  const [selectingLocation, setSelectingLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [pointClicked, setPointClicked] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  const addDonationPoint = (point: Omit<DonationPoint, 'id'>) => {
    const newPoint: DonationPoint = { ...point, id: Math.random().toString(36).slice(2, 9) };
    setDonationPoints(prev => [...prev, newPoint]);
  };

  const registerMap = useCallback((map: L.Map) => {
    mapRef.current = map;
  }, []);


  return (
    <DonationPointContext.Provider
      value={{
        donationPoints,
        addDonationPoint,
        selectingLocation,
        setSelectingLocation,
        selectedLocation,
        setSelectedLocation,
        pointClicked,
        setPointClicked,
        registerMap
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
