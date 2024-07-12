import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths } from 'date-fns';
import styles from '../styles/Calendar.module.css'; // Make sure to create appropriate styles

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

  const renderDays = () => {
    const days = [];
    const startDay = getDay(startDate);

    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className={styles.emptyDay} />);
    }

    daysInMonth.forEach((date, index) => {
      days.push(
        <div key={index} className={styles.day}>
          <div className={styles.date}>{format(date, 'd')}</div>
          <div className={styles.tasks}>{renderTasksForDay(date)}</div>
        </div>
      );
    });

    return days;
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button onClick={handlePrevMonth}>Previous</button>
        <div>{format(currentMonth, 'MMMM yyyy')}</div>
        <button onClick={handleNextMonth}>Next</button>
      </div>
      <div className={styles.daysGrid}>
        {renderDays()}
      </div>
    </div>
  );
};

export default Calendar;
