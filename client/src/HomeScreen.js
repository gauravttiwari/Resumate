import React from 'react';

const HomeScreen = ({ onStartClick }) => {
  return (
    <div className="home-screen">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Build Your Professional Resume in 
              <span className="text-primary"> Minutes</span>
            </h1>
            <p className="hero-subtitle">
              Create ATS-friendly resumes that get you noticed by top companies like Google, Microsoft, 
              Amazon and more. Choose from professional templates designed by experts.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={onStartClick}>
                <span>🚀 Start Building Resume</span>
              </button>
              <button className="btn btn-secondary btn-lg">
                <span>📋 View Templates</span>
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Resumes Created</span>
              </div>
              <div className="stat">
                <span className="stat-number">95%</span>
                <span className="stat-label">Success Rate</span>
              </div>
              <div className="stat">
                <span className="stat-number">24/7</span>
                <span className="stat-label">AI Support</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="resume-preview-mockup">
              <div className="mockup-browser">
                <div className="browser-header">
                  <div className="browser-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div className="browser-content">
                  <div className="resume-mockup">
                    <div className="resume-header">
                      <div className="profile-circle"></div>
                      <div className="header-lines">
                        <div className="line long"></div>
                        <div className="line medium"></div>
                      </div>
                    </div>
                    <div className="resume-body">
                      <div className="section">
                        <div className="line short"></div>
                        <div className="line long"></div>
                        <div className="line medium"></div>
                      </div>
                      <div className="section">
                        <div className="line short"></div>
                        <div className="line long"></div>
                        <div className="line medium"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose ResuMate?</h2>
            <p className="section-subtitle">
              Everything you need to create a standout resume that gets results
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3 className="feature-title">ATS Optimized</h3>
              <p className="feature-description">
                Our templates are designed to pass Applicant Tracking Systems used by top companies
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3 className="feature-title">AI-Powered</h3>
              <p className="feature-description">
                Get intelligent suggestions and content optimization powered by advanced AI
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3 className="feature-title">Mobile Friendly</h3>
              <p className="feature-description">
                Create and edit your resume on any device with our responsive design
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Lightning Fast</h3>
              <p className="feature-description">
                Build professional resumes in minutes, not hours. Get hired faster
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3 className="feature-title">Beautiful Templates</h3>
              <p className="feature-description">
                Choose from professionally designed templates that make you stand out
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💼</div>
              <h3 className="feature-title">Industry Specific</h3>
              <p className="feature-description">
                Templates tailored for different industries and career levels
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Success Stories</h2>
            <p className="section-subtitle">
              Join thousands who landed their dream jobs with ResuMate
            </p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"ResuMate helped me land my dream job at Google! The ATS optimization really works."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">👨‍💻</div>
                <div className="author-info">
                  <span className="author-name">Rahul Sharma</span>
                  <span className="author-role">Software Engineer at Google</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"The AI suggestions were spot-on. Got 3 interview calls within a week of applying!"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">👩‍💼</div>
                <div className="author-info">
                  <span className="author-name">Priya Patel</span>
                  <span className="author-role">Product Manager at Microsoft</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Beautiful templates and so easy to use. Highly recommend for job seekers!"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">👨‍🎓</div>
                <div className="author-info">
                  <span className="author-name">Amit Kumar</span>
                  <span className="author-role">Data Scientist at Amazon</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Land Your Dream Job?</h2>
            <p className="cta-subtitle">
              Join thousands of professionals who've accelerated their careers with ResuMate
            </p>
            <button className="btn btn-primary btn-lg" onClick={onStartClick}>
              <span>🎯 Create Your Resume Now</span>
            </button>
            <div className="cta-features">
              <span>✅ No Credit Card Required</span>
              <span>✅ Free Templates</span>
              <span>✅ Instant Download</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;
