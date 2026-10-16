export default function LessonEditor({ lesson, setLesson }) {

  return (
    <textarea
    className="editor"
    aria-label="Lesson editor"
    value={lesson}
    onChange={(e) => setLesson(e.target.value)}
    placeholder="Lesson will appear here..."
    />
  );
}
