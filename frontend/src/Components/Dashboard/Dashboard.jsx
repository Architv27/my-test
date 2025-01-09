// src/components/dashboard/Dashboard.js
import React, { useState, useEffect, useRef } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseClient";  // import the Firestore instance

import "../../ComponentCSS/dashboard.css";
import ParkingBrakeIndicator from "./Indicators/ParkingBrakeIndicator";
import CheckEngineIndicator from "./Indicators/CheckEngineIndicator";
import MotorStatusIndicator from "./Indicators/MotorStatusIndicator";
import BatteryLowIndicator from "./Indicators/BatteryLowIndicator";
import PowerGauge from "./Gauges/PowerGauge";
import RpmGauge from "./Gauges/RpmGauge";
import MiddleRow from "./MiddleRow/MiddleRow";
import BottomRow from "./BottomRow/BottomRow";
import debounce from "lodash.debounce";

function Dashboard() {
  // Indicators
  const [parkingBrakeActive, setParkingBrakeActive] = useState(false);
  const [checkEngineActive, setCheckEngineActive] = useState(false);
  const [motorHighRpmActive, setMotorHighRpmActive] = useState(false);
  const [batteryLowActive, setBatteryLowActive] = useState(false);

  // Gauges & Values
  const [powerValue, setPowerValue] = useState(0);
  const [rpmValue, setRpmValue] = useState(0);
  const [gearRatio, setGearRatio] = useState("4:1");
  const [batteryPercent, setBatteryPercent] = useState(100);
  const [batteryTemp, setBatteryTemp] = useState(25);

  // Slider & Charging
  const [sliderValue, setSliderValue] = useState(0);
  const [isCharging, setIsCharging] = useState(false);
  const [overheated, setOverHeated] = useState(false);

  // ----------- 1) Real-Time Firestore Listener -----------
  useEffect(() => {
    // Setup a real-time subscription to the "vehicles/myVehicle" doc
    // On each update, Firestore calls our callback with the latest data
    const unsub = onSnapshot(doc(db, "vehicles", "myVehicle"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();

        const {
          parkingBrake = false,
          checkEngine = false,
          motorRPM = 0,
          powerLevel = 0,
          gearRatio = "4:1",
          batteryPct = 100,
          batteryTemp = 25,
          motorSpeedSetting = 0,
          isCharging = false,
        } = data;

        // Update local states
        setParkingBrakeActive(parkingBrake);
        setCheckEngineActive(checkEngine);
        setRpmValue(motorRPM);
        setPowerValue(powerLevel);
        setGearRatio(gearRatio);
        setBatteryPercent(batteryPct);
        setBatteryTemp(batteryTemp);
        setSliderValue(motorSpeedSetting);
        setIsCharging(isCharging);

        // Relational logic
        setMotorHighRpmActive(motorRPM >= 800);
        setBatteryLowActive(batteryPct < 20);
        setOverHeated(batteryTemp > 100);
      } else {
        console.warn("myVehicle doc does not exist in Firestore.");
      }
    });

    // Cleanup: unsubscribe when component unmounts
    return () => unsub();
  }, []); // run once on mount

  // ----------- 2) Debounced POST for motor speed changes -----------
  const debouncedPostMotorSpeed = useRef(
    debounce(async (val) => {
      try {
        const response = await fetch("https://api-wv6xyu6ukq-uc.a.run.app/motor/speed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ motorSpeed: val }),
          credentials: "include"
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update motor speed");
        }
        const result = await response.json();
        console.log(result.message);
      } catch (error) {
        console.error("Error updating motor speed:", error);
      }
    }, 200)
  ).current;

  // Handler for slider changes
  const handleSliderChange = (val) => {
    setSliderValue(val);
    debouncedPostMotorSpeed(val);
  };

  // ----------- 3) Toggle charging -----------
  const handleChargingToggle = async () => {
    const nextState = !isCharging;
    setIsCharging(nextState); // immediate UI feedback
    try {
      const response = await fetch("https://api-wv6xyu6ukq-uc.a.run.app/battery/charging", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCharging: nextState }),
        credentials: "include"
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to toggle charging");
      }
      const result = await response.json();
      console.log(result.message);
    } catch (error) {
      console.error("Error toggling charging:", error);
      setIsCharging(!nextState);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Top Indicators */}
      <div className="top-indicators-row">
        <ParkingBrakeIndicator active={parkingBrakeActive} />
        <CheckEngineIndicator active={checkEngineActive} />
        <MotorStatusIndicator active={motorHighRpmActive} />
        <BatteryLowIndicator active={batteryLowActive} />
      </div>

      {/* Gauges */}
      <div className="center-gauges-row">
        <PowerGauge value={powerValue} />
        <RpmGauge rpm={rpmValue} />
      </div>

      {/* Middle Row */}
      <MiddleRow
        gearRatio={gearRatio}
        batteryPercent={batteryPercent}
        batteryTemp={batteryTemp}
        rpmValue={rpmValue}
        sliderValue={sliderValue}
        onSliderChange={handleSliderChange}
        isCharging={isCharging}
      />

      {/* Bottom Row */}
      <BottomRow
        isCharging={isCharging}
        onToggleCharging={handleChargingToggle}
        isOverheating={overheated}
      />
    </div>
  );
}

export default Dashboard;
