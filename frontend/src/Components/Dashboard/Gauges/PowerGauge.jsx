// src/components/dashboard/gauges/PowerGauge.jsx
import React from "react";
import "../../../ComponentCSS/gauges.css";

/**
 * value: number (kW)
 *   Range: -1000 (left) ... 0 (top) ... +1000 (right)
 */
function PowerGauge({ value = 0 }) {
  // Gauge range
  const minVal = -1000;
  const maxVal = 1000;

  // Clamp to ensure the needle never spins beyond the dial
  const clampedValue = Math.max(minVal, Math.min(maxVal, value));

  // Convert the value to a fraction from 0..1, then map to -90..+90 degrees
  // -1000 => -90 deg (left)
  //  0    =>   0 deg (top)
  // +1000 => +90 deg (right)
  const fullRange = maxVal - minVal; // 2000
  const fraction = (clampedValue - minVal) / fullRange; // 0..1
  const rotationDegrees = fraction * 180 - 90; // -90..+90

  // Tick marks: label every 250 from -1000 to +1000
  const ticks = [-1000, -750, -500, -250, 0, 250, 500, 750, 1000];

  return (
    <div className="gauge-container power-gauge">
      {/* Title */}
      <div className="gauge-title">POWER (kW)</div>

      {/* Tick marks */}
      <div className="gauge-ticks">
        {ticks.map((tickValue) => {
          // Fraction for each tick
          const tickFraction = (tickValue - minVal) / fullRange; // 0..1
          // Convert to degrees in [-90..+90]
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

      {/* The actual gauge (needle + center) */}
      <div className="gauge">
        <div
          className="gauge-needle"
          style={{
            transform: `rotate(${rotationDegrees}deg)`,
          }}
        />
        <div className="gauge-center" />

        {/* Numeric readout inside the dial */}
        <div className="gauge-readout-inside">
          {value > 0 ? `+${value} kW` : `${value} kW`}
        </div>
      </div>
    </div>
  );
}

export default PowerGauge;
