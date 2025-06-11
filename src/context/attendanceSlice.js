import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { EMPLOYEE_ATTENDANCE_ENDPOINT } from './../utils/constant';

// Thunks
export const clockIn = createAsyncThunk(
  'attendance/clockIn', 
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${EMPLOYEE_ATTENDANCE_ENDPOINT}/clock-in`, 
        data, 
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      console.error('Detailed clock-in error:', err.response?.data);
      return rejectWithValue({
        message: err.response?.data?.message || 'Clock-in failed',
        status: err.response?.status,
        data: err.response?.data
      });
    }
  }
);

export const clockOut = createAsyncThunk('attendance/clockOut', async (id, { rejectWithValue }) => {
  try {
    const res = await axios.patch(`${EMPLOYEE_ATTENDANCE_ENDPOINT}/clock-out/${id}`, null, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Clock-out failed');
  }
});

export const fetchLogs = createAsyncThunk(
  'attendance/fetchLogs', 
  async (params, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${EMPLOYEE_ATTENDANCE_ENDPOINT}/logs`, { 
        params, 
        withCredentials: true
      });
      return res.data;
    } catch (err) {
      console.error('Error fetching logs:', err.response?.data);
      return rejectWithValue({
        message: err.response?.data?.message || 'Failed to fetch logs',
        status: err.response?.status,
        data: err.response?.data
      });
    }
  }
);


// Slice
const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    status: 'idle',
    error: null,
    sessions: [],
    summary: null,
    dailyStats: null,
    loading: false,
  },
  reducers: {
    resetAttendance: (state) => {
      state.status = 'idle';
      state.error = null;
      state.sessions = [];
      state.summary = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Clock In
      .addCase(clockIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clockIn.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions.push(action.payload);
      })
      .addCase(clockIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Clock Out
      .addCase(clockOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clockOut.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.sessions.findIndex(s => s._id === action.payload._id);
        if (index !== -1) state.sessions[index] = action.payload;
      })
      .addCase(clockOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Logs
      .addCase(fetchLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
     .addCase(fetchLogs.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      // Update all three state properties from the action payload
      state.sessions = action.payload.sessions || []; // Add this line
      state.dailyStats = action.payload.dailyStats || {};
      state.summary = action.payload.summary || {};
      
     
    })
      .addCase(fetchLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetAttendance } = attendanceSlice.actions;
export default attendanceSlice.reducer;
