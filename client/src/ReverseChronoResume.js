/**
 * Reverse-Chronological Resume Template - ResuMate Pro
 * 
 * ATS-friendly design following industry standards
 * Highlights most recent experience first
 * Clean, structured layout for maximum readability
 */
import React from 'react';
import { safeText, safeAchievement, safeArray } from './utils/safeRender';
import './styles/ReverseChrono.css';

const ReverseChronoResume = React.forwardRef(({ data = {}, showProfile = false }, ref) => {
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
  } = data;

  // Enhanced helper to safely convert values to text
  const safeText = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      // Handle {text, start, end} objects from rich text editor
      if (value.text !== undefined) return String(value.text || '');
      // Handle other object structures
      if (value.toString && value.toString !== Object.prototype.toString) {
        return value.toString();
      }
      return '';
    }
    if (Array.isArray(value)) return value.map(v => safeText(v)).filter(Boolean).join(', ');
    return String(value || '');
  };

  // Format skills into an array
  const formatSkillsList = (skillsString) => {
    if (!skillsString) return [];
    const text = safeText(skillsString);
    return text.split(',').map(skill => skill.trim()).filter(Boolean);
  };

  // Create combined skills array
  const allSkills = [...formatSkillsList(skills), ...formatSkillsList(technicalSkills), ...formatSkillsList(softSkills)];
  
  // Get combined professional summary
  const professionalSummary = safeText(summary) || safeText(objective) || '';

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

      {/* 2. Professional Summary - Always visible */}
      <section className="resume-section">
        <h2 className="section-title">PROFESSIONAL SUMMARY</h2>
        <p className="summary-text">{professionalSummary || 'Your professional summary will appear here. Highlight your key skills and experience.'}</p>
      </section>

      {/* 3. Technical Skills - Always visible */}
      <section className="resume-section">
        <h2 className="section-title">TECHNICAL SKILLS</h2>
        <div className="skills-list">
          {allSkills.length > 0 ? (
            allSkills.map((skill, index) => (
              <span key={index}>{skill}</span>
            ))
          ) : (
            <>
              <span>JavaScript</span>
              <span>React</span>
              <span>Node.js</span>
              <span>Python</span>
              <span>SQL</span>
            </>
          )}
        </div>
      </section>

      {/* 4. Work Experience - Always visible */}
      <section className="resume-section">
        <h2 className="section-title">WORK EXPERIENCE</h2>
        {experience && experience.length > 0 ? (
          experience.sort((a, b) => {
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
          ))
        ) : (
          <div className="experience-item">
            <div className="experience-header">
              <span className="experience-title">Software Developer</span>
              <span className="experience-duration">Jan 2020 - Present</span>
            </div>
            <div className="experience-company">Tech Company Inc.</div>
            <div className="experience-description">
              Your work experience will appear here
            </div>
          </div>
        )}
      </section>

      {/* 5. Projects - Always visible */}
      <section className="resume-section">
        <h2 className="section-title">PROJECTS</h2>
        {projects && projects.length > 0 ? (
          projects.map((project, index) => (
            <div key={index} className="project-item">
              <div className="project-title">{project.title || 'Project Title'}</div>
              <div className="project-description">{project.description || 'Project description'}</div>
            </div>
          ))
        ) : (
          <div className="project-item">
            <div className="project-title">Sample Project</div>
            <div className="project-description">Your projects will appear here</div>
          </div>
        )}
      </section>

      {/* 6. Education - Always visible */}
      <section className="resume-section">
        <h2 className="section-title">EDUCATION</h2>
        {education && education.length > 0 ? (
          education.map((edu, index) => (
            <div key={index} className="education-item">
              <span className="education-degree">{edu.degree || 'Degree'}</span>
              {edu.percentage && <span> - {edu.percentage}%</span>}
              <div>
                <span className="education-institution">{edu.institution || 'Institution'}</span>
                {edu.year && <span> ({edu.year})</span>}
              </div>
            </div>
          ))
        ) : (
          <div className="education-item">
            <span className="education-degree">Bachelor of Technology in Computer Science</span>
            <div>
              <span className="education-institution">University Name - 75%</span>
              <span> (2020)</span>
            </div>
          </div>
        )}
      </section>

      {/* 7. Certifications & Achievements - Always visible */}
      <section className="resume-section">
        <h2 className="section-title">CERTIFICATIONS & ACHIEVEMENTS</h2>
        <ul className="cert-achievements-list">
          {(() => {
            const certItems = certifications && certifications.length > 0 
              ? certifications.map((cert, index) => {
                  const text = safeText(cert);
                  return text ? <li key={`cert-${index}`}>{text}</li> : null;
                }).filter(Boolean)
              : [];
            
            const achvItems = achievements && achievements.length > 0
              ? achievements.map((achievement, index) => {
                  const text = safeAchievement(achievement);
                  return text ? <li key={`achv-${index}`}>{text}</li> : null;
                }).filter(Boolean)
              : [];
            
            const allItems = [...certItems, ...achvItems];
            
            return allItems.length > 0 ? allItems : (
              <li>Your certifications and achievements will appear here</li>
            );
          })()}
        </ul>
      </section>
    </div>
  );
});

export default ReverseChronoResume;
