import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance'; 

const  SendNotification = () => {
  const [message, setMessage] = useState('');

  const  handleSendNotification = async () => {
    try {
      const response = await axiosInstance.post('/notifications', {
        message,
      });
      console.log('Notification sent:', response.data);
      setMessage('');
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification.');
    }
  };

return (
  <div className="notification-form">
    <div className="form-group">
      <label className="form-label notification-message">Message</label>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="form-textarea"
        placeholder="Enter your notification message"
      />
    </div>
    <button
      onClick={handleSendNotification}
      className="send-button"
    >
      Send Notification
    </button>
  </div>
);
};

export default SendNotification;