import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { createEmployee} from '../../context/employeeSlice'; 

function AddEmployee() {
    const [form, setForm] = useState({
        name: '',
        lastName: '',
        department: '',
        manager: '',
        jobTitle: '',
        jobCategory: '',
        email: '',
        password: '',
        position: '',
        salary: '',
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [error, setError] = useState('');

    const employeeStatus = useSelector(state => state.employees.status);
    const employeeError = useSelector(state => state.employees.error);


    const departments = [
        "Engineering", "HR", "Finance", "Sales", "Marketing", "IT Support", "Operations",
        "Customer Support", "Legal", "Product", "Research & Development", "Design", "Administration"
    ];

    const jobTitles = [
        "Software Engineer", "Frontend Developer", "Backend Developer", "DevOps Engineer", "HR Manager",
        "Financial Analyst", "Marketing Executive", "Sales Representative", "Product Manager",
        "QA Tester", "Customer Support Specialist", "UX/UI Designer", "Project Manager",
        "Legal Advisor", "Operations Coordinator", "Full Stack Developer"
    ];

    const jobCategories = [
        "Information Technology", "Human Resources", "Finance", "Marketing", "Sales", "Operations",
        "Customer Service", "Research and Development", "Engineering", "Legal", "Administration",
        "Management", "Design", "Product Management"
    ];

    const positions = [
        "Intern", "Junior", "Mid-Level", "Senior", "Lead", "Supervisor", "Manager",
        "Director", "VP", "CTO", "CFO", "CEO"
    ];

 const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');

        const resultAction = await dispatch(createEmployee(form));

        if (createEmployee.fulfilled.match(resultAction)) {
            navigate('/dashboard-admin');
        } else {
            setError(resultAction.payload || 'Failed to create employee');
        }
    };

    return (
        <div className="flex gap-8 p-8 bg-gray-100 min-h-screen">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 text-white p-4 flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-xl">
                            👤
                        </div>
                        <div>
                            <h3 className="text-lg font-medium">Xyz admin</h3>
                            <p className="text-gray-300 text-sm">Admin</p>
                        </div>
                    </div>
                    
                    <div className="mb-8">
                        <h4 className="text-gray-300 text-lg mb-4">Features</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/dashboard-admin" className="flex items-center gap-2 p-2 rounded hover:bg-green-500 transition-colors">
                                    <span>📊</span> Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link to="/messages" className="flex items-center gap-2 p-2 rounded hover:bg-green-500 transition-colors">
                                    <span>✉️</span> Messages
                                </Link>
                            </li>
                            <li>
                                <Link to="/employee-status" className="flex items-center gap-2 p-2 rounded hover:bg-green-500 transition-colors">
                                    <span>👥</span> Employee Status
                                </Link>
                            </li>
                            <li>
                                <Link to="/documents" className="flex items-center gap-2 p-2 rounded hover:bg-green-500 transition-colors">
                                    <span>📄</span> Documents
                                </Link>
                            </li>
                        </ul>
                    </div>
                    
                    <div className="mb-8">
                        <h4 className="text-gray-300 text-lg mb-4">Organization</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/employee-payroll" className="flex items-center gap-2 p-2 rounded hover:bg-green-500 transition-colors">
                                    <span>💼</span> Employee Payroll
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <button className="mt-8 px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
                    Log Out
                </button>
            </div>

            {/* Main Content */}
          <div className="flex-1 bg-white rounded-lg shadow-md p-8">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6">➕ Add Employee</h1>
                
                {(error || employeeError) && (
                    <p className="text-red-500 mb-4">{error || employeeError}</p>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-4">
                        <input
                            className="flex-1 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            name="name"
                            placeholder="Name"
                            onChange={handleChange}
                            required
                        />
                        <input
                            className="flex-1 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            name="lastName"
                            placeholder="Last Name"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="flex gap-4">
                        <select
                            className="flex-1 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            name="department"
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Department</option>
                            {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                        </select>
                        <input
                            className="flex-1 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            name="manager"
                            placeholder="Manager"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="flex gap-4">
                        <select
                            className="flex-1 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            name="jobTitle"
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Job Title</option>
                            {jobTitles.map(title => <option key={title} value={title}>{title}</option>)}
                        </select>
                        <select
                            className="flex-1 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            name="jobCategory"
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Job Category</option>
                            {jobCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    
                    <div className="flex gap-4">
                        <input
                            className="flex-1 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            name="email"
                            placeholder="E-Mail"
                            type="email"
                            onChange={handleChange}
                            required
                        />
                        <input
                            className="flex-1 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            name="password"
                            placeholder="Password"
                            type="password"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="flex gap-4">
                        <select
                            className="flex-1 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            name="position"
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Position</option>
                            {positions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                        </select>
                        <input
                            className="flex-1 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            name="salary"
                            placeholder="Salary"
                            type="number"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                          disabled={employeeStatus === 'loading'}
                        className="ml-auto px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                        {employeeStatus === 'loading' ? 'Adding...' : 'Add Employee'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddEmployee;






