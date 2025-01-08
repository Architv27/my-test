// src/components/dashboard/gauges/PowerGauge.jsx
import React from "react";
import "../../../ComponentCSS/gauges.css";

/**
 * value: number (kW)
 *   Positive => battery is discharging (motor consumption)
 *   Negative => battery is charging
 *   e.g., range could be -100 to +100 or further
 */
function PowerGauge({ value = 0 }) {
  // clamp or define a max/min for rotation
  const maxVal = 100;
  const minVal = -100;
  const clamped = Math.max(minVal, Math.min(maxVal, value));
  // convert to degrees (just an example)
  const rotation = (clamped / maxVal) * 90; // -90 deg to +90 deg range

  return (
    <div className="gauge-container">
      <div className="gauge-title">POWER (kW)</div>
      <div className="gauge">
        <div
          className="gauge-needle"
          style={{ transform: `rotate(${rotation}deg)` }}
        ></div>
        <div className="gauge-center"></div>
      </div>
      <div className="gauge-readout">
        {value > 0 ? `+${value} kW` : `${value} kW`}
      </div>
    </div>
  );
}

export default PowerGauge;
