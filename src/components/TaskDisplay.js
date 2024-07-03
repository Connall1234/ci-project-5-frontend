// src/components/TaskList.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/TaskDisplay.module.css";

const TaskDisplay = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          "https://project-5-backend-api-connall-3eb143768597.herokuapp.com/tasks/"
        );
        console.log("API response:", response.data);
        setTasks(response.data.results); // Set tasks to the results array
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
      <h1>Task List</h1>
      <ul>
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`task ${task.completed ? "completed" : ""}`}
          >
            <h2>{task.title}</h2>
            <p>{task.description}</p>
            <p>Start Date: {new Date(task.start_date).toLocaleString()}</p>
            <p>End Date: {new Date(task.end_date).toLocaleString()}</p>
            <p>Completed: {task.completed ? "Yes" : "No"}</p>
            <p>Priority: {task.priority}</p>
            <p>Category: {task.category}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskDisplay;
