import React from 'react';
import html2canvas from 'html2canvas';
import './styles/TemplateSelector.css';
import './styles/TemplatePreview.css';
import ResumePreview from './ResumePreview';
import ReverseChronoResume from './ReverseChronoResume';
import ModernSidebarResume from './ModernSidebarResume';
import ProfessionalCleanResume from './ProfessionalCleanResume';
import JobFitProResume from './JobFitProResume';
import ProProfileResume from './ProProfileResume';
import MncResume from './MncResume';
import SmartResume from './SmartResume';

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

  // Small sample data used to render mini previews inside template cards
  const sampleData = {
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 234 567 890',
    summary: 'Experienced developer with expertise in React, Node.js and cloud platforms.',
    skills: 'JavaScript, React, Node.js, AWS',
    experience: [
      { role: 'Software Developer', company: 'Tech Company', duration: '2020-2023', description: 'Built web applications using React and Node.js' }
    ],
    projects: [ { title: 'E-commerce Website', description: 'Built a full-stack e-commerce platform using React, Node.js, and MongoDB' } ],
    education: [ { degree: 'B.Sc Computer Science', institution: 'ABC University', year: '2020' } ]
  };

  // Refs to each mini ResumePreview so we can compute a fitting scale
  const previewRefs = React.useRef({});

  // Helper: render the actual template component for a given template id
  const renderTemplateComponent = (templateId, props = {}) => {
    const common = { data: props.data || sampleData, ref: props.ref };
    switch (templateId) {
      case 'reverse-chrono':
        return <ReverseChronoResume {...common} />;
      case 'modern-sidebar':
        return <ModernSidebarResume {...common} />;
      case 'professional-clean':
        return <ProfessionalCleanResume {...common} />;
      case 'jobfit-pro':
        return <JobFitProResume {...common} />;
      case 'pro-profile':
        return <ProProfileResume {...common} />;
      case 'classic':
      case 'mnc':
        return <MncResume {...common} />;
      case 'smart-resume':
      case 'modern':
      case 'minimal':
      case 'tech':
      case 'medical-pro':
      case 'healthcare':
      case 'diploma-focus':
        // Many templates may share the generic renderer or SmartResume
        return <SmartResume {...common} />;
      default:
        return <ResumePreview data={props.data || sampleData} template={templateId} ref={props.ref} />;
    }
  };

  // Offscreen refs and snapshots (data URLs) for pixel-accurate card previews
  const offscreenRefs = React.useRef({});
  const [snapshots, setSnapshots] = React.useState({});

  // Capture snapshots of each template's full preview to show exact match in cards
  React.useEffect(() => {
    let cancelled = false;

    const capture = async (id) => {
      const el = offscreenRefs.current[id];
      if (!el) return;
      try {
        // small delay to ensure styles/fonts are applied
        await new Promise((r) => setTimeout(r, 80));
        // capture with white background to emulate paper
        const canvas = await html2canvas(el, { scale: 2, backgroundColor: '#ffffff' });
        if (cancelled) return;
        const dataUrl = canvas.toDataURL('image/png');
        setSnapshots((s) => (s[id] ? s : { ...s, [id]: dataUrl }));
      } catch (err) {
        // swallow errors — fallback will be the live mini preview
      }
    };

    // trigger captures for templates that don't have snapshots yet
    filteredTemplates.forEach((t) => {
      if (!snapshots[t.id]) capture(t.id);
    });

    return () => { cancelled = true; };
  }, [filteredTemplates, snapshots]);

  React.useEffect(() => {
    // compute scale for each rendered mini preview so the full resume fits the card
    const computeScales = () => {
      Object.keys(previewRefs.current).forEach((id) => {
        const resumeEl = previewRefs.current[id];
        if (!resumeEl) return;
        const container = resumeEl.closest('.mini-preview-inner');
        if (!container) return;
        // prefer the element's natural width (templates use ~800px) fallback
        const naturalWidth = resumeEl.offsetWidth || 800;
        const containerWidth = container.clientWidth;
        // leave some padding inside card
        const padding = 16;
        const available = Math.max(40, containerWidth - padding);
        const scale = Math.min(1, available / naturalWidth);
        resumeEl.style.transformOrigin = 'top left';
        resumeEl.style.transform = `scale(${scale})`;
        resumeEl.style.pointerEvents = 'none';
        // ensure the container height clips the scaled resume correctly
        const naturalHeight = resumeEl.offsetHeight || 1100;
        const scaledHeight = Math.ceil(naturalHeight * scale);
        container.style.height = `${scaledHeight}px`;
      });
    };

    // run once and on resize
    computeScales();
    window.addEventListener('resize', computeScales);
    return () => window.removeEventListener('resize', computeScales);
  }, [filteredTemplates]);

  return (
    <div className="template-selector">
        <div className="template-hero">
          <h1 className="hero-title">Resume templates</h1>
          <p className="hero-subtitle">Each resume template is designed to follow the exact rules you need to get hired faster. Use our resume templates and get free access to 18 more career tools!</p>
          <div className="hero-cta-wrap">
            <button className="hero-cta" onClick={() => { if (onTemplateSelect) onTemplateSelect('reverse-chrono', localType); else if (onTemplateChange) onTemplateChange('reverse-chrono'); }}>Create my resume</button>
          </div>
        </div>

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
            <div className="mini-preview-wrap">
              <div className="mini-preview-inner" aria-hidden>
                {/* If we have a pixel snapshot, show the image; otherwise render the live scaled preview */}
                {snapshots[template.id] ? (
                  <img src={snapshots[template.id]} alt={`${template.name} snapshot`} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', background: '#fff' }} />
                ) : (
                  renderTemplateComponent(template.id, { data: sampleData, ref: (el) => { if (el) previewRefs.current[template.id] = el; else delete previewRefs.current[template.id]; } })
                )}
                {/* hidden offscreen full-size preview used to capture accurate snapshots */}
                <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', width: 800, height: 1100, overflow: 'hidden' }} aria-hidden>
                  <div ref={(el) => { if (el) offscreenRefs.current[template.id] = el; }}>
                    {renderTemplateComponent(template.id, { data: sampleData })}
                  </div>
                </div>
              </div>

              {/* small circular action in the top-right of preview like image */}
              <button className="preview-action" title="Preview sample" onClick={(e) => { e.stopPropagation(); if (onTemplatePreview) onTemplatePreview(template); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0ea5a4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>

              <div className="card-actions">
                <button className="btn btn-select-template" onClick={(e) => { e.stopPropagation(); if (onTemplateSelect) onTemplateSelect(template.id, localType); else if (onTemplateChange) onTemplateChange(template.id); }}>Use</button>
                <button className="btn btn-preview-template" onClick={(e) => { e.stopPropagation(); if (onTemplatePreview) onTemplatePreview(template); }}>Preview</button>
              </div>
            </div>

            <div className="template-info template-card-labels">
              <h3 className="label-title">{template.name}</h3>
              <p className="label-sub">Resume Template</p>
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
