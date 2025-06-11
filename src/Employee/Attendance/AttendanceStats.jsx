import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLogs } from '../../context/attendanceSlice';

import { FiCalendar, FiClock, FiTrendingUp, FiHome, FiAlertTriangle } from 'react-icons/fi';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AttendanceStats = () => {
  const dispatch = useDispatch();
  const { summary, dailyStats, loading, error } = useSelector((state) => state.attendance);

  useEffect(() => {
    dispatch(fetchLogs());
  }, [dispatch]);

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading attendance data...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  if (!summary || !dailyStats) {
    return <div className="text-center py-10 text-gray-500">No attendance data available.</div>;
  }

  // Chart data based on Redux state
  const hoursData = {
    labels: ['Effective Hours', 'Gross Hours', 'Overtime'],
    datasets: [
      {
        label: 'Hours',
        data: [
          summary.avgEffectiveHours,
          summary.avgGrossHours,
          summary.totalOvertime
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 159, 64, 0.7)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const issuesData = {
    labels: ['Late Arrivals', 'Early Departures'],
    datasets: [
      {
        data: [
          summary.totalLateArrivals,
          summary.totalEarlyDepartures
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(255, 206, 86, 0.7)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const todayKey = Object.keys(dailyStats)[0]; // Assuming the latest date
  const todayStats = dailyStats[todayKey] || { sessions: [] };

  const workLocationCounts = todayStats.sessions.reduce(
    (acc, session) => {
      if (session.workLocation === 'work_from_home') acc.wfh += 1;
      else acc.office += 1;
      return acc;
    },
    { wfh: 0, office: 0 }
  );

  const workLocationData = {
    labels: ['Work From Home', 'Office'],
    datasets: [
      {
        data: [workLocationCounts.wfh, workLocationCounts.office],
        backgroundColor: [
          'rgba(153, 102, 255, 0.7)',
          'rgba(54, 162, 235, 0.7)'
        ],
        borderColor: [
          'rgba(153, 102, 255, 1)',
          'rgba(54, 162, 235, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const formatTime = (timeString) => {
    if (!timeString) return '--:--';
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Attendance Statistics</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <FiCalendar className="text-blue-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Days</p>
            <p className="text-2xl font-bold text-gray-800">{summary.totalDays}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <FiClock className="text-green-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Avg. Effective Hours</p>
            <p className="text-2xl font-bold text-gray-800">{summary.avgEffectiveHours.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="bg-purple-100 p-3 rounded-full mr-4">
            <FiTrendingUp className="text-purple-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Avg. Gross Hours</p>
            <p className="text-2xl font-bold text-gray-800">{summary.avgGrossHours.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
          <div className="bg-red-100 p-3 rounded-full mr-4">
            <FiAlertTriangle className="text-red-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Attendance Issues</p>
            <p className="text-2xl font-bold text-gray-800">
              {summary.totalLateArrivals + summary.totalEarlyDepartures}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Hours Breakdown</h2>
          <div className="h-64">
            <Bar data={hoursData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { position: 'top' } },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: (value) => `${value} hrs`
                  }
                }
              }
            }} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Attendance Issues</h2>
          <div className="h-64">
            <Pie data={issuesData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { position: 'top' } }
            }} />
          </div>
        </div>
      </div>

      {/* Work Location Chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Work Location Distribution</h2>
        <div className="h-64">
          <Pie data={workLocationData} options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'top' } }
          }} />
        </div>
      </div>

      {/* Daily Sessions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Daily Sessions - {todayKey}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clock In</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clock Out</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {todayStats.sessions.map((session, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Session {index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatTime(session.clockIn)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {session.clockOut ? formatTime(session.clockOut) : '--:--'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {session.effectiveHours > 0 ? `${session.effectiveHours.toFixed(2)} hrs` : '--'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(session.isLateArrival || session.isEarlyDeparture) ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Issue
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Normal
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <FiHome className="mr-1" />
                      {session.workLocation === 'work_from_home' ? 'WFH' : 'Office'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceStats;
