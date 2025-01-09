// src/components/dashboard/bottomRow/ChargingButton.jsx
import React from "react";
import { GiCharging } from "react-icons/gi";  // Import the GiCharging icon

function ChargingButton({ isCharging, onToggle, isLoading }) {
  return (
      <GiCharging 
        onClick={onToggle} 
        disabled={isLoading}
        title={isCharging ? "Stop Charging" : "Start Charging"}  // Accessible tooltip
        style={{ 
          color: isCharging ? "green" : "grey",
          fontSize: "4rem"  // Adjust size as needed
        }} 
      />
  );
}

export default ChargingButton;
