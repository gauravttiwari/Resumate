import React from 'react';
import './styles/ResumeTypeSelector.css'; // Reusing the same CSS file

const HomeScreen = ({ onStartClick }) => {
  return (
    <div className="home-button-container">
      <div className="welcome-message">
        <h1>Welcome to ResuMate</h1>
        <p>
          Create professional, ATS-friendly resumes for top companies like Google, Microsoft, 
          Amazon and more. Our intelligent templates are designed to help you land your dream job.
        </p>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2>🚀 Powerful Features to Boost Your Career</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI-Powered Writing</h3>
            <p>Gemini AI helps optimize your content, suggests keywords, and generates professional summaries for maximum impact.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Multiple Templates</h3>
            <p>Choose from 12+ professional templates including JobFit Pro, Modern Sidebar, ProProfile, and specialized medical/tech formats.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✅</div>
            <h3>ATS Optimization</h3>
            <p>All templates are ATS-friendly and tested with major MNC recruitment systems. Get real-time ATS compatibility scores.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Real-time Preview</h3>
            <p>See your changes instantly with live preview. Mobile-responsive design ensures perfect viewing on all devices.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📄</div>
            <h3>PDF Export</h3>
            <p>Generate high-quality PDF resumes with perfect formatting. No login required - instant download ready.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Smart Suggestions</h3>
            <p>AI recommends relevant skills, improves work descriptions, and suggests the best template based on your job type.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏢</div>
            <h3>MNC-Ready Formats</h3>
            <p>Templates optimized for applications to Google, Microsoft, Amazon, Apple, and other top tech companies.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔧</div>
            <h3>Easy Customization</h3>
            <p>Customize colors, layouts, and sections. Add profile pictures with image cropping. No technical skills required.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>AI Resume Helper</h3>
            <p>Interactive AI chat support to answer questions and provide guidance throughout your resume building process.</p>
          </div>
        </div>
      </div>

      <button className="create-resume-btn" onClick={onStartClick}>
        <span>Create Your Resume Here</span>
        <i className="fas fa-arrow-right"></i>
      </button>
    </div>
  );
};

export default HomeScreen;