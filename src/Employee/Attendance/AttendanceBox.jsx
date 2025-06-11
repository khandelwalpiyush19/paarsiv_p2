import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clockIn, clockOut, fetchLogs } from '../../context/attendanceSlice';
import { format, parseISO } from 'date-fns';
import { FiClock, FiHome, FiMapPin, FiCalendar } from 'react-icons/fi';
import store from '../../context/store';
import { Link } from 'react-router-dom';





const AttendanceBox = () => {
  const dispatch = useDispatch();
  const {
    sessions,
    error,
    loading,
    dailyStats
  } = useSelector((state) => state.attendance);
  
  const [workLocation, setWorkLocation] = useState('office');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [currentSession, setCurrentSession] = useState(null);


  useEffect(() => {
    dispatch(fetchLogs());
  }, [dispatch]);

  useEffect(() => {
    if (sessions && sessions.length > 0) {
      const openSession = sessions.find(session => !session.clockOut);
      setCurrentSession(openSession || null);
    } else {
      setCurrentSession(null);
    }
  }, [sessions]);

const handleClockIn = async () => {
  try {
    // First ensure we have the absolute latest sessions from server
    await dispatch(fetchLogs()).unwrap();
    
    // Get the updated state after fetchLogs completes
    const updatedState = store.getState().attendance;
    const openSession = updatedState.sessions.find(session => !session.clockOut);

    if (openSession) {
      showNotification(
        `You have an open session since ${formatTime(openSession.clockIn)}. Please clock out first.`,
        'error'
      );
      return;
    }

    console.log('Attempting to clock in with location:', workLocation);
    const result = await dispatch(clockIn({ workLocation })).unwrap();
    showNotification('Checked in successfully!', 'success');
    // Refresh the list after successful clock-in
    await dispatch(fetchLogs());
  } catch (err) {
    console.error('Clock-in error:', err);
    const errorMessage = err?.message || 
                        err?.payload?.message || 
                        'Failed to check in. Please try again.';
    showNotification(errorMessage, 'error');
  }
};

const handleClockOut = async () => {
  if (!currentSession) return;

  try {
    await dispatch(clockOut(currentSession._id)).unwrap();
    showNotification('Checked out successfully!', 'success');

    // Refresh logs to update currentSession
    dispatch(fetchLogs());
  } catch (err) {
    const errorMessage = (err && err.message) ? err.message : 'Failed to check out';
    showNotification(errorMessage, 'error');
  }
};

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ ...notification, show: false });
    }, 3000);
  };

  const formatTime = (dateString) => {
    if (!dateString) return '--:--';
    return format(parseISO(dateString), 'HH:mm');
  };


  const todayKey = format(new Date(), 'yyyy-MM-dd');
const todayStats = dailyStats?.[todayKey] || { sessions: [], totalEffectiveHours: 0, totalGrossHours: 0 };
const totalSessions = todayStats.sessions.length;
const totalHours = todayStats.totalEffectiveHours || 0;

  const formatDuration = (start, end) => {
    if (!start || !end) return '--:--';
    
    const startDate = parseISO(start);
    const endDate = parseISO(end);
    const diff = endDate - startDate;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };
  // In your component
useEffect(() => {
  const initializeAttendance = async () => {
    try {
      const result = await dispatch(fetchLogs()).unwrap();
      console.log('Initial sessions from API:', result.sessions);
      console.log('Redux state sessions:', store.getState().attendance.sessions);
    } catch (err) {
      console.error('Initial load error:', err);
    }
  };
  
  initializeAttendance();
}, [dispatch]);

  useEffect(() => {
  const interval = setInterval(() => {
    dispatch(fetchLogs());
  }, 30000); // Sync every 30 seconds

  return () => clearInterval(interval);
}, [dispatch]);


  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className='flex flex-row justify-between mb-2'>

      <h2 className="text-xl font-semibold text-gray-800 mb-4">Today's Attendance</h2>
      <Link to="/attendance-stats" > <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">     My Attendance </button> </Link>
      </div>
      
{error && (
  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
    <p>{typeof error === 'string' ? error : error.message}</p>
  </div>
)}
      
      {loading ? (
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {currentSession ? (
            <div>
              <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4">
                <p>You are currently checked in since {formatTime(currentSession.clockIn)}</p>
              </div>
              
              <div className="flex items-center mb-2">
                <FiMapPin className="text-gray-500 mr-2" />
                <span className="text-gray-700">Location: {currentSession.workLocation === 'office' ? 'Office' : 'Home'}</span>
              </div>
              
              <div className="flex items-center mb-4">
                <FiClock className="text-gray-500 mr-2" />
                <span className="text-gray-700">Checked in at: {formatTime(currentSession.clockIn)}</span>
              </div>
              <button
                onClick={handleClockOut}
                disabled={loading}
                className={`w-1/4 py-2 px-4 rounded-md text-white font-medium ${loading ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'}`}
              >
                {loading ? 'Processing...' : 'Check Out'}
              </button>
            </div>
          ) : (
            <div className='flex flex-row justify-between'>
              {/* Work Location Radio Buttons */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Select Work Location:</p>
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="workLocation"
                      value="office"
                      checked={workLocation === 'office'}
                      onChange={(e) => setWorkLocation(e.target.value)}
                      className="mr-2 text-blue-500"
                    />
                    <FiMapPin className="text-blue-500 mr-1" />
                    <span className="text-gray-700">Work from Office</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="workLocation"
                      value="work_from_home"
                      checked={workLocation === 'work_from_home'}
                      onChange={(e) => setWorkLocation(e.target.value)}
                      className="mr-2 text-green-500"
                    />
                    <FiHome className="text-green-500 mr-1" />
                    <span className="text-gray-700">Work from Home</span>
                  </label>
                </div>
              </div>
              
              <button
                onClick={handleClockIn}
                disabled={loading}
                className={`w-1/4 py-2 px-4 rounded-md text-white font-medium ${loading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
              >
                {loading ? 'Processing...' : 'Check In'}
              </button>
            </div>
          )}
          
         {dailyStats && (
  <div className="mt-6 pt-4 border-t border-gray-200">
    <div className="flex items-center mb-3">
      <FiCalendar className="text-gray-500 mr-2" />
      <h3 className="text-md font-medium text-gray-800">Today's Summary</h3>
    </div>
    
    <div className="grid grid-cols-2 gap-2">
      <div className="bg-gray-50 p-3 rounded-md">
        <p className="text-sm text-gray-500">Total Sessions</p>
        <p className="font-semibold">{totalSessions}</p>
      </div>
      
      <div className="bg-gray-50 p-3 rounded-md">
        <p className="text-sm text-gray-500">Total Hours</p>
        <p className="font-semibold">
          {totalHours.toFixed(2)}h
        </p>
      </div>
    </div>
  </div>
)}

        </>
      )}
      
      {/* Notification Toast */}
      {notification.show && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg text-white ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default AttendanceBox;