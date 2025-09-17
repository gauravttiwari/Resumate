import React from 'react';
import './styles/TemplateSelector.css';
import './styles/TemplatePreview.css';

const TemplateSelector = ({ selectedTemplate, onTemplateChange, resumeType, externalTemplates = [], onInspireFromTemplate = () => {}, onUseExternalTemplate = () => {}, onTemplatePreview = () => {} }) => {
  // All templates with their respective types
  const allTemplates = [
    {
      id: 'reverse-chrono',
      name: 'ResuMate Pro',
      description: 'Reverse-chronological format highlighting recent experience first. Highly ATS-friendly and preferred by MNCs.',
      types: ['technical', 'nontechnical'],
      // image: reverseChronoThumbnail
    },
    {
      id: 'modern-sidebar',
      name: 'Modern Sidebar',
      description: 'Two-column layout with a stylish sidebar. Perfect balance of visual appeal and ATS readability.',
      types: ['technical', 'nontechnical', 'diploma'],
      // image: modernSidebarThumbnail
    },
    {
      id: 'professional-clean',
      name: 'Professional Clean',
      description: 'Elegant, modern design with accent colors. Clean layout for corporate applications.',
      types: ['technical', 'nontechnical'],
      // image: professionalCleanThumbnail
    },
    {
      id: 'pro-profile',
      name: 'ProProfile',
      description: 'Elegant corporate resume with a dark sidebar showcasing skills and competencies. Perfect for senior roles and executives.',
      types: ['technical', 'nontechnical'],
      // image: proProfileThumbnail
    },
    {
      id: 'jobfit-pro',
      name: 'JobFit Pro',
      description: 'Sidebar Resume Layout with clear sections for skills and experience. Highly customizable and ATS-friendly.',
      types: ['technical', 'diploma', 'nontechnical'],
      // image: jobfitProThumbnail
    },
    {
      id: 'classic',
      name: 'Classic MNC',
      description: 'Traditional format with clear sections. Highly ATS-friendly.',
      types: ['nontechnical', 'technical'],
      // image: classicThumbnail
    },
    {
      id: 'modern',
      name: 'Modern Professional',
      description: 'Clean design with a touch of color. Good balance of style and ATS compatibility.',
      types: ['technical', 'nontechnical'],
      types: ['technical', 'nontechnical'],
      // image: modernThumbnail
    },
    {
      id: 'minimal',
      name: 'Minimalist',
      description: 'Streamlined and focused on content. Maximum ATS compatibility.',
      types: ['technical', 'nontechnical', 'diploma'],
      // image: minimalThumbnail
    },
    {
      id: 'smart-resume',
      name: 'SmartResume – Structured Minimalist Design',
      description: 'Structured minimalist layout inspired by a professional PDF design. Focus on clarity and hierarchy.',
      types: ['technical', 'nontechnical'],
    },
    {
      id: 'tech',
      name: 'Tech Specialist',
      description: 'Designed specifically for tech roles at companies like Google, Microsoft, and Amazon.',
      types: ['technical'],
      // image: techThumbnail
    },
    {
      id: 'medical-pro',
      name: 'Medical Professional',
      description: 'Specialized for medical professionals with sections for certifications, specialties, and clinical experience.',
      types: ['medical'],
      // image: medicalThumbnail
    },
    {
      id: 'healthcare',
      name: 'Healthcare Specialist',
      description: 'Tailored for healthcare roles with emphasis on patient care, medical procedures, and health institution experience.',
      types: ['medical'],
      // image: healthcareThumbnail
    },
    {
      id: 'diploma-focus',
      name: 'Diploma Focus',
      description: 'Highlights vocational training, certifications, and hands-on skills for diploma holders.',
      types: ['diploma'],
      // image: diplomaThumbnail
    }
  ];

  // Filter templates based on the selected resume type
  const filteredTemplates = resumeType 
    ? allTemplates.filter(template => template.types.includes(resumeType))
    : allTemplates;

  return (
    <div className="template-selector">
      <h2>Choose a Resume Template</h2>
      <p className="template-intro">
        Select one of our professionally designed templates optimized for {resumeType === 'medical' ? 'medical professionals' : 
          resumeType === 'technical' ? 'technical roles' : 
          resumeType === 'diploma' ? 'diploma holders' : 'professional'} job applications.
        All templates are ATS-friendly and formatted to highlight your skills and experience.
      </p>
      
      <div className="template-grid">
        {filteredTemplates.map((template) => {
          const previewUrl = template.image || template.previewUrl || null;
          return (
              <div
              key={template.id}
              className={`template-card ${selectedTemplate === template.id ? 'selected' : ''}`}
              onClick={() => onTemplateChange(template.id)}
            >
              <div className="template-preview">
                <div className="action-overlay">
                  <button title="Select" onClick={(e) => { e.stopPropagation(); onTemplateChange(template.id); }}>✨</button>
                  <button title="Preview" onClick={(e) => { e.stopPropagation(); onTemplatePreview(template.id); }}>�️</button>
                </div>
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={template.name}
                    className="template-image"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="template-placeholder" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', fontSize: '3rem'}}>📄</div>
                )}
                {/* SmartResume preview small thumbnail */}
                {template.id === 'smart-resume' && (
                  <div className="template-mini-preview">
                    <div style={{padding: '8px'}}>
                      <div style={{fontWeight: 700}}>John Doe</div>
                      <div style={{fontSize: 12, color: '#666'}}>Senior Software Engineer</div>
                    </div>
                  </div>
                )}
              </div>
              <div className="template-info">
                <h3>{template.name}</h3>
                <p>{template.description}</p>
                <div className="template-actions">
                  <button
                    className="btn-select-template"
                    onClick={(e) => { e.stopPropagation(); onTemplateChange(template.id); }}
                  >
                    ✨ Select Template
                  </button>
                  <button
                    className="btn-preview-template"
                    onClick={(e) => { e.stopPropagation(); onTemplatePreview(template.id); }}
                  >
                    👁️ Preview
                  </button>
                </div>
              </div>
              {selectedTemplate === template.id && (
                <div className="template-selected">
                  <span className="checkmark">✓</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* External templates (from Google / AI search) */}
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
                    <img
                      src={template.previewUrl}
                      alt={template.name}
                      className="template-image"
                      onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling && (e.target.nextSibling.style.display = 'flex'); }}
                    />
                  ) : null}
                  <div
                    className="template-placeholder"
                    style={{ display: template.previewUrl ? 'none' : 'flex', width: '100%', height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}
                  >
                    📄
                  </div>
                  <div className="external-badge">🌐 External</div>
                  <div className="external-license" style={{display: 'none'}}>Third-party template — check licensing on source</div>
                </div>
                <div className="template-info">
                  <h3>{template.name}</h3>
                  <p>{template.description}</p>
                  {template.copyright && <p className="copyright-notice">📄 {template.copyright}</p>}
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
          <li>
            <strong>ATS Optimization</strong>: Our templates are designed to pass through Applicant Tracking Systems used by major companies.
          </li>
          <li>
            <strong>Keyword Matching</strong>: Include relevant keywords from the job description in your resume.
          </li>
          <li>
            <strong>Quantifiable Achievements</strong>: Where possible, include metrics and numbers to demonstrate your impact.
          </li>
          <li>
            <strong>Clear Formatting</strong>: Avoid complex layouts, tables, or graphics that might confuse ATS systems.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TemplateSelector;
