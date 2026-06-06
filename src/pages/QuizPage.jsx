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

    console.log(
  "LESSON URL:",
  `${import.meta.env.VITE_GET_LESSON_BY_ID_URL}?lesson_id=${lessonId}`
);

      const url =
  `${import.meta.env.VITE_GET_LESSON_BY_ID_URL}?lesson_id=${lessonId}`;

console.log("LESSON URL:", url);

const res = await fetch(url);

console.log("STATUS:", res.status);

const text = await res.text();

console.log("RAW RESPONSE:");
console.log(text);

    /*  setTitle(data.title);

      const parsedQuiz =
        typeof data.quiz === "string"
          ? JSON.parse(data.quiz)
          : data.quiz;

      setQuiz(parsedQuiz); */
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