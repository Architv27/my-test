import React from "react";
import { FaTemperatureHigh } from "react-icons/fa6";
import { MdBattery90 } from "react-icons/md";

/**
 * props:
 *   overheated: boolean
 *       If true, both the battery and temperature icon appear red.
 *       Otherwise, they have neutral (grey & whitesmoke) colors.
 */
function BatteryTempButton({ overheated = false }) {
  // If overheated is true, color everything red; else neutral
  const batteryColor = overheated ? "red" : "grey";
  const tempIconColor = overheated ? "red" : "whitesmoke";

  return (
    <div className="battery-temp-button" style={{ position: "relative" }}>
      {/* Battery icon */}
      <MdBattery90
        style={{
          fontSize: "3rem",
          color: batteryColor,
          position: "relative",
          zIndex: 1,
        }}
      />

      {/* Temperature icon, partially overlapping the battery */}
      <FaTemperatureHigh
        style={{
          fontSize: "1.4rem",
          color: tempIconColor,
          position: "absolute",
          left: "1.9rem",  // horizontal offset
          top: "-0.4rem",     // vertical offset
          zIndex: 2
        }}
      />
    </div>
  );
}

export default BatteryTempButton;
