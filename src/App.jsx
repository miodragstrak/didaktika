import { useCallback, useEffect, useState } from "react";
import SourcePanel from "./components/SourcePanel";
import Controls from "./components/Controls";
import LessonEditor from "./components/LessonEditor";
import LessonSidebar from "./components/LessonSidebar";
import ActionBar from "./components/ActionBar";
import "./styles.css";
import logo from "./assets/logo.png";
import PublicationManager from "./components/PublicationManager";
import QuizPage from "./pages/QuizPage";

export default function App() {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [lesson, setLesson] = useState("");
  const [level, setLevel] = useState("B1");
  const [savedLessons, setSavedLessons] = useState([]);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [lessonsError, setLessonsError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [quiz, setQuiz] = useState([]);
  const [title, setTitle] = useState("");
  const [quizText, setQuizText] = useState("");
  const [view, setView] = useState("studio");

  const loadLessons = useCallback(async () => {
    const lessonsUrl =
      import.meta.env.VITE_GET_LESSONS_URL;

    if (!lessonsUrl) {
      setLessonsError("Missing VITE_GET_LESSONS_URL");
      return;
    }

    try {
      setLessonsLoading(true);
      setLessonsError("");

      const res = await fetch(lessonsUrl);

      if (!res.ok) {
        throw new Error(`Lessons request failed (${res.status})`);
      }

      const data = await res.json();
      const lessons = Array.isArray(data) ? data : data.lessons || [];

      setSavedLessons(lessons);
    } catch (err) {
      console.error("Error loading lessons:", err);
      setLessonsError("Could not load lessons");
    } finally {
      setLessonsLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(loadLessons);
  }, [loadLessons]);

  function stripHtml(html) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  }

  const isQuizPage = window.location.pathname === "/quiz";

    if (isQuizPage) {
      return <QuizPage />;
    }  

return (
  <div className="page">

    {/* 🔝 HEADER */}
    <div className="header">
        <div className="brand">
          <img src={logo} alt="Didaktika" />
        <div>
          <strong>Didaktika</strong>
          <span>AI Lesson Studio</span>
        </div>
      </div>

    <div className="top-nav">
      <button
        className={view === "studio" ? "active" : ""}
        onClick={() => setView("studio")}
      >
        Lesson Studio
      </button>

      <button
        className={view === "publication" ? "active" : ""}
        onClick={() => setView("publication")}
      >
        Publication Manager
      </button>
    </div>
    </div>
    {/* 🔽 MAIN APP */}
    {view === "studio" && (
      <div className="app">

        {/* LEFT */}
        <div className="left">
          <SourcePanel onSelect={setSelectedArticle} />
        </div>

        {/* CENTER */}
        <div className="center">

          <Controls
            level={level}
            setLevel={setLevel}
            article={selectedArticle}
            setLesson={setLesson}
            setQuiz={setQuiz}
            setQuizText={setQuizText}
            setTitle={setTitle}
            setLoading={setLoading}
          />

          {selectedArticle && (
            <div className="preview">
              <h4>{selectedArticle.title}</h4>
              <p>{stripHtml(selectedArticle.content).slice(0, 500)}...</p>
            </div>
          )}

          <LessonEditor lesson={lesson} setLesson={setLesson} loading={loading} />

          {title && (
            <div className="preview">
              <h3>{title}</h3>
            </div>
          )}

          {quiz.length > 0 && (
            <div className="preview">
              <h3>Quiz Editor</h3>

              {quiz.map((q, questionIndex) => (
                <div
                  key={questionIndex}
                  style={{
                    marginBottom: "20px",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                  }}
                >
                  <label>
                    <strong>Question {questionIndex + 1}</strong>
                  </label>

                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => {
                      const updated = [...quiz];
                      updated[questionIndex].question = e.target.value;
                      setQuiz(updated);
                    }}
                    style={{
                      width: "100%",
                      marginTop: "8px",
                      marginBottom: "12px",
                    }}
                  />

                  {q.options?.map((option, optionIndex) => (
                    <input
                      key={optionIndex}
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const updated = [...quiz];
                        updated[questionIndex].options[optionIndex] =
                          e.target.value;
                        setQuiz(updated);
                      }}
                      style={{
                        width: "100%",
                        marginBottom: "8px",
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}

          {quizText && (
            <textarea
              className="lesson-editor"
              value={quizText}
              onChange={(e) => setQuizText(e.target.value)}
            />
          )}

          <ActionBar
            lesson={lesson}
            level={level}
            title={title}
            selectedLesson={selectedLesson}
            quiz={quiz}
            lessonId={selectedLesson?.lesson_id}
            onSaved={loadLessons}
          />
          
        </div>

        {/* RIGHT */}
        <div className="right">
          <LessonSidebar
            lessons={savedLessons}
            loading={lessonsLoading}
            error={lessonsError}
            onRefresh={loadLessons}
            onSelectLesson={(lesson) => {
              setSelectedLesson(lesson);

              setLesson(lesson.lesson || "");
              setLevel(lesson.level || "B1");
              setTitle(lesson.title || "");

              try {
                setQuiz(
                  lesson.quiz
                    ? JSON.parse(lesson.quiz)
                    : []
                );
              } catch {
                setQuiz([]);
              }
            }}
          />
        </div>

      </div>
    )}
    {view === "publication" && <PublicationManager
  lessons={savedLessons}
/>}

  </div>
  );
}