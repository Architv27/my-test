// src/components/dashboard/indicators/ParkingBrakeIndicator.jsx
import React from "react";
import "../../../ComponentCSS/indicators.css";

function ParkingBrakeIndicator({ active }) {
  return (
    <div className={`indicator-wrapper ${active ? "active" : ""}`}>
      {/* In a real app, replace 'P' with an actual Parking Brake icon */}
      <div style={{fontSize:"3.6rem"}} className="indicator-icon">P</div>
      <div className="indicator-label">Parking Brake</div>
    </div>
  );
}

export default ParkingBrakeIndicator;
