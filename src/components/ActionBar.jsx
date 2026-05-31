export default function ActionBar({ lesson, level, onSaved }) {

const saveLesson = async () => {
  if (!lesson) return;

  const firstLine =
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
      title: firstLine,
      lesson,
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

const handlePublish = () => {
  alert("Lesson sent to students 🚀");
};


  return (
    <div className="actions">
      <button onClick={saveLesson}>Save</button>
      <button onClick={handleRecord}>Record</button>
      <button onClick={handlePublish}>Publish</button>
    </div>
  );
}
