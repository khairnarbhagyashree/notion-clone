import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCKo_dww73pAFHvOzGlrR1fsTqFSF_dhRY",
  authDomain: "notion-clone-8069a.firebaseapp.com",
  projectId: "notion-clone-8069a",
  storageBucket: "notion-clone-8069a.firebasestorage.app",
  messagingSenderId: "378701234174",
  appId: "1:378701234174:web:5d59c53c748254692ecaaf",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
