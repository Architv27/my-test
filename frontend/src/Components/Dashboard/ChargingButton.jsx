// src/components/dashboard/ChargingButton.js
import React from "react";

function ChargingButton({ isCharging, onToggle }) {
  return (
    <div className="charging-button">
      <button onClick={onToggle}>
        {isCharging ? "Stop Charging" : "Start Charging"}
      </button>
    </div>
  );
}

export default ChargingButton;
