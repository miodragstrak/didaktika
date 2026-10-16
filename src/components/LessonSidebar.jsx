export default function LessonSidebar({
  lessons,
  loading,
  error,
  onRefresh,
  onSelectLesson
}) {
  return (
    <div className="panel">
      <div className="panel-heading">
        <h3>Lessons</h3>
        <button className="ghost-button" onClick={onRefresh} disabled={loading}>
          Refresh
        </button>
      </div>

      {loading && <p className="muted">Loading lessons...</p>}

      {!loading && error && <p className="error-text">{error}</p>}

      {!loading && !error && lessons.length === 0 && (
        <p className="muted">No lessons saved yet.</p>
      )}

      {!loading &&
        !error &&
        lessons.map((l, index) => (
          <button
            type="button"
            key={l.lesson_id || `${l.title}-${index}`}
            className="lesson-item"
            onClick={() => onSelectLesson && onSelectLesson(l)}
          >
            <span className="lesson-title">{l.title || "Untitled"}</span>
            <span className="lesson-meta">
              <span>{l.level || "No level"}</span>
              <span>{l.status || "draft"}</span>
            </span>
            {l.created_at && (
              <small>{new Date(l.created_at).toLocaleDateString()}</small>
            )}
          </button>
        ))}
    </div>
  );
}
