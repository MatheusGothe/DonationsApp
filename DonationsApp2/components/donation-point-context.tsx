"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

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

interface DonationPointContextType {
  donationPoints: DonationPoint[];
  addDonationPoint: (point: Omit<DonationPoint, "id">) => void;
}

const DonationPointContext = createContext<
  DonationPointContextType | undefined
>(undefined);
export function DonationPointProvider({
  children,
  initialPoints = [],
}: {
  children: ReactNode;
  initialPoints?: DonationPoint[];
}) {
  const [donationPoints, setDonationPoints] =
    useState<DonationPoint[]>(initialPoints);

  const addDonationPoint = (point: Omit<DonationPoint, "id">) => {
    const newPoint = {
      ...point,
      id: Math.random().toString(36).substring(2, 9),
    };
    setDonationPoints([...donationPoints, newPoint]);
  };

  return (
    <DonationPointContext.Provider value={{ donationPoints, addDonationPoint }}>
      {children}
    </DonationPointContext.Provider>
  );
}

export function useDonationPoints() {
  const context = useContext(DonationPointContext);
  if (context === undefined) {
    throw new Error(
      "useDonationPoints must be used within a DonationPointProvider"
    );
  }
  return context;
}
