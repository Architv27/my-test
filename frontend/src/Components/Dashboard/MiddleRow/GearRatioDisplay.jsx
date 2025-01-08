// src/components/dashboard/middleRow/GearRatioDisplay.jsx
import React from "react";

function GearRatioDisplay({ ratio }) {
  return (
    <div className="info-block">
      <div className="info-label">Gear Ratio</div>
      <div className="info-value">{ratio}</div>
    </div>
  );
}

export default GearRatioDisplay;
