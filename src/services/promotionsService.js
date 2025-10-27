import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const colRef = collection(db, 'promotions');

export const listenAllPromotions = (cb) => {
  const q = query(colRef, orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    cb(items);
  });
};

export const createPromotion = async (data) => {
  const payload = {
    name: data.name,
    price: Number(data.price) || 0,
    discount: Number(data.discount) || 0,
    image: data.image || '',
    createdAt: serverTimestamp(),
  };
  const ref = await addDoc(colRef, payload);
  return { id: ref.id, ...payload };
};

export const updatePromotion = async (id, data) => {
  const ref = doc(db, 'promotions', id);
  await updateDoc(ref, {
    name: data.name,
    price: Number(data.price) || 0,
    discount: Number(data.discount) || 0,
    image: data.image || '',
  });
};

export const deletePromotion = async (id) => {
  const ref = doc(db, 'promotions', id);
  await deleteDoc(ref);
};
