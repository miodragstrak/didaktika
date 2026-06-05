import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
import process from "process";

dotenv.config();

console.log("GET_LESSONS_URL =", process.env.GET_LESSONS_URL);

console.log("Loaded webhook:", process.env.VITE_N8N_WEBHOOK_URL);

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

app.post("/api/generate-lesson", async (req, res) => {
  try {
    const response = await fetch(
      process.env.N8N_WEBHOOK_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      }
    );

    const data = await response.json();

    res.json(data);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
});

// START SERVER
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/api/get-lessons", async (req, res) => {
  try {
    const response = await fetch(
      process.env.GET_LESSONS_URL
    );

    console.log("Status:", response.status);

    const text = await response.text();

    console.log(text);

    res.send(text);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
});