/**
 * Professional MNC-Approved Resume Component
 * ATS-friendly design following best practices for major companies
 */
import React from 'react';
import './styles/MncResumeStyles.css';

const MncResume = React.forwardRef(({ data, template = 'professional' }, ref) => {
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
  } = data || {};

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
          <p className="summary-text">{summary}</p>
        </section>
      )}

      {/* Technical Skills */}
      {skills && (
        <section className="resume-section">
          <h2 className="section-title">TECHNICAL SKILLS</h2>
          <p className="skills-text">{skills}</p>
        </section>
      )}

      {/* Work Experience */}
      {experience && experience.length > 0 && (
        <section className="resume-section">
          <h2 className="section-title">WORK EXPERIENCE</h2>
          <div className="experience-list">
            {experience.map((exp, index) => (
              <div key={index} className="experience-item">
                <div className="job-header">
                  <div className="job-title">
                    <strong>{exp.role}</strong> – {exp.company}
                  </div>
                  <div className="job-duration">{exp.duration}</div>
                </div>
                <ul className="job-duties">
                  {exp.description && exp.description.split('\n').map((duty, i) => 
                    duty.trim() && <li key={i}>{duty.trim()}</li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="resume-section">
          <h2 className="section-title">PROJECTS</h2>
          <div className="projects-list">
            {projects.map((project, index) => (
              <div key={index} className="project-item">
                <h3 className="project-title">{project.title}</h3>
                <ul className="project-details">
                  {project.description && project.description.split('\n').map((detail, i) => 
                    detail.trim() && <li key={i}>{detail.trim()}</li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="resume-section">
          <h2 className="section-title">EDUCATION</h2>
          <div className="education-list">
            {education.map((edu, index) => (
              <div key={index} className="education-item">
                <div className="degree">{edu.degree} – {edu.institution} – {edu.year} 
                  {edu.percentage && <span> – {edu.percentage}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements & Certifications */}
      {achievements && achievements.length > 0 && (
        <section className="resume-section">
          <h2 className="section-title">ACHIEVEMENTS & CERTIFICATIONS</h2>
          <ul className="achievements-list">
            {achievements.map((achievement, index) => (
              achievement.trim() && <li key={index}>{achievement}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
});

export default MncResume;
