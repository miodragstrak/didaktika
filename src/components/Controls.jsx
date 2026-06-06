export default function Controls({
  level,
  setLevel,
  article,
  setLesson,
  setQuiz,
  setTitle,
  setLoading
}) {

  const levels = ["B1", "B2", "C1", "C2"];
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

  const generateLesson = async () => {
    if (!article) {
      alert("Please select an article first");
      return;
    }

    try {
      setLoading(true);

      console.log("GENERATE CLICKED");
    console.log("API_URL =", API_URL);

      const res = await fetch(import.meta.env.N8N_WEBHOOK_URL, {
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
