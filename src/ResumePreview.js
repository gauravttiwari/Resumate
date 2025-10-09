import React from 'react';
import './styles/ResumePreview.css';

/**
 * Resume preview component to display HTML-based resume
 */
const ResumePreview = React.forwardRef(({ data, template = 'modern' }, ref) => {
  // Helper function to safely render text (convert objects to strings)
  const safeText = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value.text) return value.text;
    return String(value);
  };

  // CSS class for the selected template
  const templateClass = `resume-template-${template}`;
  
  return (
    <div ref={ref} className={`resume-preview ${templateClass}`}>
      {/* Header section */}
      <header className="resume-header">
        {data.profilePic && (
          <div className="profile-pic">
            <img src={data.profilePic} alt="Profile" />
          </div>
        )}
        <div className="contact-info">
          <h1 className="resume-name">{safeText(data.name) || 'Your Name'}</h1>
          <p className="resume-contact">
            {data.address && <span>{safeText(data.address)} • </span>}
            {data.phone && <span>{safeText(data.phone)} • </span>}
            {data.email && <span><a href={`mailto:${safeText(data.email)}`}>{safeText(data.email)}</a></span>}
          </p>
        </div>
      </header>

      {/* Objective section */}
      {data.objective && (
        <section className="resume-section">
          <h2 className="section-title">CAREER OBJECTIVE</h2>
          <p className="objective-text">{safeText(data.objective)}</p>
        </section>
      )}

      {/* Education section */}
      {data.education && data.education.length > 0 && (
        <section className="resume-section">
          <h2 className="section-title">EDUCATION</h2>
          <ul className="education-list">
            {data.education.map((edu, index) => (
              <li key={index} className="education-item">
                <div className="education-degree">{safeText(edu.degree)}</div>
                <div className="education-details">
                  {safeText(edu.institution)} 
                  {edu.year && <span> • {safeText(edu.year)}</span>} 
                  {edu.percentage && <span> • {safeText(edu.percentage)}</span>}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Experience section */}
      {data.experience && data.experience.length > 0 && (
        <section className="resume-section">
          <h2 className="section-title">PROFESSIONAL EXPERIENCE</h2>
          <ul className="experience-list">
            {data.experience.map((exp, index) => (
              <li key={index} className="experience-item">
                <div className="experience-role">
                  <strong>{safeText(exp.role)}</strong> at {safeText(exp.company)}
                </div>
                <div className="experience-duration">{safeText(exp.duration)}</div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Projects section */}
      {data.projects && data.projects.length > 0 && (
        <section className="resume-section">
          <h2 className="section-title">PROJECTS</h2>
          <ul className="projects-list">
            {data.projects.map((project, index) => (
              <li key={index} className="project-item">
                <div className="project-title">{safeText(project.title)}</div>
                <div className="project-description">{safeText(project.description)}</div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Skills section */}
      {data.skills && (
        <section className="resume-section">
          <h2 className="section-title">SKILLS</h2>
          <p className="skills-text">{safeText(data.skills)}</p>
        </section>
      )}

      {/* Achievements section */}
      {data.achievements && (
        <section className="resume-section">
          <h2 className="section-title">ACHIEVEMENTS</h2>
          <p className="achievements-text">{safeText(data.achievements)}</p>
        </section>
      )}
    </div>
  );
});

export default ResumePreview;
