import { useState } from "react";

export default function PublicationManager({
  lessons = []
}) {

  const [schedule, setSchedule] = useState({});

  const handleChange = (day, level, lessonId) => {
  setSchedule(prev => ({
    ...prev,
    [`${day}-${level}`]: lessonId,
  }));
};

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];

  const levels = ["B1", "B2", "C1", "C2"];

  const saveSchedule = async () => {

    const res = await fetch(
        import.meta.env.VITE_SAVE_SCHEDULE_URL,
        {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            week: "2026-W23",
            schedule,
        }),
        }
    );

    if (!res.ok) {
        alert("Failed to save schedule");
        return;
    }

    alert("Schedule saved");
    };

  return (
    <div className="publication-manager">
      <h2>Next Week Schedule</h2>

      <h3>Available Lessons</h3>

        <div>
        {lessons.map((lesson) => (
            <div key={lesson.lesson_id}>
            [{lesson.level}] {lesson.title}
            </div>
        ))}
        </div>

        <div className="schedule-summary">
        <div>Lessons: {lessons.length}</div>
        <div>Selected: {Object.keys(schedule).length}/20</div>
        <div>Week: 2026-W23</div>
        </div>

      <table className="schedule-table">
        <thead>
          <tr>
            <th>Day</th>
            {levels.map(level => (
              <th key={level}>{level}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {days.map(day => (
            <tr key={day}>
              <td>{day}</td>

              {levels.map(level => (
                <td key={`${day}-${level}`}>

                    <select
                        className="schedule-select"
                        value={schedule[`${day}-${level}`] || ""}
                        onChange={(e) =>
                        handleChange(day, level, e.target.value)
                        }
                    >
                        <option value="">
                        Select lesson
                        </option>

                        {lessons
                        .filter(l => l.level === level)
                        .map(lesson => (
                            <option
                            key={lesson.lesson_id}
                            value={lesson.lesson_id}
                            >
                            {lesson.title}
                            </option>
                        ))}
                    </select>

                    </td>
              ))}
            </tr>
          ))}
        </tbody>
        </table>
        <button className="primary-button" onClick={saveSchedule}>
            Save Schedule
        </button>
    </div>
  );
}