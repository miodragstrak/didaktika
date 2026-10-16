import { CEFR_LEVELS } from "../constants";

export default function Controls({
  level,
  setLevel,
  article,
  setLesson,
  setQuiz,
  setTitle,
  setLoading,
  loading,
  onGenerated,
}) {

  const generateLesson = async () => {
    if (!article) {
      alert("Please select an article first");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(import.meta.env.VITE_N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          article: article.content,
          level
        })
      });

      console.log("FETCH SENT");

      if (!res.ok) {
        throw new Error(`Generate lesson failed: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();

      console.log("Generated lesson:", data);

      setTitle(data.title || "");
      setLesson(data.lesson || "");
      setQuiz(data.quiz || []);
      onGenerated?.();

    } catch (err) {
      console.error(err);
      alert("Failed to generate lesson");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="controls" aria-busy={loading}>

      <div className="level-buttons">
        <span className="label">2 Choose CEFR level:</span>

        {CEFR_LEVELS.map(l => (
          <button
            key={l}
            className={`level-btn ${level === l ? "active" : ""}`}
            aria-pressed={level === l}
            onClick={() => setLevel(l)}
          >
            {l}
          </button>
        ))}
      </div>

      <button onClick={generateLesson} disabled={!article || loading}>
        {loading ? "Generating lesson..." : "3 Generate lesson"}
      </button>

    </div>
  );
}
