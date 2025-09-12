// components/ai/ResumeOptimizer.js
import React, { useState } from 'react';
import { optimizeResume } from '../../services/aiService';

/**
 * Component for optimizing resumes with AI suggestions
 */
const ResumeOptimizer = ({ resumeData, targetJobTitle, onApplySuggestions }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [selectedSuggestions, setSelectedSuggestions] = useState({});

  const handleOptimize = async () => {
    if (!resumeData || !targetJobTitle) {
      setError('Resume data and job title are required for optimization');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const optimizationData = await optimizeResume(resumeData, targetJobTitle);
      setSuggestions(optimizationData);
      
      // Initialize selected suggestions (all selected by default)
      const initialSelections = {};
      if (optimizationData.suggestedKeywords) {
        optimizationData.suggestedKeywords.forEach(keyword => {
          initialSelections[`keyword_${keyword}`] = true;
        });
      }
      
      if (optimizationData.contentSuggestions) {
        Object.keys(optimizationData.contentSuggestions).forEach(field => {
          initialSelections[`content_${field}`] = true;
        });
      }
      
      if (optimizationData.skillsToAdd) {
        optimizationData.skillsToAdd.forEach(skill => {
          initialSelections[`skill_${skill}`] = true;
        });
      }
      
      setSelectedSuggestions(initialSelections);
    } catch (err) {
      setError('Failed to optimize resume. Please try again.');
      console.error('Error optimizing resume:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSuggestion = (key) => {
    setSelectedSuggestions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleApply = () => {
    // Prepare the selected suggestions to apply
    const appliedSuggestions = {
      keywords: suggestions.suggestedKeywords.filter((keyword) => 
        selectedSuggestions[`keyword_${keyword}`]
      ),
      contentImprovements: Object.entries(suggestions.contentSuggestions)
        .filter(([field]) => selectedSuggestions[`content_${field}`])
        .reduce((acc, [field, suggestion]) => {
          acc[field] = suggestion;
          return acc;
        }, {}),
      skills: suggestions.skillsToAdd.filter((skill) => 
        selectedSuggestions[`skill_${skill}`]
      )
    };

    // Call the parent component's handler with the selected suggestions
    onApplySuggestions(appliedSuggestions);
  };

  if (loading) {
    return (
      <div className="resume-optimizer loading">
        <div className="optimizer-header">
          <h3>Optimizing Your Resume...</h3>
        </div>
        <div className="optimizer-body">
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Our AI is analyzing your resume and generating optimization suggestions. This may take a moment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="resume-optimizer error">
        <div className="optimizer-header">
          <h3>Optimization Error</h3>
        </div>
        <div className="optimizer-body">
          <p className="error-message">{error}</p>
          <button className="retry-button" onClick={handleOptimize}>
            Retry Optimization
          </button>
        </div>
      </div>
    );
  }

  if (!suggestions) {
    return (
      <div className="resume-optimizer">
        <div className="optimizer-header">
          <h3>AI Resume Optimizer</h3>
        </div>
        <div className="optimizer-body">
          <p>Let our AI analyze your resume and suggest improvements to make it more effective and ATS-friendly for your target job.</p>
          <button className="optimize-button" onClick={handleOptimize}>
            Optimize Resume
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="resume-optimizer">
      <div className="optimizer-header">
        <h3>AI Resume Optimization Suggestions</h3>
        <div className="optimization-score">
          <span>Current ATS Optimization Score:</span>
          <div className="score-indicator">
            <div 
              className="score-value" 
              style={{ 
                color: suggestions.optimizationScore >= 80 ? '#4CAF50' : 
                       suggestions.optimizationScore >= 60 ? '#FF9800' : '#F44336'
              }}
            >
              {suggestions.optimizationScore}%
            </div>
          </div>
        </div>
      </div>
      
      <div className="optimizer-body">
        <div className="suggestion-section">
          <h4>Keywords to Add</h4>
          <p className="section-description">Adding these keywords can improve your resume's visibility in ATS systems.</p>
          <div className="suggestions-list">
            {suggestions.suggestedKeywords.map((keyword) => (
              <div className="suggestion-item" key={`keyword_${keyword}`}>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={!!selectedSuggestions[`keyword_${keyword}`]}
                    onChange={() => toggleSuggestion(`keyword_${keyword}`)}
                  />
                  <span className="keyword-suggestion">{keyword}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="suggestion-section">
          <h4>Content Improvements</h4>
          <p className="section-description">These suggestions can improve how your resume content is presented.</p>
          <div className="suggestions-list">
            {Object.entries(suggestions.contentSuggestions).map(([field, suggestion]) => (
              <div className="suggestion-item content-suggestion" key={`content_${field}`}>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={!!selectedSuggestions[`content_${field}`]}
                    onChange={() => toggleSuggestion(`content_${field}`)}
                  />
                  <div>
                    <span className="field-name">{field.charAt(0).toUpperCase() + field.slice(1)}</span>
                    <p className="suggestion-text">{suggestion}</p>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="suggestion-section">
          <h4>Skills to Highlight</h4>
          <p className="section-description">These skills are relevant for your target position and should be highlighted.</p>
          <div className="suggestions-list skills-list">
            {suggestions.skillsToAdd.map((skill) => (
              <div className="suggestion-item" key={`skill_${skill}`}>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={!!selectedSuggestions[`skill_${skill}`]}
                    onChange={() => toggleSuggestion(`skill_${skill}`)}
                  />
                  <span className="skill-suggestion">{skill}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="improvement-areas">
          <h4>Areas to Improve</h4>
          <ul className="areas-list">
            {suggestions.improvementAreas.map((area, index) => (
              <li key={index}>{area}</li>
            ))}
          </ul>
        </div>
        
        <div className="action-buttons">
          <button className="apply-button" onClick={handleApply}>
            Apply Selected Suggestions
          </button>
          <button className="cancel-button" onClick={() => setSuggestions(null)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeOptimizer;