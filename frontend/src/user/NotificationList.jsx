import React, { useState, useEffect, useRef } from 'react';
import { FaBell } from 'react-icons/fa';
import axiosInstance from '../api/axiosInstance';
import '../admin/style.css';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get('/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  return (
    <div className="notif-container" ref={dropdownRef}>
      <button className="notif-icon" onClick={toggleDropdown}>
        <FaBell size={20} />
        {notifications.length > 0 && (
          <span className="notif-badge">{notifications.length}</span>
        )}
      </button>

      {showDropdown && (
        <div className="notif-dropdown">
          <div className="notif-header">Notifications</div>
          <div className="notif-items">
            {notifications.length === 0 ? (
              <div className="notif-empty">No notifications</div>
            ) : (
              notifications.map((notification, index) => (
                <div key={index} className="notif-item">
                  {notification.message}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationList;
