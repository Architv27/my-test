// src/components/dashboard/middleRow/GearRatioDisplay.jsx
import React from "react";
import { FaGear } from "react-icons/fa6";

function GearRatioDisplay({ ratio }) {
  return (
    <div className="info-block">
      <FaGear style={{fontSize: "4em", color:"grey"}}/>
      <div className="info-value">{ratio}</div>
    </div>
  );
}

export default GearRatioDisplay;
