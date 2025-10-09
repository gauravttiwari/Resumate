/**
 * HTML-based resume generator
 * This replaces the LaTeX-based PDF generation with pure HTML and CSS
 */

import React from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { safeText, safeAchievement, safeArray } from './utils/safeRender';
import '../styles/HTMLResume.css'; // We'll create this file for resume styling

// Map of template names to their style classes
const templateStyles = {
  modern: 'resume-template-modern',
  professional: 'resume-template-professional',
  simple: 'resume-template-simple',
  creative: 'resume-template-creative',
  academic: 'resume-template-academic',
};

/**
 * Renders a resume in HTML format based on template and data
 */
const HTMLResume = React.forwardRef(({ data = {}, template = 'modern' }, ref) => {
  // Default template to modern if not provided or invalid
  const templateClass = templateStyles[template] || templateStyles.modern;
  
  // Helper to safely convert values to text
  const safeText = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value.text !== undefined) return String(value.text || '');
    if (Array.isArray(value)) return value.map(v => safeText(v)).filter(Boolean).join(', ');
    return '';
  };
  
  // Destructure resume data
  const { 
    name, 
    email, 
    phone, 
    address, 
    objective, 
    education = [], 
    experience = [], 
    skills = '', 
    projects = [], 
    achievements = '',
    profilePic
  } = data;
  
  return (
    <div ref={ref} className={`resume-container ${templateClass}`}>
      {/* Header section */}
      <header className="resume-header">
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
        <div className="contact-info">
          <h1 className="resume-name">{name || 'Your Name'}</h1>
          <p className="resume-contact">
            {address && <span>{address} • </span>}
            {phone && <span>{phone} • </span>}
            {email && <span><a href={`mailto:${email}`}>{email}</a></span>}
          </p>
        </div>
      </header>

      {/* Objective section */}
      {objective && (
        <section className="resume-section">
          <h2 className="section-title">CAREER OBJECTIVE</h2>
          <p className="objective-text">{safeText(objective)}</p>
        </section>
      )}

      {/* Education section - Always visible */}
      <section className="resume-section">
        <h2 className="section-title">EDUCATION</h2>
        <ul className="education-list">
          {education && education.length > 0 ? (
            education.map((edu, index) => (
              <li key={index} className="education-item">
                <div className="education-degree">{safeText(edu.degree)}</div>
                <div className="education-details">
                  {safeText(edu.institution)} 
                  {edu.year && <span> • {safeText(edu.year)}</span>} 
                  {edu.percentage && <span> • {safeText(edu.percentage)}</span>}
                </div>
              </li>
            ))
          ) : (
            <li className="education-item">
              <div className="education-degree">Bachelor of Technology in Computer Science</div>
              <div className="education-details">
                University Name • 2020 • 75%
              </div>
            </li>
          )}
        </ul>
      </section>

      {/* Experience section - Always visible */}
      <section className="resume-section">
        <h2 className="section-title">PROFESSIONAL EXPERIENCE</h2>
        <ul className="experience-list">
          {experience && experience.length > 0 ? (
            experience.map((exp, index) => (
              <li key={index} className="experience-item">
                <div className="experience-role">
                  <strong>{safeText(exp.role)}</strong> at {safeText(exp.company)}
                </div>
                <div className="experience-duration">{safeText(exp.duration)}</div>
              </li>
            ))
          ) : (
            <li className="experience-item">
              <div className="experience-role">
                <strong>Software Developer</strong> at Tech Company Inc.
              </div>
              <div className="experience-duration">Jan 2020 - Present</div>
            </li>
          )}
        </ul>
      </section>

      {/* Projects section - Always visible */}
      <section className="resume-section">
        <h2 className="section-title">PROJECTS</h2>
        <ul className="projects-list">
          {projects && projects.length > 0 ? (
            projects.map((project, index) => (
              <li key={index} className="project-item">
                <div className="project-title">{safeText(project.title)}</div>
                <div className="project-description">{safeText(project.description)}</div>
              </li>
            ))
          ) : (
            <li className="project-item">
              <div className="project-title">Sample Project</div>
              <div className="project-description">Your projects will appear here</div>
            </li>
          )}
        </ul>
      </section>

      {/* Skills section */}
      {skills && (
        <section className="resume-section">
          <h2 className="section-title">SKILLS</h2>
          <p className="skills-text">{safeText(skills)}</p>
        </section>
      )}

      {/* Achievements section - Always visible */}
      <section className="resume-section">
        <h2 className="section-title">ACHIEVEMENTS</h2>
        {achievements && achievements.length > 0 ? (
          <ul className="achievements-list">
            {achievements.map((achievement, index) => {
              const text = safeAchievement(achievement);
              return text ? <li key={index}>{text}</li> : null;
            })}
          </ul>
        ) : (
          <p className="achievements-text">Your achievements will appear here</p>
        )}
      </section>
    </div>
  );
});

/**
 * Generates a PDF from resume data
 */
export const generateResumePDF = async (resumeData, template = 'modern') => {
  // Create a container for the resume
  const container = document.createElement('div');
  document.body.appendChild(container);
  
  // Use ReactDOM to render our component to this container
  const ReactDOM = require('react-dom');
  ReactDOM.render(
    <HTMLResume data={resumeData} template={template} />,
    container
  );
  
  try {
    // Convert the HTML resume to a canvas
    const canvas = await html2canvas(container, {
      scale: 2, // Higher quality
      useCORS: true,
      logging: false
    });
    
    // Create PDF with correct dimensions (A4)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Add the canvas as an image
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    
    pdf.addImage(
      imgData, 'JPEG',
      0, 0,
      imgWidth * ratio, imgHeight * ratio
    );
    
    // Clean up the temporary container
    document.body.removeChild(container);
    
    // Return PDF as blob URL
    const pdfBlob = pdf.output('blob');
    return {
      pdf: URL.createObjectURL(pdfBlob),
      type: 'html-generated'
    };
  } catch (error) {
    console.error('Error generating PDF:', error);
    // Clean up the temporary container
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
    throw error;
  }
};

export default HTMLResume;
