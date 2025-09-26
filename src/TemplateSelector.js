import React from 'react';
import './styles/TemplateSelector.css';
import './styles/TemplatePreview.css';

const TemplateSelector = ({ selectedTemplate, onTemplateChange, onTemplateSelect, onResumeTypeChange, resumeType, onTemplatePreview = () => {} }) => {
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

  const [localType, setLocalType] = React.useState(resumeType || 'technical');

  React.useEffect(() => {
    // inform parent of initial type
    if (onResumeTypeChange) onResumeTypeChange(localType);
  }, []);

  const handleTypeChange = (t) => {
    setLocalType(t);
    if (onResumeTypeChange) onResumeTypeChange(t);
  };

  return (
    <div className="template-selector">
      <h2>Choose a Resume Template</h2>
      <p className="template-intro">
        Select one of our professionally designed templates optimized for {resumeType === 'medical' ? 'medical professionals' : 
          resumeType === 'technical' ? 'technical roles' : 
          resumeType === 'diploma' ? 'diploma holders' : 'professional'} job applications.
        All templates are ATS-friendly and formatted to highlight your skills and experience.
      </p>
      
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
          <div
            key={template.id}
            className={`template-card ${selectedTemplate === template.id ? 'selected' : ''}`}
            onClick={() => {
              // prefer onTemplateSelect which includes type, fallback to onTemplateChange
              if (onTemplateSelect) onTemplateSelect(template.id, localType);
              else onTemplateChange && onTemplateChange(template.id);
            }}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onTemplateChange(template.id); } }}
          >
            <div className="template-preview" onClick={() => onTemplateChange(template.id)}>
              <div className="template-preview-content">
                {template.id === 'reverse-chrono' && (
                  <div className="resume-preview reverse-chrono-preview">
                    <div className="preview-header">
                      <div className="preview-name">John Doe</div>
                      <div className="preview-contact">
                        <span>johndoe@email.com</span>
                        <span>(123) 456-7890</span>
                        <span>New York, NY</span>
                      </div>
                    </div>
                    <div className="preview-section">
                      <div className="preview-section-title">Professional Summary</div>
                      <div className="preview-description">Experienced professional with 5+ years in software development and project management.</div>
                    </div>
                    <div className="preview-section">
                      <div className="preview-section-title">Work Experience</div>
                      <div className="preview-item">
                        <div className="preview-job-title">Senior Software Engineer</div>
                        <div className="preview-company">Tech Innovations Inc.</div>
                        <div className="preview-dates">Jan 2020 - Present</div>
                        <div className="preview-description">Led development team in creating enterprise applications.</div>
                      </div>
                      <div className="preview-item">
                        <div className="preview-job-title">Software Developer</div>
                        <div className="preview-company">Digital Solutions</div>
                        <div className="preview-dates">Jun 2018 - Dec 2019</div>
                      </div>
                    </div>
                  </div>
                )}
                
                {template.id === 'modern-sidebar' && (
                  <div className="resume-preview modern-sidebar-preview">
                    <div className="sidebar">
                      <div className="preview-name">John Doe</div>
                      <div className="preview-section">
                        <div className="preview-section-title">Contact</div>
                        <div className="preview-contact">
                          <span>johndoe@email.com</span>
                          <span>(123) 456-7890</span>
                          <span>New York, NY</span>
                        </div>
                      </div>
                      <div className="preview-section">
                        <div className="preview-section-title">Skills</div>
                        <ul className="preview-skills-list">
                          <li className="preview-skill">JavaScript</li>
                          <li className="preview-skill">React</li>
                          <li className="preview-skill">Node.js</li>
                          <li className="preview-skill">UI/UX</li>
                        </ul>
                      </div>
                    </div>
                    <div className="main-content">
                      <div className="preview-section">
                        <div className="preview-section-title">Experience</div>
                        <div className="preview-item">
                          <div className="preview-job-title">Senior Developer</div>
                          <div className="preview-company">Tech Solutions</div>
                          <div className="preview-dates">2020 - Present</div>
                        </div>
                      </div>
                      <div className="preview-section">
                        <div className="preview-section-title">Education</div>
                        <div className="preview-item">
                          <div className="preview-education-degree">B.S. Computer Science</div>
                          <div className="preview-education-school">University of Technology</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {template.id === 'professional-clean' && (
                  <div className="resume-preview professional-clean-preview">
                    <div className="preview-header">
                      <div className="preview-name">John Doe</div>
                      <div className="preview-contact">
                        <span>johndoe@email.com</span>
                        <span>(123) 456-7890</span>
                        <span>New York, NY</span>
                      </div>
                    </div>
                    <div className="preview-section">
                      <div className="preview-section-title">Professional Summary</div>
                      <div className="preview-description">Innovative tech professional with expertise in software development.</div>
                    </div>
                    <div className="preview-section">
                      <div className="preview-section-title">Work History</div>
                      <div className="preview-item">
                        <div className="preview-job-title">Senior Developer</div>
                        <div className="preview-company">Future Tech Inc.</div>
                      </div>
                    </div>
                  </div>
                )}

                {template.id === 'pro-profile' && (
                  <div className="resume-preview pro-profile-preview">
                    <div className="sidebar">
                      <div className="preview-name">John Doe</div>
                      <div className="preview-section">
                        <div className="preview-section-title">Contact</div>
                        <div className="preview-contact">
                          <span>johndoe@email.com</span>
                          <span>(123) 456-7890</span>
                        </div>
                      </div>
                      <div className="preview-section">
                        <div className="preview-section-title">Skills</div>
                        <ul className="preview-skills-list">
                          <li className="preview-skill">Leadership</li>
                          <li className="preview-skill">Strategy</li>
                          <li className="preview-skill">Management</li>
                        </ul>
                      </div>
                    </div>
                    <div className="main-content">
                      <div className="preview-section">
                        <div className="preview-section-title">Executive Profile</div>
                        <div className="preview-description">Senior executive with over 10 years of leadership experience.</div>
                      </div>
                      <div className="preview-section">
                        <div className="preview-section-title">Experience</div>
                        <div className="preview-item">
                          <div className="preview-job-title">Chief Technology Officer</div>
                          <div className="preview-company">Enterprise Solutions</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {template.id === 'jobfit-pro' && (
                  <div className="resume-preview jobfit-pro-preview">
                    <div className="sidebar">
                      <div className="preview-section">
                        <div className="preview-section-title">Contact</div>
                        <div className="preview-contact">
                          <span>johndoe@email.com</span>
                          <span>(123) 456-7890</span>
                        </div>
                      </div>
                      <div className="preview-section">
                        <div className="preview-section-title">Skills</div>
                        <ul className="preview-skills-list">
                          <li className="preview-skill">Python</li>
                          <li className="preview-skill">Data Analysis</li>
                          <li className="preview-skill">Machine Learning</li>
                        </ul>
                      </div>
                    </div>
                    <div className="main-content">
                      <div className="preview-name">John Doe</div>
                      <div className="preview-section">
                        <div className="preview-section-title">Experience</div>
                        <div className="preview-item">
                          <div className="preview-job-title">Data Scientist</div>
                          <div className="preview-company">Analytics Co.</div>
                          <div className="preview-dates">2019 - Present</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {template.id === 'classic' && (
                  <div className="resume-preview classic-preview">
                    <div className="preview-header">
                      <div className="preview-name">John Doe</div>
                      <div className="preview-contact">
                        <span>johndoe@email.com</span>
                        <span>(123) 456-7890</span>
                        <span>New York, NY</span>
                      </div>
                    </div>
                    <div className="preview-section">
                      <div className="preview-section-title">Experience</div>
                      <div className="preview-item">
                        <div className="preview-job-title">Marketing Manager</div>
                        <div className="preview-company">Global Brands Inc.</div>
                        <div className="preview-dates">2018 - Present</div>
                      </div>
                    </div>
                  </div>
                )}

                {template.id === 'modern' && (
                  <div className="resume-preview modern-preview">
                    <div className="preview-header">
                      <div className="preview-name">John Doe</div>
                      <div className="preview-contact">
                        <span>johndoe@email.com</span>
                        <span>(123) 456-7890</span>
                      </div>
                    </div>
                    <div className="preview-section">
                      <div className="preview-section-title">Experience</div>
                      <div className="preview-item">
                        <div className="preview-job-title">Product Manager</div>
                        <div className="preview-company">Innovative Products</div>
                      </div>
                    </div>
                  </div>
                )}

                {template.id === 'smart-resume' && (
                  <div className="resume-preview smart-resume-preview">
                    <div className="preview-header">
                      <div className="preview-name">John Doe</div>
                      <div className="preview-contact">
                        <span>johndoe@email.com</span>
                        <span>(123) 456-7890</span>
                        <span>San Francisco, CA</span>
                      </div>
                    </div>
                    <div className="preview-section">
                      <div className="preview-section-title">Profile</div>
                      <div className="preview-description">Structured, minimalist resume layout with clear sections and readable typography.</div>
                    </div>
                    <div className="preview-section">
                      <div className="preview-section-title">Key Skills</div>
                      <div className="preview-description">React • Node.js • AWS • Docker</div>
                    </div>
                  </div>
                )}

                {template.id === 'minimal' && (
                  <div className="resume-preview minimal-preview">
                    <div className="preview-header">
                      <div className="preview-name">John Doe</div>
                      <div className="preview-contact">
                        <span>johndoe@email.com</span>
                        <span>(123) 456-7890</span>
                      </div>
                    </div>
                    <div className="preview-section">
                      <div className="preview-section-title">Experience</div>
                      <div className="preview-item">
                        <div className="preview-job-title">UX Designer</div>
                        <div className="preview-company">Design Studio</div>
                      </div>
                    </div>
                  </div>
                )}

                {template.id === 'tech' && (
                  <div className="resume-preview tech-preview">
                    <div className="preview-header">
                      <div className="preview-name">John Doe</div>
                      <div className="preview-contact">
                        <span>johndoe@email.com</span>
                        <span>(123) 456-7890</span>
                        <span>github.com/johndoe</span>
                      </div>
                    </div>
                    <div className="preview-section">
                      <div className="preview-section-title">Technical Skills</div>
                      <ul className="preview-skills-list">
                        <li className="preview-skill">React</li>
                        <li className="preview-skill">Node.js</li>
                        <li className="preview-skill">Python</li>
                        <li className="preview-skill">AWS</li>
                        <li className="preview-skill">Docker</li>
                        <li className="preview-skill">Kubernetes</li>
                      </ul>
                    </div>
                  </div>
                )}

                {template.id === 'medical-pro' && (
                  <div className="resume-preview medical-pro-preview">
                    <div className="preview-header">
                      <div className="preview-name">Dr. Jane Smith</div>
                      <div className="preview-contact">
                        <span>janesmith@email.com</span>
                        <span>Medical License #12345</span>
                      </div>
                    </div>
                    <div className="preview-section">
                      <div className="preview-section-title">Medical Specialization</div>
                      <div className="preview-description">Board Certified Cardiologist with 8 years of clinical experience</div>
                    </div>
                    <div className="preview-section">
                      <div className="preview-section-title">Clinical Experience</div>
                      <div className="preview-item">
                        <div className="preview-job-title">Attending Physician</div>
                        <div className="preview-company">City Hospital</div>
                      </div>
                    </div>
                  </div>
                )}

                {template.id === 'healthcare' && (
                  <div className="resume-preview healthcare-preview">
                    <div className="preview-header">
                      <div className="preview-name-title">
                        <div className="preview-name">Sarah Johnson, RN</div>
                        <div className="preview-description">Registered Nurse</div>
                      </div>
                      <div className="preview-photo"></div>
                    </div>
                    <div className="preview-section">
                      <div className="preview-section-title">Clinical Expertise</div>
                      <ul className="preview-skills-list">
                        <li className="preview-skill">Emergency Care</li>
                        <li className="preview-skill">Patient Assessment</li>
                        <li className="preview-skill">Critical Care</li>
                      </ul>
                    </div>
                  </div>
                )}

                {template.id === 'diploma-focus' && (
                  <div className="resume-preview diploma-focus-preview">
                    <div className="preview-header">
                      <div className="preview-name">Michael Brown</div>
                      <div className="preview-description">Certified Electrical Technician</div>
                    </div>
                    <div className="preview-section">
                      <div className="preview-section-title">Certifications</div>
                      <div className="preview-item">
                        <div className="preview-education-degree">Diploma in Electrical Engineering</div>
                        <div className="preview-education-school">Technical Institute</div>
                      </div>
                    </div>
                    <div className="preview-section">
                      <div className="preview-section-title">Technical Skills</div>
                      <ul className="preview-skills-list">
                        <li className="preview-skill">Circuit Design</li>
                        <li className="preview-skill">Maintenance</li>
                        <li className="preview-skill">Troubleshooting</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
                <div className="template-info">
              <h3>{template.name}</h3>
              <p>{template.description}</p>
                  <div className="template-actions">
                    <button className="btn-select-template" onClick={(e) => { e.stopPropagation(); if (onTemplateSelect) onTemplateSelect(template.id, localType); else if (onTemplateChange) onTemplateChange(template.id); }}>Use</button>
                    <button className="btn-preview-template" onClick={(e) => { e.stopPropagation(); if (onTemplatePreview) onTemplatePreview(template); }}>Preview</button>
                  </div>
            </div>
            {selectedTemplate === template.id && (
              <div className="template-selected">
                <span className="checkmark">✓</span>
              </div>
            )}
          </div>
        ))}
      </div>
      
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
