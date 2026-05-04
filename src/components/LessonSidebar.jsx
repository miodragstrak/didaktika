export default function LessonSidebar({ lessons }) {
  return (
    <div className="panel">
      <h3>Lessons</h3>

      {lessons.map((l, i) => (
        <div key={i} className="lesson-item">
          {l.level} - {l.title || "Untitled"}
        </div>
      ))}
    </div>
  );
}