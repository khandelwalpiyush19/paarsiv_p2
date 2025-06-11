import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { EMPLOYEE_AUTH_ENDPOINT } from '../utils/constant';

// employeeSlice.js
export const createEmployee = createAsyncThunk(
  'employees/createEmployee',
  async (employeeData, thunkAPI) => {
    try {
      const response = await axios.post(`${EMPLOYEE_AUTH_ENDPOINT}/register`, employeeData);
      return response.data.employee; // Make sure to return the employee object
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message || 'Failed to create employee');
    }
  }
);

export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${EMPLOYEE_AUTH_ENDPOINT}/get-all-employees`, {withCredentials: true});
      return response.data.employees; // Return the array directly
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch employees');
    }
  }
);

const employeeSlice = createSlice({
  name: 'employees',
  initialState: {
    employees: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createEmployee.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createEmployee.fulfilled, (state, action) => { // Added action parameter
        state.status = 'succeeded';
        state.employees.push(action.payload); // Add the new employee to the array
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchEmployees.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.employees = action.payload; // Set the employees array directly
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default employeeSlice.reducer;
