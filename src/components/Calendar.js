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
import styles from '../styles/Calendar.module.css'; // Ensure you have appropriate styles

const Calendar = ({ tasks }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const startDate = startOfMonth(currentMonth);
  const endDate = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const renderTasksForDay = (date) => {
    return tasks
      .filter(task => format(new Date(task.start_date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'))
      .map(task => (
        <div key={task.id} className={styles.task}>
          {task.title}
        </div>
      ));
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

    // Fill empty days before the start of the month
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className={styles.emptyDay} />);
    }

    // Render days of the month
    daysInMonth.forEach((date, index) => {
      const isCurrentDay = isSameDay(date, new Date());
      days.push(
        <div key={index} className={`${styles.day} ${isCurrentDay ? styles.currentDay : ''}`}>
          <div className={styles.date}>{format(date, 'd')}</div>
          <div className={styles.tasks}>{renderTasksForDay(date)}</div>
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
        <div>{format(currentMonth, 'MMMM yyyy')}</div>
        <button onClick={handleNextMonth}>Next</button>
      </div>
      {renderDaysOfWeek()}
      {renderDays()}
    </div>
  );
};

export default Calendar;
