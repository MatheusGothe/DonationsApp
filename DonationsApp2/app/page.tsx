// app/page.tsx

import DonationMap from "@/components/donation-map";
import { DonationPointProvider } from "@/components/donation-point-context";
import type { DonationPoint } from "@/components/donation-point-context";

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const collection = process.env.NEXT_PUBLIC_FIREBASE_COLLECTION;

function parseFirestoreDocument(doc: any) {
  // Extrai o id do documento
  const id = doc.name.split('/').pop();

  // Converte campos do Firestore para JSON simples
  const fields = doc.fields || {};
  const parsedFields: any = {};

  for (const key in fields) {
    const value = fields[key];
    if (value.stringValue !== undefined) parsedFields[key] = value.stringValue;
    else if (value.integerValue !== undefined) parsedFields[key] = Number(value.integerValue);
    else if (value.doubleValue !== undefined) parsedFields[key] = Number(value.doubleValue);
    else if (value.booleanValue !== undefined) parsedFields[key] = value.booleanValue;
    else if (value.timestampValue !== undefined) parsedFields[key] = value.timestampValue;
    else if (value.arrayValue !== undefined) {
      parsedFields[key] = value.arrayValue.values?.map((v: any) => Object.values(v)[0]) || [];
    }
    else {
      parsedFields[key] = null; // outros tipos não tratados
    }
  }

  return { id, ...parsedFields };
}

async function getDonationPoints(): Promise<DonationPoint[]> {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collection}?key=${apiKey}`;

  const res = await fetch(url);
  if (!res.ok) {
    console.error('Erro ao buscar dados do Firestore', await res.text());
    return [];
  }
  
  const data = await res.json();

  if (!data.documents) return [];

  return data.documents.map(parseFirestoreDocument);
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
