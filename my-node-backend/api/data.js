// api/data.js

import { db } from '../firebaseAdmin.js'; // Adjust the path based on your project structure

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Reference to the 'myVehicle' document in 'vehicles' collection
      const vehicleDocRef = db.collection('vehicles').doc('myVehicle');

      // Fetch the document
      const snap = await vehicleDocRef.get();

      if (!snap.exists) {
        return res.status(404).json({ error: 'Vehicle document not found' });
      }

      // Return the document data
      return res.status(200).json(snap.data());
    } catch (error) {
      console.error('Error fetching data:', error);
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
