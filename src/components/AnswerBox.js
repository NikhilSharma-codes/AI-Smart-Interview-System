import React from "react";

function AnswerBox({ answer, setAnswer, submitAnswer, isEvaluating }) {
  return (
    <div className="answer-box">
      <h3>Your Answer</h3>
      <textarea
        rows="5"
        placeholder="Write your answer..."
        value={answer}
        onChange={(event) => setAnswer(event.target.value)}
        disabled={isEvaluating}
      />
      <button className="submit-btn" onClick={submitAnswer} disabled={isEvaluating}>
        {isEvaluating ? "Evaluating answer..." : "Submit Answer"}
      </button>
    </div>
  );
}

export default AnswerBox;
