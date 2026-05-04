export default function LessonEditor({ lesson, setLesson }) {

  return (
    <textarea
    className="editor"
    value={lesson}
    onChange={(e) => setLesson(e.target.value)}
    placeholder="Lesson will appear here..."
    />
  );
}