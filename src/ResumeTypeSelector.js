import React from 'react';
import './styles/ResumeTypeSelector.css';

const resumeTypes = [
  {
    id: 'technical',
    title: 'Technical Resume',
    icon: '💻',
    description: 'For software developers, IT professionals, engineers, and other technical roles.'
  },
  {
    id: 'medical',
    title: 'Medical Resume',
    icon: '🩺',
    description: 'For doctors, nurses, medical technicians, and healthcare professionals.'
  },
  {
    id: 'diploma',
    title: 'Diploma/Certificate Resume',
    icon: '🎓',
    description: 'For diploma holders, technicians, and vocational training graduates.'
  },
  {
    id: 'nontechnical',
    title: 'Non-Technical Resume',
    icon: '📝',
    description: 'For business, marketing, sales, customer service, and other non-technical roles.'
  }
];

const ResumeTypeSelector = ({ onSelect }) => {
  return (
    <div className="resume-type-selector">
      <h2>Select Your Resume Type</h2>
      <p className="selector-description">
        Choose the type of resume that best matches your career profile to get a tailored resume format.
      </p>
      
      <div className="resume-types-grid">
        {resumeTypes.map(type => (
          <div 
            key={type.id} 
            className="resume-type-card" 
            onClick={() => onSelect(type.id)}
          >
            <div className="type-icon">{type.icon}</div>
            <h3>{type.title}</h3>
            <p>{type.description}</p>
            <button className="select-type-btn">Select</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumeTypeSelector;
