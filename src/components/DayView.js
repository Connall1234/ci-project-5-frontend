import React from 'react';
import { format } from 'date-fns';
import styles from '../styles/DayView.module.css'; 
import { useHistory } from 'react-router-dom';

const DayView = ({ date, tasks }) => {
  const history = useHistory();

  const formattedDate = format(date, 'MMMM d, yyyy');

  const renderTasks = () => {
    const tasksForDay = tasks.filter(task => format(new Date(task.start_date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));

    if (tasksForDay.length === 0) {
      return <p>No tasks for {formattedDate}</p>;
    }

    return (
      <div className={styles.tasks}>
        <h3>Tasks for {formattedDate}</h3>
        <ul>
          {tasksForDay.map(task => (
            <li key={task.id}>{task.title}</li>
          ))}
        </ul>
      </div>
    );
  };

  const handleAddTask = () => {
    // This will allow us to keep the date selected
    history.push({
      pathname: '/tasks/create',
      state: { date: format(date, 'yyyy-MM-dd') } //Send correct date format
    });
  };

  return (
    <div className={styles.dayView}>
      <h2>{formattedDate}</h2>
      {renderTasks()}
      <button onClick={handleAddTask}>Add Task</button>
    </div>
  );
};

export default DayView;
