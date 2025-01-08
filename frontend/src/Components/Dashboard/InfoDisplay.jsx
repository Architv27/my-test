// src/components/dashboard/InfoDisplay.js
import React from "react";

function InfoDisplay({ label, value }) {
  return (
    <div className="info-display">
      <div className="info-label">{label}</div>
      <div className="info-value">{value}</div>
    </div>
  );
}

export default InfoDisplay;
