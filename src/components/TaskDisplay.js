// src/components/TaskList.js
import React, { useState, useEffect } from "react";

import axios from "axios";
import styles from "../styles/TaskDisplay.module.css";
import { Button, Card } from "react-bootstrap";
import { useHistory } from 'react-router-dom';



const TaskDisplay = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const history = useHistory();

  const handleEditClick = (taskId) => {
    history.push(`/tasks/${taskId}/edit`);
  };

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
    <div className={styles.taskList}>
      {tasks.map((task) => (
        <Card style={{ width: '18rem' }} key={task.id} className={`task ${task.completed ? "completed" : ""}`}>
          <Card.Body>
            <Card.Title>{task.title}</Card.Title>
            <Card.Text>{task.description}</Card.Text>
            <Card.Text>Start Date: {new Date(task.start_date).toLocaleString()}</Card.Text>
            <Card.Text>End Date: {new Date(task.end_date).toLocaleString()}</Card.Text>
            <Card.Text>Completed: {task.completed ? "Yes" : "No"}</Card.Text>
            <Card.Text>Priority: {task.priority}</Card.Text>
            <Card.Text>Category: {task.category}</Card.Text>
            <Button onClick={() => handleEditClick(task.id)}> Edit </Button>            
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default TaskDisplay;
