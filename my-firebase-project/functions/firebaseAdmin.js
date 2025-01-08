// backend/firebaseAdmin.js

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file in the project root
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Initialize Firebase Admin SDK only if it hasn't been initialized yet
if (!getApps().length) {
  // Path to the service account key JSON file
  const serviceAccountPath = path.join(__dirname, 'secret.json');

  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error(`Service account key file not found at path: ${serviceAccountPath}`);
  }

  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

  initializeApp({
    credential: cert(serviceAccount),
  });
}

// Initialize Firestore
const db = getFirestore();

// Export `db` as a named export
export { db };
