import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InterviewHistory from "../components/InterviewHistory";
import "./Dashboard.css";

function Dashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");
  const roles = ["Java Developer", "Python Developer", "React Developer", "HR Interview"];
  const historyKey = `interviewHistory_${user.user_id || user.email}`;
  const [interviewHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(historyKey)) || [];
    } catch {
      return [];
    }
  });
  const todayKey = (() => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  })();
  const todayDisplayDate = new Date().toLocaleDateString();
  const dailyGoal = 10;
  const todayInterviews = interviewHistory.filter(
    (interview) => interview.dateKey === todayKey || interview.date === todayDisplayDate
  );
  const progressPercentage = Math.round(Math.min((todayInterviews.length / dailyGoal) * 100, 100));

  const startInterview = () => {
    if (!selectedRole) {
      alert("Please select an interview role");
      return;
    }
    navigate("/interview", { state: { role: selectedRole } });
  };

  return (
    <main className="dashboard">
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">AI INTERVIEW PREPARATION</p>
          <h1>Welcome back, {user.full_name}</h1>
          <p className="hero-copy">Choose a role and practise with focused interview questions.</p>
        </div>
        <div className="hero-badge" aria-label="Interview practice">
          <span>AI</span>
          <small>Practice mode</small>
        </div>
      </section>

      <section className="dashboard-card profile-card">
        <div className="profile-avatar" aria-hidden="true">{(user.full_name || "U").charAt(0).toUpperCase()}</div>
        <div className="profile-details">
          <p className="card-kicker">YOUR PROFILE</p>
          <h2>{user.full_name}</h2>
          <p>{user.email}</p>
        </div>
        <button className="logout-button" onClick={onLogout}>Log out</button>
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-card role-card">
          <p className="card-kicker">START A SESSION</p>
          <h2>Choose your interview role</h2>
          <p>Select one role to begin a tailored practice interview.</p>
          <label htmlFor="interview-role">Interview role</label>
          <select id="interview-role" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
            <option value="">Select a role</option>
            {roles.map((role) => <option key={role} value={role}>{role}</option>)}
          </select>
          <button className="start-interview-button" onClick={startInterview}>Start interview <span aria-hidden="true">&rarr;</span></button>
        </div>

        <aside className="dashboard-card progress-card">
          <p className="card-kicker">YOUR PROGRESS</p>
          <h2>Today&apos;s practice goal</h2>
          <div className="progress-ring" style={{ "--progress": `${progressPercentage}%` }}><span>{progressPercentage}%</span></div>
          <p>{todayInterviews.length} of {dailyGoal} practice interviews completed today.</p>
        </aside>
      </section>

      <InterviewHistory interviews={interviewHistory} />
    </main>
  );
}

export default Dashboard;
