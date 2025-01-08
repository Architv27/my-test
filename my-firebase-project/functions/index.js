/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";
import logger from "firebase-functions/logger";

import express from "express";
import cors from "cors";
import { db } from './firebaseAdmin.js'; // Ensure the path is correct relative to this file
import dotenv from "dotenv";
import crypto from "crypto";

// Load environment variables from .env file in local development
dotenv.config();

const app = express();

// Enable CORS for all routes
// Configure CORS with specific origin and credentials
app.use(cors({
    origin: "https://test-archit-verma.web.app",  // specify the client origin
    credentials: true                              // allow credentials
  }));
app.use(express.json());

// Define your routes
app.post("/motor/speed", async (req, res) => {
  console.log(`Hi`);
  try {
    const { motorSpeed } = req.body;

    // Validate motorSpeed
    if (typeof motorSpeed !== "number" || motorSpeed < 0 || motorSpeed > 4) {
      return res
        .status(400)
        .json({ error: "motorSpeed must be between 0 and 4" });
    }

    const vehicleDocRef = db.collection("vehicles").doc("myVehicle");

    // Update motorSpeedSetting
    await vehicleDocRef.update({
      motorSpeedSetting: motorSpeed,
    });

    return res.status(200).json({ message: "Motor speed updated" });
  } catch (error) {
    console.error("Error updating motor speed:", error);
    return res.status(500).json({ error: error.message });
  }
});

app.post("/battery/charging", async (req, res) => {
  try {
    const { isCharging } = req.body;

    if (typeof isCharging !== "boolean") {
      return res.status(400).json({ error: "isCharging must be a boolean" });
    }

    const vehicleDocRef = db.collection("vehicles").doc("myVehicle");

    await vehicleDocRef.update({
      isCharging,
    });

    return res.status(200).json({ message: "Charging state updated" });
  } catch (error) {
    console.error("Error updating charging state:", error);

    if (error.code === 5) {
      return res
        .status(404)
        .json({ error: "Vehicle document not found" });
    }

    return res.status(500).json({ error: error.message });
  }
});

app.get("/data", async (req, res) => {
  try {
    const vehicleDoc = await db.collection("vehicles").doc("myVehicle").get();
    if (!vehicleDoc.exists) {
      return res.status(404).json({ error: "Vehicle document not found" });
    }

    const data = vehicleDoc.data();

    const hash = crypto
      .createHash("md5")
      .update(JSON.stringify(data))
      .digest("hex");

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

// Use ES module export syntax for Firebase Cloud Function
export const api = onRequest(app);

/*
  // Example of a simple function if needed:
  // export const helloWorld = onRequest((request, response) => {
  //   logger.info("Hello logs!", {structuredData: true});
  //   response.send("Hello from Firebase!");
  // });
*/
