import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) return;
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get('/api/notifications', config);
      setNotifications(data);
    } catch (err) {
      console.error('Could not fetch notifications');
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Fetch notifications every 30 seconds to keep the list updated
    const interval = setInterval(fetchNotifications, 30000); 
    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = async (notification) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    try {
      // Mark as read on the backend
      if (!notification.read) {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.put(`/api/notifications/${notification._id}/read`, {}, config);
      }
      
      // Navigate to the link associated with the notification
      navigate(notification.link);
      setIsOpen(false); // Close dropdown after clicking
    } catch (err) {
      console.error('Failed to mark notification as read');
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notifications-container">
      <button onClick={() => setIsOpen(!isOpen)} className="notification-button">
        🔔
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>
      {isOpen && (
        <div className="notifications-dropdown">
          {notifications.length > 0 ? (
            notifications.map(n => (
              <div 
                key={n._id} 
                className={`notification-item ${n.read ? '' : 'unread'}`}
                onClick={() => handleNotificationClick(n)}
              >
                <p>{n.message}</p>
              </div>
            ))
          ) : (
            <div className="notification-item">
              <p>No new notifications.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;