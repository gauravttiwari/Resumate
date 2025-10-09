import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MobileNavbar.css';

// MobileNavbar is a top navigation component. It delegates sidebar control and
// search handling to the parent via props so pages can show search results in
// their own sidebar/overlay.
const MobileNavbar = ({ onNavigate, onOpenAIChat, resumeType, showToast, sidebarOpen, setSidebarOpen, onSearch }) => {
  const navigate = useNavigate();
  const [navSearchOpen, setNavSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSidebar = () => setSidebarOpen ? setSidebarOpen(true) : null;

  const submitSearch = (q) => {
    const qstr = (typeof q === 'string' ? q : searchQuery).trim();
    if (!qstr) return;
    if (onSearch) onSearch(qstr);
    // Ask parent to display sidebar (search results) if possible
    if (setSidebarOpen) setSidebarOpen(true);
    setNavSearchOpen(false);
  };

  const onNavKey = (e) => {
    if (e.key === 'Enter') submitSearch(searchQuery);
  };

  return (
    <nav className="hm-topnav">
      <div className="nav-left">
        <div className="nav-logo">ResuMate.ai</div>
        <div className="nav-actions">
          <button
            className="nav-btn create-small"
            onClick={() => {
              if (onNavigate) onNavigate('type-selector');
              else navigate('/create');
            }}
          >Create Resume</button>
        </div>
      </div>
      <div className="nav-right">
        <button
          className="nav-btn nav-search-icon"
          title="Search templates"
          aria-haspopup="dialog"
          aria-expanded={navSearchOpen}
          onClick={() => setNavSearchOpen(s => !s)}
        >🔎</button>
        <button className="nav-btn sidebar" onClick={toggleSidebar} title="Open menu">☰</button>

        {navSearchOpen && (
          <div className="nav-search-popover nav-search-popover-right" role="dialog" aria-label="Search templates">
            <input
              className="nav-search-popover-input"
              type="search"
              placeholder="Search templates"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={onNavKey}
              autoFocus
            />
            <button
              className="nav-btn pop-search-go"
              onClick={() => submitSearch(searchQuery)}
            >Search</button>
          </div>
        )}

      </div>
    </nav>
  );
};

export default MobileNavbar;
