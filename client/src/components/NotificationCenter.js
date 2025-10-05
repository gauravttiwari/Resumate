import React, { useState, useEffect } from 'react';
import './NotificationCenter.css';

const NotificationCenter = ({ userId = 'anonymous' }) => {
  const [notifications, setNotifications] = useState([]);
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState({
    enableNotifications: true,
    notificationFrequency: 'weekly',
    categories: {
      skillUpdates: true,
      marketTrends: true,
      salaryChanges: true,
      newOpportunities: true
    }
  });

  useEffect(() => {
    fetchNotifications();
    // Set up periodic refresh (every 30 seconds for demo)
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/ai/trend-notifications');
      const data = await response.json();

      if (data.success) {
        setNotifications(data.data.notifications || []);
        setTrends(data.data.trends || null);
      } else {
        setError('Failed to fetch notifications');
      }
    } catch (err) {
      setError('Network error while fetching notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };

  const dismissNotification = (notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type) => {
    const icons = {
      skill_update: '🛠️',
      market_trend: '📈',
      salary_change: '💰',
      new_opportunity: '🚀',
      industry_news: '📰',
      certification: '🏆',
      job_market: '💼'
    };
    return icons[type] || '🔔';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: '#e74c3c',
      medium: '#f39c12',
      low: '#27ae60'
    };
    return colors[priority] || '#3498db';
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <div className="notification-center">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notification-center">
      <div className="notification-header">
        <h2>🔔 Notification Center</h2>
        <p>Stay updated with industry trends and career opportunities</p>
      </div>

      {/* Quick Stats */}
      <div className="notification-stats">
        <div className="stat-item">
          <span className="stat-number">{notifications.filter(n => !n.isRead).length}</span>
          <span className="stat-label">Unread</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{notifications.length}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{notifications.filter(n => n.priority === 'high').length}</span>
          <span className="stat-label">High Priority</span>
        </div>
      </div>

      {/* Industry Trends Summary */}
      {trends && (
        <div className="trends-summary">
          <h3>📊 Current Industry Trends</h3>
          <div className="trends-grid">
            {Object.entries(trends).map(([industry, data]) => (
              <div key={industry} className="trend-card">
                <h4>{industry.replace('_', ' ').toUpperCase()}</h4>
                <div className="trend-metrics">
                  <div className="metric">
                    <span className="metric-label">Growth</span>
                    <span className="metric-value positive">+{data.growth || '12%'}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Demand</span>
                    <span className="metric-value">{data.demand || 'High'}</span>
                  </div>
                </div>
                <div className="top-skills">
                  <span className="skills-label">Hot Skills:</span>
                  <div className="skills-tags">
                    {(data.topSkills || ['React', 'AWS', 'Docker']).slice(0, 3).map(skill => (
                      <span key={skill} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notification Controls */}
      <div className="notification-controls">
        <button onClick={fetchNotifications} className="refresh-btn">
          🔄 Refresh
        </button>
        <button onClick={clearAllNotifications} className="clear-btn">
          🗑️ Clear All
        </button>
      </div>

      {/* Notifications List */}
      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="empty-notifications">
            <div className="empty-icon">🔕</div>
            <h3>No notifications</h3>
            <p>You're all caught up! Check back later for updates.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id || Date.now() + Math.random()}
              className={`notification-item ${!notification.isRead ? 'unread' : ''} priority-${notification.priority}`}
            >
              <div className="notification-content">
                <div className="notification-header-row">
                  <div className="notification-type">
                    <span className="type-icon">{getNotificationIcon(notification.type)}</span>
                    <span className="type-name">{notification.type?.replace('_', ' ').toUpperCase() || 'UPDATE'}</span>
                    {!notification.isRead && <div className="unread-indicator"></div>}
                  </div>
                  <div className="notification-time">
                    {getTimeAgo(notification.timestamp)}
                  </div>
                </div>

                <h4 className="notification-title">{notification.title}</h4>
                <p className="notification-message">{notification.message}</p>

                {notification.category && (
                  <div className="notification-category">
                    <span className="category-tag">{notification.category}</span>
                  </div>
                )}

                <div className="notification-actions">
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="action-btn read-btn"
                    >
                      Mark as Read
                    </button>
                  )}
                  <button
                    onClick={() => dismissNotification(notification.id)}
                    className="action-btn dismiss-btn"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
              <div 
                className="priority-indicator"
                style={{ backgroundColor: getPriorityColor(notification.priority) }}
              ></div>
            </div>
          ))
        )}
      </div>

      {/* Notification Settings */}
      <div className="notification-settings">
        <h3>⚙️ Notification Settings</h3>
        <div className="settings-grid">
          <div className="setting-item">
            <label className="setting-label">
              <input
                type="checkbox"
                checked={settings.enableNotifications}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  enableNotifications: e.target.checked
                }))}
              />
              Enable Notifications
            </label>
          </div>

          <div className="setting-item">
            <label className="setting-label">Frequency:</label>
            <select
              value={settings.notificationFrequency}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                notificationFrequency: e.target.value
              }))}
            >
              <option value="real-time">Real-time</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div className="setting-item categories">
            <label className="setting-label">Categories:</label>
            <div className="category-checkboxes">
              {Object.entries(settings.categories).map(([category, enabled]) => (
                <label key={category} className="category-checkbox">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      categories: {
                        ...prev.categories,
                        [category]: e.target.checked
                      }
                    }))}
                  />
                  {category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;