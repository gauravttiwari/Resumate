import React from 'react';
import './ResumePreview.css';

const ResumePreview = ({ formData, templateType = 'modern' }) => {
  // Get the theme from the parent container
  const theme = document.querySelector('.app-container').classList.contains('dark-theme') ? 'dark' : 'light';
  
  // Use formData for preview
  const data = formData;
  const formatDate = (dateString) => {
    return dateString;
  };

  return (
    <div className={`resume-preview ${theme}-theme`}>
      <div className="preview-header">
        <h2>Resume Preview</h2>
        <p className="preview-note">This is how your resume will appear when generated</p>
      </div>

      <div className={`preview-content template-${templateType}`}>
        {/* Header / Personal Info */}
        <div className="preview-section preview-header-section">
          <div className="preview-header-content">
            {data.profilePic && (
              <div className="preview-profile-pic">
                <img 
                  src={data.profilePic} 
                  alt="Profile" 
                  className="preview-profile-image"
                />
              </div>
            )}
            <div className="preview-personal-info">
              <h1 className="preview-name">{data.name || 'Your Name'}</h1>
              <div className="preview-contact">
                {data.email && <span className="preview-email">{data.email}</span>}
                {data.phone && <span className="preview-phone">{data.phone}</span>}
                {data.address && <span className="preview-address">{data.address}</span>}
              </div>
            </div>
          </div>
        </div>
        
        {/* Career Objective */}
        {data.objective && (
          <div className="preview-section">
            <h3 className="preview-section-title">Career Objective</h3>
            <div className="preview-objective">{data.objective}</div>
          </div>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <div className="preview-section">
            <h3 className="preview-section-title">Education</h3>
            {data.education.map((edu, index) => (
              <div key={index} className="preview-education-item">
                <div className="preview-degree">{edu.degree || 'Degree'}</div>
                <div className="preview-institution">{edu.institution || 'Institution'}</div>
                <div className="preview-edu-details">
                  <span>{edu.year || 'Year'}</span>
                  {edu.percentage && <span> • {edu.percentage}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <div className="preview-section">
            <h3 className="preview-section-title">Experience</h3>
            {data.experience.map((exp, index) => (
              <div key={index} className="preview-experience-item">
                <div className="preview-role">{exp.role || 'Role'}</div>
                <div className="preview-company">{exp.company || 'Company'}</div>
                <div className="preview-duration">{exp.duration || 'Duration'}</div>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <div className="preview-section">
            <h3 className="preview-section-title">Projects</h3>
            {data.projects.map((proj, index) => (
              <div key={index} className="preview-project-item">
                <div className="preview-project-title">{proj.title || 'Project Title'}</div>
                <div className="preview-project-description">{proj.description || 'Description'}</div>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <div className="preview-section">
            <h3 className="preview-section-title">Skills</h3>
            <div className="preview-skills">
              {data.skills.join(' • ')}
            </div>
          </div>
        )}

        {/* Achievements */}
        {data.achievements && data.achievements.filter(Boolean).length > 0 && (
          <div className="preview-section">
            <h3 className="preview-section-title">Achievements</h3>
            <ul className="preview-achievements">
              {data.achievements.filter(Boolean).map((achievement, index) => (
                <li key={index} className="preview-achievement-item">{achievement}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumePreview;
