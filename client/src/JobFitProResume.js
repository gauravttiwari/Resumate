/**
 * JobFit Pro – Sidebar Resume Layout Component
 * 
 * A professional, ATS-friendly resume template with a colored sidebar
 * featuring sections for contact, languages, software skills, and general skills
 */
import React from 'react';
import { safeText, safeAchievement, safeArray } from './utils/safeRender';
import './styles/JobFitPro.css';

const JobFitProResume = React.forwardRef(({ data = {}, showProfile = true }, ref) => {
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
    hobbies = '',
    profilePic = null,
    sidebarColor = '#800000' // Default maroon color if not specified
  } = data;

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

  // Format hobbies into a string
  const hobbiesText = safeText(hobbies) || '';

  // Determine job title from latest experience or default
  const jobTitle = experience && experience.length > 0 ? 
    experience[0].role || 'Professional' : 'Professional';

  // Create styles object with dynamic colors
  const dynamicStyles = {
    sidebar: {
      backgroundColor: sidebarColor
    },
    heading: {
      color: sidebarColor
    },
    borderBottom: {
      borderBottomColor: sidebarColor
    }
  };

  return (
    <div ref={ref} className="jobfit-pro-resume">
      <div className="resume-wrapper">
        {/* Sidebar */}
        <aside className="sidebar" style={dynamicStyles.sidebar}>
          {/* Profile Picture */}
          {profilePic && showProfile && (
            <div className="profile-photo-container">
              <img 
                src={profilePic} 
                alt="Profile" 
                className="profile-photo" 
                crossOrigin="anonymous"
              />
            </div>
          )}
          
          {/* Contact Information */}
          <div className="section">
            <h3>📞 Contact</h3>
            {phone && <p>{phone}</p>}
            {email && <p>{email}</p>}
            {linkedin && <p>{linkedin}</p>}
            {address && <p>{address}</p>}
            {github && <p>{github}</p>}
          </div>
          
          {/* Languages Section */}
          {languagesList.length > 0 && (
            <div className="section">
              <h3>🌐 Languages</h3>
              <ul>
                {languagesList.map((lang, index) => (
                  <li key={index}>
                    {lang.name}: {lang.level}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Software Skills Section - Using Technical Skills */}
          {technicalSkillsList.length > 0 && (
            <div className="section">
              <h3>💻 Software</h3>
              <ul>
                {technicalSkillsList.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* General Skills Section */}
          {(generalSkillsList.length > 0 || softSkillsList.length > 0) && (
            <div className="section">
              <h3>⚡ Skills</h3>
              <ul>
                {generalSkillsList.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
                {softSkillsList.map((skill, index) => (
                  <li key={`soft-${index}`}>{skill}</li>
                ))}
              </ul>
            </div>
          )}
        </aside>
        
        {/* Main Content */}
        <main className="main-content">
          <h1>{name.toUpperCase()}</h1>
          <h2 style={dynamicStyles.heading}>{jobTitle.toUpperCase()}</h2>
          
          {/* Professional Summary */}
          {professionalSummary && (
            <section className="summary">
              <p>{professionalSummary}</p>
            </section>
          )}
          
          {/* Education Section - Always visible */}
          <section className="education">
            <h3 style={{...dynamicStyles.heading, ...dynamicStyles.borderBottom}}>🎓 Education</h3>
            {education && education.length > 0 ? (
              education.map((edu, index) => (
                <p key={index}>
                  <strong>{edu.degree}</strong> – {edu.institution} ({edu.year})
                  {edu.percentage && <span> - {edu.percentage}%</span>}
                </p>
              ))
            ) : (
              <p>
                <strong>Bachelor of Technology in Computer Science</strong> – University Name (2020) - 75%
              </p>
            )}
          </section>
          
          {/* Work Experience Section - Always visible */}
          <section className="experience">
            <h3 style={{...dynamicStyles.heading, ...dynamicStyles.borderBottom}}>💼 Professional Experience</h3>
            {experience && experience.length > 0 ? (
              experience.map((job, index) => (
                <div key={index} className="experience-item">
                  <p>
                    <strong>{job.role} | {job.company} – {job.location || 'N/A'}</strong> ({job.duration})
                  </p>
                  {job.description && (
                    <ul>
                      {job.description.split('\n').map((item, i) => (
                        item.trim() !== '' && <li key={i}>{item.trim()}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))
            ) : (
              <div className="experience-item">
                <p>
                  <strong>Software Developer | Tech Company Inc. – N/A</strong> (Jan 2020 - Present)
                </p>
                <ul>
                  <li>Your work experience will appear here</li>
                </ul>
              </div>
            )}
          </section>
          
          {/* Projects Section - Always visible */}
          <section className="projects">
            <h3 style={{...dynamicStyles.heading, ...dynamicStyles.borderBottom}}>📋 Projects</h3>
            {projects && projects.length > 0 ? (
              projects.map((project, index) => (
                <div key={index} className="project-item">
                  <p><strong>{safeText(project.title)}</strong></p>
                  <p>{safeText(project.description)}</p>
                </div>
              ))
            ) : (
              <div className="project-item">
                <p><strong>Sample Project</strong></p>
                <p>Your projects will appear here</p>
              </div>
            )}
          </section>
          
          {/* Hobbies Section */}
          {hobbiesText && (
            <section className="hobbies">
              <h3 style={{...dynamicStyles.heading, ...dynamicStyles.borderBottom}}>🎯 Hobbies & Interests</h3>
              <p>{hobbiesText}</p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
});

export default JobFitProResume;
