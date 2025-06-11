import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/api/admin/employees')
            .then(res => res.json())
            .then(data => setEmployees(data))
            .catch(err => console.error('Error fetching employees:', err));
    }, []);

    const handleAddEmployee = () => {
        navigate('/add-employee');
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Employee List</h1>

            <div className="mb-4">
                <Link to="/add">
                    <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                        Add Employee
                    </button>
                </Link>
            </div>

            <ul className="bg-white rounded shadow p-4 divide-y divide-gray-200">
                {employees.map(emp => (
                    <li key={emp._id} className="py-2">
                        <span className="font-medium">{emp.name}</span> - <span className="text-gray-600">{emp.position}</span>
                    </li>
                ))}
            </ul>

            <button
                onClick={handleAddEmployee}
                className="mt-6 px-5 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
                + Add Employee
            </button>
        </div>
    );
}

export default EmployeeList;
