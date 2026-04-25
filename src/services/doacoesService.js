import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

const COLLECTION = 'doacoes';

export async function criarDoacao(dados) {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...dados,
    criadoEm: serverTimestamp(),
    status: 'disponivel',
  });
  return docRef.id;
}

export async function listarDoacoes() {
  const q = query(collection(db, COLLECTION), orderBy('criadoEm', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function buscarDoacao(id) {
  const docRef = doc(db, COLLECTION, id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
}

export async function atualizarDoacao(id, dados) {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, {
    ...dados,
    atualizadoEm: serverTimestamp(),
  });
}

export async function deletarDoacao(id) {
  const docRef = doc(db, COLLECTION, id);
  await deleteDoc(docRef);
}