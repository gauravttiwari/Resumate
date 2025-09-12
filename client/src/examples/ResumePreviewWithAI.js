// examples/ResumePreviewWithAI.js
import React, { useState, useEffect } from 'react';
import ATSScoreCard from '../components/ai/ATSScoreCard';
import ResumeHelper from '../components/ai/ResumeHelper';

/**
 * Example implementation showing how to integrate AI ATS scoring into a Resume Preview page
 */
const ResumePreviewWithAI = ({ resumeData, selectedTemplate, targetJobTitle }) => {
  // State for tracking if the resume has been analyzed
  const [showATSAnalysis, setShowATSAnalysis] = useState(false);
  
  // Simulated resume HTML content (would be generated based on selected template)
  const [resumeHtml, setResumeHtml] = useState('');
  
  // Generate resume HTML based on template and data
  useEffect(() => {
    if (resumeData && selectedTemplate) {
      // This would typically use a template engine or component to generate the HTML
      // Here we're just simulating it with a placeholder
      const generatedHtml = `
        <div class="resume-preview ${selectedTemplate.id}">
          <header class="resume-header">
            <h1>${resumeData.name || 'Your Name'}</h1>
            <div class="contact-info">
              <p>${resumeData.email || 'email@example.com'} | ${resumeData.phone || '(123) 456-7890'}</p>
              <p>${resumeData.address || 'City, State'}</p>
            </div>
          </header>
          
          <section class="resume-summary">
            <h2>Professional Summary</h2>
            <p>${resumeData.summary || 'Professional summary will appear here.'}</p>
          </section>
          
          <section class="resume-skills">
            <h2>Skills</h2>
            <ul class="skills-list">
              ${(resumeData.skills || []).map(skill => `<li>${skill}</li>`).join('')}
            </ul>
          </section>
          
          <section class="resume-experience">
            <h2>Work Experience</h2>
            ${(resumeData.experience || []).length > 0 ? 
              (resumeData.experience || []).map(exp => `
                <div class="experience-item">
                  <h3>${exp.title || 'Job Title'} at ${exp.company || 'Company Name'}</h3>
                  <p class="date-range">${exp.startDate || 'Start Date'} - ${exp.endDate || 'End Date'}</p>
                  <p>${exp.description || 'Job description'}</p>
                </div>
              `).join('') : 
              '<p>No experience added yet.</p>'
            }
          </section>
          
          <section class="resume-education">
            <h2>Education</h2>
            ${(resumeData.education || []).length > 0 ? 
              (resumeData.education || []).map(edu => `
                <div class="education-item">
                  <h3>${edu.degree || 'Degree'} - ${edu.institution || 'Institution'}</h3>
                  <p class="date-range">${edu.startYear || 'Start Year'} - ${edu.endYear || 'End Year'}</p>
                </div>
              `).join('') : 
              '<p>No education added yet.</p>'
            }
          </section>
        </div>
      `;
      
      setResumeHtml(generatedHtml);
    }
  }, [resumeData, selectedTemplate]);

  // Toggle ATS analysis visibility
  const toggleATSAnalysis = () => {
    setShowATSAnalysis(prev => !prev);
  };

  // Handle download click
  const handleDownload = () => {
    alert('Resume download functionality would be implemented here');
    // Implementation would typically use a library like jsPDF or html2pdf
  };

  return (
    <div className="resume-preview-page">
      <div className="container">
        <header>
          <h1>Resume Preview</h1>
          <p>Review your resume and analyze its ATS compatibility</p>
          
          <div className="preview-actions">
            <button className="download-button" onClick={handleDownload}>
              Download PDF
            </button>
            
            <button className="ats-button" onClick={toggleATSAnalysis}>
              {showATSAnalysis ? 'Hide ATS Analysis' : 'Analyze ATS Compatibility'}
            </button>
          </div>
        </header>
        
        <div className="preview-container">
          <div className="resume-document">
            {/* This would typically be a properly styled resume, but we're using dangerouslySetInnerHTML for this example */}
            <div 
              className="resume-content"
              dangerouslySetInnerHTML={{ __html: resumeHtml }}
            ></div>
          </div>
          
          {/* ATS Analysis Section */}
          {showATSAnalysis && resumeData && targetJobTitle && (
            <div className="ats-analysis-section">
              <ATSScoreCard 
                resumeData={resumeData}
                targetJobTitle={targetJobTitle}
              />
            </div>
          )}
        </div>
        
        <div className="action-buttons">
          <button className="back-button">Back to Edit</button>
          <button className="share-button">Share Resume</button>
        </div>
      </div>
      
      {/* Always show the AI helper chat for contextual help */}
      <ResumeHelper resumeData={resumeData} />
    </div>
  );
};

export default ResumePreviewWithAI;