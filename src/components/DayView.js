import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useHistory } from 'react-router-dom';
import { axiosReq } from '../api/axiosDefaults';
import { Popover, OverlayTrigger, Button, Fade } from 'react-bootstrap';
import styles from '../styles/DayView.module.css';

const DayView = ({ date, tasks, onTaskUpdate }) => {
  const history = useHistory();
  const [tasksState, setTasksState] = useState([]);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [updatingTask, setUpdatingTask] = useState(null);
  const [showPopover, setShowPopover] = useState(false);
  const [popoverMessage, setPopoverMessage] = useState('');
  const [popoverColor, setPopoverColor] = useState('success');
  const [loading, setLoading] = useState(true);

  const formattedDate = format(date, 'MMMM d, yyyy');
  const formattedDateForCreate = format(date, 'yyyy-MM-dd');

  useEffect(() => {
    const fetchTasksForDay = async () => {
      setLoading(true);
      try {
        // Fetch all tasks
        const response = await axiosReq.get('/tasks');
        const tasksForDay = response.data.tasks.filter(task => 
          format(new Date(task.start_date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
        );
        setTasksState(tasksForDay);
      } catch (error) {
        console.error('Failed to fetch tasks for day', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasksForDay();
  }, [date]);

  const handleAddTask = () => {
    history.push({
      pathname: '/tasks/create',
      state: { date: formattedDateForCreate }
    });
  };

  const handleViewTask = (taskId) => {
    history.push(`/tasks/view/${taskId}`);
  };

  const handleEditTask = (taskId) => {
    history.push(`/tasks/${taskId}/edit`);
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      console.log('Deleting task:', taskToDelete.id);
      await axiosReq.delete(`/tasks/${taskToDelete.id}`);
      setTasksState(prevTasks => prevTasks.filter(task => task.id !== taskToDelete.id));
      console.log('Task deleted successfully:', taskToDelete.id);
      setTaskToDelete(null);
    } catch (err) {
      console.error('Failed to delete task', err);
    } finally {
      setTaskToDelete(null);
    }
  };

  const handleCompleteTask = async (task) => {
    try {
      setUpdatingTask(task);

      const updatedTask = {
        ...task,
        completed: !task.completed
      };

      console.log('Updating task:', updatedTask);
      const response = await axiosReq.put(`/tasks/${task.id}`, updatedTask);

      setTasksState(prevTasks =>
        prevTasks.map(t => (t.id === task.id ? response.data : t))
      );

      setPopoverMessage(updatedTask.completed ? 'Task complete' : 'Task incomplete');
      setPopoverColor(updatedTask.completed ? 'success' : 'danger');
      setShowPopover(true);
      setTimeout(() => setShowPopover(false), 2000);
    } catch (err) {
      console.error('Failed to update task', err);
    } finally {
      setUpdatingTask(null);
    }
  };

  const popover = (
    <Popover id="popover-basic">
      <Popover.Content style={{ color: popoverColor === 'success' ? 'green' : 'red' }}>
        {popoverMessage}
      </Popover.Content>
    </Popover>
  );

  const renderTasks = () => {
    if (loading) {
      return <p>Loading tasks...</p>;
    }

    if (tasksState.length === 0) {
      return <p>No tasks for {formattedDate}</p>;
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
              <span style={{ textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? 'grey' : 'black' }}>
                {task.title}
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
                  onChange={() => {
                    if (updatingTask) return;
                    handleCompleteTask(task);
                  }}
                  disabled={updatingTask === task}
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
      {renderTasks()}
      <button onClick={handleAddTask}>Add Task</button>

      {taskToDelete && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '20px', backgroundColor: 'white', border: '1px solid black' }}>
          <p>Are you sure you want to delete this task?</p>
          <Button onClick={handleDeleteTask}>Yes</Button>
          <Button onClick={() => setTaskToDelete(null)}>No</Button>
        </div>
      )}

      <OverlayTrigger show={showPopover} placement="bottom" overlay={popover} transition={Fade}>
        <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}></div>
      </OverlayTrigger>
    </div>
  );
};

export default DayView;
