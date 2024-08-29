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

// Main Calendar component that handles month navigation, day selection, and task rendering.
const Calendar = ({ tasks, onTaskUpdate, onTaskDelete }) => {
  // State to track the currently displayed month
  const [currentMonth, setCurrentMonth] = useState(new Date());
  // State to track the selected day
  const [selectedDay, setSelectedDay] = useState(null);

  // Get the start and end dates for the current month
  const startDate = startOfMonth(currentMonth);
  const endDate = endOfMonth(currentMonth);
  // Get an array of all days in the current month
  const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });

  // Function to move to the previous month and reset selected day
  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
    setSelectedDay(null);
  };

  // Function to move to the next month and reset selected day
  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
    setSelectedDay(null);
  };

  // Function to handle the selection of a specific day
  const handleDayClick = (date) => {
    setSelectedDay(date);
  };

  // Function to filter tasks for a specific day based on its formatted date
  const renderTasksForDay = (date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const tasksForDay = tasks.filter(task => task.start_date === formattedDate);

    return tasksForDay;
  };

  // Renders the names of the days of the week at the top of the calendar
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

  // Renders all the days in the current month, including empty spaces for alignment
  const renderDays = () => {
    const days = [];
    const startDay = getDay(startDate); // Get the day of the week the month starts on

    // Render empty divs to align the first day of the month correctly
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className={styles.emptyDay} />);
    }

    // Render the actual days of the month
    daysInMonth.forEach((date, index) => {
      const isCurrentDay = isSameDay(date, new Date()); // Check if the date is today
      const tasksForDay = renderTasksForDay(date); // Get tasks for the current day
      const numberOfTasks = tasksForDay.length; // Count the number of tasks for the day

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

  // Main component rendering
  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        {/* Navigation buttons and month display */}
        <button onClick={handlePrevMonth}>Previous</button>
        <div className={styles.headerMonth}>{format(currentMonth, 'MMMM yyyy')}</div>
        <button onClick={handleNextMonth}>Next</button>
      </div>
      {/* Render the days of the week */}
      {renderDaysOfWeek()}
      {/* Render the days of the month */}
      {renderDays()}
      {/* Render the DayView component if a day is selected */}
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
