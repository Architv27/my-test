import { onSchedule } from "firebase-functions/v2/scheduler";
import { db } from './firebaseAdmin.js';

export const updateVehicleStats = onSchedule("every 1 minutes", async (event) => {
  const vehicleRef = db.collection("vehicles").doc("myVehicle");
  const doc = await vehicleRef.get();
  if (!doc.exists) return;

  let data = doc.data();
  const { motorSpeedSetting, isCharging, batteryPct, batteryTemp } = data;

  let newMotorRPM = motorSpeedSetting * 1000;
  let powerLevel = isCharging ? -50 : newMotorRPM * 0.1;
  let newBatteryPct = batteryPct;
  let newBatteryTemp = batteryTemp;

  if (!isCharging) {
    newBatteryPct = Math.max(batteryPct - (motorSpeedSetting * 0.1), 0);
    newBatteryTemp = batteryTemp + (motorSpeedSetting * 0.05);
  } else {
    newBatteryPct = Math.min(batteryPct + 0.5, 100);
    newBatteryTemp = batteryTemp + 0.02;
  }

  await vehicleRef.update({
    motorRPM: newMotorRPM,
    powerLevel,
    batteryPct: newBatteryPct,
    batteryTemp: newBatteryTemp
  });
});
