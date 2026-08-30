import React from "react";

function InterviewHistory({ interviews }) {
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  };

  return (
    <section className="dashboard-card history-card">
      <div>
        <p className="card-kicker">INTERVIEW HISTORY</p>
        <h2>Previous interviews</h2>
      </div>

      {interviews.length === 0 ? (
        <p className="empty-history">No completed interviews yet. Your results will appear here.</p>
      ) : (
        <div className="history-list">
          {interviews.map((interview) => (
            <div className="history-item" key={interview.id}>
              <div>
                <strong>{interview.role}</strong>
                <span>{interview.date}</span>
              </div>
              <span>{interview.questionsAttempted} questions - {formatDuration(interview.seconds)}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default InterviewHistory;
