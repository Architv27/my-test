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
async function updateVehicleStats() {
    try {
      const vehicleRef = db.collection("vehicles").doc("myVehicle");
      const docSnap = await vehicleRef.get();
      if (!docSnap.exists) {
        console.log("Document does not exist. No updates performed.");
        return;
      }
  
      const data = docSnap.data();
      const {
        motorSpeedSetting = 0,
        isCharging = false,
        batteryPct = 100,
        batteryTemp = 25,
      } = data;
  
      let newMotorRPM = 0;
      let newPowerLevel = 0;
      let newBatteryPct = batteryPct;
      let newBatteryTemp = batteryTemp;
  
      // We'll unify the max RPM at 800, full-power at +1000 kW, charging at -1000
      // Ambient temperature
      const ambientTemp = 20;
  
      if (isCharging) {
        // CHARGING => motor is off, negative power
        newMotorRPM = 0;
        newPowerLevel = -1000; // indicates full charging
        newBatteryPct = Math.min(newBatteryPct + 0.5, 100); // slow charge
        // Gently cool battery, but never below ambient
        newBatteryTemp = Math.max(newBatteryTemp - 0.5, ambientTemp);
      } else {
        // Motor running => scale RPM up to 800 for motorSpeedSetting=4
        newMotorRPM = (motorSpeedSetting / 4) * 800;
  
        // Scale power from 0..800 => 0..1000
        // fraction = newMotorRPM / 800 => 0..1 => multiply by 1000 => 0..1000
        newPowerLevel = (newMotorRPM / 800) * 1000;
  
        // Drain battery based on motorSpeedSetting
        newBatteryPct = Math.max(newBatteryPct - (motorSpeedSetting * 0.1), 0);
  
        // Battery temperature logic
        if (motorSpeedSetting === 0) {
          // Motor off => cool down
          newBatteryTemp = Math.max(newBatteryTemp - 1, ambientTemp);
        } else {
          // Heat up more with higher speed
          newBatteryTemp = newBatteryTemp + (motorSpeedSetting * 0.5);
        }
      }
  
    // Round battery temp for a simpler integer
    newBatteryTemp = parseInt(newBatteryTemp);

    // ---- NEW LOGIC: If battery hits 0%, switch to charging mode automatically ----
    if (newBatteryPct <= 0) {
      newBatteryPct = 0;          // Force charging on
      newMotorRPM = 0;            // Motor off
      motorSpeedSetting = 0;      // Reset slider
      // Optionally engage parking brake or other fields if needed
      console.log("Battery at 0%. Forcing charging on...");
    }

    // Save updated fields
    await vehicleRef.update({
      motorRPM: newMotorRPM,
      powerLevel: newPowerLevel,
      batteryPct: newBatteryPct,
      batteryTemp: newBatteryTemp,
      // If you want to persist the new motorSpeedSetting (0) and isCharging (true) in the doc:
      motorSpeedSetting,
      isCharging,
      parkingBrake: isCharging ? true : data.parkingBrake, 
    });

    console.log("Vehicle stats updated:", {
      motorSpeedSetting,
      isCharging,
      newMotorRPM,
      newPowerLevel,
      newBatteryPct,
      newBatteryTemp,
    });
  } catch (error) {
    console.error("Error updating vehicle stats:", error);
  }
}

// Interval to run every 15 seconds
setInterval(updateVehicleStats, 15000);

// Run once immediately on startup
updateVehicleStats();  
export { db };
