import { useEffect, useState } from "react";

export default function QuizPage() {

  const [quiz, setQuiz] = useState([]);
  const [title, setTitle] = useState("");

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

  return (
    <div className="quiz-page">

      <h1>{title}</h1>

      {quiz.map((q, index) => (
        <div key={index}>

          <h3>
            Question {index + 1}
          </h3>

          <p>{q.question}</p>

          {q.options.map((option, i) => (
            <label key={i}>
              <input
                type="radio"
                name={`q-${index}`}
                value={i}
              />
              {option}
            </label>
          ))}

        </div>
      ))}

    </div>
  );
}