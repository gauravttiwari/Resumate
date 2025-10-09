import React, { useState, useEffect } from 'react';
import './ResumeAnalytics.css';

const ResumeAnalytics = ({ resumeData, atsAnalysis }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (resumeData && atsAnalysis) {
      generateAnalytics();
    }
  }, [resumeData, atsAnalysis]);

  const generateAnalytics = () => {
    setLoading(true);
    
    // Calculate comprehensive analytics
    const skillsCount = resumeData.skills ? resumeData.skills.split(',').length : 0;
    const experienceYears = calculateExperienceYears(resumeData.experience || []);
    const educationLevel = determineEducationLevel(resumeData.education || []);
    const keywordDensity = calculateKeywordDensity(resumeData);
    
    const analyticsData = {
      overallScore: atsAnalysis.atsScore?.totalScore || 75,
      breakdown: atsAnalysis.atsScore?.breakdown || {
        keywordMatch: 80,
        formatting: 95,
        contentQuality: 70,
        keywordPlacement: 85,
        industryAlignment: 78
      },
      metrics: {
        skillsCount,
        experienceYears,
        educationLevel,
        keywordDensity,
        sectionsCompleted: calculateSectionsCompleted(resumeData),
        recommendedImprovements: atsAnalysis.improvementSuggestions?.length || 3
      },
      trends: {
        scoreHistory: generateScoreHistory(),
        skillsProgress: generateSkillsProgress(skillsCount),
        industryBenchmark: 82
      },
      recommendations: generateTopRecommendations(atsAnalysis)
    };

    setAnalytics(analyticsData);
    setLoading(false);
  };

  const calculateExperienceYears = (experiences) => {
    if (!experiences.length) return 0;
    // Simple calculation - in real app, parse dates properly
    return experiences.length * 1.5; // Assume average 1.5 years per position
  };

  const determineEducationLevel = (education) => {
    if (!education.length) return 'None';
    const degrees = education.map(edu => edu.degree?.toLowerCase() || '');
    if (degrees.some(d => d.includes('phd') || d.includes('doctorate'))) return 'Doctorate';
    if (degrees.some(d => d.includes('master') || d.includes('mba'))) return 'Masters';
    if (degrees.some(d => d.includes('bachelor'))) return 'Bachelors';
    return 'Diploma/Certificate';
  };

  const calculateKeywordDensity = (data) => {
    const text = `${data.objective || ''} ${data.skills || ''} ${data.experience?.map(e => e.role + ' ' + e.description).join(' ') || ''}`;
    const words = text.split(' ').filter(w => w.length > 3);
    return Math.min(100, Math.round((words.length / 500) * 100)); // Optimal density
  };

  const calculateSectionsCompleted = (data) => {
    const sections = ['name', 'email', 'objective', 'skills', 'experience', 'education'];
    const completed = sections.filter(section => {
      if (section === 'experience') return data.experience?.length > 0;
      if (section === 'education') return data.education?.length > 0;
      return data[section] && data[section].trim();
    });
    return Math.round((completed.length / sections.length) * 100);
  };

  const generateScoreHistory = () => {
    // Simulate score history - in real app, store actual history
    return [
      { date: '2025-01-01', score: 65 },
      { date: '2025-02-01', score: 72 },
      { date: '2025-03-01', score: 75 },
      { date: '2025-04-01', score: 78 },
      { date: '2025-05-01', score: 82 }
    ];
  };

  const generateSkillsProgress = (currentCount) => {
    return {
      current: currentCount,
      recommended: Math.max(currentCount + 3, 10),
      industryAverage: 12
    };
  };

  const generateTopRecommendations = (analysis) => {
    return [
      { priority: 'high', action: 'Add 3-5 relevant technical skills', impact: '+8 points' },
      { priority: 'medium', action: 'Improve keyword placement in summary', impact: '+5 points' },
      { priority: 'medium', action: 'Quantify achievements with numbers', impact: '+6 points' },
      { priority: 'low', action: 'Add industry certifications', impact: '+3 points' }
    ];
  };

  const renderScoreGauge = (score, label, color = '#4CAF50') => (
    <div className="score-gauge">
      <div className="gauge-container">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="#e0e0e0"
            strokeWidth="10"
          />
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeDasharray={`${(score / 100) * 314} 314`}
            transform="rotate(-90 60 60)"
            className="score-arc"
          />
          <text x="60" y="65" textAnchor="middle" className="score-text">
            {score}%
          </text>
        </svg>
      </div>
      <div className="gauge-label">{label}</div>
    </div>
  );

  const renderProgressBar = (value, max, label, color = '#2196F3') => (
    <div className="progress-item">
      <div className="progress-header">
        <span className="progress-label">{label}</span>
        <span className="progress-value">{value}/{max}</span>
      </div>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${(value / max) * 100}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="analytics-loading">
        <div className="loading-spinner"></div>
        <p>Generating Analytics...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="analytics-error">
        <p>Unable to generate analytics. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="resume-analytics">
      <div className="analytics-header">
        <h2>📊 Resume Analytics Dashboard</h2>
        <p>Comprehensive analysis of your resume performance and optimization opportunities</p>
      </div>

      {/* Overall Score Section */}
      <div className="analytics-section">
        <h3>Overall ATS Score</h3>
        <div className="score-overview">
          {renderScoreGauge(analytics.overallScore, 'Overall Score', '#4CAF50')}
          <div className="score-breakdown">
            <h4>Score Breakdown</h4>
            {Object.entries(analytics.breakdown).map(([category, score]) => (
              <div key={category} className="breakdown-item">
                <span className="category-name">
                  {category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
                <div className="score-bar">
                  <div 
                    className="score-fill" 
                    style={{ width: `${score}%` }}
                  />
                  <span className="score-number">{score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="analytics-section">
        <h3>Key Metrics</h3>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon">🎯</div>
            <div className="metric-value">{analytics.metrics.skillsCount}</div>
            <div className="metric-label">Skills Listed</div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">💼</div>
            <div className="metric-value">{analytics.metrics.experienceYears}</div>
            <div className="metric-label">Years Experience</div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">🎓</div>
            <div className="metric-value">{analytics.metrics.educationLevel}</div>
            <div className="metric-label">Education Level</div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">📈</div>
            <div className="metric-value">{analytics.metrics.keywordDensity}%</div>
            <div className="metric-label">Keyword Density</div>
          </div>
        </div>
      </div>

      {/* Progress Tracking */}
      <div className="analytics-section">
        <h3>Progress Tracking</h3>
        <div className="progress-section">
          {renderProgressBar(
            analytics.metrics.sectionsCompleted, 
            100, 
            'Profile Completion', 
            '#4CAF50'
          )}
          {renderProgressBar(
            analytics.trends.skillsProgress.current, 
            analytics.trends.skillsProgress.recommended, 
            'Skills Development', 
            '#2196F3'
          )}
          {renderProgressBar(
            analytics.overallScore, 
            analytics.trends.industryBenchmark, 
            'Industry Benchmark', 
            '#FF9800'
          )}
        </div>
      </div>

      {/* Score History Chart */}
      <div className="analytics-section">
        <h3>Score History</h3>
        <div className="chart-container">
          <div className="score-trend">
            {analytics.trends.scoreHistory.map((point, index) => (
              <div key={index} className="trend-point">
                <div 
                  className="trend-bar" 
                  style={{ height: `${point.score}%` }}
                />
                <div className="trend-label">{new Date(point.date).toLocaleDateString()}</div>
                <div className="trend-value">{point.score}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Recommendations */}
      <div className="analytics-section">
        <h3>Top Recommendations</h3>
        <div className="recommendations-list">
          {analytics.recommendations.map((rec, index) => (
            <div key={index} className={`recommendation-item priority-${rec.priority}`}>
              <div className="recommendation-priority">
                <span className={`priority-badge ${rec.priority}`}>
                  {rec.priority.toUpperCase()}
                </span>
              </div>
              <div className="recommendation-content">
                <div className="recommendation-action">{rec.action}</div>
                <div className="recommendation-impact">Expected Impact: {rec.impact}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Industry Insights */}
      <div className="analytics-section">
        <h3>Industry Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <h4>🏆 Your Ranking</h4>
            <p>Top 25% of resumes in your field</p>
          </div>
          <div className="insight-card">
            <h4>📊 Industry Benchmark</h4>
            <p>Average ATS Score: {analytics.trends.industryBenchmark}%</p>
          </div>
          <div className="insight-card">
            <h4>🚀 Growth Potential</h4>
            <p>+{100 - analytics.overallScore} points possible</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalytics;