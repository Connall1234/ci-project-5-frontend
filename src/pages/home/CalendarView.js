import React, { useState, useEffect } from "react";
import Calendar from "../../components/Calendar"; 
import { axiosReq } from "../../api/axiosDefaults"; 

const CalendarView = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



    // this was the old use useEffect, caused issue with memory leak trying to debug

  // const fetchTasks = async () => {
  //   try {
  //     const response = await axiosReq.get("/tasks/");
  //     setTasks(response.data.tasks || []);
  //   } catch (err) {
  //     setError(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  
  // useEffect(() => {
  //   fetchTasks();
  // }, []);

  useEffect(() => {
    let isMounted = true; 
  
    const fetchTasks = async () => {
      try {
        const response = await axiosReq.get("/tasks/");
        if (isMounted) { 
          setTasks(response.data.tasks || []);
        }
      } catch (err) {
        if (isMounted) { 
          setError(err);
        }
      } finally {
        if (isMounted) { 
          setLoading(false);
        }
      }
    };
  
    fetchTasks();
  
    // 3. Cleanup function to set flag to false when component unmounts
    return () => {
      isMounted = false;
    };
  }, []);
  


  const handleTaskUpdate = async (updatedTask) => {
    try {
      const response = await axiosReq.put(`/tasks/${updatedTask.id}`, updatedTask);
      setTasks(prevTasks =>
        prevTasks.map(task => (task.id === updatedTask.id ? response.data : task))
      );
    } catch (err) {
      console.error('Failed to update task', err);
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      await axiosReq.delete(`/tasks/${taskId}`);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Task Calendar</h1>
      <Calendar tasks={tasks} onTaskUpdate={handleTaskUpdate} onTaskDelete={handleTaskDelete} />
    </div>
  );
};

export default CalendarView;
