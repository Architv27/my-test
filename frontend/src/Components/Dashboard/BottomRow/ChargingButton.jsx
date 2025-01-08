// src/components/dashboard/bottomRow/ChargingButton.jsx
import React from "react";

function ChargingButton({ isCharging, onToggle }) {
  return (
    <button className="bottom-button" onClick={onToggle}>
      {isCharging ? "Stop Charging" : "Start Charging"}
    </button>
  );
}

export default ChargingButton;
