import React from 'react';
import './styles/TemplateSelector.css';
import './styles/TemplatePreview.css';

const TemplateSelector = ({ selectedTemplate, onTemplateChange, onTemplateSelect, onResumeTypeChange, resumeType, onTemplatePreview = () => {}, externalTemplates = [], onInspireFromTemplate = () => {}, onUseExternalTemplate = () => {} }) => {
  // All templates with their allowed resume types
  const allTemplates = [
    { id: 'reverse-chrono', name: 'ResuMate Pro', description: 'Reverse-chronological format highlighting recent experience first. Highly ATS-friendly and preferred by MNCs.', types: ['technical', 'nontechnical'] },
    { id: 'modern-sidebar', name: 'Modern Sidebar', description: 'Two-column layout with a stylish sidebar. Perfect balance of visual appeal and ATS readability.', types: ['technical', 'nontechnical', 'diploma'] },
    { id: 'professional-clean', name: 'Professional Clean', description: 'Elegant, modern design with accent colors. Clean layout for corporate applications.', types: ['technical', 'nontechnical'] },
    { id: 'pro-profile', name: 'ProProfile', description: 'Elegant corporate resume with a dark sidebar showcasing skills and competencies. Perfect for senior roles and executives.', types: ['technical', 'nontechnical'] },
    { id: 'jobfit-pro', name: 'JobFit Pro', description: 'Sidebar Resume Layout with clear sections for skills and experience. Highly customizable and ATS-friendly.', types: ['technical', 'diploma', 'nontechnical'] },
    { id: 'classic', name: 'Classic MNC', description: 'Traditional format with clear sections. Highly ATS-friendly.', types: ['nontechnical', 'technical'] },
    { id: 'modern', name: 'Modern Professional', description: 'Clean design with a touch of color. Good balance of style and ATS compatibility.', types: ['technical', 'nontechnical'] },
    { id: 'minimal', name: 'Minimalist', description: 'Streamlined and focused on content. Maximum ATS compatibility.', types: ['technical', 'nontechnical', 'diploma'] },
    { id: 'smart-resume', name: 'SmartResume – Structured Minimalist Design', description: 'Structured minimalist layout inspired by a professional PDF design. Focus on clarity and hierarchy.', types: ['technical', 'nontechnical'] },
    { id: 'tech', name: 'Tech Specialist', description: 'Designed specifically for tech roles at companies like Google, Microsoft, and Amazon.', types: ['technical'] },
    { id: 'medical-pro', name: 'Medical Professional', description: 'Specialized for medical professionals with sections for certifications, specialties, and clinical experience.', types: ['medical'] },
    { id: 'healthcare', name: 'Healthcare Specialist', description: 'Tailored for healthcare roles with emphasis on patient care, medical procedures, and health institution experience.', types: ['medical'] },
    { id: 'diploma-focus', name: 'Diploma Focus', description: 'Highlights vocational training, certifications, and hands-on skills for diploma holders.', types: ['diploma'] }
  ];

  const [localType, setLocalType] = React.useState(resumeType || 'technical');

  React.useEffect(() => {
    // inform parent about initial type when component mounts
    if (onResumeTypeChange) onResumeTypeChange(localType);
  }, []);

  const handleTypeChange = (t) => {
    setLocalType(t);
    if (onResumeTypeChange) onResumeTypeChange(t);
  };

  const filteredTemplates = localType ? allTemplates.filter(template => template.types.includes(localType)) : allTemplates;

  return (
    <div className="template-selector">
      <h2>Choose a Resume Template</h2>
      <p className="template-intro">Select one of our professionally designed templates optimized for {localType === 'medical' ? 'medical professionals' : localType === 'technical' ? 'technical roles' : localType === 'diploma' ? 'diploma holders' : 'professional'} job applications.</p>

      <div className="template-type-select">
        <label>Resume type</label>
        <div className="type-options">
          <button type="button" className={`type-btn ${localType === 'technical' ? 'active' : ''}`} onClick={() => handleTypeChange('technical')}>Technical</button>
          <button type="button" className={`type-btn ${localType === 'nontechnical' ? 'active' : ''}`} onClick={() => handleTypeChange('nontechnical')}>Non-Technical</button>
          <button type="button" className={`type-btn ${localType === 'diploma' ? 'active' : ''}`} onClick={() => handleTypeChange('diploma')}>Diploma</button>
          <button type="button" className={`type-btn ${localType === 'medical' ? 'active' : ''}`} onClick={() => handleTypeChange('medical')}>Medical</button>
        </div>
      </div>

      <div className="template-grid">
        {filteredTemplates.map((template) => (
          <div key={template.id} className={`template-card ${selectedTemplate === template.id ? 'selected' : ''}`} onClick={() => { if (onTemplateSelect) onTemplateSelect(template.id, localType); else if (onTemplateChange) onTemplateChange(template.id); }}>
            <div className="template-preview"><div className="template-placeholder" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', fontSize: '3rem'}}>📄</div></div>
            <div className="template-info">
              <h3>{template.name}</h3>
              <p>{template.description}</p>
              <div className="template-actions">
                <button className="btn-select-template" onClick={(e) => { e.stopPropagation(); if (onTemplateSelect) onTemplateSelect(template.id, localType); else if (onTemplateChange) onTemplateChange(template.id); }}>Use</button>
                <button className="btn-preview-template" onClick={(e) => { e.stopPropagation(); if (onTemplatePreview) onTemplatePreview(template); }}>Preview</button>
              </div>
            </div>
            {selectedTemplate === template.id && (<div className="template-selected"><span className="checkmark">✓</span></div>)}
          </div>
        ))}
      </div>

      {externalTemplates && externalTemplates.length > 0 && (
        <div className="external-templates-section">
          <h3>External Templates</h3>
          <div className="template-grid">
            {externalTemplates.map((template) => (
              <div key={template.id || template.sourceUrl} className="template-card external-template-card">
                <div className="template-preview">
                  <div className="action-overlay">
                    <button title="View Original" onClick={(e) => { e.stopPropagation(); window.open(template.sourceUrl, '_blank'); }}>🔗</button>
                    <button title="Get Inspired" onClick={(e) => { e.stopPropagation(); onInspireFromTemplate(template); }}>💡</button>
                    <button title="Use as Template" onClick={(e) => { e.stopPropagation(); onUseExternalTemplate(template); }}>✅</button>
                  </div>
                  {template.previewUrl ? (
                    <img src={template.previewUrl} alt={template.name} className="template-image" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling && (e.target.nextSibling.style.display = 'flex'); }} />
                  ) : null}
                  <div className="template-placeholder" style={{ display: template.previewUrl ? 'none' : 'flex', width: '100%', height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>📄</div>
                  <div className="external-badge">🌐 External</div>
                </div>
                <div className="template-info">
                  <h3>{template.name}</h3>
                  <p>{template.description}</p>
                </div>
                <div className="template-actions">
                  <button className="btn-visit-external" onClick={() => window.open(template.sourceUrl, '_blank')}>🔗 View Original</button>
                  <button className="btn-inspire-template" onClick={() => onInspireFromTemplate(template)}>💡 Get Inspired</button>
                  <button className="btn-use-external" onClick={() => onUseExternalTemplate(template)}>✅ Use as Template</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="template-selector-tips">
        <h4>Tips for MNC Applications</h4>
        <ul>
          <li><strong>ATS Optimization</strong>: Our templates are designed to pass through Applicant Tracking Systems used by major companies.</li>
          <li><strong>Keyword Matching</strong>: Include relevant keywords from the job description in your resume.</li>
          <li><strong>Quantifiable Achievements</strong>: Where possible, include metrics and numbers to demonstrate your impact.</li>
          <li><strong>Clear Formatting</strong>: Avoid complex layouts, tables, or graphics that might confuse ATS systems.</li>
        </ul>
      </div>
    </div>
  );
};

export default TemplateSelector;
