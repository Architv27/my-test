// backend/firebaseAdmin.js

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

// Load environment variables from .env file in local development
  dotenv.config();

// Initialize Firebase Admin SDK only if it hasn't been initialized yet
if (!getApps().length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

  initializeApp({
    credential: cert(serviceAccount),
  });
}

// Initialize Firestore
const db = getFirestore();

// Export `db` as a named export
export { db };
