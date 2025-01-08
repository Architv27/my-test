// src/components/dashboard/middleRow/MotorRpmDisplay.jsx
import React from "react";

function MotorRpmDisplay({ rpm }) {
  return (
    <div className="info-block">
      <div className="info-label">Motor RPM</div>
      <div className="info-value">{rpm}</div>
    </div>
  );
}

export default MotorRpmDisplay;
