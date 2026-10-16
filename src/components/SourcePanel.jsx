import { useEffect, useState } from "react";

export default function SourcePanel({ onSelect, selectedArticle }) {
  const [mode, setMode] = useState("news");
  const [articles, setArticles] = useState([]);
  const [manualTitle, setManualTitle] = useState("");
  const [manualContent, setManualContent] = useState("");
  const [loading, setLoading] = useState(false);

useEffect(() => {
  async function loadNews() {
    try {
      setLoading(true);

      const res = await fetch(
        import.meta.env.VITE_GUARDIAN_NEWS_URL
      );

      if (!res.ok) {
        throw new Error(
          `News request failed (${res.status})`
        );
      }

      const data = await res.json();

      const items = Array.isArray(data)
        ? data
        : data.articles || [];

      console.log("ITEMS:", items.length);

      const normalized = items.map((item, index) => ({
        id: item.id || `guardian-${index}`,
        title: item.webTitle || item.title || "Untitled",
        source: item.sectionName || "Guardian",
        content:
          item.fields?.bodyText ||
          item.fields?.trailText ||
          item.content ||
          item.webTitle ||
          "",
        createdAt:
          item.webPublicationDate ||
          new Date().toISOString(),
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
      <h3>1 Choose source content</h3>

      <div className="source-tabs">
        <button
          className={mode === "news" ? "active" : ""}
          aria-pressed={mode === "news"}
          onClick={() => setMode("news")}
        >
          News
        </button>

        <button
          className={mode === "manual" ? "active" : ""}
          aria-pressed={mode === "manual"}
          onClick={() => setMode("manual")}
        >
          Paste your content
        </button>
      </div>

      {mode === "news" && (
        <>
          {loading && <p>Loading news...</p>}

          {!loading &&
            articles.map((article) => (
              <button
                type="button"
                key={article.id}
                className={`article ${selectedArticle?.id === article.id ? "selected" : ""}`}
                aria-pressed={selectedArticle?.id === article.id}
                onClick={() => onSelect(article)}
              >
                <strong>{article.title}</strong>
                <small>{article.source}</small>
              </button>
            ))}
        </>
      )}

      {mode === "manual" && (
        <div className="manual-source">
          <input
            aria-label="Source title"
            value={manualTitle}
            onChange={(e) => setManualTitle(e.target.value)}
            placeholder="Lesson topic / title"
          />

          <textarea
            aria-label="Source content"
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
