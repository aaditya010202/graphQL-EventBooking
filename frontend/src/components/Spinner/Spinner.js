import React from "react";
import "./Spinner.css";
const Spinner = () => (
  <div className="Spinner">
    <div className="lds-ellipsis">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
);

export default Spinner;
