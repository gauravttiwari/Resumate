// examples/TemplateSelectorWithAI.js
import React, { useState, useEffect } from 'react';
import TemplateRecommender from '../components/ai/TemplateRecommender';

/**
 * Example implementation showing how to integrate AI template recommendation into a Template Selection page
 */
const TemplateSelectorWithAI = ({ resumeData, jobType, onSelectTemplate, onContinue }) => {
  // State for templates
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showAIRecommendations, setShowAIRecommendations] = useState(true);
  
  // Simulate loading templates
  useEffect(() => {
    // This would typically come from an API or context
    const availableTemplates = [
      {
        id: 'modern-pro',
        name: 'Modern Professional',
        type: 'tech',
        description: 'Clean, professional template with modern design elements. Ideal for tech roles.',
        imageUrl: '/images/templates/modern-pro.jpg',
      },
      {
        id: 'classic-minimal',
        name: 'Classic Minimal',
        type: 'tech',
        description: 'Traditional layout with minimal design. Perfect for conservative industries.',
        imageUrl: '/images/templates/classic-minimal.jpg',
      },
      {
        id: 'creative-sidebar',
        name: 'Creative Sidebar',
        type: 'non-tech',
        description: 'Bold, creative design with a colorful sidebar. Great for creative fields.',
        imageUrl: '/images/templates/creative-sidebar.jpg',
      },
      {
        id: 'medical-professional',
        name: 'Medical Professional',
        type: 'medical',
        description: 'Structured template optimized for medical professionals with credential highlights.',
        imageUrl: '/images/templates/medical-pro.jpg',
      },
      {
        id: 'academic-focus',
        name: 'Academic Focus',
        type: 'diploma',
        description: 'Academic-focused design highlighting education and publications.',
        imageUrl: '/images/templates/academic.jpg',
      }
    ];
    
    setTemplates(availableTemplates);
    
    // Filter templates based on job type
    if (jobType) {
      setFilteredTemplates(availableTemplates.filter(template => template.type === jobType));
    } else {
      setFilteredTemplates(availableTemplates);
    }
  }, [jobType]);

  // Handle template selection
  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    if (onSelectTemplate) {
      onSelectTemplate(template);
    }
  };

  // Handle continue button click
  const handleContinue = () => {
    if (!selectedTemplate) {
      alert('Please select a template to continue');
      return;
    }
    
    if (onContinue) {
      onContinue(selectedTemplate);
    }
  };

  // Toggle AI recommendations
  const toggleAIRecommendations = () => {
    setShowAIRecommendations(prev => !prev);
  };

  return (
    <div className="template-selector-page">
      <div className="container">
        <header>
          <h1>Choose Your Resume Template</h1>
          <p>Select a template that best showcases your professional profile</p>
          
          <div className="ai-toggle">
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={showAIRecommendations} 
                onChange={toggleAIRecommendations}
              />
              <span className="toggle-slider"></span>
            </label>
            <span className="toggle-label">Show AI Recommendations</span>
          </div>
        </header>
        
        <div className="template-selection-container">
          {/* AI Recommendations Section */}
          {showAIRecommendations && resumeData && jobType && (
            <div className="ai-recommendations-section">
              <TemplateRecommender
                resumeData={resumeData}
                jobType={jobType}
                availableTemplates={templates}
                onSelectTemplate={handleSelectTemplate}
              />
            </div>
          )}
          
          {/* Manual Template Selection */}
          <div className="templates-grid">
            <h2>Available Templates {jobType ? `for ${jobType.charAt(0).toUpperCase() + jobType.slice(1)}` : ''}</h2>
            
            <div className="templates-list">
              {filteredTemplates.map(template => (
                <div 
                  key={template.id}
                  className={`template-card ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
                  onClick={() => handleSelectTemplate(template)}
                >
                  <div className="template-image">
                    <img 
                      src={template.imageUrl || 'https://via.placeholder.com/150x200?text=Template'} 
                      alt={template.name} 
                    />
                  </div>
                  <div className="template-info">
                    <h3>{template.name}</h3>
                    <p className="template-description">{template.description}</p>
                    <span className="template-type">{template.type.charAt(0).toUpperCase() + template.type.slice(1)}</span>
                  </div>
                  <button 
                    className={`select-button ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
                  >
                    {selectedTemplate?.id === template.id ? 'Selected' : 'Select Template'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="action-buttons">
          <button className="back-button">Back</button>
          <button 
            className={`continue-button ${!selectedTemplate ? 'disabled' : ''}`}
            onClick={handleContinue}
            disabled={!selectedTemplate}
          >
            Continue with {selectedTemplate ? selectedTemplate.name : 'Selected Template'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelectorWithAI;