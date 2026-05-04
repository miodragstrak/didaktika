import { useEffect, useState } from "react";

export default function NewsFeed({ onSelect }) {
  const [articles, setArticles] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

fetch(`${API_URL}/api/guardian`)

  useEffect(() => {
    fetch(`https://content.guardianapis.com/search?show-fields=bodyText&api-key=${import.meta.env.VITE_GUARDIAN_API_KEY}`)
      .then(res => res.json())
      .then(setArticles);
  }, []);

  return (
    <div className="panel">
      <h3>News</h3>

      {articles.map((a, i) => (
        <div key={i} className="article" onClick={() => onSelect(a)}>
          {a.title}
        </div>
      ))}
    </div>
  );
}