import React, { useState, useEffect } from "react";
import Calendar from "../../components/Calendar"; // Adjust the import path as needed
import { axiosReq } from "../../api/axiosDefaults"; // Adjust the import path as needed

const CalendarView = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axiosReq.get("/tasks/");
        setTasks(response.data.results);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Task Calendar</h1>
      <Calendar tasks={tasks} />
    </div>
  );
};

export default CalendarView;
