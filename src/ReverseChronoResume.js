/**
 * Reverse-Chronological Resume Template - ResuMate Pro
 * 
 * ATS-friendly design following industry standards
 * Highlights most recent experience first
 * Clean, structured layout for maximum readability
 */
import React from 'react';
import './styles/ReverseChrono.css';

const ReverseChronoResume = React.forwardRef(({ data, showProfile = false }, ref) => {
  // Destructure resume data with defaults
  const { 
    name = '', 
    email = '', 
    phone = '', 
    linkedin = '',
    github = '',
    summary = '',
    objective = '',
    skills = '',
    technicalSkills = '',
    softSkills = '',
    experience = [],
    projects = [],
    education = [],
    achievements = [],
    certifications = [],
    profilePic = null
  } = data || {};

  // Format skills into an array
  const formatSkillsList = (skillsString) => {
    if (!skillsString) return [];
    return skillsString.split(',').map(skill => skill.trim()).filter(Boolean);
  };

  // Create combined skills array
  const allSkills = [...formatSkillsList(skills), ...formatSkillsList(technicalSkills), ...formatSkillsList(softSkills)];
  
  // Get combined professional summary
  const professionalSummary = summary || objective || '';

  return (
    <div ref={ref} className={`resume-template-reverse-chrono ${showProfile ? 'show-profile' : ''}`}>
      {/* 1. Header - Personal Information */}
      <header className="resume-header">
        {profilePic && showProfile && (
          <div className="profile-pic">
            <img src={profilePic} alt="Profile" />
          </div>
        )}
        <h1 className="resume-name">{name}</h1>
        <div className="contact-info">
          {email && <span>Email: {email}</span>}
          {phone && <span> | Phone: {phone}</span>}
          {linkedin && <span> | LinkedIn: {linkedin}</span>}
          {github && <span> | GitHub: {github}</span>}
        </div>
      </header>

      {/* 2. Professional Summary */}
      {professionalSummary && (
        <section className="resume-section">
          <h2 className="section-title">PROFESSIONAL SUMMARY</h2>
          <p className="summary-text">{professionalSummary}</p>
        </section>
      )}

      {/* 3. Technical Skills */}
      {allSkills.length > 0 && (
        <section className="resume-section">
          <h2 className="section-title">TECHNICAL SKILLS</h2>
          <div className="skills-list">
            {allSkills.map((skill, index) => (
              <span key={index}>{skill}</span>
            ))}
          </div>
        </section>
      )}

      {/* 4. Work Experience */}
      {experience && experience.length > 0 && (
        <section className="resume-section">
          <h2 className="section-title">WORK EXPERIENCE</h2>
          {/* Sort by most recent first */}
          {experience.sort((a, b) => {
            // Try to parse years from duration strings
            const getEndYear = (duration) => {
              const match = duration?.match(/\d{4}/) || [''];
              return parseInt(match[0] || '0');
            };
            return getEndYear(b.duration) - getEndYear(a.duration);
          }).map((job, index) => (
            <div key={index} className="experience-item">
              <div className="experience-header">
                <span className="experience-title">{job.role || 'Position'}</span>
                <span className="experience-duration">{job.duration || 'Duration'}</span>
              </div>
              <div className="experience-company">{job.company || 'Company'}</div>
              <div className="experience-description">
                {job.description || 'Job description'}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* 5. Projects */}
      {projects && projects.length > 0 && (
        <section className="resume-section">
          <h2 className="section-title">PROJECTS</h2>
          {projects.map((project, index) => (
            <div key={index} className="project-item">
              <div className="project-title">{project.title || 'Project Title'}</div>
              <div className="project-description">{project.description || 'Project description'}</div>
            </div>
          ))}
        </section>
      )}

      {/* 6. Education */}
      {education && education.length > 0 && (
        <section className="resume-section">
          <h2 className="section-title">EDUCATION</h2>
          {education.map((edu, index) => (
            <div key={index} className="education-item">
              <span className="education-degree">{edu.degree || 'Degree'}</span>
              {edu.percentage && <span> - {edu.percentage}%</span>}
              <div>
                <span className="education-institution">{edu.institution || 'Institution'}</span>
                {edu.year && <span> ({edu.year})</span>}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* 7. Certifications & Achievements */}
      {(certifications.length > 0 || achievements.length > 0) && (
        <section className="resume-section">
          <h2 className="section-title">CERTIFICATIONS & ACHIEVEMENTS</h2>
          <ul className="cert-achievements-list">
            {certifications.map((cert, index) => (
              <li key={`cert-${index}`}>{cert}</li>
            ))}
            {achievements.map((achievement, index) => (
              <li key={`achv-${index}`}>{achievement}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
});

export default ReverseChronoResume;
