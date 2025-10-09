/**
 * Enhancv-Style Professional Resume Template
 * 
 * Clean left-right section layout inspired by Enhancv design
 * Professional two-column design with profile photo support
 */
import React from 'react';
import { safeText, safeAchievement, safeArray } from './utils/safeRender';
import './styles/EnhancvResume.css';

const EnhancvResume = React.forwardRef(({ data = {}, showProfile = true }, ref) => {
  // Destructure resume data with defaults
  const { 
    name = '', 
    email = '', 
    phone = '', 
    linkedin = '',
    github = '',
    location = '',
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
    profilePic = null
  } = data;

  // Format skills into an array
  const formatSkillsList = (skillsString) => {
    if (!skillsString) return [];
    const text = safeText(skillsString);
    return text.split(',').map(skill => skill.trim()).filter(Boolean);
  };

  // Format languages for display
  const formatLanguages = (languagesString) => {
    if (!languagesString) return [];
    const text = safeText(languagesString);
    // Handle both "English - Native, Spanish - Intermediate" and simple comma-separated format
    return text.split(',').map(lang => {
      const trimmed = lang.trim();
      if (trimmed.includes(' - ')) {
        const [name, level] = trimmed.split(' - ');
        return { name: name.trim(), level: level.trim() };
      }
      return { name: trimmed, level: 'Proficient' };
    }).filter(lang => lang.name);
  };

  const skillsList = formatSkillsList(skills || technicalSkills);
  const languagesList = formatLanguages(languages);

  return (
    <div ref={ref} className="enhancv-resume">
      <div className="resume-container">
        {/* LEFT PANEL */}
        <aside className="left-panel">
          {showProfile && profilePic && (
            <img 
              src={profilePic} 
              alt="Profile" 
              className="profile-pic"
              crossOrigin="anonymous"
            />
          )}
          
          <h1 className="name">{safeText(name) || 'Your Name'}</h1>
          <h3 className="title">{safeText(objective || summary) || 'Professional Title'}</h3>
          
          <div className="contact">
            {phone && <p>📞 {safeText(phone)}</p>}
            {email && <p>📧 {safeText(email)}</p>}
            {location && <p>🌍 {safeText(location)}</p>}
            {linkedin && <p>🔗 {safeText(linkedin)}</p>}
            {github && <p>💻 {safeText(github)}</p>}
          </div>

          {/* Skills Section */}
          <div className="skills-section">
            <h2>Skills</h2>
            <ul className="skills-list">
              {skillsList.length > 0 ? (
                skillsList.slice(0, 8).map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))
              ) : (
                <li>Your key skills will appear here</li>
              )}
            </ul>
          </div>

          {/* Languages Section */}
          {languagesList.length > 0 && (
            <div className="languages-section">
              <h2>Languages</h2>
              <ul className="languages-list">
                {languagesList.map((lang, index) => (
                  <li key={index}>
                    <span className="lang-name">{lang.name}</span>
                    <span className="lang-level">{lang.level}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Soft Skills */}
          {softSkills && (
            <div className="soft-skills-section">
              <h2>Strengths</h2>
              <ul className="soft-skills-list">
                {formatSkillsList(softSkills).slice(0, 5).map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
          )}
        </aside>

        {/* RIGHT PANEL */}
        <section className="right-panel">
          {/* Summary Section */}
          <div className="summary-section">
            <h2>Summary</h2>
            <p className="summary-text">
              {safeText(summary) || 'Your professional summary will appear here. Highlight your key expertise, years of experience, and what makes you unique as a candidate.'}
            </p>
          </div>

          {/* Experience Section */}
          <div className="experience-section">
            <h2>Experience</h2>
            {experience && experience.length > 0 ? (
              experience.map((exp, index) => (
                <div key={index} className="job">
                  <h3 className="job-title">
                    {safeText(exp.role || exp.position) || 'Job Title'} | {safeText(exp.company) || 'Company Name'}
                  </h3>
                  <p className="job-duration">
                    {safeText(exp.duration) || 'Duration'} {exp.location && `| ${safeText(exp.location)}`}
                  </p>
                  {exp.description && (
                    <ul className="job-details">
                      {safeText(exp.description).split('\n').map((detail, i) => 
                        detail.trim() && <li key={i}>{detail.trim()}</li>
                      )}
                    </ul>
                  )}
                </div>
              ))
            ) : (
              <div className="job">
                <h3 className="job-title">Senior Software Engineer | Tech Company</h3>
                <p className="job-duration">2020 - Present | Remote</p>
                <ul className="job-details">
                  <li>Your work experience will appear here</li>
                  <li>Add your key responsibilities and achievements</li>
                </ul>
              </div>
            )}
          </div>

          {/* Projects Section */}
          {projects && projects.length > 0 && (
            <div className="projects-section">
              <h2>Key Projects</h2>
              {projects.map((project, index) => (
                <div key={index} className="project">
                  <h3 className="project-title">{safeText(project.title) || `Project ${index + 1}`}</h3>
                  {project.description && (
                    <ul className="project-details">
                      {safeText(project.description).split('\n').map((detail, i) => 
                        detail.trim() && <li key={i}>{detail.trim()}</li>
                      )}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Education Section */}
          <div className="education-section">
            <h2>Education</h2>
            <ul className="education-list">
              {education && education.length > 0 ? (
                education.map((edu, index) => (
                  <li key={index}>
                    <strong>{safeText(edu.degree) || 'Degree'}</strong> — {safeText(edu.institution || edu.school) || 'Institution'} 
                    {edu.year && ` (${safeText(edu.year)})`}
                    {edu.percentage && ` - ${safeText(edu.percentage)}`}
                  </li>
                ))
              ) : (
                <li><strong>Bachelor of Technology</strong> — University Name (2020)</li>
              )}
            </ul>
          </div>

          {/* Achievements & Certifications Section */}
          {((achievements && achievements.length > 0) || (certifications && certifications.length > 0)) && (
            <div className="achievements-section">
              <h2>Achievements & Certifications</h2>
              <ul className="achievements-list">
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
                    <li>Your achievements and certifications will appear here</li>
                  );
                })()}
              </ul>
            </div>
          )}
        </section>
      </div>

      {/* Enhancv-style footer */}
      <div className="resume-footer">
        <span className="resume-website">www.enhancv.com</span>
        <span className="powered-by">Powered by ResuMate</span>
      </div>
    </div>
  );
});

export default EnhancvResume;