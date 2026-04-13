import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Icon } from '../../utils/general';
import { 
  selectNotifications, 
  selectUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  clearNotifications 
} from '../../player/store';
import { useScenario } from '../../scenarios/engine';
import './actioncenter.scss';

const ActionCenterItem = ({ notification, onClick }) => {
  const { getNPC } = useScenario();
  const dispatch = useDispatch();
  
  const sender = notification.senderId ? getNPC(notification.senderId) : null;
  
  const handleClick = () => {
    if (!notification.read) {
      dispatch(markNotificationRead(notification.id));
    }
    onClick(notification);
  };
  
  // Format timestamp
  const date = new Date(notification.timestamp);
  const timeStr = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  
  return (
    <div 
      className={`action-item ${notification.read ? 'read' : 'unread'} ${notification.urgency}`}
      onClick={handleClick}
    >
      <div className="action-item-header">
        {sender ? (
          <div 
            className="action-item-avatar"
            style={{ backgroundColor: sender.avatarColour }}
          >
            {sender.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
          </div>
        ) : (
          <div className="action-item-avatar system">
            <Icon src="settings" ui width={16} />
          </div>
        )}
        <div className="action-item-meta">
          <div className="action-item-title">{notification.title}</div>
          <div className="action-item-time">{timeStr}</div>
        </div>
        {!notification.read && <div className="action-item-unread-dot" />}
      </div>
      <div className="action-item-body">{notification.body}</div>
      {notification.appId && (
        <div className="action-item-hint">
          Click to open {notification.appId}
          {notification.deepLink && ` • ${notification.deepLink}`}
        </div>
      )}
    </div>
  );
};

export const ActionCenter = () => {
  const dispatch = useDispatch();
  const { history } = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadCount);
  
  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsRead());
  };
  
  const handleClear = () => {
    dispatch(clearNotifications());
  };
  
  const handleNotificationClick = (notification) => {
    // Handle deep link
    if (notification.appId) {
      window.dispatchEvent(new CustomEvent('focus-app', {
        detail: { appId: notification.appId, deepLink: notification.deepLink }
      }));
    }
  };
  
  return (
    <div className="action-center">
      <div className="action-header">
        <div className="action-title">
          Notifications
          {unreadCount > 0 && (
            <span className="action-badge">{unreadCount}</span>
          )}
        </div>
        <div className="action-actions">
          {unreadCount > 0 && (
            <button 
              className="action-btn"
              onClick={handleMarkAllRead}
              title="Mark all as read"
            >
              <Icon fafa="faCheckDouble" width={14} />
            </button>
          )}
          {history.length > 0 && (
            <button 
              className="action-btn"
              onClick={handleClear}
              title="Clear all"
            >
              <Icon fafa="faTrash" width={14} />
            </button>
          )}
        </div>
      </div>
      
      <div className="action-list">
        {history.length === 0 ? (
          <div className="action-empty">
            <Icon fafa="faBellSlash" width={32} />
            <p>No notifications</p>
          </div>
        ) : (
          history.map(notification => (
            <ActionCenterItem
              key={notification.id}
              notification={notification}
              onClick={handleNotificationClick}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ActionCenter;
