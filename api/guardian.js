export default async function handler(req, res) {
  const API_KEY = globalThis.process?.env?.GUARDIAN_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "Missing API key" });
  }

  try {
    const url = `https://content.guardianapis.com/search?show-fields=bodyText&page-size=10&api-key=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    const articles = data.response.results.map((a) => ({
      title: a.webTitle,
      content: a.fields?.bodyText || "",
    }));

    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}