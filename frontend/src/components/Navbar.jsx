// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  return (
    <nav className="bg-blue-500 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span className="font-roboto text-white text-3xl font-bold uppercase tracking-wider">Easy Exam</span>
        </div>

        <ul className="flex space-x-6">
          {!isAuthenticated ? (
            <>
              <li>
                <Link to="/login" className="text-white text-lg hover:text-gray-300">Login</Link>
              </li>
              <li>
                <Link to="/register" className="text-white text-lg hover:text-gray-300">Register</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/dashboard" className="text-white text-lg hover:text-gray-300">Dashboard</Link>
              </li>
              <li>
                <Link to="/results" className="text-white text-lg hover:text-gray-300">Results</Link>
              </li>
              <li>
                <Link to="/create-exam" className="text-white text-lg hover:text-gray-300">Create Exam</Link>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="bg-red-600 text-white text-lg px-4 py-2 rounded hover:bg-red-700 transition duration-300"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;