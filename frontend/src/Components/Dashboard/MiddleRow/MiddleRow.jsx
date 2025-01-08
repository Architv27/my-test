// src/components/dashboard/middleRow/MiddleRow.js
import React, {useState} from "react";
import GearRatioDisplay from "./GearRatioDisplay";
import BatteryPercentDisplay from "./BatteryPercentDisplay";
import BatteryTempDisplay from "./BatteryTempDisplay";
import MotorRpmDisplay from "./MotorRpmDisplay";
import MotorSpeedSlider from "./MotorSpeedSlider";

// Ensure you have the correct path to your CSS file
import "../../../ComponentCSS/middleRow.css";

function MiddleRow({
  gearRatio,
  batteryPercent,
  batteryTemp,
  rpmValue,
  sliderValue,
  onSliderChange
}) {
  return (
    <div className="middle-row-container">
      <GearRatioDisplay ratio={gearRatio} />
      <BatteryPercentDisplay percent={batteryPercent} />
      <BatteryTempDisplay temperature={batteryTemp} />
      <MotorRpmDisplay rpm={rpmValue} />
      <MotorSpeedSlider value={sliderValue} onChange={onSliderChange} />
    </div>
  );
}

export default MiddleRow;
