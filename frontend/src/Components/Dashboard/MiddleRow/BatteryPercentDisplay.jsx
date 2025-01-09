// src/components/dashboard/middleRow/BatteryPercentDisplay.jsx
import React from "react";
import { 
  MdBatteryChargingFull, 
  MdBatteryCharging90, 
  MdBatteryCharging80, 
  MdBatteryCharging60, 
  MdBatteryCharging50, 
  MdBatteryCharging30, 
  MdBatteryCharging20 
} from "react-icons/md";
import { 
  MdBatteryFull, 
  MdBattery90, 
  MdBattery80, 
  MdBattery60, 
  MdBattery50, 
  MdBattery30, 
  MdBattery20 
} from "react-icons/md";

function BatteryPercentDisplay({ percent, isCharging }) {
  let BatteryIcon;

  if (isCharging) {
    // Choose charging icons based on battery percentage
    if (percent >= 90) {
      BatteryIcon = MdBatteryChargingFull;
    } else if (percent >= 80) {
      BatteryIcon = MdBatteryCharging90;
    } else if (percent >= 60) {
      BatteryIcon = MdBatteryCharging80;
    } else if (percent >= 50) {
      BatteryIcon = MdBatteryCharging60;
    } else if (percent >= 30) {
      BatteryIcon = MdBatteryCharging50;
    } else if (percent >= 20) {
      BatteryIcon = MdBatteryCharging30;
    } else {
      BatteryIcon = MdBatteryCharging20;
    }
  } else {
    // Choose non-charging icons based on battery percentage
    if (percent >= 90) {
      BatteryIcon = MdBatteryFull;
    } else if (percent >= 80) {
      BatteryIcon = MdBattery90;
    } else if (percent >= 60) {
      BatteryIcon = MdBattery80;
    } else if (percent >= 50) {
      BatteryIcon = MdBattery60;
    } else if (percent >= 30) {
      BatteryIcon = MdBattery50;
    } else if (percent >= 20) {
      BatteryIcon = MdBattery30;
    } else {
      BatteryIcon = MdBattery20;
    }
  }

  return (
    <div className="info-block">
      <BatteryIcon style={{ marginRight: "8px", fontSize: "4rem" }} />
      <div className="info-value">
        {percent}%
      </div>
    </div>
  );
}

export default BatteryPercentDisplay;
