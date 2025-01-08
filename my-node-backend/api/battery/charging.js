// api/battery/charging.js

import { db } from '../../firebaseAdmin.js'; // Ensure the path is correct

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { isCharging } = req.body;

      // Validate the request body
      if (typeof isCharging !== "boolean") {
        return res.status(400).json({ error: "isCharging must be a boolean" });
      }

      // Reference to the 'myVehicle' document in 'vehicles' collection
      const vehicleDocRef = db.collection("vehicles").doc("myVehicle");

      // Update the 'isCharging' field
      await vehicleDocRef.update({
        isCharging,
      });

      return res.status(200).json({ message: "Charging state updated" });
    } catch (error) {
      console.error("Error updating charging state:", error);

      // Handle specific Firestore errors (optional)
      if (error.code === 5) { // Firestore 'not found' error code
        return res.status(404).json({ error: "Vehicle document not found" });
      }

      return res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
