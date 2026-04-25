import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDHlhk_cutS0RRFaoBQZDD_7PWLv_kEuOw",
  authDomain: "doafacil-b16bc.firebaseapp.com",
  projectId: "doafacil-b16bc",
  storageBucket: "doafacil-b16bc.firebasestorage.app",
  messagingSenderId: "1020619696982",
  appId: "1:1020619696982:web:68d8edb07f5177070684f7",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);