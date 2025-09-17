import React from 'react';
import './styles/SmartResume.css';

// SmartResume - Structured Minimalist Design
// Lightweight renderer that follows a structured, minimalist layout similar to the provided PDF.
const SmartResume = React.forwardRef(({ data = {}, template = 'smart-resume' }, ref) => {
  const {
    name = data.name || data.personalInfo?.fullName || 'John Doe',
    title = data.title || data.personalInfo?.title || 'Senior Software Engineer',
    email = data.email || data.personalInfo?.email || 'johndoe@example.com',
    phone = data.phone || data.personalInfo?.phone || '+1 555 123 4567',
    location = data.location || data.personalInfo?.location || 'San Francisco, CA',
    summary = data.summary || data.personalInfo?.summary || data.profile || '',
    skills = data.skills || data.technicalSkills || '',
    experience = data.experience || [],
    education = data.education || []
  } = data || {};

  const templateClass = `smart-resume ${template}`;

  return (
    <div ref={ref} className={templateClass} id="smart-resume-root">
      <header className="sr-header">
        <div className="sr-name-block">
          <h1 className="sr-name">{name}</h1>
          <div className="sr-title">{title}</div>
        </div>
        <div className="sr-contact-block">
          <div>{email}</div>
          <div>{phone}</div>
          <div>{location}</div>
        </div>
      </header>

      {summary && (
        <section className="sr-section sr-summary">
          <h2>PROFILE</h2>
          <p>{summary}</p>
        </section>
      )}

      {skills && (
        <section className="sr-section sr-skills">
          <h2>KEY SKILLS</h2>
          <p>{skills}</p>
        </section>
      )}

      {experience && experience.length > 0 && (
        <section className="sr-section sr-experience">
          <h2>EXPERIENCE</h2>
          {experience.map((exp, idx) => (
            <div className="sr-experience-item" key={idx}>
              <div className="sr-exp-head">
                <div className="sr-role">{exp.role || exp.jobTitle || exp.position || 'Role'}</div>
                <div className="sr-duration">{exp.duration || exp.dates || exp.startEnd || ''}</div>
              </div>
              <div className="sr-company">{exp.company}</div>
              {exp.description && (
                <div className="sr-exp-desc">
                  {exp.description.split('\n').map((line, i) => line.trim() && <div key={i}>{line}</div>)}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {education && education.length > 0 && (
        <section className="sr-section sr-education">
          <h2>EDUCATION</h2>
          {education.map((edu, i) => (
            <div key={i} className="sr-edu-item">
              <div className="sr-degree">{edu.degree || edu.title}</div>
              <div className="sr-institution">{edu.institution || edu.school}{edu.year ? ` • ${edu.year}` : ''}</div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
});

export default SmartResume;
