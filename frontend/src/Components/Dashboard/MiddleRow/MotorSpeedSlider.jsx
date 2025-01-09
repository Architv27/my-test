// src/components/dashboard/middleRow/MotorSpeedSlider.jsx
import React from "react";
import PropTypes from "prop-types";
import { Slider } from "@mui/material";

function MotorSpeedSlider({ value, onChange, isCharging }) {
  // Convert slider event -> number, then call the parent's onChange
  const handleSliderChange = (e, newVal) => {
    // In MUI, the second arg in onChange is the new slider value
    onChange(newVal);
  };

  // For accessibility text
  function valuetext(currentValue) {
    return `${currentValue}`;
  }

  // Define slider marks
  const marks = [
    { value: 0, label: "OFF" },
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
  ];

  return (
    <div className="speed-slider-container">
      <label className="slider-label" htmlFor="motorSpeed">
        Motor Speed Setting
      </label>

      <Slider
        id="motorSpeed"
        aria-label="Motor Speed Setting"
        value={isCharging ? 0 : value} 
        onChange={handleSliderChange} 
        step={1}
        min={0}
        max={4}
        marks={marks}
        getAriaValueText={valuetext}
        disabled={isCharging}
        sx={{
          width: 155,               // adjust to your layout
          color: "white",         // slider track color
          "& .MuiSlider-markLabel": {
            color: "#fff",          // mark labels text color
          },
          "& .MuiSlider-valueLabel": {
            color: "#fff",          // value label text color
            backgroundColor: "grey",
          },
        }}
      />
    </div>
  );
}

MotorSpeedSlider.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  isCharging: PropTypes.bool.isRequired,
};

export default MotorSpeedSlider;
