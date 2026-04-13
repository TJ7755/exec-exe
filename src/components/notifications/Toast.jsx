import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Icon } from '../../utils/general';
import { selectUnreadCount, selectNotifications, markNotificationRead } from '../../player/store';
import { useScenario } from '../../scenarios/engine';
import './toast.scss';

// Single toast notification item
const ToastItem = ({ notification, onDismiss, onClick }) => {
  const [isExiting, setIsExiting] = useState(false);
  const { getNPC } = useScenario();
  
  // Auto-dismiss based on urgency
  useEffect(() => {
    if (notification.urgency === 'urgent') return; // Urgent stays until manually dismissed
    
    const duration = notification.urgency === 'low' ? 4000 : 6000;
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onDismiss(notification.id), 300); // Wait for exit animation
    }, duration);
    
    return () => clearTimeout(timer);
  }, [notification.id, notification.urgency, onDismiss]);
  
  const handleClick = () => {
    onClick(notification);
  };
  
  const handleDismiss = (e) => {
    e.stopPropagation();
    setIsExiting(true);
    setTimeout(() => onDismiss(notification.id), 300);
  };
  
  const sender = notification.senderId ? getNPC(notification.senderId) : null;
  
  return (
    <div 
      className={`toast-item ${notification.urgency} ${isExiting ? 'exiting' : ''}`}
      onClick={handleClick}
    >
      <div className="toast-header">
        {sender && (
          <div 
            className="toast-sender-dot" 
            style={{ backgroundColor: sender.avatarColour }}
          />
        )}
        <div className="toast-title">{notification.title}</div>
        <button className="toast-dismiss" onClick={handleDismiss}>
          <Icon fafa="faTimes" width={12} />
        </button>
      </div>
      <div className="toast-body">{notification.body}</div>
      {notification.urgency === 'urgent' && (
        <div className="toast-urgent-indicator" />
      )}
    </div>
  );
};

// Toast container that manages and displays active toasts
export const ToastContainer = () => {
  const dispatch = useDispatch();
  const { history } = useSelector(selectNotifications);
  const [activeToasts, setActiveToasts] = useState([]);
  
  // Track which notifications have been shown as toasts
  const [shownNotificationIds, setShownNotificationIds] = useState(new Set());
  
  // Monitor for new notifications and add them as toasts
  useEffect(() => {
    const newNotifications = history.filter(
      n => !shownNotificationIds.has(n.id) && !n.read
    );
    
    if (newNotifications.length > 0) {
      setActiveToasts(prev => [...newNotifications, ...prev].slice(0, 5)); // Max 5 toasts
      setShownNotificationIds(prev => {
        const newSet = new Set(prev);
        newNotifications.forEach(n => newSet.add(n.id));
        return newSet;
      });
    }
  }, [history, shownNotificationIds]);
  
  const handleDismiss = (id) => {
    setActiveToasts(prev => prev.filter(t => t.id !== id));
  };
  
  const handleClick = (notification) => {
    // Mark as read
    dispatch(markNotificationRead(notification.id));
    
    // Remove from active toasts
    handleDismiss(notification.id);
    
    // Handle deep link
    if (notification.appId) {
      // Dispatch app focus action
      window.dispatchEvent(new CustomEvent('focus-app', {
        detail: { appId: notification.appId, deepLink: notification.deepLink }
      }));
    }
  };
  
  if (activeToasts.length === 0) return null;
  
  return (
    <div className="toast-container">
      {activeToasts.map(toast => (
        <ToastItem
          key={toast.id}
          notification={toast}
          onDismiss={handleDismiss}
          onClick={handleClick}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
