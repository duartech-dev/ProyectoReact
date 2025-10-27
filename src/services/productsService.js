import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const colRef = collection(db, 'products');

export const listenAllProducts = (cb) => {
  const q = query(colRef, orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    cb(items);
  });
};

export const createProduct = async (data) => {
  const payload = {
    name: data.name,
    description: data.description || '',
    category: data.category || '',
    price: Number(data.price) || 0,
    image: data.image || '',
    createdAt: serverTimestamp(),
  };
  const ref = await addDoc(colRef, payload);
  return { id: ref.id, ...payload };
};

export const updateProduct = async (id, data) => {
  const ref = doc(db, 'products', id);
  await updateDoc(ref, {
    name: data.name,
    description: data.description || '',
    category: data.category || '',
    price: Number(data.price) || 0,
    image: data.image || '',
  });
};

export const deleteProduct = async (id) => {
  const ref = doc(db, 'products', id);
  await deleteDoc(ref);
};
