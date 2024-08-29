import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useHistory } from 'react-router-dom';
import { axiosReq } from '../api/axiosDefaults';
import { Popover, OverlayTrigger, Button, Fade } from 'react-bootstrap';
import styles from '../styles/DayView.module.css';

// DayView component handles task display, creation, editing, completion, and deletion for a selected day.
const DayView = ({ date, tasks, onTaskUpdate }) => {
  const history = useHistory(); // Hook to programmatically navigate to different routes
  const [tasksState, setTasksState] = useState([]); // State to manage the tasks for the selected day
  const [taskToDelete, setTaskToDelete] = useState(null); // State to track the task that the user wants to delete
  const [updatingTask, setUpdatingTask] = useState(null); // State to track if a task is being updated (e.g., marked as complete)
  const [showPopover, setShowPopover] = useState(false); // State to control the visibility of the popover message
  const [popoverMessage, setPopoverMessage] = useState(''); // State to hold the popover message content
  const [popoverColor, setPopoverColor] = useState('success'); // State to control the color of the popover message (success or error)
  const [loading, setLoading] = useState(true); // State to indicate if the tasks are still loading

  // Format the date for display and task creation
  const formattedDate = format(date, 'MMMM d, yyyy'); // e.g., August 29, 2024
  const formattedDateForCreate = format(date, 'yyyy-MM-dd'); // e.g., 2024-08-29

  // useEffect hook to fetch tasks for the selected day when the component mounts or when the date changes
  useEffect(() => {
    const fetchTasksForDay = async () => {
      setLoading(true);
      try {
        const response = await axiosReq.get('/tasks'); // Fetch all tasks from the API
        const tasksForDay = response.data.tasks.filter(task => 
          format(new Date(task.start_date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
        ); // Filter tasks to only include those matching the selected day
        setTasksState(tasksForDay); // Update state with the tasks for the day
      } catch (error) {
        console.error('Failed to fetch tasks for day', error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchTasksForDay();
  }, [date]);

  // Function to handle adding a new task, navigates to task creation page
  const handleAddTask = () => {
    history.push({
      pathname: '/tasks/create',
      state: { date: formattedDateForCreate } // Pass the selected date to the task creation page
    });
  };

  // Function to view a task, navigates to the task details page
  const handleViewTask = (taskId) => {
    history.push(`/tasks/view/${taskId}`);
  };

  // Function to edit a task, navigates to the task editing page
  const handleEditTask = (taskId) => {
    history.push(`/tasks/${taskId}/edit`);
  };

  // Function to delete a task
  const handleDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      await axiosReq.delete(`/tasks/${taskToDelete.id}`); // Send a request to delete the task
      setTasksState(prevTasks => prevTasks.filter(task => task.id !== taskToDelete.id)); // Update the task list by removing the deleted task
      setTaskToDelete(null); // Reset the taskToDelete state
      window.location.reload(); // Reload the page to reflect changes
    } catch (err) {
    } finally {
      setTaskToDelete(null); // Ensure the state is reset
    }
  };

  // Function to mark a task as completed/incomplete
  const handleCompleteTask = async (task) => {
    try {
      setUpdatingTask(task); // Set the task being updated (to prevent multiple updates at the same time)

      const updatedTask = {
        ...task,
        completed: !task.completed // Toggle the task's completed status
      };

      const response = await axiosReq.put(`/tasks/${task.id}`, updatedTask); // Update the task in the API

      setTasksState(prevTasks =>
        prevTasks.map(t => (t.id === task.id ? response.data : t))
      ); // Update the state with the updated task

      // Show success/failure message via a popover
      setPopoverMessage(updatedTask.completed ? 'Task complete' : 'Task incomplete');
      setPopoverColor(updatedTask.completed ? 'success' : 'danger');
      setShowPopover(true);
      setTimeout(() => setShowPopover(false), 2000); // Hide the popover after 2 seconds
    } catch (err) {
      console.error('Failed to update task', err);
    } finally {
      setUpdatingTask(null); // Reset the updating task state
    }
  };

  // Popover element to display messages (e.g., task completion status)
  const popover = (
    <Popover id="popover-basic">
      <Popover.Content style={{ color: popoverColor === 'success' ? 'green' : 'red' }}>
        {popoverMessage}
      </Popover.Content>
    </Popover>
  );

  // Function to render the list of tasks for the selected day
  const renderTasks = () => {
    if (loading) {
      return <p>Loading tasks...</p>; // Show loading message while tasks are being fetched
    }

    if (tasksState.length === 0) {
      return <p>No tasks for {formattedDate}</p>; // Show a message if there are no tasks for the selected day
    }

    return (
      <div className={styles.tasks}>
        <h3>Tasks for {formattedDate}</h3>
        <ul className={styles.taskList}>
          {tasksState.map(task => (
            <li
              key={task.id}
              className={`${styles.taskBar} ${styles[`priority-${task.priority}`]} ${task.completed ? styles.completed : ''}`}
            >
              {/* Task title with a strike-through if completed */}
              <span style={{ textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? 'grey' : 'black' }}>
                {task.title}
              </span>
              <div className={styles.taskActions}>
                {/* Task action buttons: view, edit, delete, and mark as complete */}
                <button onClick={() => handleViewTask(task.id)}>
                  <i className="fas fa-eye" style={{ color: 'blue' }}></i>
                </button>
                <button onClick={() => handleEditTask(task.id)}>
                  <i className="fas fa-edit" style={{ color: 'orange' }}></i>
                </button>
                <button onClick={() => setTaskToDelete(task)}>
                  <i className="fas fa-trash" style={{ color: 'red' }}></i>
                </button>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => {
                    if (updatingTask) return; // Prevent updates if another task is being updated
                    handleCompleteTask(task); // Mark the task as complete/incomplete
                  }}
                  disabled={updatingTask === task} // Disable checkbox if the task is currently being updated
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className={styles.dayView}>
      <h2>{formattedDate}</h2>
      {renderTasks()} {/* Render the task list */}
      <button onClick={handleAddTask}>Add Task</button> {/* Button to add a new task */}

      {/* Modal for confirming task deletion */}
      {taskToDelete && (
        <div className={styles.modal}>
          <p>Are you sure you want to delete this task?</p>
          <Button onClick={handleDeleteTask}>Yes</Button>
          <Button onClick={() => setTaskToDelete(null)}>No</Button>
        </div>
      )}

      {/* OverlayTrigger to display the popover with a message */}
      <OverlayTrigger show={showPopover} placement="bottom" overlay={popover} transition={Fade}>
        <div className={styles.overlay}></div>
      </OverlayTrigger>
    </div>
  );
};

export default DayView;
