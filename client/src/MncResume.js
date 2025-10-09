/**
 * Professional MNC-Approved Resume Component
 * ATS-friendly design following best practices for major companies
 */
import React from 'react';
import { safeText, safeAchievement, safeArray } from './utils/safeRender';
import './styles/MncResumeStyles.css';

const MncResume = React.forwardRef(({ data = {}, template = 'mnc' }, ref) => {
  // Destructure resume data with defaults
  const { 
    name = '', 
    email = '', 
    phone = '', 
    linkedin = '',
    github = '',
    summary = '',
    skills = '',
    experience = [],
    projects = [],
    education = [],
    achievements = [],
    profilePic = null
  } = data;

  // Helper to safely convert values to text
  const safeText = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value.text !== undefined) return String(value.text || '');
    if (Array.isArray(value)) return value.map(v => safeText(v)).filter(Boolean).join(', ');
    return '';
  };

  const templateClass = `resume-template-${template}`;

  return (
    <div ref={ref} className={`mnc-resume ${templateClass}`}>
      {/* Header Section */}
      <header className="resume-header">
        <div className="resume-header-content">
          {profilePic && (
            <div className="profile-pic">
              <img 
                src={profilePic} 
                alt="Profile" 
                style={{ width: '100%', height: 'auto', borderRadius: '50%', maxWidth: '150px' }}
                crossOrigin="anonymous"
              />
            </div>
          )}
          <div className="resume-name-contact">
            <h1 className="resume-name">{name}</h1>
            <div className="contact-info">
              {email && <span>Email: {email}</span>}
              {phone && <span> | Phone: {phone}</span>}
              {linkedin && <span> | LinkedIn: {linkedin}</span>}
              {github && <span> | GitHub: {github}</span>}
            </div>
          </div>
        </div>
      </header>

      {/* Professional Summary */}
      {summary && (
        <section className="resume-section">
          <h2 className="section-title">PROFESSIONAL SUMMARY</h2>
          <p className="summary-text">{safeText(summary)}</p>
        </section>
      )}

      {/* Technical Skills */}
      {skills && (
        <section className="resume-section">
          <h2 className="section-title">TECHNICAL SKILLS</h2>
          <p className="skills-text">{skills}</p>
        </section>
      )}

      {/* Work Experience - Always visible */}
      <section className="resume-section">
        <h2 className="section-title">WORK EXPERIENCE</h2>
        <div className="experience-list">
          {experience && experience.length > 0 ? (
            experience.map((exp, index) => (
              <div key={index} className="experience-item">
                <div className="job-header">
                  <div className="job-title">
                    <strong>{safeText(exp.role)}</strong> – {safeText(exp.company)}
                  </div>
                  <div className="job-duration">{safeText(exp.duration)}</div>
                </div>
                <ul className="job-duties">
                  {exp.description && safeText(exp.description).split('\n').map((duty, i) => 
                    duty.trim() && <li key={i}>{duty.trim()}</li>
                  )}
                </ul>
              </div>
            ))
          ) : (
            <div className="experience-item">
              <div className="job-header">
                <div className="job-title">
                  <strong>Software Developer</strong> – Tech Company Inc.
                </div>
                <div className="job-duration">Jan 2020 - Present</div>
              </div>
              <ul className="job-duties">
                <li>Your work experience will appear here</li>
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Projects - Always visible */}
      <section className="resume-section">
        <h2 className="section-title">PROJECTS</h2>
        <div className="projects-list">
          {projects && projects.length > 0 ? (
            projects.map((project, index) => (
              <div key={index} className="project-item">
                <h3 className="project-title">{safeText(project.title)}</h3>
                <ul className="project-details">
                  {project.description && safeText(project.description).split('\n').map((detail, i) => 
                    detail.trim() && <li key={i}>{detail.trim()}</li>
                  )}
                </ul>
              </div>
            ))
          ) : (
            <div className="project-item">
              <h3 className="project-title">Sample Project</h3>
              <ul className="project-details">
                <li>Your projects will appear here</li>
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Education - Always visible */}
      <section className="resume-section">
        <h2 className="section-title">EDUCATION</h2>
        <div className="education-list">
          {education && education.length > 0 ? (
            education.map((edu, index) => (
              <div key={index} className="education-item">
                <div className="degree">{safeText(edu.degree)} – {safeText(edu.institution)} – {safeText(edu.year)} 
                  {edu.percentage && <span> – {safeText(edu.percentage)}</span>}
                </div>
              </div>
            ))
          ) : (
            <div className="education-item">
              <div className="degree">Bachelor of Technology in Computer Science – University Name – 2020 – 75%</div>
            </div>
          )}
        </div>
      </section>

      {/* Achievements & Certifications - Always visible */}
      <section className="resume-section">
        <h2 className="section-title">ACHIEVEMENTS & CERTIFICATIONS</h2>
        <ul className="achievements-list">
          {(() => {
            const achvItems = achievements && achievements.length > 0
              ? achievements.map((achievement, index) => {
                  const text = safeAchievement(achievement);
                  return text ? <li key={index}>{text}</li> : null;
                }).filter(Boolean)
              : [];
            
            return achvItems.length > 0 ? achvItems : (
              <li>Your achievements and certifications will appear here</li>
            );
          })()}
        </ul>
      </section>
    </div>
  );
});

export default MncResume;
