import { useEffect, useState } from "react";

export default function NewsFeed({ onSelect }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  async function loadNews() {
    try {
      const res = await fetch(
        `https://content.guardianapis.com/search?show-fields=bodyText&page-size=10&api-key=${import.meta.env.VITE_GUARDIAN_API_KEY}`
      );

      const data = await res.json();

      const articles = data.response.results.map((a) => ({
        title: a.webTitle,
        content: a.fields?.bodyText || "",
      }));

      setArticles(articles);
    } catch (err) {
      console.error("Error loading news:", err);
    } finally {
      setLoading(false);
    }
  }

  loadNews();
}, []);

  return (
    <div className="panel">
      <h3>News</h3>

      {loading && <p>Loading news...</p>}

      {!loading &&
        articles.map((a, i) => (
          <div key={i} className="article" onClick={() => onSelect(a)}>
            {a.title}
          </div>
        ))}
    </div>
  );
}