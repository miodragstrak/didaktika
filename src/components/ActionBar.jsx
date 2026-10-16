import { useState } from "react";

export default function ActionBar({
  lesson,
  level,
  title,
  quiz,
  activeLessonId,
  onSaved,
  onPublished,
}) {
  const [testEmail, setTestEmail] = useState("");
  const [publishing, setPublishing] = useState(false);

  const sendTestEmail = async (event) => {
    event.preventDefault();

    if (!testEmail.trim()) {
      alert("Please enter a learner email address.");
      return;
    }

    try {
      const res = await fetch(import.meta.env.VITE_SEND_TEST_EMAIL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lesson_id: activeLessonId,
          email: testEmail,
          title,
          lesson,
          quiz,
          level,
        }),
      });

      if (!res.ok) {
        alert(`Email failed (${res.status})`);
        return;
      }

      alert("Learner preview sent");
    } catch (err) {
      console.error("Error sending learner preview:", err);
      alert("Failed to send learner preview");
    }
  };

  const saveLesson = async () => {
    if (!lesson) return;

    const newLessonId = crypto.randomUUID();
    const savedLesson = {
      lesson_id: newLessonId,
      level,
      title: title || lesson.split("\n")[0].replace(/#/g, "").trim(),
      lesson,
      quiz: JSON.stringify(quiz),
      status: "draft",
      created_at: new Date().toISOString(),
    };

    try {
      const res = await fetch(import.meta.env.VITE_SAVE_LESSON_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(savedLesson),
      });

      if (!res.ok) {
        alert("Failed to save lesson");
        return;
      }

      await onSaved?.(savedLesson);
      alert("Lesson saved");
    } catch (err) {
      console.error("Error saving lesson:", err);
      alert("Failed to save lesson");
    }
  };

  const handlePublish = async () => {
    if (!activeLessonId) {
      alert("Cannot publish: no active lesson ID. Save an AI draft or select a saved lesson first.");
      return;
    }

    const publishUrl = import.meta.env.VITE_PUBLISH_LESSON_URL;
    if (!publishUrl?.trim()) {
      alert("Cannot publish: VITE_PUBLISH_LESSON_URL is not configured. Configure it and rebuild the app.");
      return;
    }

    try {
      setPublishing(true);
      const res = await fetch(publishUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lesson_id: activeLessonId }),
      });

      if (!res.ok) {
        alert(`Failed to publish lesson (HTTP ${res.status}).`);
        return;
      }

      await onPublished?.(activeLessonId);
      alert("Lesson approved and published successfully.");
    } catch (err) {
      console.error("Error publishing lesson:", err);
      alert("Could not reach the publish webhook. Please check your connection and try again.");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="actions">
      <div className="lesson-actions">
        <button onClick={saveLesson}>Save AI Draft</button>
        <button onClick={handlePublish} disabled={!activeLessonId || publishing}>
          {publishing ? "Publishing..." : "Approve and Publish"}
        </button>
        <button
          className="ghost-button"
          disabled={!activeLessonId}
          onClick={() => window.open(
            `/quiz?lesson_id=${encodeURIComponent(activeLessonId)}`,
            "_blank",
            "noopener,noreferrer",
          )}
        >
          Preview Learner Quiz
        </button>
      </div>

      {!activeLessonId && (
        <p className="muted">
          Save an AI draft or select a saved lesson to enable publishing and quiz preview.
        </p>
      )}

      <form className="learner-preview" onSubmit={sendTestEmail}>
        <label htmlFor="learner-email">Learner email</label>
        <input
          id="learner-email"
          type="email"
          required
          placeholder="student@example.com"
          value={testEmail}
          onChange={(e) => setTestEmail(e.target.value)}
        />
        <button type="submit">Send Learner Preview</button>
      </form>
    </div>
  );
}
