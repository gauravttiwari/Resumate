// components/ai/TemplateRecommender.js
import React, { useState, useEffect } from 'react';
import { recommendTemplate } from '../../services/aiService';

/**
 * Component for recommending resume templates based on job type and resume data
 */
const TemplateRecommender = ({ resumeData, jobType, onSelectTemplate, availableTemplates }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    if (resumeData && jobType && availableTemplates?.length > 0) {
      handleGetRecommendation();
    }
  }, [resumeData, jobType]);

  const handleGetRecommendation = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const templateRecommendation = await recommendTemplate(resumeData, jobType);
      setRecommendation(templateRecommendation);
    } catch (err) {
      setError('Failed to get template recommendations. Please try again.');
      console.error('Error getting template recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTemplate = (templateName) => {
    // Find the template in available templates
    const template = availableTemplates.find(t => t.name === templateName || t.id === templateName);
    if (template && onSelectTemplate) {
      onSelectTemplate(template);
    }
  };

  if (loading) {
    return (
      <div className="template-recommender loading">
        <div className="recommender-header">
          <h3>Finding the Best Template...</h3>
        </div>
        <div className="recommender-body">
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Our AI is analyzing your profile to recommend the best template. This may take a moment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="template-recommender error">
        <div className="recommender-header">
          <h3>Recommendation Error</h3>
        </div>
        <div className="recommender-body">
          <p className="error-message">{error}</p>
          <button className="retry-button" onClick={handleGetRecommendation}>
            Retry Recommendation
          </button>
        </div>
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="template-recommender">
        <div className="recommender-header">
          <h3>AI Template Recommender</h3>
        </div>
        <div className="recommender-body">
          <p>Let our AI recommend the best template for your {jobType} resume.</p>
          <button className="recommend-button" onClick={handleGetRecommendation}>
            Get Recommendation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="template-recommender">
      <div className="recommender-header">
        <h3>AI Template Recommendation</h3>
        <div className="recommendation-badge">
          <span>Best Match</span>
        </div>
      </div>
      
      <div className="recommender-body">
        <div className="primary-recommendation">
          <h4>Recommended Template: {recommendation.recommendedTemplate}</h4>
          <p className="recommendation-reasoning">{recommendation.reasoning}</p>
          <button className="select-template" onClick={() => handleSelectTemplate(recommendation.recommendedTemplate)}>
            Use This Template
          </button>
        </div>
        
        <div className="alternative-recommendations">
          <h4>Alternative Options</h4>
          <div className="alternatives-list">
            {recommendation.alternativeOptions.map((template, index) => (
              <div className="alternative-item" key={index}>
                <span className="alternative-name">{template}</span>
                <button 
                  className="select-alternative"
                  onClick={() => handleSelectTemplate(template)}
                >
                  Select
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateRecommender;