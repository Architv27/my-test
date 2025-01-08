// src/components/dashboard/indicators/MotorStatusIndicator.jsx
import React from "react";
import "../../../ComponentCSS/indicators.css";

function MotorStatusIndicator({ active }) {
  return (
    <div className={`indicator-wrapper ${active ? "active" : ""}`}>
      {/* Replace 'M' with a motor icon */}
      <div className="indicator-icon">M</div>
      <div className="indicator-label">Motor High RPM</div>
    </div>
  );
}

export default MotorStatusIndicator;
