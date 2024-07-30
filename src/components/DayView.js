import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import styles from '../styles/DayView.module.css';
import { useHistory } from 'react-router-dom';
import { axiosReq } from '../api/axiosDefaults';

const DayView = ({ date, tasks }) => {
  const history = useHistory();
  const [tasksState, setTasksState] = useState(tasks); // for tasks
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [updatingTask, setUpdatingTask] = useState(null); // track which task is currently being updated
  const [taskToComplete, setTaskToComplete] = useState(null); // track task completion confirmation
  const [taskToIncomplete, setTaskToIncomplete] = useState(null); // track task incompletion confirmation

  const formattedDate = format(date, 'MMMM d, yyyy');

  // get tasks initially or when date changes
  useEffect(() => {
    setTasksState(tasks); // change tasksState whenever tasks prop changes
  }, [tasks]);

  const handleAddTask = () => {
    history.push({
      pathname: '/tasks/create',
      state: { date: format(date, 'yyyy-MM-dd') }
    });
  };

  const handleViewTask = (taskId) => {
    history.push(`/tasks/view/${taskId}`);
  };

  const handleEditTask = (taskId) => {
    history.push(`/tasks/${taskId}/edit`);
  };

  const handleDeleteTask = async () => {
    try {
      await axiosReq.delete(`/tasks/${taskToDelete.id}`);
      // Refresh tasks after deletion
      setTaskToDelete(null);
      setTasksState(prevTasks => prevTasks.filter(task => task.id !== taskToDelete.id));
      console.log('Task deleted successfully');
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };

  const handleCompleteTask = async (task) => {
    try {
      setUpdatingTask(task);
      const updatedTask = { ...task, completed: !task.completed };
      await axiosReq.put(`/tasks/${task.id}`, {
        ...updatedTask,
        start_date: new Date(updatedTask.start_date).toISOString(),
        end_date: new Date(updatedTask.end_date).toISOString(),
      });
      // change task in local state
      const updatedTasks = tasksState.map(t => (t.id === task.id ? updatedTask : t));
      setTasksState(updatedTasks);
    } catch (err) {
      console.error('Failed to update task', err);
    } finally {
      setUpdatingTask(null);
      setTaskToComplete(null);
      setTaskToIncomplete(null);
    }
  };

  const renderTasks = () => {
    const tasksForDay = tasksState.filter(task => format(new Date(task.start_date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));

    if (tasksForDay.length === 0) {
      return <p>No tasks for {formattedDate}</p>;
    }

    return (
      <div className={styles.tasks}>
        <h3>Tasks for {formattedDate}</h3>
        <ul className={styles.taskList}>
          {tasksForDay.map(task => (
            <li key={task.id} className={`${styles.taskBar} ${styles[`priority-${task.priority}`]} ${task.completed ? styles.completed : ''}`}>
              <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                {task.title} - {format(new Date(task.start_date), 'hh:mm a')}
              </span>
              <div className={styles.taskActions}>
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
                  onChange={() => task.completed ? setTaskToIncomplete(task) : setTaskToComplete(task)}
                  disabled={updatingTask === task}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const handleCompleteConfirmation = async () => {
    if (taskToComplete) {
      await handleCompleteTask(taskToComplete);
      setTaskToComplete(null);
    }
  };

  const handleIncompleteConfirmation = async () => {
    if (taskToIncomplete) {
      await handleCompleteTask(taskToIncomplete);
      setTaskToIncomplete(null);
    }
  };

  return (
    <div className={styles.dayView}>
      <h2>{formattedDate}</h2>
      {renderTasks()}
      <button onClick={handleAddTask}>Add Task</button>

      {taskToDelete && (
        <div className={styles.confirmationDialog}>
          <p>Are you sure you want to delete this task?</p>
          <button onClick={handleDeleteTask}>Yes</button>
          <button onClick={() => setTaskToDelete(null)}>No</button>
        </div>
      )}

      {taskToComplete && (
        <div className={styles.confirmationDialog}>
          <p>Is this task complete?</p>
          <button onClick={handleCompleteConfirmation}>Yes</button>
          <button onClick={() => setTaskToComplete(null)}>No</button>
        </div>
      )}

      {taskToIncomplete && (
        <div className={styles.confirmationDialog}>
          <p>Is this task incomplete?</p>
          <button onClick={handleIncompleteConfirmation}>Yes</button>
          <button onClick={() => setTaskToIncomplete(null)}>No</button>
        </div>
      )}
    </div>
  );
};

export default DayView;