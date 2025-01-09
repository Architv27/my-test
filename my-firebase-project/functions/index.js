import { onRequest } from "firebase-functions/v2/https";
import logger from "firebase-functions/logger";

import express from "express";
import cors from "cors";
import { db } from './firebaseAdmin.js'; // Ensure correct path
import dotenv from "dotenv";
import crypto from "crypto";

// Load environment variables from .env file in local development
dotenv.config();

const app = express();

// Configure CORS with specific origins and credentials
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://test-archit-verma.web.app"
  ],
  credentials: true
}));

app.use(express.json());

// Endpoint to update motor speed and related attributes
app.post("/motor/speed", async (req, res) => {
  console.log(`Received motor speed update request.`);
  try {
    const { motorSpeed } = req.body;

    // Validate motorSpeed
    if (typeof motorSpeed !== "number" || motorSpeed < 0 || motorSpeed > 4) {
      return res.status(400).json({ error: "motorSpeed must be between 0 and 4" });
    }

    const vehicleDocRef = db.collection("vehicles").doc("myVehicle");

    // Update motorSpeedSetting
    await vehicleDocRef.update({ motorSpeedSetting: motorSpeed });

    // Retrieve latest vehicle data to compute relational changes
    const doc = await vehicleDocRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Vehicle document not found" });
    }
    const data = doc.data();

    // Compute related attributes based on new motorSpeedSetting and current charging state
    const { isCharging } = data;
    let newMotorRPM, powerLevel;
    if (isCharging) {
      newMotorRPM = 0;
      powerLevel = -1000;  // Fixed negative value when charging
    } else {
      newMotorRPM = (motorSpeed / 4) * 800;  // Scale to 0-800 RPM
      powerLevel = (newMotorRPM / 800) * 1000; // Scale power proportionally
    }

    // Update related fields in Firestore
    await vehicleDocRef.update({
      motorRPM: newMotorRPM,
      powerLevel
    });

    return res.status(200).json({ message: "Motor speed and related attributes updated" });
  } catch (error) {
    console.error("Error updating motor speed:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Endpoint to update charging state and related attributes
app.post("/battery/charging", async (req, res) => {
  try {
    const { isCharging } = req.body;

    if (typeof isCharging !== "boolean") {
      return res.status(400).json({ error: "isCharging must be a boolean" });
    }

    const vehicleDocRef = db.collection("vehicles").doc("myVehicle");

    // Update charging state
    await vehicleDocRef.update({ isCharging });

    // If charging, disable motor and update related fields
    if (isCharging) {
      await vehicleDocRef.update({
        motorRPM: 0,
        motorSpeedSetting: 0,  // Reset motor speed setting
        powerLevel: -1000,      // Set a negative power level for charging
        parkingBrake: true      // Example: engage parking brake when charging
      });
    }

    return res.status(200).json({ message: "Charging state updated" });
  } catch (error) {
    console.error("Error updating charging state:", error);
    if (error.code === 5) {
      return res.status(404).json({ error: "Vehicle document not found" });
    }
    return res.status(500).json({ error: error.message });
  }
});

// Endpoint to retrieve vehicle data with ETag for efficiency
app.get("/data", async (req, res) => {
  try {
    const vehicleDoc = await db.collection("vehicles").doc("myVehicle").get();
    if (!vehicleDoc.exists) {
      return res.status(404).json({ error: "Vehicle document not found" });
    }

    const data = vehicleDoc.data();
    const hash = crypto.createHash("md5").update(JSON.stringify(data)).digest("hex");
    const ifNoneMatch = req.headers["if-none-match"];

    if (ifNoneMatch === hash) {
      return res.status(304).end();
    }

    res.setHeader("ETag", hash);

    const responseData = {
      parkingBrake: data.parkingBrake || false,
      checkEngine: data.checkEngine || false,
      motorRPM: data.motorRPM || 0,
      powerLevel: data.powerLevel || 0,
      gearRatio: data.gearRatio || "4:1",
      batteryPct: data.batteryPct || 100,
      batteryTemp: data.batteryTemp || 25,
      motorSpeedSetting: data.motorSpeedSetting || 0,
      isCharging: data.isCharging || false,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Export the Express app as a Firebase Cloud Function
export const api = onRequest(app);
