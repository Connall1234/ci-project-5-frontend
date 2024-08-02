import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/TaskDisplay.module.css";
import { Button, Card } from "react-bootstrap";
import { useHistory } from 'react-router-dom';
import { axiosReq } from "../api/axiosDefaults";
import { format } from 'date-fns'; // Import format function from date-fns

const TaskDisplay = () => {
  const [tasks, setTasks] = useState([]); // Ensure tasks is initialized as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const history = useHistory();

  const handleEditClick = (taskId) => {
    history.push(`/tasks/${taskId}/edit`);
  };

  const handleDeleteClick = async (taskId) => {
    try {
      await axiosReq.delete(`/tasks/${taskId}`);
      // Filter out the deleted task
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          "https://project-5-backend-api-connall-3eb143768597.herokuapp.com/tasks/"
        );
        console.log("API response:", response.data);

        // Access the tasks array from the response
        const fetchedTasks = Array.isArray(response.data.tasks) ? response.data.tasks : [];
        setTasks(fetchedTasks); 
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

  if (!Array.isArray(tasks)) {
    return <div>Error: Tasks data is not an array</div>;
  }

  return (
    <div className={styles.taskList}>
      {tasks.map((task) => (
        <Card style={{ width: '18rem' }} key={task.id} className={`task ${task.completed ? "completed" : ""}`}>
          <Card.Body>
            <Card.Title>{task.title}</Card.Title>
            <Card.Text>{task.description}</Card.Text>
            
            {/* Display Date and Time separately for Start Date */}
            <Card.Text>Date: {format(new Date(task.start_date), 'MMMM d, yyyy')}</Card.Text>
            <Card.Text>Time: {format(new Date(task.start_date), 'hh:mm a')}</Card.Text>

            <Card.Text>Completed: {task.completed ? "Yes" : "No"}</Card.Text>
            <Card.Text>Priority: {task.priority}</Card.Text>
            <Card.Text>Category: {task.category}</Card.Text>
            
            <Button onClick={() => handleEditClick(task.id)}>Edit</Button> 
            <Button onClick={() => handleDeleteClick(task.id)}>Delete</Button>            
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default TaskDisplay;
