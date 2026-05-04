export default function Controls({ level, setLevel, article, setLesson, setLoading }) {

  const levels = ["B1", "B2", "C1", "C2"];

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

      const text = await res.text();
      setLesson(text);

    } catch (err) {
      console.error(err);
      alert("Failed to generate lesson");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="controls">

      <div className="level-buttons">
        <span className="label">Izaberi nivo:</span>

        {levels.map(l => (
          <button
            key={l}
            className={`level-btn ${level === l ? "active" : ""}`}
            onClick={() => setLevel(l)}
          >
            {l}
          </button>
        ))}
      </div>

      <button onClick={generateLesson}>
        Generate
      </button>

    </div>
  );
}