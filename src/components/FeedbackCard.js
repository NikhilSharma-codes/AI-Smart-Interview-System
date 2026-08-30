import React from "react";

function FeedbackCard({ feedback, nextQuestion }) {
  return (
    <section className="feedback-card">
      <div className="feedback-heading">
        <div>
          <p className="feedback-label">AI EVALUATION</p>
          <h3>Feedback on your answer</h3>
        </div>
        <div className="score-badge">{feedback.score}/10</div>
      </div>

      <div className="feedback-section">
        <h4>Feedback</h4>
        <p>{feedback.feedback}</p>
      </div>

      <div className="feedback-columns">
        <div className="feedback-section">
          <h4>Strengths</h4>
          <ul className="strength-list">
            {feedback.strengths.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        </div>
        <div className="feedback-section">
          <h4>Areas for Improvement</h4>
          <ul className="improvement-list">
            {feedback.weaknesses.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        </div>
      </div>

      <div className="suggestion-box">
        <h4>Suggestion</h4>
        <p>{feedback.suggestion}</p>
      </div>

      <button className="next-btn" onClick={nextQuestion}>Next Question</button>
    </section>
  );
}

export default FeedbackCard;
