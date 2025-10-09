import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  // State to control mobile menu visibility
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo">
            <div className="logo-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="6" fill="#8b5cf6"/>
                <path d="M8 10h16v2H8v-2zm0 4h16v2H8v-2zm0 4h12v2H8v-2zm0 4h14v2H8v-2z" fill="white"/>
              </svg>
            </div>
            <div className="logo-content">
              <span className="logo-text">ResuMate</span>
              <span className="logo-subtitle">AI Resume Builder</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <Link to="/templates" className="nav-link">
              Templates
            </Link>
            <Link to="/pricing" className="nav-link">
              Pricing
            </Link>
            <Link to="/blog" className="nav-link">
              Resume Tips
            </Link>
            <Link to="/faq" className="nav-link">
              FAQ
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="header-buttons">
            <Link to="/login" className="login-link">
              Login
            </Link>
            <Link to="/create" className="create-resume-btn">
              Create Resume
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="mobile-menu-button-container">
            <button
              type="button"
              className="mobile-menu-button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg
                  style={{ width: '24px', height: '24px' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  style={{ width: '24px', height: '24px' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-container">
            <div className="mobile-nav">
              <Link
                to="/templates"
                className="mobile-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Templates
              </Link>
              <Link
                to="/pricing"
                className="mobile-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                to="/blog"
                className="mobile-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Resume Tips
              </Link>
              <Link
                to="/faq"
                className="mobile-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
              <div className="mobile-divider"></div>
              <Link
                to="/login"
                className="mobile-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/create"
                className="mobile-create-btn"
                onClick={() => setIsMenuOpen(false)}
              >
                Create Resume
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
