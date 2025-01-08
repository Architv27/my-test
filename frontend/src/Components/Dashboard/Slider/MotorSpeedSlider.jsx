// src/components/dashboard/MotorSpeedSlider.js
import React from "react";

function MotorSpeedSlider({ currentSpeed, onChangeSpeed }) {
  // We assume currentSpeed is an integer between 0 and 4
  const handleChange = (e) => {
    const newSpeed = parseInt(e.target.value, 10);
    onChangeSpeed(newSpeed);
  };

  return (
    <div className="motor-speed-slider">
      <label htmlFor="motorSpeed">Motor Speed Setting: </label>
      <input
        id="motorSpeed"
        type="range"
        min="0"
        max="4"
        step="1"
        value={currentSpeed}
        onChange={handleChange}
      />
      <span>{currentSpeed === 0 ? "OFF" : currentSpeed}</span>
    </div>
  );
}

export default MotorSpeedSlider;
