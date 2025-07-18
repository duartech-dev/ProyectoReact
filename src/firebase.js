// Firebase initialization file
// Replace the firebaseConfig values with your own project credentials
// from your Firebase console.

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBpcz5Gr3mh-Bn857lckPqR2dg2pjKOc6k",
  authDomain: "proyectouno-9acbc.firebaseapp.com",
  projectId: "proyectouno-9acbc",
  storageBucket: "proyectouno-9acbc.firebasestorage.app",
  messagingSenderId: "172388585750",
  appId: "1:172388585750:web:ecaeea40ecbd5b58058037"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth service
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

googleProvider.setCustomParameters({ prompt: 'select_account' });

export { auth, googleProvider, githubProvider, db };
