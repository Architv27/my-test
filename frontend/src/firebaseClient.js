// src/firebaseClient.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCFZRxvVrQ3W3EMXteKBU1LbNnka29nQr0",
    authDomain: "test-archit-verma.firebaseapp.com",
    projectId: "test-archit-verma",
    storageBucket: "test-archit-verma.firebasestorage.app",
    messagingSenderId: "213853608747",
    appId: "1:213853608747:web:2074647b8de988645c436e"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
