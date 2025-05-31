import { collection, addDoc, Timestamp, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase"; // ajuste esse caminho conforme seu projeto

 const addPoint = async (point) => {
  console.log(process.env.NEXT_PUBLIC_FIREBASE_COLLECTION)
  try {
    const docRef = await addDoc(collection(db, process.env.NEXT_PUBLIC_FIREBASE_COLLECTION), {
      ...point,
      createdAt: Timestamp.now(), // opcional
    });
    console.log("Documento adicionado com ID:", docRef.id);
    return docRef.id; // retorna o ID gerado pelo Firebase
  } catch (error) {
    console.error("Erro ao adicionar ponto:", error);
    throw error;
  }
};

const removePoint = async(pointId) => {
  console.log(pointId)
  console.log(process.env.NEXT_PUBLIC_FIREBASE_COLLECTION)
  try {
    await deleteDoc(doc(db, process.env.NEXT_PUBLIC_FIREBASE_COLLECTION, pointId));
    console.log("Ponto removido com sucesso!");
  } catch (error) {
    console.error("Erro ao remover ponto:", error);
  }
};


export { addPoint,removePoint };