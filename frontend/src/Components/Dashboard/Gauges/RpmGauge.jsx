// src/components/dashboard/Gauges/RpmGauge.jsx
import React from "react";
import "../../../ComponentCSS/gauges.css";

/**
 * rpm: number, range 0..800
 * This gauge displays from 0 RPM (needle at -90°) to 800 RPM (needle at +90°).
 */
function RpmGauge({ rpm = 0 }) {
  // Constrain the rpm value to [0..800]
  const maxRpm = 800;
  const clampedRpm = Math.min(Math.max(rpm, 0), maxRpm);

  // Map [0..maxRpm] => [-90..+90] degrees
  const fraction = clampedRpm / maxRpm; 
  const rotationDeg = fraction * 180 - 90; // from -90° to +90°

  // Generate tick marks
  const ticks = [0, 100, 200, 300, 400, 500, 600, 700, 800];

  return (
    <div className="gauge-container rpm-gauge">
      {/* Optional Title (above the gauge) 
          <div className="gauge-title">RPM Gauge</div> 
      */}

      {/* Ticks and labels */}
      <div className="gauge-ticks">
        {ticks.map((tickValue) => {
          const tickFraction = tickValue / maxRpm;
          const tickRotation = tickFraction * 180 - 90;
          return (
            <div
              key={tickValue}
              className="gauge-tick"
              style={{ transform: `rotate(${tickRotation}deg)` }}
            >
              <span className="tick-label">{tickValue}</span>
            </div>
          );
        })}
      </div>

      {/* The gauge face: needle + center pivot */}
      <div className="gauge">
        <div
          className="gauge-needle"
          style={{ transform: `rotate(${rotationDeg}deg)` }}
        />
        <div className="gauge-center" />
      </div>

      {/* Numeric readout at the bottom inside the gauge */}
      <div className="gauge-readout-inside">
        {clampedRpm} RPM
      </div>
    </div>
  );
}

export default RpmGauge;
