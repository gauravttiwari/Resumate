/**
 * HTML-based resume generator
 * This replaces the LaTeX-based PDF generation with pure HTML and CSS
 */

import React from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
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
const HTMLResume = React.forwardRef(({ data, template = 'modern' }, ref) => {
  // Default template to modern if not provided or invalid
  const templateClass = templateStyles[template] || templateStyles.modern;
  
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
          <p className="objective-text">{objective}</p>
        </section>
      )}

      {/* Education section */}
      {education && education.length > 0 && (
        <section className="resume-section">
          <h2 className="section-title">EDUCATION</h2>
          <ul className="education-list">
            {education.map((edu, index) => (
              <li key={index} className="education-item">
                <div className="education-degree">{edu.degree}</div>
                <div className="education-details">
                  {edu.institution} 
                  {edu.year && <span> • {edu.year}</span>} 
                  {edu.percentage && <span> • {edu.percentage}</span>}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Experience section */}
      {experience && experience.length > 0 && (
        <section className="resume-section">
          <h2 className="section-title">PROFESSIONAL EXPERIENCE</h2>
          <ul className="experience-list">
            {experience.map((exp, index) => (
              <li key={index} className="experience-item">
                <div className="experience-role">
                  <strong>{exp.role}</strong> at {exp.company}
                </div>
                <div className="experience-duration">{exp.duration}</div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Projects section */}
      {projects && projects.length > 0 && (
        <section className="resume-section">
          <h2 className="section-title">PROJECTS</h2>
          <ul className="projects-list">
            {projects.map((project, index) => (
              <li key={index} className="project-item">
                <div className="project-title">{project.title}</div>
                <div className="project-description">{project.description}</div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Skills section */}
      {skills && (
        <section className="resume-section">
          <h2 className="section-title">SKILLS</h2>
          <p className="skills-text">{skills}</p>
        </section>
      )}

      {/* Achievements section */}
      {achievements && (
        <section className="resume-section">
          <h2 className="section-title">ACHIEVEMENTS</h2>
          <p className="achievements-text">{achievements}</p>
        </section>
      )}
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
