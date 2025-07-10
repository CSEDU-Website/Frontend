import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = user.isAuthenticated;

  return (
    <nav className="bg-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div>
              <Link to="/" className="flex items-center py-4">
                <span className="font-semibold text-lg">CSEDU - Dhaka University</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              <Link to="/people" className="py-4 px-2 hover:text-slate-300 transition duration-300">People Directory</Link>
              <Link to="/chairman" className="py-4 px-2 hover:text-slate-300 transition duration-300">About Chairman</Link>
              <Link to="/admission-hub" className="py-4 px-2 hover:text-slate-300 transition duration-300">Admission Hub</Link>
              <Link to="/apply" className="py-4 px-2 hover:text-slate-300 transition duration-300">Apply Now</Link>
              <Link to="/meetings" className="py-4 px-2 hover:text-slate-300 transition duration-300">Departmental Meetings</Link>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm">{user.fullname}</span>
                <Link 
                  to={`/${user.role}-dashboard`} 
                  className="py-2 px-3 bg-slate-600 hover:bg-slate-700 text-white rounded transition duration-300"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => {
                    localStorage.removeItem('user');
                    sessionStorage.removeItem('user');
                    window.location.href = '/';
                  }}
                  className="py-2 px-3 bg-red-600 hover:bg-red-500 text-white rounded transition duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="py-2 px-3 bg-slate-600 hover:bg-slate-700 text-white rounded transition duration-300">Login</Link>
                <Link to="/signup" className="py-2 px-3 bg-gray-600 hover:bg-gray-700 text-white rounded transition duration-300">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
