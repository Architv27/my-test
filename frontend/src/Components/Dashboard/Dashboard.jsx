import React, { useState, useEffect, useRef } from "react";
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

// Lodash debounce for debouncing slider input
import debounce from "lodash.debounce";

function Dashboard() {
  // **State Variables**

  // Indicators
  const [parkingBrakeActive, setParkingBrakeActive] = useState(false);
  const [checkEngineActive, setCheckEngineActive] = useState(false);
  const [motorHighRpmActive, setMotorHighRpmActive] = useState(false);
  const [batteryLowActive, setBatteryLowActive] = useState(false);

  // Gauges & Values
  const [powerValue, setPowerValue] = useState(0); // powerLevel
  const [rpmValue, setRpmValue] = useState(0); // motorRPM
  const [gearRatio, setGearRatio] = useState("4:1"); // read-only
  const [batteryPercent, setBatteryPercent] = useState(100);
  const [batteryTemp, setBatteryTemp] = useState(25);

  // Slider & Charging
  const [sliderValue, setSliderValue] = useState(0); // motorSpeedSetting
  const [isCharging, setIsCharging] = useState(false);

  // **Refs for ETag and AbortController**
  const etagRef = useRef(null);
  const abortControllerRef = useRef(null);

  // **Polling Configuration**
  const INITIAL_POLL_INTERVAL = 1000; // 3 seconds
  const MAX_POLL_INTERVAL = 10000; // 10 seconds
  const [pollInterval, setPollInterval] = useState(INITIAL_POLL_INTERVAL);
  const [attempt, setAttempt] = useState(0); // For exponential backoff

  // **Effect: Polling Mechanism with Exponential Backoff and Conditional Requests**
  useEffect(() => {
    let isMounted = true; // To prevent state updates after unmount

    const fetchData = async () => {
      // Abort any ongoing fetch
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Initialize AbortController for the current request
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const headers = {};

        // If ETag is available, use it for conditional requests
        if (etagRef.current) {
          headers["If-None-Match"] = etagRef.current;
        }

        const response = await fetch("https://api-wv6xyu6ukq-uc.a.run.app/data", {
          method: "GET",
          headers: headers,
          signal: controller.signal,
        });

        if (response.status === 304) {
          // Data not modified; no action needed
          console.log("Data not modified. Skipping state update.");
        } else if (response.ok) {
          // Reset polling interval and attempt count on successful fetch
          if (isMounted) {
            setPollInterval(INITIAL_POLL_INTERVAL);
            setAttempt(0);
          }

          // Update ETag from response headers
          const newEtag = response.headers.get("ETag");
          if (newEtag) {
            etagRef.current = newEtag;
          }

          const data = await response.json();

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
            isCharging = false,
          } = data;

          // Update local states and compute relational indicator logic
          if (isMounted) {
            setParkingBrakeActive(parkingBrake);
            setCheckEngineActive(checkEngine);
            setRpmValue(motorRPM);
            setPowerValue(powerLevel);
            setGearRatio(gearRatio);
            setBatteryPercent(batteryPct);
            setBatteryTemp(batteryTemp);
            setSliderValue(motorSpeedSetting);
            setIsCharging(isCharging);

            // Relational logic for status indicators
            setMotorHighRpmActive(motorRPM > 3000); // Motor active if RPM > 3000
            setBatteryLowActive(batteryPct < 20);   // Battery low if < 20%
          }
        } else {
          // Handle HTTP errors
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
        }
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Fetch aborted.");
        } else {
          console.error("Error fetching dashboard data:", error);
          if (isMounted) {
            // Implement exponential backoff
            const newAttempt = attempt + 1;
            setAttempt(newAttempt);
            const newInterval = Math.min(INITIAL_POLL_INTERVAL * 2 ** newAttempt, MAX_POLL_INTERVAL);
            setPollInterval(newInterval);
          }
        }
      } finally {
        if (isMounted) {
          // Schedule the next fetch
          setTimeout(fetchData, pollInterval);
        }
      }
    };

    fetchData(); // Initial fetch

    // Cleanup function to abort fetch and prevent state updates
    return () => {
      isMounted = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [pollInterval, attempt]);

  // **Debounced Slider Handler to Reduce POST Request Frequency**
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

        // Optionally update RPM if returned by server (not required here since polling will update it)
      } catch (error) {
        console.error("Error updating motor speed:", error);
      }
    }, 500)
  ).current;

  // **Handler: Slider Change**
  const handleSliderChange = (val) => {
    setSliderValue(val);
    debouncedPostMotorSpeed(val);
  };

  // **Handler: Charging Toggle**
  const handleChargingToggle = async () => {
    const nextState = !isCharging;
    setIsCharging(nextState);
    try {
      const response = await fetch("https://api-wv6xyu6ukq-uc.a.run.app/battery/charging", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCharging: nextState}),
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
      <BottomRow isCharging={isCharging} onToggleCharging={handleChargingToggle} />
    </div>
  );
}

export default Dashboard;
