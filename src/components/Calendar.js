import React, { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addMonths,
  subMonths,
  isSameDay
} from 'date-fns';
import styles from '../styles/Calendar.module.css';
import DayView from './DayView';

const Calendar = ({ tasks, onTaskUpdate, onTaskDelete }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  const startDate = startOfMonth(currentMonth);
  const endDate = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
    setSelectedDay(null);
  };

  const handleDayClick = (date) => {
    setSelectedDay(date);
  };

  const renderTasksForDay = (date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const tasksForDay = tasks.filter(task => task.start_date === formattedDate);

    console.log(`Tasks for ${formattedDate}:`, tasksForDay);

    return tasksForDay;
  };

  const renderDaysOfWeek = () => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className={styles.daysOfWeek}>
        {daysOfWeek.map((day, index) => (
          <div key={index} className={styles.dayOfWeek}>
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const startDay = getDay(startDate);

    // show empty days
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className={styles.emptyDay} />);
    }

    daysInMonth.forEach((date, index) => {
      const isCurrentDay = isSameDay(date, new Date());

      // Get tasks for the current date
      const tasksForDay = renderTasksForDay(date);

      // Show number of tasks for the current date
      const numberOfTasks = tasksForDay.length;



      days.push(
        <div
          key={index}
          className={`${styles.day} ${isCurrentDay ? styles.currentDay : ''} ${numberOfTasks > 0 ? styles.hasTasks : ''}`}
          onClick={() => handleDayClick(date)}
        >
          <div className={styles.date}>{format(date, 'd')}</div>
          <div className={styles.tasksContainer}>
            {numberOfTasks > 0 && (
              <div className={styles.taskCount}>
                {numberOfTasks} task{numberOfTasks > 1 ? 's' : ''} today
              </div>
            )}
          </div>
        </div>
      );
    });

    return (
      <div className={styles.daysGrid}>
        {days}
      </div>
    );
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button onClick={handlePrevMonth}>Previous</button>
        <div className={styles.headerMonth}>{format(currentMonth, 'MMMM yyyy')}</div>
        <button onClick={handleNextMonth}>Next</button>
      </div>
      {renderDaysOfWeek()}
      {renderDays()}
      {selectedDay && (
        <DayView
          date={selectedDay}
          tasks={renderTasksForDay(selectedDay)} // Display tasks for selected day 
          onTaskUpdate={onTaskUpdate}
          onTaskDelete={onTaskDelete}
        />
      )}
    </div>
  );
};

export default Calendar;
