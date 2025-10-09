/**
 * ProProfile - Elegant Corporate Resume Template
 * 
 * A professional two-column template designed for corporate environments
 * featuring a dark sidebar with core competencies and a clean main section
 * for experience and education. ATS-friendly and print-optimized.
 */
import React from 'react';
import { safeText, safeAchievement, safeArray } from './utils/safeRender';
import './styles/ProProfile.css';

const ProProfileResume = React.forwardRef(({ data = {}, showProfile = true }, ref) => {
  // Destructure resume data with defaults
  const { 
    name = '', 
    email = '', 
    phone = '', 
    address = '',
    linkedin = '',
    github = '',
    website = '',
    summary = '',
    skills = '',
    technicalSkills = '',
    softSkills = '',
    certifications = [],
    experience = [],
    projects = [],
    education = [],
    achievements = [],
    profilePic = null,
    sidebarColor = '#1a365d' // Default dark blue color
  } = data;

  // Helper to safely convert values to text
  const safeText = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value.text !== undefined) return String(value.text || '');
    if (Array.isArray(value)) return value.map(v => safeText(v)).filter(Boolean).join(', ');
    return '';
  };

  // Format skills into arrays
  const formatSkillsList = (skillsString) => {
    if (!skillsString) return [];
    const text = safeText(skillsString);
    return text.split(',').map(skill => skill.trim()).filter(Boolean);
  };

  const technicalSkillsList = formatSkillsList(technicalSkills);
  const softSkillsList = formatSkillsList(softSkills);
  const generalSkillsList = formatSkillsList(skills);
  
  // Combine all skills
  const allSkills = [...generalSkillsList, ...technicalSkillsList, ...softSkillsList];

  // Create a professional headline from the most recent job title
  const professionalHeadline = experience && experience.length > 0 
    ? experience[0].role 
    : 'Professional';

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

  // Group skills into core competencies
  // Each group will have an icon and up to 3 skills
  const createCompetencyGroups = (skills) => {
    if (!skills || skills.length === 0) return [];
    
    const icons = ['📊', '🌟', '⚡', '🔄', '📈', '🛠️', '🔍', '💼'];
    const competencies = [
      { name: 'Process Improvement', icon: '📊', skills: [] },
      { name: 'Leadership', icon: '🌟', skills: [] },
      { name: 'Risk Management', icon: '⚡', skills: [] },
      { name: 'Innovation', icon: '💡', skills: [] },
      { name: 'Technical', icon: '🛠️', skills: [] },
      { name: 'Analytics', icon: '📈', skills: [] }
    ];
    
    // Distribute skills among competency groups
    skills.forEach((skill, index) => {
      const groupIndex = index % competencies.length;
      competencies[groupIndex].skills.push(skill);
    });
    
    // Only return groups that have skills
    return competencies.filter(group => group.skills.length > 0);
  };
  
  const competencyGroups = createCompetencyGroups(allSkills);

  return (
    <div ref={ref} className="template-proprofile">
      {/* Left Sidebar */}
      <aside className="sidebar" style={dynamicStyles.sidebar}>
        {/* Full Name */}
        <h1 className="name">{name.toUpperCase()}</h1>
        
        {/* Profile Picture - Optional */}
        {profilePic && showProfile && (
          <div className="profile-pic">
            <img src={profilePic} alt="Profile" crossOrigin="anonymous" />
          </div>
        )}
        
        {/* Skills Section */}
        {allSkills.length > 0 && (
          <section className="skills">
            <h2>SKILLS</h2>
            <div className="skills-list">
              {allSkills.map((skill, index) => (
                <span key={index} className="skill-item">
                  {skill}
                  {index < allSkills.length - 1 && <span className="separator">•</span>}
                </span>
              ))}
            </div>
          </section>
        )}
        
        {/* Certifications Section */}
        {certifications.length > 0 && (
          <section className="certifications">
            <h2>CERTIFICATION</h2>
            {certifications.map((cert, index) => (
              <p key={index}>
                {typeof cert === 'object' && cert.text ? cert.text : cert}
              </p>
            ))}
          </section>
        )}
        
        {/* Core Competencies Section */}
        {competencyGroups.length > 0 && (
          <section className="competencies">
            <h2>CORE COMPETENCIES</h2>
            {competencyGroups.map((group, index) => (
              <div key={index} className="competency-group">
                <p>
                  <span className="competency-icon">{group.icon}</span>
                  <span className="competency-name">{group.name}</span>
                </p>
                <div className="competency-skills">
                  {group.skills.map((skill, skillIndex) => (
                    <span key={skillIndex} className="competency-skill">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}
        
        {/* Achievements - Always visible */}
        <section className="achievements">
          <h2>ACHIEVEMENTS</h2>
          <ul>
            {(() => {
              const achvItems = achievements && achievements.length > 0
                ? achievements.map((achievement, index) => {
                    const text = safeAchievement(achievement);
                    return text ? <li key={index}>{text}</li> : null;
                  }).filter(Boolean)
                : [];
              
              return achvItems.length > 0 ? achvItems : (
                <li>Your achievements will appear here</li>
              );
            })()}
          </ul>
        </section>
      </aside>
      
      {/* Main Content */}
      <main className="main-content">
        {/* Professional Headline */}
        <h2 className="headline" style={dynamicStyles.heading}>
          {professionalHeadline.toUpperCase()}
        </h2>
        
        {/* Contact Information */}
        <header className="contact-info">
          {phone && <p><span className="icon">📞</span> {phone}</p>}
          {email && <p><span className="icon">✉️</span> {email}</p>}
          {address && <p><span className="icon">📍</span> {address}</p>}
          {linkedin && <p><span className="icon">🔗</span> {linkedin}</p>}
          {github && <p><span className="icon">💻</span> {github}</p>}
          {website && <p><span className="icon">🌐</span> {website}</p>}
        </header>
        
        {/* Summary Section */}
        {summary && (
          <section className="summary">
            <h2 style={{...dynamicStyles.heading, ...dynamicStyles.borderBottom}}>SUMMARY</h2>
            <p>{safeText(summary)}</p>
          </section>
        )}
        
        {/* Experience Section */}
        {experience && experience.length > 0 && (
          <section className="experience">
            <h2 style={{...dynamicStyles.heading, ...dynamicStyles.borderBottom}}>EXPERIENCE</h2>
            
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
                <h3>{job.role || 'Position'} | {job.company || 'Company'}</h3>
                <span className="duration-location">
                  {job.duration || 'Duration'} | {job.location || 'Location'}
                </span>
                <ul className="job-description">
                  {job.description && job.description.split('.').filter(item => item.trim()).map((point, pointIndex) => (
                    <li key={pointIndex}>{point.trim()}.</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}
        
        {/* Projects Section - If provided */}
        {/* Projects Section - Always visible */}
        <section className="projects">
          <h2 style={{...dynamicStyles.heading, ...dynamicStyles.borderBottom}}>PROJECTS</h2>
          {projects && projects.length > 0 ? (
            projects.map((project, index) => (
              <div key={index} className="project-item">
                <h3>{project.title || 'Project'}</h3>
                <p>{project.description || 'Project description'}</p>
              </div>
            ))
          ) : (
            <div className="project-item">
              <h3>Sample Project</h3>
              <p>Your projects will appear here</p>
            </div>
          )}
        </section>
        
        {/* Education Section - Always visible */}
        <section className="education">
          <h2 style={{...dynamicStyles.heading, ...dynamicStyles.borderBottom}}>EDUCATION</h2>
          {education && education.length > 0 ? (
            education.map((edu, index) => (
              <div key={index} className="education-item">
                <p className="institution">{edu.institution || 'Institution'}</p>
                <p className="degree">{edu.degree || 'Degree'} {edu.year ? `- ${edu.year}` : ''}</p>
              </div>
            ))
          ) : (
            <div className="education-item">
              <p className="institution">University Name</p>
              <p className="degree">Bachelor of Technology in Computer Science - 2020</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
});

export default ProProfileResume;
