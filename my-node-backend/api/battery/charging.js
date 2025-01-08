// api/battery/charging.js

import { db } from "../../firebase.js";
import { doc, updateDoc } from "firebase-admin/firestore";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { isCharging } = req.body;
      if (typeof isCharging !== "boolean") {
        return res.status(400).json({ error: "isCharging must be a boolean" });
      }

      const vehicleDocRef = doc(db, "vehicles", "myVehicle");
      await updateDoc(vehicleDocRef, {
        isCharging
      });
      return res.status(200).json({ message: "Charging state updated" });
    } catch (error) {
      console.error("Error updating charging state:", error);
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
