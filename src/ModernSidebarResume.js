/**
 * Modern Sidebar Resume Template Component
 * 
 * A two-column, ATS-friendly yet visually appealing resume design
 * Featuring a colored sidebar with contact info, skills and languages
 */
import React from 'react';
import './styles/ModernSidebar.css';

const ModernSidebarResume = React.forwardRef(({ data, showProfile = true }, ref) => {
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
  } = data || {};
  
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

  // Format skills into an array
  const formatSkillsList = (skillsString) => {
    if (!skillsString) return [];
    return skillsString.split(',').map(skill => skill.trim()).filter(Boolean);
  };

  // Create skill arrays
  const technicalSkillsList = formatSkillsList(technicalSkills);
  const softSkillsList = formatSkillsList(softSkills);
  const generalSkillsList = formatSkillsList(skills);
  
  // Combine all skills
  const allSkills = [...technicalSkillsList, ...generalSkillsList, ...softSkillsList];
  
  // Format languages into an array
  const languagesList = languages ? languages.split(',').map(lang => {
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
  const professionalSummary = summary || objective || '';

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
        
        {/* Work Experience Section */}
        {experience && experience.length > 0 && (
          <section className="experience">
            <h2 style={{...dynamicStyles.heading, ...dynamicStyles.borderBottom}}>Work Experience</h2>
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
                  <div className="experience-title">{job.role || 'Position'}</div>
                  <div className="experience-duration">{job.duration || 'Duration'}</div>
                </div>
                <div className="experience-company">{job.company || 'Company'}</div>
                <div className="experience-description">{job.description || 'Job description'}</div>
              </div>
            ))}
          </section>
        )}
        
        {/* Projects Section */}
        {projects && projects.length > 0 && (
          <section className="projects">
            <h2 style={{...dynamicStyles.heading, ...dynamicStyles.borderBottom}}>Projects</h2>
            {projects.map((project, index) => (
              <div key={index} className="experience-item">
                <div className="experience-header">
                  <div className="experience-title">{project.title || 'Project'}</div>
                </div>
                <div className="experience-description">{project.description || 'Project description'}</div>
              </div>
            ))}
          </section>
        )}
        
        {/* Education Section */}
        {education && education.length > 0 && (
          <section className="education">
            <h2 style={{...dynamicStyles.heading, ...dynamicStyles.borderBottom}}>Education</h2>
            {education.map((edu, index) => (
              <div key={index} className="education-item">
                <div className="education-degree">{edu.degree || 'Degree'}</div>
                <div className="education-institution">{edu.institution || 'Institution'}</div>
                <div className="education-details">
                  {edu.year && <span>{edu.year}</span>}
                  {edu.percentage && <span> - {edu.percentage}%</span>}
                </div>
              </div>
            ))}
          </section>
        )}
        
        {/* Certifications & Achievements Section */}
        {((certifications && certifications.length > 0) || (achievements && achievements.length > 0)) && (
          <section className="certifications">
            <h2 style={{...dynamicStyles.heading, ...dynamicStyles.borderBottom}}>Certifications & Achievements</h2>
            <ul className="certifications-list">
              {certifications && certifications.map((cert, index) => (
                <li key={`cert-${index}`}>{cert}</li>
              ))}
              {achievements && achievements.map((achievement, index) => (
                <li key={`achv-${index}`}>{achievement}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
});

export default ModernSidebarResume;
