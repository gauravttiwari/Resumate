/**
 * Modern Sidebar Resume Template Component
 * 
 * A two-column, ATS-friendly yet visually appealing resume design
 * Featuring a colored sidebar with contact info, skills and languages
 */
import React from 'react';
import { safeText, safeAchievement, safeArray } from './utils/safeRender';
import './styles/ModernSidebar.css';

const ModernSidebarResume = React.forwardRef(({ data = {}, showProfile = true }, ref) => {
  // Destructure resume data with defaults
  const { 
    name = '', 
    email = '', 
    phone = '', 
    address = '',
    linkedin = '',
    github = '',
    summary = '',
    objective = '',
    skills = '',
    technicalSkills = '',
    softSkills = '',
    languages = '',
    experience = [],
    projects = [],
    education = [],
    achievements = [],
    certifications = [],
    profilePic = null,
    sidebarColor = '#800000' // Default maroon color if not specified
  } = data;
  
  // Create styles object with dynamic colors for headers
  const dynamicStyles = {
    sidebar: {
      backgroundColor: sidebarColor
    },
    heading: {
      color: sidebarColor
    },
    borderBottom: {
      borderBottom: `2px solid ${sidebarColor}`
    }
  };

  // Helper to safely convert values to text
  const safeText = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value.text !== undefined) return String(value.text || '');
    if (Array.isArray(value)) return value.map(v => safeText(v)).filter(Boolean).join(', ');
    return '';
  };

  // Format skills into an array
  const formatSkillsList = (skillsString) => {
    if (!skillsString) return [];
    const text = safeText(skillsString);
    return text.split(',').map(skill => skill.trim()).filter(Boolean);
  };

  // Create skill arrays
  const technicalSkillsList = formatSkillsList(technicalSkills);
  const softSkillsList = formatSkillsList(softSkills);
  const generalSkillsList = formatSkillsList(skills);
  
  // Combine all skills
  const allSkills = [...technicalSkillsList, ...generalSkillsList, ...softSkillsList];
  
  // Format languages into an array
  const languagesList = languages ? safeText(languages).split(',').map(lang => {
    // Check if language has proficiency level indicated with a dash
    const parts = lang.trim().split('-');
    if (parts.length > 1) {
      return {
        name: parts[0].trim(),
        level: parts[1].trim()
      };
    }
    return {
      name: lang.trim(),
      level: 'Proficient'
    };
  }) : [];

  // Professional summary
  const professionalSummary = safeText(summary) || safeText(objective) || '';

  return (
    <div ref={ref} className="template-modern-sidebar">
      {/* Left Sidebar */}
      <div className="sidebar" style={dynamicStyles.sidebar}>
        {/* Profile Picture */}
        {profilePic && showProfile && (
          <div className="profile-pic">
            <img src={profilePic} alt="Profile" crossOrigin="anonymous" />
          </div>
        )}
        
        {/* Contact Information */}
        <div className="contact-info">
          <h3>Contact</h3>
          {email && <p><span className="icon">✉</span> {email}</p>}
          {phone && <p><span className="icon">☎</span> {phone}</p>}
          {address && <p><span className="icon">⌂</span> {address}</p>}
          {linkedin && <p><span className="icon">in</span> {linkedin}</p>}
          {github && <p><span className="icon">⎇</span> {github}</p>}
        </div>
        
        {/* Languages Section */}
        {languagesList.length > 0 && (
          <div className="languages">
            <h3>Languages</h3>
            <ul>
              {languagesList.map((lang, index) => (
                <li key={index}>
                  {lang.name}
                  <span className="language-level">{lang.level}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Skills Section */}
        {allSkills.length > 0 && (
          <div className="skills">
            <h3>Skills</h3>
            <ul>
              {allSkills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Main Content */}
      <div className="main-content">
        {/* Header with Name and Job Title */}
        <div className="header">
          <h1>{name}</h1>
          <p className="job-title" style={dynamicStyles.heading}>
            {experience && experience.length > 0 ? experience[0].role || 'Professional' : 'Professional'}
          </p>
          
          {/* Professional Summary */}
          {professionalSummary && (
            <div className="summary">
              <p>{professionalSummary}</p>
            </div>
          )}
        </div>
        
        {/* Work Experience Section - Always visible */}
        <section className="experience">
          <h2 style={{...dynamicStyles.heading, ...dynamicStyles.borderBottom}}>Work Experience</h2>
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
                  <div className="experience-title">{job.role || 'Position'}</div>
                  <div className="experience-duration">{job.duration || 'Duration'}</div>
                </div>
                <div className="experience-company">{job.company || 'Company'}</div>
                <div className="experience-description">{job.description || 'Job description'}</div>
              </div>
            ))
          ) : (
            <div className="experience-item">
              <div className="experience-header">
                <div className="experience-title">Software Developer</div>
                <div className="experience-duration">Jan 2020 - Present</div>
              </div>
              <div className="experience-company">Tech Company Inc.</div>
              <div className="experience-description">Your work experience will appear here</div>
            </div>
          )}
        </section>
        
        {/* Projects Section */}
        {/* Projects Section - Always visible */}
        <section className="projects">
          <h2 style={{...dynamicStyles.heading, ...dynamicStyles.borderBottom}}>Projects</h2>
          {projects && projects.length > 0 ? (
            projects.map((project, index) => (
              <div key={index} className="experience-item">
                <div className="experience-header">
                  <div className="experience-title">{project.title || 'Project'}</div>
                </div>
                <div className="experience-description">{project.description || 'Project description'}</div>
              </div>
            ))
          ) : (
            <div className="experience-item">
              <div className="experience-header">
                <div className="experience-title">Sample Project</div>
              </div>
              <div className="experience-description">Your projects will appear here</div>
            </div>
          )}
        </section>
        
        {/* Education Section - Always visible */}
        <section className="education">
          <h2 style={{...dynamicStyles.heading, ...dynamicStyles.borderBottom}}>Education</h2>
          {education && education.length > 0 ? (
            education.map((edu, index) => (
              <div key={index} className="education-item">
                <div className="education-degree">{edu.degree || 'Degree'}</div>
                <div className="education-institution">{edu.institution || 'Institution'}</div>
                <div className="education-details">
                  {edu.year && <span>{edu.year}</span>}
                  {edu.percentage && <span> - {edu.percentage}%</span>}
                </div>
              </div>
            ))
          ) : (
            <div className="education-item">
              <div className="education-degree">Bachelor of Technology in Computer Science</div>
              <div className="education-institution">University Name</div>
              <div className="education-details">
                <span>2020</span>
                <span> - 75%</span>
              </div>
            </div>
          )}
        </section>
        
        {/* Certifications & Achievements Section - Always visible */}
        <section className="certifications">
          <h2 style={{...dynamicStyles.heading, ...dynamicStyles.borderBottom}}>Certifications & Achievements</h2>
          <ul className="certifications-list">
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
    </div>
  );
});

export default ModernSidebarResume;
