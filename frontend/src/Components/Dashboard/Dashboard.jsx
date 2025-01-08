// src/components/dashboard/Dashboard.js
import React, { useState, useEffect } from "react";
import "../../ComponentCSS/dashboard.css";

// Indicators (read-only from DB: parkingBrake, checkEngine, motor (over 3000 RPM), batteryLow)
import ParkingBrakeIndicator from "./Indicators/ParkingBrakeIndicator";
import CheckEngineIndicator from "./Indicators/CheckEngineIndicator";
import MotorStatusIndicator from "./Indicators/MotorStatusIndicator";
import BatteryLowIndicator from "./Indicators/BatteryLowIndicator";

// Gauges
import PowerGauge from "./Gauges/PowerGauge";
import RpmGauge from "./Gauges/RpmGauge";

// Middle Row
import MiddleRow from "./MiddleRow/MiddleRow";

// Bottom Row
import BottomRow from "./BottomRow/BottomRow";

function Dashboard() {
  // BACKEND STATE MIRROR
  const [parkingBrakeActive, setParkingBrakeActive] = useState(false);
  const [checkEngineActive, setCheckEngineActive] = useState(false);
  const [motorHighRpmActive, setMotorHighRpmActive] = useState(false);
  const [batteryLowActive, setBatteryLowActive] = useState(false);

  // GAUGES & VALUES
  const [powerValue, setPowerValue] = useState(0);   // powerLevel
  const [rpmValue, setRpmValue] = useState(0);       // motorRPM
  const [gearRatio, setGearRatio] = useState("4:1"); // read-only
  const [batteryPercent, setBatteryPercent] = useState(100);
  const [batteryTemp, setBatteryTemp] = useState(25);

  // SLIDER & CHARGING
  const [sliderValue, setSliderValue] = useState(0); // motorSpeedSetting
  const [isCharging, setIsCharging] = useState(false);

  // 1. Fetch data from your backend every 2 seconds
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://my-node-backend-blue.vercel.app/api/data");
        const data = await res.json();

        // Destructure fields from the backend
        const {
          parkingBrake = false,
          checkEngine = false,
          motorRPM = 0,
          powerLevel = 0,
          gearRatio = "4:1",
          batteryPct = 100,
          batteryTemp = 25,
          motorSpeedSetting = 0,
          isCharging = false
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

        // Compute Indicators
        setMotorHighRpmActive(motorRPM > 3000);     // Motor indicator if RPM > 3000
        setBatteryLowActive(batteryPct < 20);       // Battery Low if < 20%
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchData(); // initial
    const intervalId = setInterval(fetchData, 200); // poll every 2s

    return () => clearInterval(intervalId);
  }, []);

  // 2. SLIDER: POST /motor/speed 
  const handleSliderChange = async (val) => {
    setSliderValue(val);  // Immediate UI feedback
    try {
      const response = await fetch("https://my-node-backend-blue.vercel.app/api/motor/speed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motorSpeed: val })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update motor speed");
      }

      const result = await response.json();
      console.log(result.message); // Optional: Log success message

      // Optionally, update motorRPM immediately based on response
      if (typeof result.motorRPM === 'number') {
        setRpmValue(result.motorRPM);
        setMotorHighRpmActive(result.motorRPM > 3000);
      }
    } catch (error) {
      console.error("Error updating motor speed:", error);
      // Optional: Revert slider value or notify the user
    }
  };

  // 3. CHARGING: POST /battery/charging
  const handleChargingToggle = async () => {
    const nextState = !isCharging;
    setIsCharging(nextState); // Immediate UI feedback
    try {
      const response = await fetch("https://my-node-backend-blue.vercel.app/api/battery/charging", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCharging: nextState })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to toggle charging");
      }

      const result = await response.json();
      console.log(result.message); // Optional: Log success message
    } catch (error) {
      console.error("Error toggling charging:", error);
      // Optional: Revert charging state or notify the user
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
        {/* Power Gauge: fluid animation in PowerGauge.jsx */}
        <PowerGauge value={powerValue} />
        {/* RPM Gauge: fluid animation in RpmGauge.jsx */}
        <RpmGauge rpm={rpmValue} />
      </div>

      {/* Middle Row: gear ratio, battery %, battery temp, motor RPM, slider */}
      <MiddleRow
        gearRatio={gearRatio}
        batteryPercent={batteryPercent}
        batteryTemp={batteryTemp}
        rpmValue={rpmValue}
        sliderValue={sliderValue}
        onSliderChange={handleSliderChange}
      />

      {/* Bottom Row: includes charging button */}
      <BottomRow
        isCharging={isCharging}
        onToggleCharging={handleChargingToggle}
      />
    </div>
  );
}

export default Dashboard;
