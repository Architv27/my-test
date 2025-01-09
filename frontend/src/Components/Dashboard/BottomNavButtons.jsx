// src/components/dashboard/BottomNavButtons.js
import React from "react";
import { FaTemperatureHigh } from "react-icons/fa6"
function BottomNavButtons() {
  return (
    <div className="bottom-nav-buttons">
      <button disabled>Gear</button>
      <button disabled>Motor</button>
      <FaTemperatureHigh style={{fontSize:"4rem"}}/>
      <button disabled>Menu</button>
    </div>
  );
}

export default BottomNavButtons;
