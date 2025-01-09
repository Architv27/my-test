// src/components/dashboard/middleRow/MotorRpmDisplay.jsx
import React from "react";
import { IoMdSpeedometer } from "react-icons/io";
function MotorRpmDisplay({ rpm }) {
  return (
    <div className="info-block">
      <IoMdSpeedometer style={{fontSize:"4.5rem"}}/>
      <div className="info-value" style={{paddingBottom:"2px", margin:0}}>{rpm} RPM</div>
    </div>
  );
}

export default MotorRpmDisplay;
