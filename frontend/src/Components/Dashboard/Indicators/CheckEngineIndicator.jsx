// src/components/dashboard/indicators/CheckEngineIndicator.jsx
import React from "react";
import "../../../ComponentCSS/indicators.css";
import { PiEngine } from "react-icons/pi";

function CheckEngineIndicator({ active }) {
  return (
    <div className={`indicator-wrapper ${active ? "active" : ""}`}>
      {/* Replace 'CE' with an engine icon */}
      <PiEngine className="indicator-icon" style={{fontSize:"4rem"}}/>
      <div className="indicator-label">Check Engine</div>
    </div>
  );
}

export default CheckEngineIndicator;
