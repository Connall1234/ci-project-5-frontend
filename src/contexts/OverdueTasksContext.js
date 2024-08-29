import React, { createContext, useState, useContext, useEffect } from 'react';
//This is our context to check for overdue count on tasks 
const OverdueTasksContext = createContext();

export const OverdueTasksProvider = ({ children }) => {
  const [overdueCount, setOverdueCount] = useState(() => {
    const savedCount = localStorage.getItem('overdueCount');
    return savedCount !== null ? parseInt(savedCount, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem('overdueCount', overdueCount);


  }, [overdueCount]);

  return (
    <OverdueTasksContext.Provider value={{ overdueCount, setOverdueCount }}>
      {children}
    </OverdueTasksContext.Provider>
  );
};

export const useOverdueTasks = () => useContext(OverdueTasksContext);
