// src/components/dashboard/gauges/RpmGauge.jsx
import React from "react";
import "../../../ComponentCSS/gauges.css";

/**
 * rpm: number (0 -> max)
 *   e.g. 0 -> 4000 or 0 -> 800 depending on your scale
 */
function RpmGauge({ rpm = 0 }) {
  const maxRpm = 4000;
  const clamped = Math.min(maxRpm, Math.max(0, rpm));
  // Map 0->4000 to 0->180 deg
  const rotation = (clamped / maxRpm) * 180;

  return (
    <div className="gauge-container">
      <div className="gauge-title">MOTOR RPM</div>
      <div className="gauge">
        <div
          className="gauge-needle"
          style={{ transform: `rotate(${rotation}deg)` }}
        ></div>
        <div className="gauge-center"></div>
      </div>
      <div className="gauge-readout">{rpm} RPM</div>
    </div>
  );
}

export default RpmGauge;
