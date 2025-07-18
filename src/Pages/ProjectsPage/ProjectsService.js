import { db } from '../../firebase';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';

const COLLECTION = 'proyectos';

export const createProject = async (data) => {
  const docRef = await addDoc(collection(db, COLLECTION), data);
  return { id: docRef.id, ...data };
};

export const getProjects = async () => {
  const snapshot = await getDocs(collection(db, COLLECTION));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const updateProject = async (id, data) => {
  await updateDoc(doc(db, COLLECTION, id), data);
};

export const deleteProject = async (id) => {
  await deleteDoc(doc(db, COLLECTION, id));
};
