// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAEakoHjgdWsRONeUndLLMmNgqWUjBKn7E",
  authDomain: "donationsapp-7bdd4.firebaseapp.com",
  projectId: "donationsapp-7bdd4",
  storageBucket: "donationsapp-7bdd4.firebasestorage.app",
  messagingSenderId: "129346598975",
  appId: "1:129346598975:web:1f62bea9f4e94d95fd208a",
  measurementId: "G-F1NXE5WXM5"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp() ;
const db = getFirestore(app);
const storage = getStorage(app); 


export { db, storage };