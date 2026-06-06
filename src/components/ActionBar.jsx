import { useState } from "react";

export default function ActionBar({
  lesson,
  level,
  title,
  quiz,
  lessonId,
  onSaved,
}) {

const [testEmail, setTestEmail] = useState("");

const sendTestEmail = async () => {
  console.log(
    "EMAIL URL:",
    import.meta.env.VITE_SEND_TEST_EMAIL_URL
  );

  const res = await fetch(
    import.meta.env.VITE_SEND_TEST_EMAIL_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lesson_id: lessonId,
        email: testEmail,
        title,
        lesson,
        quiz,
        level,
      }),
    }
  );

  console.log("EMAIL STATUS:", res.status);

  const text = await res.text();

  console.log("EMAIL RESPONSE:");
  console.log(text);

  if (!res.ok) {
    alert(`Email failed (${res.status})`);
    return;
  }

  alert("Test email sent");
};

const saveLesson = async () => {
  if (!lesson) return;

  const lessonTitle =
    title ||
    lesson.split("\n")[0].replace(/#/g, "").trim();
  const lessonId = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const res = await fetch(import.meta.env.VITE_SAVE_LESSON_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      lesson_id: lessonId,
      level,
      title: lessonTitle,
      lesson,
      quiz:JSON.stringify(quiz),
      status: "draft",
      created_at: createdAt,
    }),
  });

  if (!res.ok) {
    alert("Failed to save lesson");
    return;
  }

  await onSaved?.();
  alert("Lesson saved");
};

const handleRecord = () => {
  alert("Recording started (MVP)");
};

const handlePublish = async () => {
  if (!lessonId) {
    alert("Please select a saved lesson first.");
    return;
  }

  const res = await fetch(
    import.meta.env.VITE_PUBLISH_LESSON_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lesson_id: lessonId,
      }),
    }
  );

  if (!res.ok) {
    alert("Failed to publish lesson");
    return;
  }

  await onSaved?.();

  alert("Lesson published 🚀");
};


  return (
    <div className="actions">
      <button onClick={saveLesson}>Save</button>
      <button onClick={handleRecord}>Record</button>
      <button
        onClick={handlePublish}
        disabled={!lessonId}
      >
        Publish
      </button>

      <input
        type="email"
        placeholder="student@example.com"
        value={testEmail}
        onChange={(e) => setTestEmail(e.target.value)}
      />

      <button onClick={sendTestEmail}>
        Send Test Email
      </button>
    </div>
  );
}
