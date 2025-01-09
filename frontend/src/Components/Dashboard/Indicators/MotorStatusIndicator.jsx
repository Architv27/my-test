// src/components/dashboard/indicators/MotorStatusIndicator.jsx
import React from "react";
import "../../../ComponentCSS/indicators.css";
import { IoMdSpeedometer } from "react-icons/io";

function MotorStatusIndicator({ active }) {
  return (
    <div className={`indicator-wrapper ${active ? "active" : ""}`}>
      {/* Replace 'M' with a motor icon */}
      <IoMdSpeedometer style={{fontSize:"4rem"}}/>
      <div className="indicator-label">Motor High RPM</div>
    </div>
  );
}

export default MotorStatusIndicator;
