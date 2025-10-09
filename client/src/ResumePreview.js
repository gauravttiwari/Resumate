import React from 'react';
import './styles/ResumePreview.css';

/**
 * Resume preview component to display HTML-based resume
 */
const ResumePreview = React.forwardRef(({ data = {}, template = 'modern' }, ref) => {
  // Helper function to safely render text (convert objects to strings)
  const safeText = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    
    // Handle objects with text property (like {text, start, end})
    if (typeof value === 'object' && value !== null) {
      if (value.text !== undefined) return String(value.text || '');
      // Handle arrays by joining with commas
      if (Array.isArray(value)) return value.map(v => safeText(v)).filter(Boolean).join(', ');
      // For other objects, try to stringify
      return '';
    }
    
    return String(value);
  };

  // CSS class for the selected template
  const templateClass = `resume-template-${template}`;
  
  return (
    <div ref={ref} className={`resume-preview ${templateClass}`}>
      {/* Header section - Always visible */}
      <header className="resume-header">
        {data.profilePic && (
          <div className="profile-pic">
            <img src={data.profilePic} alt="Profile" />
          </div>
        )}
        <div className="contact-info">
          <h1 className="resume-name">{safeText(data.name) || 'Your Name'}</h1>
          <p className="resume-contact">
            <span>{safeText(data.address) || 'Your Address'}</span>
            {(data.address || data.phone) && ' • '}
            <span>{safeText(data.phone) || 'Your Phone'}</span>
            {(data.address || data.phone || data.email) && ' • '}
            <span><a href={`mailto:${safeText(data.email) || 'email@example.com'}`}>{safeText(data.email) || 'email@example.com'}</a></span>
          </p>
        </div>
      </header>

      {/* Objective section - Always visible */}
      <section className="resume-section">
        <h2 className="section-title">CAREER OBJECTIVE</h2>
        <p className="objective-text">{safeText(data.objective) || 'Your career objective will appear here. Add your professional goals and aspirations.'}</p>
      </section>

      {/* Education section - Always visible */}
      <section className="resume-section">
        <h2 className="section-title">EDUCATION</h2>
        <ul className="education-list">
          {data.education && data.education.length > 0 ? (
            data.education.filter(edu => safeText(edu.degree) || safeText(edu.institution)).map((edu, index) => (
              <li key={index} className="education-item">
                <div className="education-degree">{safeText(edu.degree) || 'Degree Name'}</div>
                <div className="education-details">
                  {safeText(edu.institution) || 'Institution Name'} 
                  <span> • {safeText(edu.year) || 'Year'}</span> 
                  {edu.percentage && <span> • {safeText(edu.percentage)}%</span>}
                </div>
              </li>
            ))
          ) : (
            <li className="education-item">
              <div className="education-degree">Bachelor's Degree</div>
              <div className="education-details">University Name • 2020 • 85%</div>
            </li>
          )}
        </ul>
      </section>

      {/* Experience section - Always visible */}
      <section className="resume-section">
        <h2 className="section-title">PROFESSIONAL EXPERIENCE</h2>
        <ul className="experience-list">
          {data.experience && data.experience.length > 0 && data.experience.some(exp => safeText(exp.role) || safeText(exp.company)) ? (
            data.experience.filter(exp => safeText(exp.role) || safeText(exp.company)).map((exp, index) => (
              <li key={index} className="experience-item">
                <div className="experience-role">
                  <strong>{safeText(exp.role) || 'Job Title'}</strong> at {safeText(exp.company) || 'Company Name'}
                </div>
                <div className="experience-duration">{safeText(exp.duration) || '2020 - 2023'}</div>
                {exp.description && (
                  <div className="experience-description">{safeText(exp.description)}</div>
                )}
              </li>
            ))
          ) : (
            <li className="experience-item">
              <div className="experience-role">
                <strong>Software Developer</strong> at Tech Company
              </div>
              <div className="experience-duration">2020 - 2023</div>
              <div className="experience-description">Your work experience description will appear here.</div>
            </li>
          )}
        </ul>
      </section>

      {/* Projects section - Always visible */}
      <section className="resume-section">
        <h2 className="section-title">PROJECTS</h2>
        <ul className="projects-list">
          {data.projects && data.projects.length > 0 && data.projects.some(p => safeText(p.title) || safeText(p.description)) ? (
            data.projects.filter(project => safeText(project.title) || safeText(project.description)).map((project, index) => (
              <li key={index} className="project-item">
                <div className="project-title">{safeText(project.title) || 'Project Title'}</div>
                <div className="project-description">{safeText(project.description) || 'Project description'}</div>
              </li>
            ))
          ) : (
            <li className="project-item">
              <div className="project-title">Sample Project</div>
              <div className="project-description">Your project details will appear here.</div>
            </li>
          )}
        </ul>
      </section>

      {/* Skills section - Always visible */}
      <section className="resume-section">
        <h2 className="section-title">SKILLS</h2>
        <p className="skills-text">
          {(() => {
            const skillsText = Array.isArray(data.skills) 
              ? data.skills.map(skill => safeText(skill)).filter(Boolean).join(', ')
              : safeText(data.skills);
            return skillsText || 'JavaScript, React, Node.js, Python, SQL';
          })()}
        </p>
      </section>

      {/* Achievements section - Always visible */}
      <section className="resume-section">
        <h2 className="section-title">ACHIEVEMENTS</h2>
        <p className="achievements-text">
          {(() => {
            const achievementsText = Array.isArray(data.achievements)
              ? data.achievements.map(achievement => safeText(achievement)).filter(Boolean).join(', ')
              : safeText(data.achievements);
            return achievementsText || 'Your achievements and certifications will appear here.';
          })()}
        </p>
      </section>
    </div>
  );
});

export default ResumePreview;
