// examples/ExperienceEditorWithAI.js
import React, { useState } from 'react';
import { improveWorkExperience } from '../services/aiService';

/**
 * Example component for editing work experience with AI assistance
 */
const ExperienceEditorWithAI = ({ initialExperiences = [], onSave }) => {
  const [experiences, setExperiences] = useState(initialExperiences);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Empty experience template
  const emptyExperience = {
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  };
  
  // Add a new empty experience
  const addExperience = () => {
    setExperiences([...experiences, { ...emptyExperience, id: Date.now() }]);
  };
  
  // Remove an experience
  const removeExperience = (index) => {
    const updatedExperiences = [...experiences];
    updatedExperiences.splice(index, 1);
    setExperiences(updatedExperiences);
  };
  
  // Handle experience field changes
  const handleExperienceChange = (index, field, value) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value
    };
    setExperiences(updatedExperiences);
  };
  
  // Handle current job checkbox
  const handleCurrentJobChange = (index, checked) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      current: checked,
      endDate: checked ? 'Present' : ''
    };
    setExperiences(updatedExperiences);
  };
  
  // Save all experiences
  const handleSave = () => {
    if (onSave) {
      onSave(experiences);
    }
  };
  
  // Use AI to improve all experience descriptions
  const handleAIImprove = async () => {
    if (experiences.length === 0) {
      setError('Please add at least one work experience to improve.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Only send non-empty experiences to AI
      const nonEmptyExperiences = experiences.filter(exp => exp.description && exp.title);
      
      if (nonEmptyExperiences.length === 0) {
        setError('Please add descriptions to your work experiences before improving them.');
        setLoading(false);
        return;
      }
      
      const improvedExperiences = await improveWorkExperience(nonEmptyExperiences);
      
      // Merge the improved experiences back with the original list
      const updatedExperiences = experiences.map(exp => {
        const improved = improvedExperiences.find(imp => 
          imp.title === exp.title && imp.company === exp.company
        );
        return improved || exp;
      });
      
      setExperiences(updatedExperiences);
    } catch (err) {
      setError('Failed to improve work experiences. Please try again.');
      console.error('Error improving work experiences:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="experience-editor">
      <div className="editor-header">
        <h2>Work Experience</h2>
        <button 
          className="ai-improve-button"
          onClick={handleAIImprove}
          disabled={loading}
        >
          {loading ? 'Improving...' : 'Improve with AI'}
        </button>
      </div>
      
      {error && (
        <div className="error-message">{error}</div>
      )}
      
      <div className="experiences-list">
        {experiences.map((experience, index) => (
          <div key={experience.id || index} className="experience-item">
            <div className="experience-header">
              <h3>Experience {index + 1}</h3>
              <button 
                className="remove-button"
                onClick={() => removeExperience(index)}
                type="button"
              >
                Remove
              </button>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor={`title-${index}`}>Job Title</label>
                <input
                  id={`title-${index}`}
                  type="text"
                  value={experience.title}
                  onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                  placeholder="e.g. Software Developer"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor={`company-${index}`}>Company</label>
                <input
                  id={`company-${index}`}
                  type="text"
                  value={experience.company}
                  onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                  placeholder="e.g. Acme Inc."
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor={`location-${index}`}>Location</label>
                <input
                  id={`location-${index}`}
                  type="text"
                  value={experience.location}
                  onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
                  placeholder="e.g. New York, NY"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor={`startDate-${index}`}>Start Date</label>
                <input
                  id={`startDate-${index}`}
                  type="text"
                  value={experience.startDate}
                  onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                  placeholder="e.g. May 2020"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor={`endDate-${index}`}>End Date</label>
                <input
                  id={`endDate-${index}`}
                  type="text"
                  value={experience.endDate}
                  onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                  placeholder="e.g. June 2023"
                  disabled={experience.current}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={experience.current}
                    onChange={(e) => handleCurrentJobChange(index, e.target.checked)}
                  />
                  I currently work here
                </label>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group full-width">
                <label htmlFor={`description-${index}`}>Description</label>
                <textarea
                  id={`description-${index}`}
                  value={experience.description}
                  onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                  placeholder="Describe your responsibilities and achievements..."
                  rows="4"
                ></textarea>
                <small className="helper-text">
                  Tip: Use bullet points and strong action verbs. Quantify achievements when possible.
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="editor-footer">
        <button 
          className="add-button"
          onClick={addExperience}
          type="button"
        >
          Add Another Experience
        </button>
        
        <button 
          className="save-button"
          onClick={handleSave}
          type="button"
        >
          Save All Experiences
        </button>
      </div>
      
      {/* AI improvement explanation */}
      <div className="ai-explanation">
        <h3>How AI Improvement Works</h3>
        <p>Clicking "Improve with AI" will:</p>
        <ul>
          <li>Transform generic descriptions into achievement-focused statements</li>
          <li>Add powerful action verbs to highlight your contributions</li>
          <li>Quantify your achievements where possible</li>
          <li>Optimize content for ATS systems</li>
          <li>Ensure consistent formatting and language</li>
        </ul>
        <p className="tip">For best results, add basic descriptions first, then let AI enhance them.</p>
      </div>
    </div>
  );
};

export default ExperienceEditorWithAI;