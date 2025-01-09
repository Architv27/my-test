// MotorButton.jsx
import React from "react";
import { CgMenuGridR } from "react-icons/cg";

function MotorButton() {
  return (
    <button style={{fontSize:"4rem", paddingRight:"5px", background:"darkgray"}}>
      <CgMenuGridR style={{fontSize:"4rem", paddingLeft:"5px" ,paddingRight:"5px", paddingTop:"11px", color:"white"}} />
    </button>
  );
}

export default MotorButton;
