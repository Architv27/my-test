// src/components/dashboard/middleRow/BatteryTempDisplay.jsx
import React from "react";

function BatteryTempDisplay({ temperature }) {
  return (
    <div className="info-block">
      <div className="info-label">Battery Temp</div>
      <div className="info-value">{temperature}°C</div>
    </div>
  );
}

export default BatteryTempDisplay;
