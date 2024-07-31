// Profile.js
import React from 'react';
import { useOverdueTasks } from '../contexts/OverdueTasksContext';

const Profile = () => {
  const { overdueCount } = useOverdueTasks();

  console.log('Overdue Count in Profile:', overdueCount); // Debug log

  return (
    <div>
      <h2>Profile</h2>
      <p>Overdue Tasks: {overdueCount !== undefined ? overdueCount : 'No data available'}</p>
    </div>
  );
};

export default Profile;
