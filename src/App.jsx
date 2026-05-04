import { useState } from "react";
import NewsFeed from "./components/NewsFeed";
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
  const [loading, setLoading] = useState(false);

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
        <NewsFeed onSelect={setSelectedArticle} />
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
          setSavedLessons={setSavedLessons}
        />
        
      </div>

      {/* RIGHT */}
      <div className="right">
        <LessonSidebar lessons={savedLessons} />
      </div>

    </div>
  </div>
);
}