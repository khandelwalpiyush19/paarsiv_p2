// EmployeesPage.js
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  Box,
  Alert
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEmployees } from '../../context/employeeSlice';

const EmployeesPage = () => {
  const dispatch = useDispatch();
  const { employees, status, error } = useSelector((state) => state.employees);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handleRowClick = (employee) => {
    setSelectedEmployee(employee);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  if (status === 'loading') {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (status === 'failed') {
    return (
      <Box p={2}>
        <Alert severity="error">
          Error loading employees: {error || 'Unknown error occurred'}
        </Alert>
      </Box>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Employees</h1>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Job Title</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees?.map((employee) => (
              <TableRow 
                key={employee._id} 
                hover 
                onClick={() => handleRowClick(employee)}
                style={{ cursor: 'pointer' }}
              >
                <TableCell>{employee.name} {employee.lastName}</TableCell>
                <TableCell>{employee.jobTitle}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>
                  <Chip 
                    label={employee.active ? 'Active' : 'Inactive'} 
                    color={employee.active ? 'success' : 'error'} 
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        {selectedEmployee && (
          <>
            <DialogTitle>Employee Details</DialogTitle>
            <DialogContent>
              <DialogContentText component="div">
                <strong>Full Name:</strong> {selectedEmployee.name} {selectedEmployee.lastName}<br />
                <strong>Email:</strong> {selectedEmployee.email}<br />
                <strong>Manager:</strong> {selectedEmployee.manager}<br />
                <strong>Salary:</strong> ${selectedEmployee.salary?.toLocaleString()}<br />
                <strong>Role:</strong> {selectedEmployee.role}<br />
                <strong>Job Category:</strong> {selectedEmployee.jobCategory}<br />
                <strong>Job Title:</strong> {selectedEmployee.jobTitle}<br />
                <strong>Position:</strong> {selectedEmployee.position}<br />
                <strong>Department:</strong> {selectedEmployee.department}<br />
                <strong>Status:</strong> 
                <Chip 
                  label={selectedEmployee.active ? 'Active' : 'Inactive'} 
                  color={selectedEmployee.active ? 'success' : 'error'} 
                  size="small"
                  style={{ marginLeft: '8px' }}
                /><br />
                <strong>Created At:</strong> {new Date(selectedEmployee.createdAt).toLocaleString()}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
};

export default EmployeesPage;