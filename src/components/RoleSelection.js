import React, { useState } from "react";

function RoleSelection({ startInterview }) {
  const [selectedRole, setSelectedRole] = useState("");

  return (
    <div className="role-selection">

      <h1>AI-Based Smart Interview Preparation System</h1>

      <h2>Select Interview Role</h2>

      <select
        value={selectedRole}
        onChange={(e) => setSelectedRole(e.target.value)}
      >
        <option value="">-- Select Role --</option>
        <option value="Java Developer">Java Developer</option>
        <option value="Python Developer">Python Developer</option>
        <option value="React Developer">React Developer</option>
        <option value="HR Interview">HR Interview</option>
      </select>

      <br /><br />

      <button
        onClick={() => startInterview(selectedRole)}
      >
        Start Interview
      </button>

    </div>
  );
}

export default RoleSelection;