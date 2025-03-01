import React from 'react';

const Unauthorized = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 min-h-screen bg-gray-50">
      <h1>Access Denied</h1>
      <p className='text-lg'>You do not have permission to access this page.</p>
    </div>
  );
};

export default Unauthorized;