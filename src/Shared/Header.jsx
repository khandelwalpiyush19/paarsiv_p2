import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaBell, FaEnvelope, FaUserCircle } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../context/Auth/authSlice";
import { toast } from 'react-toastify';

const Header = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // Get user data from Redux store
    const { username, email } = useSelector((state) => state.auth.user || {});

    const handleLogout = async () => {
        try {
            // Pass the email to determine which endpoint to use
            await dispatch(logoutUser(email)).unwrap();
            
            // Clear all client-side storage
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('email');
            
            // Show success message
              toast.success('Logged out successfully');
            
            // Navigate to login page with full reload
            navigate ('/login')
            toast.success('Logged out successfully');
            
        } catch (error) {
            // Even if API fails, clear local storage and redirect
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('email');
            toast.success('Logged out successfully');
            window.location.href = '/login';
        }
    };

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    // Determine user type for navigation
    const isAdmin = email?.endsWith('@gmail.com');
    const isEmployee = email?.endsWith('@paarsiv.com');

    return (
        <header className="flex justify-between items-center py-2 px-6 bg-gray-700 text-white shadow-md">
            <div className="flex items-center">
                {/* Logo placeholder */}
            </div>

            <nav className="flex gap-6">
                <Link 
                    to={isAdmin ? "/dashboard-admin" : isEmployee ? "/dashboard-employee" : "#"}
                    className="text-white no-underline text-base transition-colors duration-300 pb-1 border-b-2 border-transparent hover:text-blue-400 hover:border-blue-400"
                >
                    Dashboard
                </Link>
                <Link 
                    to={isAdmin ? "/admin-payroll" : isEmployee ? "/employee-payroll" : "#"}
                    className="text-white no-underline text-base transition-colors duration-300 pb-1 border-b-2 border-transparent hover:text-blue-400 hover:border-blue-400"
                >
                    Payroll
                </Link>
                <Link 
                    to={isAdmin ? "/leave-management" : isEmployee ? "/leave" : "#"}
                    className="text-white no-underline text-base transition-colors duration-300 pb-1 border-b-2 border-transparent hover:text-blue-400 hover:border-blue-400"
                >
                    Leave
                </Link>
            </nav>

            <div className="flex items-center gap-4">
                <div className="relative text-xl text-white cursor-pointer transition-transform duration-200 hover:scale-110">
                    <FaBell />
                </div>
                
                <div className="relative text-xl text-white cursor-pointer transition-transform duration-200 hover:scale-110">
                    <FaEnvelope />
                </div>
                
                <div className="relative">
                    <FaUserCircle 
                        className="text-2xl text-white cursor-pointer" 
                        onClick={toggleDropdown} 
                    />
                    {dropdownOpen && (
                        <div className="absolute top-full right-0 bg-white text-black border border-gray-300 rounded shadow-md p-2 z-50 flex flex-col items-start min-w-[150px]">
                            {username && (
                                <span className="text-sm font-bold text-gray-700 mb-1">
                                    Welcome, {username}
                                </span>
                            )}
                            <button 
                                className="bg-red-500 text-white border-none py-1 px-3 rounded text-sm cursor-pointer transition-colors duration-300 hover:bg-red-600 w-full text-left"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;