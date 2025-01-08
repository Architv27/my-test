// api/motor/speed.js

import { db } from '../../firebaseAdmin.js'; // Adjust the path if necessary

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { motorSpeed } = req.body;

      // Validate motorSpeed
      if (typeof motorSpeed !== 'number' || motorSpeed < 0 || motorSpeed > 4) {
        return res.status(400).json({ error: 'motorSpeed must be between 0 and 4' });
      }

      // Reference to the 'myVehicle' document
      const vehicleDocRef = db.collection('vehicles').doc('myVehicle');

      // Update motorSpeedSetting
      await vehicleDocRef.update({
        motorSpeedSetting: motorSpeed,
      });

      return res.status(200).json({ message: 'Motor speed updated' });
    } catch (error) {
      console.error('Error updating motor speed:', error);
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
