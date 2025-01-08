// src/components/dashboard/middleRow/BatteryPercentDisplay.jsx
import React from "react";

function BatteryPercentDisplay({ percent }) {
  return (
    <div className="info-block">
      <div className="info-label">Battery %</div>
      <div className="info-value">{percent}</div>
    </div>
  );
}

export default BatteryPercentDisplay;
