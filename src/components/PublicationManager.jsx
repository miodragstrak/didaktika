import { useState } from "react";
import { CEFR_LEVELS } from "../constants";

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

  const levels = CEFR_LEVELS;

  const saveSchedule = async () => {

    const res = await fetch(
        import.meta.env.VITE_SAVE_SCHEDULE_URL,
        {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            week: "2026-W23", // Retained for compatibility with the existing webhook.
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
      <h2>Demo Publication Schedule</h2>

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
        <div>Selected: {Object.values(schedule).filter(Boolean).length}/{days.length * levels.length}</div>
        <div>Proof of Concept</div>
        </div>

      <div className="schedule-scroll" role="region" aria-label="Demo publication schedule" tabIndex={0}>
      <table className="schedule-table">
        <thead>
          <tr>
            <th scope="col">Day</th>
            {levels.map(level => (
              <th key={level} scope="col">{level}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {days.map(day => (
            <tr key={day}>
              <th scope="row">{day}</th>

              {levels.map(level => (
                <td key={`${day}-${level}`}>

                    <select
                        className="schedule-select"
                        aria-label={`${day} ${level} lesson`}
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
        </div>
        <button className="primary-button" onClick={saveSchedule}>
            Save Schedule
        </button>
    </div>
  );
}
