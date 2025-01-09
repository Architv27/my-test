// src/components/dashboard/indicators/BatteryLowIndicator.jsx
import React from "react";
import "../../../ComponentCSS/indicators.css";
import { MdBatteryAlert } from "react-icons/md";

function BatteryLowIndicator({ active }) {
  return (
    <div className={`indicator-wrapper ${active ? "active" : ""}`}>
      {/* Replace 'B' with a battery low icon */}
      <MdBatteryAlert style={{fontSize:"4rem"}}/>
      <div className="indicator-label">Battery Low</div>
    </div>
  );
}

export default BatteryLowIndicator;
