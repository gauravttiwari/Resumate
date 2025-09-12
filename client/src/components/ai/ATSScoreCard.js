// components/ai/ATSScoreCard.js
import React, { useState, useEffect } from 'react';
import { getATSScore } from '../../services/aiService';

/**
 * Component to display ATS compatibility score and optimization suggestions
 */
const ATSScoreCard = ({ resumeData, targetJobTitle }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [atsData, setAtsData] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchATSScore = async () => {
      if (!resumeData || !targetJobTitle) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const scoreData = await getATSScore(resumeData, targetJobTitle);
        setAtsData(scoreData);
      } catch (err) {
        setError('Failed to get ATS score. Please try again.');
        console.error('Error fetching ATS score:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchATSScore();
  }, [resumeData, targetJobTitle]);

  if (loading) {
    return (
      <div className="ats-score-card loading">
        <div className="card-header">
          <h3>Analyzing Resume for ATS Compatibility...</h3>
        </div>
        <div className="card-body">
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Our AI is analyzing your resume for ATS compatibility. This may take a moment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ats-score-card error">
        <div className="card-header">
          <h3>ATS Analysis Error</h3>
        </div>
        <div className="card-body">
          <p className="error-message">{error}</p>
          <button className="retry-button" onClick={() => window.location.reload()}>
            Retry Analysis
          </button>
        </div>
      </div>
    );
  }

  if (!atsData) {
    return null;
  }

  const getScoreColor = (score) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FF9800';
    return '#F44336';
  };

  return (
    <div className="ats-score-card">
      <div className="card-header">
        <h3>ATS Compatibility Score</h3>
        <div 
          className="score-circle" 
          style={{ borderColor: getScoreColor(atsData.overallScore) }}
        >
          <span style={{ color: getScoreColor(atsData.overallScore) }}>
            {atsData.overallScore}%
          </span>
        </div>
      </div>
      
      <div className="card-body">
        <div className="section-scores">
          <h4>Section Performance</h4>
          {Object.entries(atsData.sectionScores).map(([section, score]) => (
            <div className="score-item" key={section}>
              <span className="section-name">{section.charAt(0).toUpperCase() + section.slice(1)}</span>
              <div className="score-bar-container">
                <div 
                  className="score-bar" 
                  style={{ 
                    width: `${score}%`,
                    backgroundColor: getScoreColor(score)
                  }}
                ></div>
                <span className="score-value">{score}%</span>
              </div>
            </div>
          ))}
        </div>

        <button 
          className="toggle-details"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Hide Details' : 'Show Improvement Suggestions'}
        </button>
        
        {expanded && (
          <div className="improvement-details">
            <div className="suggestions">
              <h4>Improvement Suggestions</h4>
              <ul>
                {atsData.improvementSuggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
            
            <div className="keyword-analysis">
              <h4>Keyword Analysis</h4>
              <div className="keyword-columns">
                <div className="keyword-column">
                  <h5>Present Keywords</h5>
                  <ul className="present-keywords">
                    {atsData.keywordAnalysis.present?.map((keyword, index) => (
                      <li key={index} className="keyword-present">{keyword}</li>
                    ))}
                  </ul>
                </div>
                <div className="keyword-column">
                  <h5>Missing Keywords</h5>
                  <ul className="missing-keywords">
                    {atsData.keywordAnalysis.missing?.map((keyword, index) => (
                      <li key={index} className="keyword-missing">{keyword}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            {atsData.formatIssues && atsData.formatIssues.length > 0 && (
              <div className="format-issues">
                <h4>Formatting Issues</h4>
                <ul>
                  {atsData.formatIssues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ATSScoreCard;