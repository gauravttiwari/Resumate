import React from 'react';
import './HomeMobile.css';

const HomeMobile = () => {
  return (
    <div className="home-mobile-container">
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

      <section className="hm-stats">
        <div className="stat">
          <div className="stat-num">50,000+</div>
          <div className="stat-label">Resumes Created</div>
        </div>
        <div className="stat">
          <div className="stat-num">98%</div>
          <div className="stat-label">Success Rate</div>
        </div>
        <div className="stat">
          <div className="stat-num">10</div>
          <div className="stat-label">Countries Supported</div>
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
