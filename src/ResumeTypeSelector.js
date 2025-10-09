import React from 'react';
import './styles/ResumeTypeSelector.css';

const resumeTypes = [
  {
    id: 'technical',
    title: 'Technical Resume',
    icon: '💻',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    description: 'For software developers, IT professionals, engineers, and other technical roles.',
    features: ['ATS Optimized', 'Skills Focused', 'Project Showcase']
  },
  {
    id: 'medical',
    title: 'Medical Resume',
    icon: '🩺',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    description: 'For doctors, nurses, medical technicians, and healthcare professionals.',
    features: ['Clinical Experience', 'Certifications', 'Professional Focus']
  },
  {
    id: 'diploma',
    title: 'Diploma/Certificate Resume',
    icon: '🎓',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    description: 'For diploma holders, technicians, and vocational training graduates.',
    features: ['Training Focused', 'Skill Certificates', 'Practical Experience']
  },
  {
    id: 'nontechnical',
    title: 'Professional Resume',
    icon: '�',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    description: 'For business, marketing, sales, customer service, and other professional roles.',
    features: ['Experience Driven', 'Achievement Focus', 'Leadership Skills']
  }
];

const ResumeTypeSelector = ({ onSelect }) => {
  return (
    <div className="resume-type-selector">
      <div className="selector-header">
        <h1 className="selector-title">
          <span className="title-icon">🎯</span>
          <span className="title-line">Choose a <span className="title-gradient">Professional</span> Resume</span>
        </h1>
        <p className="selector-description">
          Select the perfect template type that matches your career profile and industry for maximum impact
        </p>
      </div>
      
      <div className="resume-types-grid">
        {resumeTypes.map(type => (
          <div 
            key={type.id} 
            className="resume-type-card" 
            onClick={() => onSelect(type.id)}
            style={{'--card-gradient': type.gradient}}
          >
            <div className="card-header">
              <div className="type-icon-wrapper">
                <span className="type-icon">{type.icon}</span>
              </div>
              <div className="card-gradient-bg"></div>
            </div>
            
            <div className="card-content">
              <h3 className="card-title">{type.title}</h3>
              <p className="card-description">{type.description}</p>
              
              <ul className="card-features">
                {type.features.map((feature, index) => (
                  <li key={index} className="feature-item">
                    <span className="feature-check">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="card-footer">
              <button className="select-type-btn">
                <span>Choose This Type</span>
                <span className="btn-arrow">→</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumeTypeSelector;
