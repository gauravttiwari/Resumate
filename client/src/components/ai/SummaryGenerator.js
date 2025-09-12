// components/ai/SummaryGenerator.js
import React, { useState } from 'react';
import { generateSummary } from '../../services/aiService';

/**
 * Component for generating professional summaries with AI
 */
const SummaryGenerator = ({ resumeData, onSummaryGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedSummary, setGeneratedSummary] = useState('');

  const handleGenerateSummary = async () => {
    if (!resumeData) {
      setError('Resume data is required to generate a summary');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const summary = await generateSummary(resumeData);
      setGeneratedSummary(summary);
    } catch (err) {
      setError('Failed to generate summary. Please try again.');
      console.error('Error generating summary:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (onSummaryGenerated && generatedSummary) {
      onSummaryGenerated(generatedSummary);
    }
  };

  const handleEdit = () => {
    // Allow the user to edit before applying
    // This keeps the current summary in the editing state
  };

  if (loading) {
    return (
      <div className="summary-generator loading">
        <div className="generator-header">
          <h3>Generating Professional Summary...</h3>
        </div>
        <div className="generator-body">
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Our AI is crafting a professional summary based on your profile. This may take a moment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="summary-generator error">
        <div className="generator-header">
          <h3>Generation Error</h3>
        </div>
        <div className="generator-body">
          <p className="error-message">{error}</p>
          <button className="retry-button" onClick={handleGenerateSummary}>
            Retry Generation
          </button>
        </div>
      </div>
    );
  }

  if (!generatedSummary) {
    return (
      <div className="summary-generator">
        <div className="generator-header">
          <h3>AI Summary Generator</h3>
        </div>
        <div className="generator-body">
          <p>Let our AI create a professional, compelling summary that highlights your skills and experience.</p>
          <button className="generate-button" onClick={handleGenerateSummary}>
            Generate Professional Summary
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="summary-generator">
      <div className="generator-header">
        <h3>AI-Generated Professional Summary</h3>
      </div>
      
      <div className="generator-body">
        <div className="summary-preview">
          <p className="summary-text">{generatedSummary}</p>
        </div>
        
        <div className="action-buttons">
          <button className="edit-button" onClick={handleEdit}>
            Edit Summary
          </button>
          <button className="apply-button" onClick={handleApply}>
            Apply Summary
          </button>
          <button className="regenerate-button" onClick={handleGenerateSummary}>
            Regenerate
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryGenerator;