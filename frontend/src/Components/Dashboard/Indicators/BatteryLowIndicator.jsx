// src/components/dashboard/indicators/BatteryLowIndicator.jsx
import React from "react";
import "../../../ComponentCSS/indicators.css";

function BatteryLowIndicator({ active }) {
  return (
    <div className={`indicator-wrapper ${active ? "active" : ""}`}>
      {/* Replace 'B' with a battery low icon */}
      <div className="indicator-icon">B</div>
      <div className="indicator-label">Battery Low</div>
    </div>
  );
}

export default BatteryLowIndicator;
