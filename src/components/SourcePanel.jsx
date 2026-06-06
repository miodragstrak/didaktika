import { useEffect, useState } from "react";

export default function SourcePanel({ onSelect }) {
  const [mode, setMode] = useState("news");
  const [articles, setArticles] = useState([]);
  const [manualTitle, setManualTitle] = useState("");
  const [manualContent, setManualContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  async function loadNews() {
    try {
      setLoading(true);

      console.log(
  "VITE_GUARDIAN_NEWS_URL =",
  import.meta.env.VITE_GUARDIAN_NEWS_URL
);

      const res = await fetch(import.meta.env.VITE_GUARDIAN_NEWS_URL);

      if (!res.ok) {
        throw new Error(`News request failed (${res.status})`);
      }

      const data = await res.json();

      const normalized = data.map((item, index) => ({
        id: item.id || `guardian-${index}`,
        title: item.title,
        source: "Guardian",
        content: item.content,
        createdAt: new Date().toISOString(),
      }));

      setArticles(normalized);
    } catch (err) {
      console.error("Error loading news:", err);
    } finally {
      setLoading(false);
    }
  }

  loadNews();
}, []);

  const useManualSource = () => {
    if (!manualTitle.trim() || !manualContent.trim()) {
      alert("Please add title and content.");
      return;
    }

    onSelect({
      id: `manual-${Date.now()}`,
      title: manualTitle,
      source: "Manual",
      content: manualContent,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="panel">
      <h3>Sources</h3>

      <div className="source-tabs">
        <button
          className={mode === "news" ? "active" : ""}
          onClick={() => setMode("news")}
        >
          News
        </button>

        <button
          className={mode === "manual" ? "active" : ""}
          onClick={() => setMode("manual")}
        >
          Manual
        </button>
      </div>

      {mode === "news" && (
        <>
          {loading && <p>Loading news...</p>}

          {!loading &&
            articles.map((article) => (
              <div
                key={article.id}
                className="article"
                onClick={() => onSelect(article)}
              >
                <strong>{article.title}</strong>
                <small>{article.source}</small>
              </div>
            ))}
        </>
      )}

      {mode === "manual" && (
        <div className="manual-source">
          <input
            value={manualTitle}
            onChange={(e) => setManualTitle(e.target.value)}
            placeholder="Lesson topic / title"
          />

          <textarea
            value={manualContent}
            onChange={(e) => setManualContent(e.target.value)}
            placeholder="Paste text, idea, topic, article, transcript..."
          />

          <button onClick={useManualSource}>Use as source</button>
        </div>
      )}
    </div>
  );
}
