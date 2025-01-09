// src/components/dashboard/gauges/RpmGauge.jsx
import React from "react";
import "../../../ComponentCSS/gauges.css";

/**
 * rpm: number (0 -> max)
 *   e.g. 0 -> 4000 or 0 -> 800 depending on your scale
 */
function RpmGauge({ rpm = 0 }) {
  const maxRpm = 800; // Update to 800 as per requirement
  const clamped = Math.min(maxRpm, Math.max(0, rpm));
  
  // Map 0->800 to -90°->+90° range (bottom left to bottom right)
  const rotation = ((clamped / maxRpm) * 180) - 90;

  // Define tick marks for the gauge at regular intervals
  const ticks = [0, 200, 400, 600, 800];

  return (
    <div className="gauge-container">
      <div className="gauge-title">MOTOR RPM</div>
      
      {/* Render tick marks */}
      <div className="gauge-ticks">
        {ticks.map((tick) => {
          // Map tick value to angle position around the gauge
          const tickRotation = ((tick / maxRpm) * 180) - 90;
          return (
            <div 
              key={tick} 
              className="gauge-tick" 
              style={{ transform: `rotate(${tickRotation}deg)` }}
            >
              <span className="tick-label">{tick}</span>
            </div>
          );
        })}
      </div>

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
