export default function ActionBar({
  lesson,
  level,
  title,
  quiz,
  onSaved,
}) {

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
  if (!title?.lesson_id) {
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
        lesson_id: title.lesson_id,
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
        disabled={!title?.lesson_id}
      >
        Publish
      </button>
    </div>
  );
}
