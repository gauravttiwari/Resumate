import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Import CSS for styling

const HomePage = () => {
  // Animation state
  const [isVisible, setIsVisible] = useState({
    hero: false,
    templates: false,
    features: false,
    howItWorks: false,
    testimonials: false,
    cta: false
  });

  // Intersection observer setup
  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '-50px'
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe all sections
    const sections = document.querySelectorAll('.animate-section');
    sections.forEach(section => observer.observe(section));

    return () => sections.forEach(section => observer.unobserve(section));
  }, []);

  return (
    <div className="homepage-container">
      {/* Hero Section */}
      <section id="hero" className="hero-section animate-section">
        <div className="hero-background"></div>
        
        <div className="container">
          <div className={`hero-content ${isVisible.hero ? 'visible' : ''}`}>
            <div className="hero-text">
              <span className="hero-badge">Professional Resume Builder</span>
              <h1 className="hero-title">
                Create an impressive 
                <span className="highlight"> resume </span> 
                in minutes
              </h1>
              <p className="hero-description">
                Build a standout resume that gets you noticed. Choose from professional templates, customize with ease, and land your dream job.
              </p>
              <div className="hero-buttons">
                <Link to="/create" className="btn btn-primary">
                  Create Your Resume
                </Link>
                <Link to="/templates" className="btn btn-secondary">
                  Browse Templates
                </Link>
              </div>
            </div>
            
            <div className="hero-image">
              <img src="/assets/images/resume-preview.png" alt="Resume preview" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section animate-section">
        <div className="container">
          <div className={`section-header ${isVisible.features ? 'visible' : ''}`}>
            <h2 className="section-title">Why Choose ResuMate</h2>
            <p className="section-description">
              Features designed to help you create the perfect resume
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="feature-title">Professional Templates</h3>
              <p className="feature-description">Choose from dozens of ATS-friendly templates designed by HR professionals.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="feature-title">Easy Customization</h3>
              <p className="feature-description">Personalize your resume with our intuitive editor to match your unique style.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="feature-title">Save Time</h3>
              <p className="feature-description">Create a professional resume in minutes, not hours. Export to PDF or share online.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="howItWorks" className="process-section animate-section">
        <div className="container">
          <div className={`section-header ${isVisible.howItWorks ? 'visible' : ''}`}>
            <h2 className="section-title">How It Works</h2>
            <p className="section-description">
              Create your perfect resume in three simple steps
            </p>
          </div>

          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">01</div>
              <h3 className="step-title">Select a Template</h3>
              <p className="step-description">Choose from our collection of professional templates designed for different industries and career levels.</p>
            </div>
            <div className="step-card">
              <div className="step-number">02</div>
              <h3 className="step-title">Fill in Your Details</h3>
              <p className="step-description">Our intuitive editor makes it easy to add your personal information, experience, skills, and more.</p>
            </div>
            <div className="step-card">
              <div className="step-number">03</div>
              <h3 className="step-title">Customize & Download</h3>
              <p className="step-description">Personalize fonts, colors, and layout, then download your resume in PDF format ready to send to employers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="cta-section animate-section">
        <div className="container">
          <div className={`cta-content ${isVisible.cta ? 'visible' : ''}`}>
            <h2 className="cta-title">Ready to land your dream job?</h2>
            <p className="cta-description">
              Join thousands of job seekers who have successfully created standout resumes with ResuMate
            </p>
            <Link to="/create" className="btn btn-cta">
              Create Your Resume Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
