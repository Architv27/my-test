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
// The function that updates vehicle stats periodically
async function updateVehicleStats() {
    try {
      const vehicleRef = db.collection("vehicles").doc("myVehicle");
      const doc = await vehicleRef.get();
      if (!doc.exists) {
        console.log("Document does not exist. No updates performed.");
        return;
      }
  
      const data = doc.data();
      const { motorSpeedSetting, isCharging, batteryPct, batteryTemp } = data;
  
      // We'll define new values here
      let newMotorRPM;
      let newPowerLevel;
      let newBatteryPct = batteryPct;
      let newBatteryTemp = batteryTemp;
  
      // Define a baseline ambient temperature to prevent unrealistic cooling
      const ambientTemp = 20;
  
      if (isCharging) {
        // If charging, motor is off
        newMotorRPM = 0;
        newPowerLevel = -50; // Negative indicates charging
  
        // Gradually increase battery percentage
        newBatteryPct = Math.min(batteryPct + 0.5, 100);
  
        // For charging, you can cool or heat battery slightly; here we reduce it a bit
        newBatteryTemp = batteryTemp - 0.5;
      } else {
        // Motor speed scales from 0 to 4 (motorSpeedSetting) => 0 to 4000 RPM
        newMotorRPM = motorSpeedSetting * 1000;
        // Power level scales proportionally to RPM for discharge
        newPowerLevel = newMotorRPM * 0.1;
  
        // Deplete battery based on motor speed
        newBatteryPct = Math.max(batteryPct - (motorSpeedSetting * 0.1), 0);
  
        // Battery temperature logic
        if (motorSpeedSetting === 0) {
          // Cool the battery when the motor is off
          newBatteryTemp = batteryTemp - 1.0; 
          // Prevent battery from dropping below ambient temperature
          if (newBatteryTemp < ambientTemp) {
            newBatteryTemp = ambientTemp;
          }
        } else {
          // Increase temperature more significantly at higher speeds
          newBatteryTemp = batteryTemp + (motorSpeedSetting * 0.05);
        }
      }
  
      // Round temperature to keep it as an integer
      newBatteryTemp = Math.round(newBatteryTemp);
  
      // Update Firestore with new stats
      await vehicleRef.update({
        motorRPM: newMotorRPM,
        powerLevel: newPowerLevel,
        batteryPct: newBatteryPct,
        batteryTemp: newBatteryTemp,
      });
  
      console.log("Vehicle stats updated:", {
        motorSpeedSetting,
        isCharging,
        newBatteryPct,
        newBatteryTemp,
        newMotorRPM,
        newPowerLevel
      });
    } catch (error) {
      console.error("Error updating vehicle stats:", error);
    }
  }
  
  // Invoke the update function every 15 seconds
  setInterval(updateVehicleStats, 15000);
  
  // Optional: Immediately run the function on startup
  updateVehicleStats();
  
export { db };
