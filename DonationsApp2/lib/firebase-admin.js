import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccountJson from './firebaseAdmin.json';

// Ajusta a private_key para substituir as barras e n pela quebra real, se necessário
const serviceAccount = {
  ...serviceAccountJson,
  private_key: serviceAccountJson.private_key.replace(/\\n/g, '\n'),
};

// Inicializa o Firebase Admin app só se ainda não tiver inicializado
const app = !getApps().length
  ? initializeApp({
      credential: cert(serviceAccount),
    })
  : getApp();

const adminDb = getFirestore(app);

export { adminDb };
