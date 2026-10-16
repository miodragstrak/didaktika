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
  const [activeLessonId, setActiveLessonId] = useState();
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
    if (window.location.pathname !== "/quiz") {
      void Promise.resolve().then(loadLessons);
    }
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
    <header className="header">
        <div className="brand">
          <img src={logo} alt="Didaktika" />
        <div>
          <strong>Didaktika</strong>
          <span>Didaktika Lab</span>
        </div>
      </div>
      <span className="poc-badge">Proof of Concept</span>

    <nav className="top-nav" aria-label="Workspace">
      <button
        className={view === "studio" ? "active" : ""}
        aria-pressed={view === "studio"}
        onClick={() => setView("studio")}
      >
        Lesson Studio
      </button>

      <button
        className={view === "publication" ? "active" : ""}
        aria-pressed={view === "publication"}
        onClick={() => setView("publication")}
      >
        Publication Manager
      </button>
    </nav>
    </header>

    <section className="introduction" aria-labelledby="intro-title">
      <h1 id="intro-title">AI-assisted lesson creation with teacher control</h1>
      <p>
        Transform source content into CEFR-adapted lessons, review AI-generated
        materials and connect them with assessment activities.
      </p>
      <p className="model-description">
        The English lesson is the first demonstration of a reusable Didaktika
        model based on learning outcomes, structured activities, assessment and
        expert review. The same process can be adapted to other courses and
        subject areas.
      </p>
    </section>

    <ol className="process-stepper" aria-label="Lesson creation process">
      {["Source", "Learning settings", "AI generation", "Teacher review", "Publish and assess"].map((step, index) => (
        <li key={step}>
          <span className="step-number" aria-hidden="true">{index + 1}</span>
          <span>{step}</span>
        </li>
      ))}
    </ol>
    {/* 🔽 MAIN APP */}
    {view === "studio" && (
      <div className="app">

        {/* LEFT */}
        <div className="left">
          <SourcePanel onSelect={setSelectedArticle} selectedArticle={selectedArticle} />
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
            loading={loading}
            onGenerated={() => {
              setActiveLessonId(undefined);
              setSelectedLesson(null);
            }}
          />

          {selectedArticle && (
            <div className="preview">
              <h4>{selectedArticle.title}</h4>
              <p>{stripHtml(selectedArticle.content).slice(0, 500)}...</p>
            </div>
          )}

          {lesson && (
            <section className="teacher-review" aria-labelledby="review-title">
              <h2 id="review-title">Teacher review</h2>
              <p>Review and edit the AI-generated lesson and assessment before publishing.</p>
              <ol className="review-status" aria-label="Review and approval stages">
                <li aria-current={selectedLesson?.status !== "published" ? "step" : undefined}>AI Draft</li>
                <li>Teacher Reviewed</li>
                <li aria-current={selectedLesson?.status === "published" ? "step" : undefined}>Approved</li>
              </ol>
              <p className="muted">
                {selectedLesson?.status === "published"
                  ? "Saved status: published."
                  : "AI draft. Teacher review is required before approval."}
              </p>
            </section>
          )}

          <LessonEditor lesson={lesson} setLesson={setLesson} loading={loading} />

          {title && (
            <div className="preview">
              <h3>{title}</h3>
            </div>
          )}

          {quiz.length > 0 && (
            <div className="quiz-editor">
              <h3>Quiz Editor</h3>

              {quiz.map((q, questionIndex) => (
                <div
                  key={questionIndex}
                  className="quiz-editor-question"
                >
                  <label>
                    <strong>Question {questionIndex + 1}</strong>
                  </label>

                  <input
                    type="text"
                    aria-label={`Question ${questionIndex + 1}`}
                    value={q.question}
                    onChange={(e) => {
                      const updated = [...quiz];
                      updated[questionIndex].question = e.target.value;
                      setQuiz(updated);
                    }}
                  />

                  {q.options?.map((option, optionIndex) => (
                    <input
                      key={optionIndex}
                      type="text"
                      aria-label={`Question ${questionIndex + 1}, option ${optionIndex + 1}`}
                      value={option}
                      onChange={(e) => {
                        const updated = [...quiz];
                        updated[questionIndex].options[optionIndex] =
                          e.target.value;
                        setQuiz(updated);
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
            quiz={quiz}
            activeLessonId={activeLessonId}
            onSaved={async (savedLesson) => {
              setActiveLessonId(savedLesson.lesson_id);
              setSelectedLesson(savedLesson);
              await loadLessons();
            }}
            onPublished={async (publishedLessonId) => {
              setSelectedLesson((previous) => (
                previous?.lesson_id === publishedLessonId
                  ? { ...previous, status: "published" }
                  : previous
              ));
              setSavedLessons((previous) => previous.map((savedLesson) => (
                savedLesson.lesson_id === publishedLessonId
                  ? { ...savedLesson, status: "published" }
                  : savedLesson
              )));
              await loadLessons();
            }}
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
              setActiveLessonId(lesson.lesson_id);
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
