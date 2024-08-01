import React, { createContext, useState, useContext, useEffect } from 'react';

const OverdueTasksContext = createContext();

export const OverdueTasksProvider = ({ children }) => {
  const [overdueCount, setOverdueCount] = useState(() => {
    const savedCount = localStorage.getItem('overdueCount');
    console.log('Initializing Overdue Count from Local Storage:', savedCount); // Debug log
    return savedCount !== null ? parseInt(savedCount, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem('overdueCount', overdueCount);
    console.log('Updated Overdue Count in Local Storage:', overdueCount); // Debug log
  }, [overdueCount]);

  return (
    <OverdueTasksContext.Provider value={{ overdueCount, setOverdueCount }}>
      {children}
    </OverdueTasksContext.Provider>
  );
};

export const useOverdueTasks = () => useContext(OverdueTasksContext);
