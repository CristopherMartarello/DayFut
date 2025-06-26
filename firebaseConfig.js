import { getFirestore } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBvYUJUzsoXndl5OrrrBYD1F3F-r51ZFf0",
  authDomain: "crud-firebase-70303.firebaseapp.com",
  projectId: "crud-firebase-70303",
  storageBucket: "crud-firebase-70303.firebasestorage.app",
  messagingSenderId: "207298870874",
  appId: "1:207298870874:web:35c9590f76affe7aff2263"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };


