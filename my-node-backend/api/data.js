// backend/api/data.js

import { db } from '../firebaseAdmin.js'; // Adjust the path

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const vehicleDoc = await db.collection('vehicles').doc('myVehicle').get();
      if (!vehicleDoc.exists) {
        return res.status(404).json({ error: 'Vehicle document not found' });
      }

      const data = vehicleDoc.data();

      // Select only necessary fields
      const responseData = {
        parkingBrake: data.parkingBrake || false,
        checkEngine: data.checkEngine || false,
        motorRPM: data.motorRPM || 0,
        powerLevel: data.powerLevel || 0,
        gearRatio: data.gearRatio || "4:1",
        batteryPct: data.batteryPct || 100,
        batteryTemp: data.batteryTemp || 25,
        motorSpeedSetting: data.motorSpeedSetting || 0,
        isCharging: data.isCharging || false
      };

      res.status(200).json(responseData);
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
