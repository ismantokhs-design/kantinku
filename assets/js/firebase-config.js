// Import SDK Firebase dari CDN (Modular v9+)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInAnonymously, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Konfigurasi Firebase Project "kantinku"
const firebaseConfig = {
    apiKey: "AIzaSyA5ssaCnGW2hsc67cTpjC-__s4yJaYVCs8",
    authDomain: "kantinku-f7ee0.firebaseapp.com",
    projectId: "kantinku-f7ee0",
    storageBucket: "kantinku-f7ee0.firebasestorage.app",
    messagingSenderId: "161375413390",
    appId: "1:161375413390:web:de07f71e5261e11c5195df",
    measurementId: "G-D4X68BHKW5"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged };