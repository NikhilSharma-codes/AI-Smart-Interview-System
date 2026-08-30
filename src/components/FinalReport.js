import React from "react";
import { useNavigate } from "react-router-dom";

function FinalReport({ candidateName, selectedRole, responses, totalQuestions, seconds, onRestart }) {
  const navigate = useNavigate();
  const totalScore = responses.reduce((sum, response) => sum + Number(response.evaluation.score || 0), 0);
  const maximumScore = totalQuestions * 10;
  const percentage = maximumScore ? Math.round((totalScore / maximumScore) * 100) : 0;
  const strengths = [...new Set(responses.flatMap((response) => response.evaluation.strengths))].slice(0, 5);
  const weaknesses = [...new Set(responses.flatMap((response) => response.evaluation.weaknesses))].slice(0, 5);
  const suggestions = [...new Set(responses.map((response) => response.evaluation.suggestion))].slice(0, 3);
  const minutes = Math.floor(seconds / 60);
  const timeTaken = `${String(minutes).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  const overallFeedback = percentage >= 80
    ? "The candidate demonstrates strong understanding and communicates answers clearly."
    : percentage >= 60
      ? "The candidate has a good foundation but should add more depth and practical detail."
      : "The candidate should revise the core concepts and practise explaining answers with examples.";
  const recommendation = percentage >= 70
    ? "Recommended to continue with more advanced interview practice."
    : "Recommended to review the improvement areas before attempting another interview.";

  return (
    <main className="final-report">
      <p className="report-kicker">FINAL INTERVIEW REPORT</p>
      <h1>Interview Report Card</h1>
      <div className="report-summary">
        <p><strong>Candidate:</strong> {candidateName}</p>
        <p><strong>Role:</strong> {selectedRole}</p>
        <p><strong>Questions answered:</strong> {responses.length} / {totalQuestions}</p>
        <p><strong>Time taken:</strong> {timeTaken}</p>
      </div>

      <div className="score-summary">
        <div>
          <span>Overall score</span>
          <strong>{totalScore.toFixed(1)} / {maximumScore}</strong>
        </div>
        <div>
          <span>Percentage</span>
          <strong>{percentage}%</strong>
        </div>
      </div>

      <section className="report-section">
        <h2>Strengths</h2>
        <ul className="strength-list">{strengths.map((item, index) => <li key={index}>{item}</li>)}</ul>
      </section>
      <section className="report-section">
        <h2>Areas for Improvement</h2>
        <ul className="improvement-list">{weaknesses.map((item, index) => <li key={index}>{item}</li>)}</ul>
      </section>
      <section className="report-section">
        <h2>Suggestions</h2>
        <ul>{suggestions.map((item, index) => <li key={index}>{item}</li>)}</ul>
      </section>
      <section className="report-section overall-feedback">
        <h2>Overall AI Feedback</h2>
        <p>{overallFeedback}</p>
        <p><strong>Recommendation:</strong> {recommendation}</p>
      </section>

      <section className="report-section question-results">
        <h2>Question Results</h2>
        {responses.map((response) => (
          <div className="report-card" key={response.questionId}>
            <div className="question-score"><strong>Question {response.questionNumber}</strong><span>{response.evaluation.score}/10</span></div>
            <p>{response.question}</p>
            <p><strong>Feedback:</strong> {response.evaluation.feedback}</p>
          </div>
        ))}
      </section>

      <div className="report-actions">
        <button className="another-interview-button" onClick={() => navigate("/dashboard")}>Finish Interview</button>
        <button className="dashboard-button" onClick={onRestart}>Try This Role Again</button>
      </div>
    </main>
  );
}

export default FinalReport;
