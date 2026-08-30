import React from "react";

function ProgressBar({ completed, total }) {

  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="progress-section">

      <p>Progress</p>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      <p>{Math.round(percentage)}% Completed</p>

    </div>
  );
}

export default ProgressBar;
