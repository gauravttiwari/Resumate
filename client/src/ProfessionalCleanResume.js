/**
 * Professional Clean Resume Template Component
 * 
 * A modern, elegant ATS-friendly design with accent colors
 * Single-column layout with clean sections and visual highlights
 */
import React from 'react';
import { safeText, safeAchievement, safeArray } from './utils/safeRender';
import './styles/ProfessionalClean.css';

const ProfessionalCleanResume = React.forwardRef(({ data = {}, showProfile = true }, ref) => {
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
  
  // Get job title from most recent experience
  const jobTitle = experience && experience.length > 0 ? 
    experience[0].role || 'Professional' : 'Professional';
  
  // Get combined professional summary
  const professionalSummary = safeText(summary) || safeText(objective) || '';

  return (
    <div ref={ref} className="template-professional-clean">
      {/* Header Section */}
      <header className="resume-header">
        {profilePic && showProfile && (
          <div className="profile-pic">
            <img src={profilePic} alt="Profile" crossOrigin="anonymous" />
          </div>
        )}
        <h1 className="resume-name">{name}</h1>
        <p className="resume-title">{jobTitle}</p>
        <div className="contact-row">
          {email && (
            <span className="contact-item">
              <span className="contact-icon">✉</span> {email}
            </span>
          )}
          {phone && (
            <span className="contact-item">
              <span className="contact-icon">☎</span> {phone}
            </span>
          )}
          {address && (
            <span className="contact-item">
              <span className="contact-icon">⌂</span> {address}
            </span>
          )}
          {linkedin && (
            <span className="contact-item">
              <span className="contact-icon">in</span> {linkedin}
            </span>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {professionalSummary && (
        <section className="resume-section">
          <h2 className="section-title">Professional Summary</h2>
          <p className="summary-text">{professionalSummary}</p>
        </section>
      )}

      {/* Skills Section */}
      {(technicalSkillsList.length > 0 || softSkillsList.length > 0 || generalSkillsList.length > 0) && (
        <section className="resume-section">
          <h2 className="section-title">Skills</h2>
          <div className="skills-container">
            {technicalSkillsList.length > 0 && (
              <div className="skill-group">
                <h3>Technical Skills</h3>
                <div className="skill-list">
                  {technicalSkillsList.map((skill, index) => (
                    <span key={`tech-${index}`} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            )}
            {softSkillsList.length > 0 && (
              <div className="skill-group">
                <h3>Soft Skills</h3>
                <div className="skill-list">
                  {softSkillsList.map((skill, index) => (
                    <span key={`soft-${index}`} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            )}
            {generalSkillsList.length > 0 && !technicalSkillsList.length && !softSkillsList.length && (
              <div className="skill-group">
                <div className="skill-list">
                  {generalSkillsList.map((skill, index) => (
                    <span key={`gen-${index}`} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Experience Section - Always visible */}
      <section className="resume-section">
        <h2 className="section-title">Professional Experience</h2>
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
              </div>
              <div className="company-duration">
                <div className="experience-company">{job.company || 'Company'}</div>
                <div className="experience-duration">{job.duration || 'Duration'}</div>
              </div>
              <div className="experience-description">{job.description || 'Job description'}</div>
            </div>
          ))
        ) : (
          <div className="experience-item">
            <div className="experience-header">
              <div className="experience-title">Software Developer</div>
            </div>
            <div className="company-duration">
              <div className="experience-company">Tech Company Inc.</div>
              <div className="experience-duration">Jan 2020 - Present</div>
            </div>
            <div className="experience-description">Your work experience will appear here</div>
          </div>
        )}
      </section>

      {/* Projects Section */}
      {/* Projects Section - Always visible */}
      <section className="resume-section">
        <h2 className="section-title">Projects</h2>
        {projects && projects.length > 0 ? (
          projects.map((project, index) => (
            <div key={index} className="experience-item">
              <div className="experience-header">
                <div className="experience-title">{project.title || 'Project Title'}</div>
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

      {/* Two Column Layout for Education and Certifications */}
      <div className="two-column">
        {/* Education Section - Always visible */}
        <div className="column">
          <section className="resume-section">
            <h2 className="section-title">Education</h2>
            {education && education.length > 0 ? (
              education.map((edu, index) => (
                <div key={index} className="education-item">
                  <div className="education-left">
                    <div className="education-degree">{edu.degree || 'Degree'}</div>
                    <div className="education-institution">{edu.institution || 'Institution'}</div>
                  </div>
                  <div className="education-right">
                    <div className="education-date">{edu.year || 'Year'}</div>
                    {edu.percentage && <div className="education-gpa">{edu.percentage}%</div>}
                  </div>
                </div>
              ))
            ) : (
              <div className="education-item">
                <div className="education-left">
                  <div className="education-degree">Bachelor of Technology in Computer Science</div>
                  <div className="education-institution">University Name</div>
                </div>
                <div className="education-right">
                  <div className="education-date">2020</div>
                  <div className="education-gpa">75%</div>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Certifications & Achievements Section - Always visible */}
        <div className="column">
          <section className="resume-section">
            <h2 className="section-title">Certifications & Achievements</h2>
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
      </div>
    </div>
  );
});

export default ProfessionalCleanResume;
