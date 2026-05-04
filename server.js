import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
import process from "process";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = process.env.GUARDIAN_API_KEY;

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Server is working");
});

// GUARDIAN ROUTE
app.get("/api/guardian", async (req, res) => {
  try {
    const url = `https://content.guardianapis.com/search?api-key=${API_KEY}&show-fields=bodyText`;

    const response = await fetch(url);
    const data = await response.json();

    const articles = data.response.results.map(a => ({
        title: a.webTitle,
        content: a.fields?.bodyText || a.fields?.trailText || "",
        }));

    res.json(articles);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// START SERVER
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});