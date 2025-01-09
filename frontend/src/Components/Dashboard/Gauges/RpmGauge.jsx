// src/components/dashboard/gauges/RpmGauge.jsx
import React from "react";
import "../../../ComponentCSS/gauges.css";

/**
 * rpm: number, range 0..800
 * This gauge displays from 0 RPM (needle at -90°) to 800 RPM (needle at +90°).
 */
function RpmGauge({ rpm = 0 }) {
  const maxRpm = 800;
  const clampedRpm = Math.min(Math.max(rpm, 0), maxRpm);

  // Map [0..maxRpm] => [-90..+90] degrees
  const fraction = clampedRpm / maxRpm; // 0..1
  const rotationDeg = fraction * 180 - 90; // -90..+90

  // Tick marks
  const ticks = [0, 100, 200, 300, 400, 500, 600, 700, 800];

  return (
    <div className="gauge-container rpm-gauge">
      {/* Title at top */}
      <div className="gauge-title">MOTOR RPM</div>

      {/* Tick marks around the arc */}
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

      {/* Gauge face (needle + center) */}
      <div className="gauge">
        <div
          className="gauge-needle"
          style={{ transform: `rotate(${rotationDeg}deg)` }}
        ></div>
        <div className="gauge-center"></div>
      </div>

      {/* Numeric readout at bottom */}
      <div className="gauge-readout-inside">{clampedRpm} RPM</div>
    </div>
  );
}

export default RpmGauge;
