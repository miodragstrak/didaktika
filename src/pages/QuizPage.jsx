import { useEffect, useState } from "react";

export default function QuizPage() {

    const [quiz, setQuiz] = useState([]);
    const [title, setTitle] = useState("");
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(null);

useEffect(() => {

  async function loadQuiz() {

    const params =
      new URLSearchParams(window.location.search);

    const lessonId =
      params.get("lesson_id");

    const url =
      `${import.meta.env.VITE_GET_LESSON_BY_ID_URL}?lesson_id=${lessonId}`;

    const res = await fetch(url);

    const data = await res.json();

    setTitle(data.title);

    const parsedQuiz =
      typeof data.quiz === "string"
        ? JSON.parse(data.quiz)
        : data.quiz;

    setQuiz(parsedQuiz);
    
  }

  loadQuiz();

}, []);

const submitQuiz = () => {

  let correct = 0;

  quiz.forEach((q, index) => {

    if (
      answers[index] === q.correct
    ) {
      correct++;
    }

  });

  setScore(correct);
};

return (
  <div className="quiz-page">

    <div className="quiz-header">
      <h1>{title}</h1>
    </div>

    {quiz.map((q, index) => (
      <div
        key={index}
        className="quiz-card"
      >

        <h2>
          Question {index + 1}
        </h2>

        <p className="question-text">
          {q.question}
        </p>

        <div className="options">

          {q.options.map((option, i) => (
            <label
              key={i}
              className="option"
            >
              <input
                type="radio"
                name={`q-${index}`}
                value={i}
                checked={answers[index] === i}
                onChange={() =>
                  setAnswers({
                    ...answers,
                    [index]: i,
                  })
                }
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
    >
        Submit Quiz
    </button>

    {score !== null && (
  <div className="quiz-result">

    <h2>
      Score: {score}/{quiz.length}
    </h2>

    <p>
      {Math.round(
        (score / quiz.length) * 100
      )}%
    </p>

  </div>
)}

  </div>
);
}