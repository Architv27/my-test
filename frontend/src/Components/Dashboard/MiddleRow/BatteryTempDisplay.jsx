// src/components/dashboard/middleRow/BatteryTempDisplay.jsx
import React from "react";
import { FaTemperatureHigh } from "react-icons/fa6";
import { MdBattery90 } from "react-icons/md";

function BatteryTempDisplay({ temperature }) {
  return (
    <div className="info-block" style={{ paddingLeft:30}}>
          <div style={{ position: "relative"}}>
            {/* Battery icon */}
            <MdBattery90
              style={{
                fontSize: "4rem",
                color: "white",
                position: "relative",
                zIndex: 1,
                paddingTop:10,
                marginBottom:0
              }}
            />
      
            {/* Temperature icon, partially overlapping the battery */}
            <FaTemperatureHigh
              style={{
                fontSize: "1.4rem",
                color: "white",
                position: "absolute",
                left: "2.5rem",  // horizontal offset
                top: "-0.4rem",     // vertical offset
                zIndex: 2,
                paddingTop:"20px"
              }}
            />
          </div>
      <div className="info-value" style={{paddingBottom:"10px", margin:0}}>{temperature}°C</div>
    </div>
  );
}

export default BatteryTempDisplay;
