import React, { useState, useEffect } from "react";
import Calendar from "../../components/Calendar"; 
import { axiosReq } from "../../api/axiosDefaults"; 
import { useOverdueTasks } from "../../contexts/OverdueTasksContext"; 

const CalendarView = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setOverdueCount } = useOverdueTasks();

  const fetchTasks = async () => {
    try {
      const response = await axiosReq.get("/tasks/");
      const fetchedTasks = response.data.results;
      setTasks(fetchedTasks);

      // Calculate overdue tasks
      const overdueTasks = fetchedTasks.filter(task => {
        const today = new Date().setHours(0, 0, 0, 0);
        const taskDate = new Date(task.start_date).setHours(0, 0, 0, 0);
        return taskDate < today && !task.completed;
      });

      // Update overdue count in context
      setOverdueCount(overdueTasks.length);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  // eslint-disable-next-line
  }, []);

  const handleTaskUpdate = async (updatedTask) => {
    try {
      const response = await axiosReq.put(`/tasks/${updatedTask.id}`, updatedTask);
      const updatedTasks = tasks.map(task => (task.id === updatedTask.id ? response.data : task));
      setTasks(updatedTasks);

      // Update overdue tasks
      const overdueTasks = updatedTasks.filter(task => {
        const today = new Date().setHours(0, 0, 0, 0);
        const taskDate = new Date(task.start_date).setHours(0, 0, 0, 0);
        return taskDate < today && !task.completed;
      });

      // Update overdue count in context
      setOverdueCount(overdueTasks.length);
    } catch (err) {
      console.error('Failed to update task', err);
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      await axiosReq.delete(`/tasks/${taskId}`);
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      setTasks(updatedTasks);

      // Update overdue tasks
      const overdueTasks = updatedTasks.filter(task => {
        const today = new Date().setHours(0, 0, 0, 0);
        const taskDate = new Date(task.start_date).setHours(0, 0, 0, 0);
        return taskDate < today && !task.completed;
      });

      // Update overdue count in context
      setOverdueCount(overdueTasks.length);
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