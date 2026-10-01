import './Navbar.css';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSignOutAlt } from 'react-icons/fa'; // Importing a logout icon from react-icons
import NotificationList from '../user/NotificationList'; // Importing the NotificationList component


const Navbar = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const location = useLocation();
  if (!currentUser) return null;

  return (
    <nav>
      <div className="container">
        <div className="title">Bulk Ordering </div>
        
        <div className="links">
          {isAdmin ? (
            <Link
              to="/admin"
              className={location.pathname === '/admin' ? 'active' : ''}
            >
              Admin Dashboard
            </Link>
          ) : (
            <Link
              to="/dashboard"
              className={location.pathname === '/dashboard' ? 'active' : ''}
            >
              Store Dashboard
            </Link>
          )}
          {!isAdmin && <NotificationList />}
          
          <button onClick={logout} className="logout-btn" title="Logout">
            <FaSignOutAlt size={20} /> {/* Logout icon */}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;