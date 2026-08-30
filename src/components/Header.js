import React from "react";

function Header(props) {
  return (
    <div className="header">

      <h2>{props.role}</h2>
  
      <div className="header-info">
        <span>Question {props.current} / {props.total}</span>
        <span className="header-timer">Time: {props.time}</span>
      </div>

    </div>
  );
}

export default Header;
