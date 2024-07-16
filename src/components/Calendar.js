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

const Calendar = ({ tasks }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  const startDate = startOfMonth(currentMonth);
  const endDate = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
    setSelectedDay(null); // reset when change month 
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
    setSelectedDay(null); // handle the next month 
  };

  const handleDayClick = (date) => {
    setSelectedDay(date);
  };

  const renderTasksForDay = (date) => {
    // get specific dates 
    const tasksForDay = tasks.filter(task => isSameDay(new Date(task.start_date), date));

    // show day if no tasks are there 
    if (tasksForDay.length === 0) {
      return null;
    }

    // add same tasks to sane day 
    const taskCounts = tasksForDay.reduce((counts, task) => {
      const taskDate = format(new Date(task.start_date), 'yyyy-MM-dd');
      counts[taskDate] = (counts[taskDate] || []);
      counts[taskDate].push(task);
      return counts;
    }, {});

    // show how many tasks are on a day 
    return (
      <div className={styles.taskList}>
        {Object.keys(taskCounts).map((taskDate, index) => {
          const tasks = taskCounts[taskDate];
          const taskElements = tasks.map((task, i) => (
            <div key={task.id} className={styles.task}>
              {i === 0 ? task.title : null}
              {i === 0 && tasks.length > 1 ? <span className={styles.taskCount}>+{tasks.length - 1}</span> : null}
            </div>
          ));
          return (
            <div key={index}>
              {taskElements}
            </div>
          );
        })}
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

    // fill the empty days before month begin
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className={styles.emptyDay} />);
    }

    // for days 
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
      {selectedDay && <DayView date={selectedDay} tasks={tasks} />}
    </div>
  );
};

export default Calendar;
