import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
function ProfileDetails() {
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
const user = useSelector((state) => state.auth.user);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-8 text-center">
          <div className="w-36 h-36 mx-auto mb-6 rounded-full bg-yellow-300 overflow-hidden flex items-center justify-center">
            <img
              src={
                user?.profilePicture || "/Avatar.jpg"
              }
              alt="Profile Picture"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="max-w-xl mx-auto">
            <p className="text-gray-600 text-sm">Employee Name</p>
            <h2 className="text-2xl font-semibold text-gray-800 mt-1 mb-6">{user?.name || 'User name'}</h2>

            <div className="grid grid-cols-2 gap-6 mb-4 text-center">
              <div>
                <p className="text-gray-500 text-sm">Department</p>
                <p className="text-lg font-semibold text-gray-700">{user?.department || 'Development'}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Email</p>
                <p className="text-lg font-semibold text-gray-700">{user?.email || ''}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <p className="text-gray-500 text-sm">Job Title</p>
                <p className="text-lg font-semibold text-gray-700">{user?.jobTitle || 'Developer'}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Job Category</p>
                <p className="text-lg font-semibold text-gray-700">{user?.position || 'Full time'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileDetails;
