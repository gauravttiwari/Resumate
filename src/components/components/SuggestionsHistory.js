import React, { useState, useEffect } from 'react';
import './SuggestionsHistory.css';

const SuggestionsHistory = ({ userId = 'anonymous' }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: 'all',
    timeRange: 'all',
    showUnreadOnly: false
  });

  // Fetch suggestions history and stats
  useEffect(() => {
    fetchSuggestionsData();
  }, [userId, filters]);

  const fetchSuggestionsData = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams({ userId });
      if (filters.type !== 'all') params.append('type', filters.type);
      if (filters.timeRange !== 'all') {
        const now = new Date();
        let startDate;
        switch (filters.timeRange) {
          case 'today':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
          case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
        }
        if (startDate) params.append('startDate', startDate.toISOString());
      }

      // Fetch suggestions
      const suggestionsResponse = await fetch(`/api/ai/suggestions-history?${params}`);
      const suggestionsData = await suggestionsResponse.json();

      if (suggestionsData.success) {
        let filteredSuggestions = suggestionsData.data;
        if (filters.showUnreadOnly) {
          filteredSuggestions = filteredSuggestions.filter(s => !s.isRead);
        }
        setSuggestions(filteredSuggestions);
      }

      // Fetch stats
      const statsResponse = await fetch(`/api/ai/suggestions-stats?userId=${userId}`);
      const statsData = await statsResponse.json();
      
      if (statsData.success) {
        setStats(statsData.data);
      }

    } catch (err) {
      setError('Failed to fetch suggestions history');
      console.error('Error fetching suggestions:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (suggestionId) => {
    try {
      const response = await fetch(`/api/ai/suggestions/${suggestionId}/read`, {
        method: 'PATCH'
      });
      
      if (response.ok) {
        setSuggestions(prev => 
          prev.map(s => s.id === suggestionId ? { ...s, isRead: true } : s)
        );
        // Update stats
        setStats(prev => ({
          ...prev,
          unread: Math.max(0, prev.unread - 1)
        }));
      }
    } catch (err) {
      console.error('Error marking suggestion as read:', err);
    }
  };

  const deleteSuggestion = async (suggestionId) => {
    try {
      const response = await fetch(`/api/ai/suggestions/${suggestionId}?userId=${userId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
        setStats(prev => ({
          ...prev,
          total: prev.total - 1
        }));
      }
    } catch (err) {
      console.error('Error deleting suggestion:', err);
    }
  };

  const clearAllHistory = async () => {
    if (window.confirm('Are you sure you want to clear all suggestions history? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/ai/suggestions-history?userId=${userId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setSuggestions([]);
          setStats({
            total: 0,
            unread: 0,
            byType: {},
            recentActivity: { today: 0, thisWeek: 0, thisMonth: 0 }
          });
        }
      } catch (err) {
        console.error('Error clearing history:', err);
      }
    }
  };

  const getSuggestionIcon = (type) => {
    const icons = {
      summary: '📝',
      skills: '🛠️',
      experience: '💼',
      education: '🎓',
      optimization: '⚡',
      ats_analysis: '📊',
      career_path: '🚀',
      interview: '🎯',
      template: '📋'
    };
    return icons[type] || '💡';
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 24 * 60 * 60 * 1000) {
      return date.toLocaleTimeString();
    } else if (diff < 7 * 24 * 60 * 60 * 1000) {
      return date.toLocaleDateString();
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="suggestions-history">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading suggestions history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="suggestions-history">
        <div className="error-state">
          <p>❌ {error}</p>
          <button onClick={fetchSuggestionsData} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="suggestions-history">
      <div className="history-header">
        <h2>🕒 Suggestions History</h2>
        <p>Track all AI suggestions and recommendations you've received</p>
      </div>

      {/* Statistics Overview */}
      {stats && (
        <div className="stats-overview">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Suggestions</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.unread}</div>
            <div className="stat-label">Unread</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.recentActivity.thisWeek}</div>
            <div className="stat-label">This Week</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.recentActivity.today}</div>
            <div className="stat-label">Today</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Type:</label>
          <select
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
          >
            <option value="all">All Types</option>
            <option value="summary">Summaries</option>
            <option value="skills">Skills</option>
            <option value="experience">Experience</option>
            <option value="optimization">Optimization</option>
            <option value="ats_analysis">ATS Analysis</option>
            <option value="career_path">Career Path</option>
            <option value="interview">Interview Prep</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Time Range:</label>
          <select
            value={filters.timeRange}
            onChange={(e) => setFilters(prev => ({ ...prev, timeRange: e.target.value }))}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={filters.showUnreadOnly}
              onChange={(e) => setFilters(prev => ({ ...prev, showUnreadOnly: e.target.checked }))}
            />
            Show unread only
          </label>
        </div>

        <button onClick={clearAllHistory} className="clear-all-btn">
          🗑️ Clear All
        </button>
      </div>

      {/* Suggestions List */}
      <div className="suggestions-list">
        {suggestions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No suggestions found</h3>
            <p>Try adjusting your filters or generate some AI suggestions to see them here.</p>
          </div>
        ) : (
          suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className={`suggestion-item ${!suggestion.isRead ? 'unread' : ''}`}
            >
              <div className="suggestion-header">
                <div className="suggestion-type">
                  <span className="type-icon">{getSuggestionIcon(suggestion.type)}</span>
                  <span className="type-name">{suggestion.type.replace('_', ' ').toUpperCase()}</span>
                  {!suggestion.isRead && <div className="unread-badge">New</div>}
                </div>
                <div className="suggestion-time">
                  {formatTimestamp(suggestion.timestamp)}
                </div>
              </div>

              <div className="suggestion-content">
                {suggestion.content.length > 200 ? 
                  `${suggestion.content.substring(0, 200)}...` : 
                  suggestion.content
                }
              </div>

              {suggestion.metadata && Object.keys(suggestion.metadata).length > 0 && (
                <div className="suggestion-metadata">
                  {suggestion.metadata.role && (
                    <span className="metadata-tag">Role: {suggestion.metadata.role}</span>
                  )}
                  {suggestion.metadata.atsScore && (
                    <span className="metadata-tag">ATS Score: {suggestion.metadata.atsScore}%</span>
                  )}
                  {suggestion.metadata.keywordsUsed && (
                    <span className="metadata-tag">Keywords: {suggestion.metadata.keywordsUsed.join(', ')}</span>
                  )}
                </div>
              )}

              <div className="suggestion-actions">
                {!suggestion.isRead && (
                  <button
                    onClick={() => markAsRead(suggestion.id)}
                    className="action-btn read-btn"
                  >
                    Mark as Read
                  </button>
                )}
                <button
                  onClick={() => deleteSuggestion(suggestion.id)}
                  className="action-btn delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SuggestionsHistory;