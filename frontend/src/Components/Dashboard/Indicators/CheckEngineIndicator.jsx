// src/components/dashboard/indicators/CheckEngineIndicator.jsx
import React from "react";
import "../../../ComponentCSS/indicators.css";

function CheckEngineIndicator({ active }) {
  return (
    <div className={`indicator-wrapper ${active ? "active" : ""}`}>
      {/* Replace 'CE' with an engine icon */}
      <div className="indicator-icon">CE</div>
      <div className="indicator-label">Check Engine</div>
    </div>
  );
}

export default CheckEngineIndicator;
