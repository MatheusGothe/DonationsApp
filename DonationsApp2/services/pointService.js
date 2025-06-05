import { collection, addDoc, Timestamp, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; // ajuste esse caminho conforme seu projeto

 const addPoint = async (point) => {
  try {
    const docRef = await addDoc(collection(db,process.env.NEXT_PUBLIC_FIREBASE_COLLECTION), {
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

  try {
    await deleteDoc(doc(db, process.env.NEXT_PUBLIC_FIREBASE_COLLECTION, pointId));
    console.log("Ponto removido com sucesso!");
  } catch (error) {
    console.error("Erro ao remover ponto:", error);
  }
};

const updatePoint = async (pointId, updatedData) => {
  try {
    const pointRef = doc(db, process.env.NEXT_PUBLIC_FIREBASE_COLLECTION, pointId);
    await updateDoc(pointRef, {
      ...updatedData,
      updatedAt: Timestamp.now(), // opcional: para registrar data da edição
    });
    console.log("Ponto atualizado com sucesso!");
  } catch (error) {
    console.error("Erro ao atualizar ponto:", error);
    throw error;
  }
};


export { addPoint,removePoint, updatePoint };