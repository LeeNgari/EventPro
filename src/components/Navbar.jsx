import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import toast from 'react-hot-toast';

const Navbar = ({ user, userRole }) => {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              EventPro
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/events"
              className="text-gray-600 hover:text-gray-900"
            >
              Events
            </Link>
            {user && (
              <Link
                to="/bookings"
                className="text-gray-600 hover:text-gray-900"
              >
                My Bookings
              </Link>
            )}
            {userRole === 'admin' && (
              <Link
                to="/admin"
                className="text-gray-600 hover:text-gray-900"
              >
                Admin Dashboard
              </Link>
            )}
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">{user.displayName}</span>
                <button
                  onClick={handleSignOut}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 