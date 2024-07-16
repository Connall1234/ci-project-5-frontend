import React, { useState } from 'react';
import { format } from 'date-fns';
import styles from '../styles/DayView.module.css'; 
import { useHistory } from 'react-router-dom';
import { axiosReq } from '../api/axiosDefaults';

const DayView = ({ date, tasks }) => {
  const history = useHistory();
  const [taskToDelete, setTaskToDelete] = useState(null);

  const formattedDate = format(date, 'MMMM d, yyyy');

  const renderTasks = () => {
    const tasksForDay = tasks.filter(task => format(new Date(task.start_date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));

    if (tasksForDay.length === 0) {
      return <p>No tasks for {formattedDate}</p>;
    }

    return (
      <div className={styles.tasks}>
        <h3>Tasks for {formattedDate}</h3>
        <ul className={styles.taskList}>
          {tasksForDay.map(task => (
            <li key={task.id} className={`${styles.taskBar} ${styles[`priority-${task.priority}`]}`}>
              <span>{task.title} - {format(new Date(task.start_date), 'hh:mm a')}</span>
              <div className={styles.taskActions}>
                <button onClick={() => handleViewTask(task.id)}>View</button>
                <button onClick={() => handleEditTask(task.id)}>Edit</button>
                <button onClick={() => setTaskToDelete(task)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

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
      //  refresh tasks after deletion
      setTaskToDelete(null); 
      console.log('Task deleted successfully');
    } catch (err) {
      console.error('Failed to delete task', err);
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
    </div>
  );
};

export default DayView;
