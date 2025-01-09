// src/components/dashboard/bottomRow/BottomRow.js
import React from "react";
import GearButton from "./GearButton";
import MotorButton from "./MotorButton";
import BatteryTempButton from "./BatteryTempButton";
import ViewMenuButton from "./ViewMenuButton";
import ChargingButton from "./ChargingButton";
import "../../../ComponentCSS/bottomRow.css";

function BottomRow({ isCharging, onToggleCharging, isLoading, isOverheating }) {
  return (
    <div className="bottom-row-container">
      <div className="left-button-group">
        <GearButton />
        <div style={{marginbottom:"30px"}}>
        <MotorButton />
        </div>
        <BatteryTempButton overheated = {isOverheating}/>
      </div>
      <div style={{paddingRight:"100px"}}>
        <ViewMenuButton />

      </div>


      <ChargingButton isCharging={isCharging} onToggle={onToggleCharging} isLoading={isLoading} />
    </div>
  );
}

export default BottomRow;
