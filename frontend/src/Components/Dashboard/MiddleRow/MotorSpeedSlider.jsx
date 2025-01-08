// src/components/dashboard/middleRow/MotorSpeedSlider.jsx
import React from "react";

function MotorSpeedSlider({ value, onChange }) {
  const handleSliderChange = (e) => {
    const newVal = parseInt(e.target.value, 10);
    onChange(newVal); // calls the parent's handleSliderChange
  };

  return (
    <div className="speed-slider-container">
      <label className="slider-label" htmlFor="motorSpeed">
        Motor Speed Setting
      </label>
      <input
        id="motorSpeed"
        type="range"
        min="0"
        max="4"
        step="1"
        value={value}
        onChange={handleSliderChange}
      />
      <div className="slider-value">
        {value === 0 ? "OFF" : value}
      </div>
    </div>
  );
}

export default MotorSpeedSlider;
