import React, { useState, useEffect } from "react";
import Calendar from "../../components/Calendar"; 
import { axiosReq } from "../../api/axiosDefaults"; 

const CalendarView = () => {
  const [tasks, setTasks] = useState([]); // State to hold the list of tasks
  const [loading, setLoading] = useState(true); // State to manage the loading state
  const [error, setError] = useState(null); // State to handle any errors

  // Effect to fetch tasks when the component mounts
  useEffect(() => {
    let isMounted = true; // Flag to prevent updating state if component unmounts
  
    const fetchTasks = async () => {
      try {
        const response = await axiosReq.get("/tasks/");
        if (isMounted) { 
          setTasks(response.data.tasks || []); // Update tasks state if component is still mounted
        }
      } catch (err) {
        if (isMounted) { 
          setError(err); // Update error state if component is still mounted
        }
      } finally {
        if (isMounted) { 
          setLoading(false); // Set loading to false when data fetching is complete
        }
      }
    };
  
    fetchTasks();
  
    // Cleanup function to set flag to false when component unmounts
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array means this effect runs once when the component mounts

  // Function to handle task updates
  const handleTaskUpdate = async (updatedTask) => {
    try {
      const response = await axiosReq.put(`/tasks/${updatedTask.id}`, updatedTask);
      setTasks(prevTasks =>
        prevTasks.map(task => (task.id === updatedTask.id ? response.data : task)) // Update the specific task in state
      );
    } catch (err) {
      console.error('Failed to update task', err); // Log error if update fails
    }
  };

  // Function to handle task deletion
  const handleTaskDelete = async (taskId) => {
    try {
      await axiosReq.delete(`/tasks/${taskId}`);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId)); // Remove deleted task from state
    } catch (err) {
      console.error('Failed to delete task', err); // Log error if deletion fails
    }
  };

  // Conditional rendering based on loading and error states
  if (loading) {
    return <div>Loading...</div>; // Display loading indicator while fetching data
  }

  if (error) {
    return <div>Error: {error.message}</div>; // Display error message if there's an error
  }

  return (
    <div>
      <h1>Task Calendar</h1>
      <Calendar 
        tasks={tasks} 
        onTaskUpdate={handleTaskUpdate} 
        onTaskDelete={handleTaskDelete} 
      />
    </div>
  );
};

export default CalendarView;
