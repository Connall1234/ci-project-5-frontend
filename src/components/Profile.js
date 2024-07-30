// Profile.js
import React from 'react';

const Profile = ({ overdueCount }) => {
  return (
    <div>
      <h2>Profile</h2>
      <p>Overdue Tasks: {overdueCount !== undefined ? overdueCount : 'No data available'}</p>
    </div>
  );
};

export default Profile;
