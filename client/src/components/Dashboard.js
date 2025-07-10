import React from 'react';
import WorkerPanel from './WorkerPanel';
import RecruiterPanel from './RecruiterPanel';

const Dashboard = ({ user }) => {
  return (
    <div className="w-full">
      {user?.role === 'recruiter' ? (
        <RecruiterPanel />
      ) : user?.role === 'worker' ? (
        <WorkerPanel />
      ) : (
        <p className="text-center text-red-500">Unknown Role</p>
      )}
    </div>
  );
};

export default Dashboard;