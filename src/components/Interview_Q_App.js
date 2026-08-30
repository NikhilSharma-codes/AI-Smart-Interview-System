import React, { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import ProgressBar from "./ProgressBar";
import QuestionCard from "./QuestionCard";
import AnswerBox from "./AnswerBox";
import FeedbackCard from "./FeedbackCard";
import allQuestions from "../data/questions";
import FinalReport from "./FinalReport";
import "./Interview_Q_App.css";

function Interview_Q_App({ user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedRole = location.state?.role || "";
  const questions = allQuestions[selectedRole] || [];
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [responses, setResponses] = useState([]);
  const [evaluation, setEvaluation] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (interviewCompleted) return undefined;

    const timer = setInterval(() => setSeconds((previous) => previous + 1), 1000);
    return () => clearInterval(timer);
  }, [interviewCompleted]);

  const submitAnswer = async () => {
    if (!answer.trim()) {
      alert("Please enter your answer.");
      return;
    }

    setIsEvaluating(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: questions[currentQuestion].question,
          answer: answer.trim(),
          role: selectedRole,
          questionNumber: currentQuestion + 1,
        }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not evaluate your answer.");
      }

      const answerRecord = {
        questionId: questions[currentQuestion].id,
        questionNumber: currentQuestion + 1,
        question: questions[currentQuestion].question,
        answer: answer.trim(),
        evaluation: data.evaluation,
      };

      setResponses((previous) => [...previous, answerRecord]);
      setEvaluation(data.evaluation);
      setShowFeedback(true);
    } catch (error) {
      alert(error.message || "Cannot connect to the evaluation service.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((previous) => previous + 1);
      setAnswer("");
      setEvaluation(null);
      setShowFeedback(false);
      return;
    }

    const date = new Date();
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const historyKey = `interviewHistory_${user.user_id || user.email}`;
    const interviewRecord = {
      id: `${Date.now()}-${selectedRole}`,
      role: selectedRole,
      questionsAttempted: responses.length,
      seconds,
      date: date.toLocaleDateString(),
      dateKey,
    };

    try {
      const existingHistory = JSON.parse(localStorage.getItem(historyKey)) || [];
      localStorage.setItem(historyKey, JSON.stringify([interviewRecord, ...existingHistory].slice(0, 10)));
    } catch {
      // The report is still shown if browser storage is unavailable.
    }

    setInterviewCompleted(true);
  };

  const restartInterview = () => {
    setCurrentQuestion(0);
    setAnswer("");
    setResponses([]);
    setEvaluation(null);
    setShowFeedback(false);
    setSeconds(0);
    setInterviewCompleted(false);
  };

  const exitInterview = () => {
    if (window.confirm("Exit this interview? Your current answers and progress will be lost.")) {
      navigate("/dashboard");
    }
  };

  if (!selectedRole || questions.length === 0) {
    return <Navigate to="/dashboard" replace />;
  }

  if (interviewCompleted) {
    return (
      <FinalReport
        candidateName={user.full_name}
        selectedRole={selectedRole}
        responses={responses}
        totalQuestions={questions.length}
        seconds={seconds}
        onRestart={restartInterview}
      />
    );
  }

  const minutes = Math.floor(seconds / 60);
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <div className="app-layout">
      <main className="main-content">
        <div className="interview-topbar">
          <h2>Welcome, {user.full_name}</h2>
          <button className="exit-interview-button" onClick={exitInterview} disabled={isEvaluating}>
            Exit interview
          </button>
        </div>
        <Header role={selectedRole} current={currentQuestion + 1} total={questions.length} time={formattedTime} />
        <ProgressBar completed={responses.length} total={questions.length} />
        <QuestionCard question={questions[currentQuestion].question} />
        {showFeedback ? (
          <FeedbackCard feedback={evaluation} nextQuestion={nextQuestion} />
        ) : (
          <AnswerBox
            answer={answer}
            setAnswer={setAnswer}
            submitAnswer={submitAnswer}
            isEvaluating={isEvaluating}
          />
        )}
      </main>
    </div>
  );
}

export default Interview_Q_App;
