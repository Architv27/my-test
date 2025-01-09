// src/components/dashboard/middleRow/MotorSpeedSlider.jsx
import React from "react";
import PropTypes from "prop-types";

function MotorSpeedSlider({ value, onChange, isCharging }) {
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
        value={isCharging ? 0 : value}   // Force value to 0 when charging
        onChange={handleSliderChange}
        disabled={isCharging}
        className="custom-slider"        // Add custom class for styling
      />
      <div className="slider-value">
        {isCharging ? "OFF" : value === 0 ? "OFF" : value}
      </div>
    </div>
  );
}

MotorSpeedSlider.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  isCharging: PropTypes.bool.isRequired,
};

export default MotorSpeedSlider;
