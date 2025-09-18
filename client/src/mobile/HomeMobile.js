import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as aiService from '../services/aiService';
import './HomeMobile.css';
import MobileNavbar from './MobileNavbar';

const HomeMobile = ({ onNavigate, onOpenAIChat, resumeType, showToast }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // close sidebar handler
  const closeSidebar = () => setSidebarOpen(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState(null);
  const [navSearchOpen, setNavSearchOpen] = useState(false);

  const handleSearch = async (q) => {
    const query = (typeof q === 'string' ? q : searchQuery).trim();
    if (!query) return;
    setSearching(true);
    setSearchError(null);
    try {
      const results = await aiService.searchTemplates({ jobTitle: query, industry: 'general', experienceLevel: 'mid-level' });
      setSearchResults(results || []);
    } catch (err) {
      console.error('Search error', err);
      setSearchError('Search failed. Try again');
    } finally {
      setSearching(false);
    }
  };

  // handle enter key on navbar search
  const onNavSearchKey = (e) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery);
      setSidebarOpen(true);
    }
  };

  const onNavPopoverKey = (e) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery);
      setSidebarOpen(true);
      setNavSearchOpen(false);
    }
  };

  return (
    <div className="home-mobile-container">
      {/* Sidebar panel (hidden by default) */}
      <aside className={`hm-sidebar ${sidebarOpen ? 'open' : ''}`} role="dialog" aria-modal="true">
        <ul className="hm-sidebar-list">
          <li className="menu-item" onClick={() => { closeSidebar(); if (onNavigate) onNavigate('home'); else navigate('/'); }}>🏠 Home</li>
          <li className="menu-item" onClick={() => { closeSidebar(); if (onNavigate) onNavigate('type-selector'); else navigate('/create'); }}>📝 Create Resume</li>
          <li className="menu-item" onClick={() => {
              closeSidebar();
              // Prefer app-level navigation to respect resumeType guard
              if (onNavigate) {
                if (resumeType) onNavigate('templates');
                else showToast && showToast('Please select a resume type first', 'warning');
              } else {
                if (resumeType) navigate('/templates');
                else showToast && showToast('Please select a resume type first', 'warning');
              }
            }}>📋 Templates</li>
          <li className="menu-item" onClick={() => { closeSidebar(); if (onNavigate) onNavigate('interview-prep'); else navigate('/interview-prep'); }}>🎯 Interview Prep</li>
          <li className="menu-item" onClick={() => { console.log('Mobile sidebar AI Chat clicked, onOpenAIChat?', !!onOpenAIChat); closeSidebar(); if (onOpenAIChat) onOpenAIChat(); }}>💬 AI Chat</li>
        </ul>
      </aside>
      <div className={`hm-sidebar-overlay ${sidebarOpen ? 'show' : ''}`} onClick={closeSidebar} />
      <MobileNavbar
        onNavigate={onNavigate}
        onOpenAIChat={onOpenAIChat}
        resumeType={resumeType}
        showToast={showToast}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onSearch={(q) => { handleSearch(q); setNavSearchOpen(false); }}
      />
      {/* Hero / CTA header (match desktop hero on mobile) */}
      <header className="hm-hero">
        <div className="hm-top-badge">AI-Powered Resume Builder</div>
        <div className="hm-hero-inner">
          <h1 className="hm-title">Create a <span className="grad">Professional<br/>Resume</span> in Minutes</h1>
          <p className="hm-sub">Build ATS-optimized resumes with AI assistance. Tailored for different countries and languages.</p>
          <button className="hm-cta">Create Free Resume</button>

          <div className="hm-selects">
            <label>Target Country</label>
            <select defaultValue="India">
              <option>India</option>
            </select>
            <label>Resume Language</label>
            <select defaultValue="English">
              <option>English</option>
            </select>
          </div>
        </div>
      </header>
      <section className="hm-stats-grid">
        <div className="hm-stat-card hm-stat-blue">
          <div className="hm-stat-icon" style={{background: 'linear-gradient(90deg,#60a5fa,#0369a1)'}}>📄</div>
          <div className="hm-stat-value">50,000+</div>
          <div className="hm-stat-label">Resumes Created</div>
        </div>
        <div className="hm-stat-card hm-stat-green">
          <div className="hm-stat-icon" style={{background: 'linear-gradient(90deg,#34d399,#10b981)'}}>📈</div>
          <div className="hm-stat-value">98%</div>
          <div className="hm-stat-label">ATS Pass Rate</div>
        </div>
        <div className="hm-stat-card hm-stat-purple">
          <div className="hm-stat-icon" style={{background: 'linear-gradient(90deg,#7c3aed,#a78bfa)'}}>🌐</div>
          <div className="hm-stat-value">10</div>
          <div className="hm-stat-label">Countries</div>
        </div>
        <div className="hm-stat-card hm-stat-orange">
          <div className="hm-stat-icon" style={{background: 'linear-gradient(90deg,#fb923c,#f97316)'}}>📚</div>
          <div className="hm-stat-value">3</div>
          <div className="hm-stat-label">Templates</div>
        </div>
      </section>

      <section className="hm-mockup">
        <div className="mockup-card">
          <div className="mockup-badge left">Powerful Features</div>
          <div className="mockup-badge right green">ATS-Optimized</div>
          <div className="mockup-avatar">JA</div>
          <div className="mockup-name">John Anderson</div>
          <div className="mockup-role">Senior Software Engineer</div>
          <div className="mockup-lines">
            <div className="line"></div>
            <div className="line short"></div>
            <div className="line"></div>
            <div className="line"></div>
          </div>
          <div className="mockup-score">★★★★★ Perfect Score</div>
        </div>
      </section>

      <section className="hm-features-cards">
        <h3 className="hm-section-title">Powerful Features</h3>
        <div className="cards">
          <div className="feature-card">
            <div className="icon blue">⚡</div>
            <h4>AI-Powered Content</h4>
            <p>Smart suggestions and content optimization.</p>
          </div>
          <div className="feature-card">
            <div className="icon purple">🌐</div>
            <h4>Multilingual Support</h4>
            <p>Country-specific formatting and translations.</p>
          </div>
          <div className="feature-card">
            <div className="icon orange">🔒</div>
            <h4>ATS Optimization</h4>
            <p>Ensure resumes pass applicant tracking systems.</p>
          </div>
        </div>
      </section>

      <section className="hm-cta-section">
        <div className="hm-cta-wrap">
          <h3>Ready to Create Your Perfect Resume?</h3>
          <p>Join thousands of professionals who landed their dream jobs with ResuMate</p>
          <button className="hm-cta-primary">Start Building Now</button>
          <div className="template-previews">
            <div className="tpl">Modern</div>
            <div className="tpl">Professional</div>
            <div className="tpl">Creative</div>
          </div>
        </div>
      </section>

      <footer className="hm-footer">
        <div className="rating">★★★★★</div>
        <p className="trust">Trusted by 1000+ professionals worldwide</p>
      </footer>
    </div>
  );
};

export default HomeMobile;
