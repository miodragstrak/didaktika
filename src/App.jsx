import { useCallback, useEffect, useState } from "react";
import SourcePanel from "./components/SourcePanel";
import Controls from "./components/Controls";
import LessonEditor from "./components/LessonEditor";
import LessonSidebar from "./components/LessonSidebar";
import ActionBar from "./components/ActionBar";
import "./styles.css";
import logo from "./assets/logo.png";

export default function App() {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [lesson, setLesson] = useState("");
  const [level, setLevel] = useState("B1");
  const [savedLessons, setSavedLessons] = useState([]);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [lessonsError, setLessonsError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadLessons = useCallback(async () => {
    const lessonsUrl = import.meta.env.VITE_GET_LESSONS_URL;

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

return (
  <div className="page">

    {/* 🔝 HEADER */}
    <div className="header">
      <img src={logo} alt="Didakta" />
    </div>

    {/* 🔽 MAIN APP */}
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
          setLoading={setLoading}
        />

        {selectedArticle && (
          <div className="preview">
            <h4>{selectedArticle.title}</h4>
            <p>{stripHtml(selectedArticle.content).slice(0, 500)}...</p>
          </div>
        )}

        <LessonEditor lesson={lesson} setLesson={setLesson} loading={loading} />

        <ActionBar
          lesson={lesson}
          level={level}
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
        />
      </div>

    </div>
  </div>
);
}
