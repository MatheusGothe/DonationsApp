// app/page.tsx

import DonationMap from "@/components/donation-map";
import { DonationPointProvider } from "@/components/donation-point-context";
import type { DonationPoint } from "@/components/donation-point-context";
import { adminDb } from '@/lib/firebase-admin'; // Seu setup do Admin SDK

async function getDonationPoints() {
  const snapshot = await adminDb.collection('donationPoints').get();

  return snapshot.docs.map(doc => {
    const { createdAt, ...rest } = doc.data();
    return {
      id: doc.id,
      ...rest,
    };
  });
}


export default async function Home() {
  const donationPoints = await getDonationPoints();

  return (
    <DonationPointProvider initialPoints={donationPoints}>
      <main className="h-screen flex flex-col">
        <DonationMap />
      </main>
    </DonationPointProvider>
  );
}
