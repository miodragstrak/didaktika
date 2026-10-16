import { useEffect, useState } from "react";
import logo from "../assets/logo.png";

export default function QuizPage() {
  const [quiz, setQuiz] = useState([]);
  const [title, setTitle] = useState("");
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadQuiz() {
      try {
        const params = new URLSearchParams(window.location.search);
        const lessonId = params.get("lesson_id");

        if (!lessonId) {
          throw new Error("Missing lesson ID");
        }

        const url = `${import.meta.env.VITE_GET_LESSON_BY_ID_URL}?lesson_id=${encodeURIComponent(lessonId)}`;
        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(`Quiz request failed (${res.status})`);
        }

        const data = await res.json();
        const parsedQuiz = typeof data.quiz === "string"
          ? JSON.parse(data.quiz)
          : data.quiz;

        setTitle(data.title || "Lesson quiz");
        setQuiz(Array.isArray(parsedQuiz) ? parsedQuiz : []);
      } catch (err) {
        console.error("Error loading quiz:", err);
        setError("Could not load this quiz. Please check the lesson link and try again.");
      } finally {
        setLoading(false);
      }
    }

    loadQuiz();
  }, []);

  const submitQuiz = () => {
    if (quiz.length === 0) return;

    let correct = 0;
    quiz.forEach((q, index) => {
      if (answers[index] === q.correct) {
        correct++;
      }
    });
    setScore(correct);
  };

  const percentage = quiz.length > 0 && score !== null
    ? Math.round((score / quiz.length) * 100)
    : 0;
  const feedback = percentage >= 80
    ? "Great work. You are ready to continue."
    : percentage >= 50
      ? "Good progress. Review the lesson and try again."
      : "Review the lesson before continuing.";

  return (
    <main className="quiz-page">
      <div className="quiz-brand">
        <div className="brand">
          <img src={logo} alt="Didaktika" />
          <div>
            <strong>Didaktika</strong>
            <span>Didaktika Lab</span>
          </div>
        </div>
        <span className="poc-badge">Learner preview</span>
      </div>

      <div className="quiz-header">
        <h1>{title || "Lesson quiz"}</h1>
      </div>

      {loading && <p role="status">Loading quiz...</p>}
      {error && <p className="error-text" role="alert">{error}</p>}
      {!loading && !error && quiz.length === 0 && (
        <p className="muted">No quiz questions are available for this lesson yet.</p>
      )}

      {quiz.map((q, index) => (
        <div key={index} className="quiz-card">
          <h2>Question {index + 1}</h2>
          <p className="question-text">{q.question}</p>
          <div className="options" role="group" aria-label={`Question ${index + 1}: ${q.question}`}>
            {q.options.map((option, i) => (
              <label key={i} className="option">
                <input
                  type="radio"
                  name={`q-${index}`}
                  value={i}
                  checked={answers[index] === i}
                  onChange={() => setAnswers({ ...answers, [index]: i })}
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      ))}

      <button
        className="submit-btn"
        onClick={submitQuiz}
        disabled={loading || !!error || quiz.length === 0}
      >
        Submit Quiz
      </button>

      {score !== null && quiz.length > 0 && (
        <div className="quiz-result" role="status">
          <h2>Score: {score}/{quiz.length}</h2>
          <p>{percentage}%</p>
          <p>{feedback}</p>
        </div>
      )}
    </main>
  );
}
