"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase"; // seu arquivo onde o Firestore está inicializado
import { DonationPointProvider, type DonationPoint } from "@/components/donation-point-context";
import DonationMap from "@/components/donation-map";

export default function Home() {
  const [donationPoints, setDonationPoints] = useState<DonationPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDonationPoints() {
      try {
        const colRef = collection(db, process.env.NEXT_PUBLIC_FIREBASE_COLLECTION);
        const snapshot = await getDocs(colRef);

        const points = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as DonationPoint[];

        setDonationPoints(points);
      } catch (error) {
        console.error("Erro ao buscar pontos de doação:", error);
        setDonationPoints([]);
      } finally {
        setLoading(false);
      }
    }

    fetchDonationPoints();
  }, []);

  if (loading) return <p>Carregando pontos de doação...</p>;

  return (
    <DonationPointProvider initialPoints={donationPoints}>
      <main className="h-screen flex flex-col">
        <DonationMap />
      </main>
    </DonationPointProvider>
  );
}
