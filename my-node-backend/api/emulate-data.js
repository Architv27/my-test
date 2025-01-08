// api/emulate-data.js

import { db } from "../firebase.js";
import { doc, getDoc, updateDoc, setDoc } from "firebase-admin/firestore";

// Utility constants & thresholds
const BATTERY_LOW_THRESHOLD = 20;
const MOTOR_HIGH_RPM = 3000;
const CHARGE_RATE = 1;
const DISCHARGE_RATE = 0.5;
const MOTOR_TEMP_RATE = 1;
const MOTOR_SPEED_RPM_MAP = {
  0: 0,
  1: 1000,
  2: 2000,
  3: 3000,
  4: 4000
};
const POWER_CONSUMPTION_MAP = {
  0: 0,
  1: 20,
  2: 40,
  3: 60,
  4: 80
};
const CHARGE_POWER_LEVEL = -10; // Negative => charging input

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const vehicleDocRef = doc(db, "vehicles", "myVehicle");
      const snap = await getDoc(vehicleDocRef);
      if (!snap.exists()) {
        console.log("No vehicle document found. Creating 'myVehicle' with defaults...");

        // Create doc with default values
        await setDoc(vehicleDocRef, {
          motorRPM: 0,
          batteryPct: 100,
          batteryTemp: 25,
          motorSpeedSetting: 0,
          isCharging: false,
          powerLevel: 0,
          parkingBrake: true,
          checkEngine: false,
          gearRatio: "4:1"
        });

        console.log("'myVehicle' created. Skipping emulation this round.");
        return res.status(200).json({ message: "'myVehicle' created." });
      }

      // If doc exists, proceed with emulation
      const data = snap.data();
      let {
        motorRPM = 0,
        batteryPct = 100,
        batteryTemp = 25,
        motorSpeedSetting = 0,
        isCharging = false,
        powerLevel = 0
      } = data;

      // Emulation logic
      let newBatteryPct = batteryPct;
      let newBatteryTemp = batteryTemp;
      let newMotorRPM = 0;
      let newPowerLevel = 0;

      if (isCharging) {
        // If charging, motor is off, battery goes up
        newMotorRPM = 0;
        newPowerLevel = CHARGE_POWER_LEVEL;
        newBatteryPct = Math.min(100, batteryPct + CHARGE_RATE);
        newBatteryTemp = Math.max(20, batteryTemp - 0.2);
      } else {
        // Motor in use
        newMotorRPM = MOTOR_SPEED_RPM_MAP[motorSpeedSetting];
        newPowerLevel = POWER_CONSUMPTION_MAP[motorSpeedSetting];

        // Battery drain
        if (motorSpeedSetting > 0) {
          newBatteryPct = Math.max(0, batteryPct - motorSpeedSetting * DISCHARGE_RATE);
          // Battery temp increases with speed
          newBatteryTemp = Math.min(100, batteryTemp + motorSpeedSetting * MOTOR_TEMP_RATE);
        }
      }

      // Update Firestore doc
      await updateDoc(vehicleDocRef, {
        motorRPM: newMotorRPM,
        batteryPct: newBatteryPct,
        batteryTemp: newBatteryTemp,
        powerLevel: newPowerLevel
      });

      console.log("Emulation updated vehicle data:", {
        motorRPM: newMotorRPM,
        batteryPct: newBatteryPct,
        batteryTemp: newBatteryTemp,
        powerLevel: newPowerLevel
      });

      return res.status(200).json({ message: "Emulation data updated." });
    } catch (err) {
      console.error("Emulation error:", err);
      return res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
