"use client";

import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import DonationMap from "@/components/donation-map";
import { DonationPointProvider } from "@/components/donation-point-context";
import type { DonationPoint } from "@/components/donation-point-context";

async function getDonationPoints(): Promise<DonationPoint[]> {
  const snapshot = await getDocs(collection(db, 'donationPoints'));

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    // Remover o campo createdAt ou qualquer outro que você não quer
    const { createdAt, ...rest } = data;
    return {
      id: doc.id,
      ...rest,
    };
  }) as DonationPoint[];
}

export default function Home() {
  const [donationPoints, setDonationPoints] = useState<DonationPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDonationPoints()
      .then((points) => {
        setDonationPoints(points);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>Carregando pontos de doação...</div>;
  }

  return (
    <DonationPointProvider initialPoints={donationPoints}>
      <main className="h-screen flex flex-col">
        <DonationMap />
      </main>
    </DonationPointProvider>
  );
}
