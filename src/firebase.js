// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';  // Import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyAscFWkaoXMv8mRSBa4KwR4d1kmO2QomiM",
  authDomain: "wasted-87213.firebaseapp.com",
  projectId: "wasted-87213",
  storageBucket: "wasted-87213.appspot.com",
  messagingSenderId: "249086508723",
  appId: "1:249086508723:web:7f3f391ac209f5db5d7ac6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);  // Initialize Firestore

export { auth, db };  // Export both auth and db
