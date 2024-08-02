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

  console.log('Rendering Calendar with tasks:', tasks);

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
    const tasksForDay = tasks.filter(task => isSameDay(new Date(task.start_date), date));

    console.log('Tasks for day:', date, tasksForDay); // Debug output

    if (tasksForDay.length === 0) {
      return null;
    }

    return (
      <div className={styles.taskList}>
        {tasksForDay.map(task => (
          <div key={task.id} className={styles.task}>
            {task.title}
          </div>
        ))}
      </div>
    );
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

    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className={styles.emptyDay} />);
    }

    daysInMonth.forEach((date, index) => {
      const isCurrentDay = isSameDay(date, new Date());
      days.push(
        <div
          key={index}
          className={`${styles.day} ${isCurrentDay ? styles.currentDay : ''}`}
          onClick={() => handleDayClick(date)}
        >
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
      {selectedDay && (
        <DayView
          date={selectedDay}
          tasks={tasks}
          onTaskUpdate={onTaskUpdate}
          onTaskDelete={onTaskDelete}
        />
      )}
    </div>
  );
};

export default Calendar;
