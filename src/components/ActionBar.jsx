export default function ActionBar({ lesson, level, setSavedLessons }) {

const handleSave = () => {
  const newLesson = {
    id: Date.now(),
    level,
    content: lesson
  };

  setSavedLessons(prev => [...prev, newLesson]);
};

const handleRecord = () => {
  alert("Recording started (MVP)");
};

const handlePublish = () => {
  alert("Lesson sent to students 🚀");
};


  return (
    <div className="actions">
      <button onClick={handleSave}>Save</button>
      <button onClick={handleRecord}>Record</button>
      <button onClick={handlePublish}>Publish</button>
    </div>
  );
}