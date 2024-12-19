import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC5GftfS6XuE5z4oqiZawbwCew1jb-aNTY",
  authDomain: "advh-77060.firebaseapp.com",
  projectId: "advh-77060",
  storageBucket: "advh-77060.firebasestorage.app",
  messagingSenderId: "744395082680",
  appId: "1:744395082680:web:c6dfa6862f853c39d41d4d",
  measurementId: "G-DTS2N9NYTN",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
