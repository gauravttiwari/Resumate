// examples/ResumeFormWithAI.js
import React, { useState, useEffect } from 'react';
import GeminiAIContainer from '../components/ai/GeminiAIContainer';

/**
 * Example implementation showing how to integrate Gemini AI features into a Resume Form page
 */
const ResumeFormWithAI = () => {
  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    summary: '',
    skills: [],
    education: [],
    experience: [],
    projects: []
  });
  
  // State for job-related information
  const [jobInfo, setJobInfo] = useState({
    targetJobTitle: '',
    jobType: 'tech' // Can be 'tech', 'non-tech', 'medical', or 'diploma'
  });

  // Placeholder for available templates
  const [availableTemplates, setAvailableTemplates] = useState([
    { id: 'template1', name: 'Modern Professional', type: 'tech' },
    { id: 'template2', name: 'Clean Minimal', type: 'tech' },
    { id: 'template3', name: 'Creative Sidebar', type: 'non-tech' },
    { id: 'template4', name: 'Medical Standard', type: 'medical' },
    { id: 'template5', name: 'Academic Focused', type: 'diploma' }
  ]);
  
  // State for selected template
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle job info changes
  const handleJobInfoChange = (e) => {
    const { name, value } = e.target;
    setJobInfo(prevInfo => ({
      ...prevInfo,
      [name]: value
    }));
  };

  // Handle updating resume data from AI suggestions
  const handleUpdateResume = (updatedData) => {
    setFormData(prevData => ({
      ...prevData,
      ...updatedData
    }));
  };

  // Handle template selection
  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
  };

  // Example form fields (simplified)
  const renderBasicFields = () => (
    <div className="form-section">
      <h2>Personal Information</h2>
      
      <div className="form-group">
        <label htmlFor="name">Full Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="phone">Phone</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="address">Address</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );

  const renderJobFields = () => (
    <div className="form-section">
      <h2>Job Target</h2>
      
      <div className="form-group">
        <label htmlFor="targetJobTitle">Target Job Title</label>
        <input
          type="text"
          id="targetJobTitle"
          name="targetJobTitle"
          value={jobInfo.targetJobTitle}
          onChange={handleJobInfoChange}
          placeholder="e.g. Frontend Developer, Data Analyst"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="jobType">Job Type</label>
        <select
          id="jobType"
          name="jobType"
          value={jobInfo.jobType}
          onChange={handleJobInfoChange}
        >
          <option value="tech">Tech</option>
          <option value="non-tech">Non-Tech</option>
          <option value="medical">Medical</option>
          <option value="diploma">Diploma/Academic</option>
        </select>
      </div>
    </div>
  );

  const renderSummaryField = () => (
    <div className="form-section">
      <h2>Professional Summary</h2>
      <div className="form-group">
        <label htmlFor="summary">Summary</label>
        <textarea
          id="summary"
          name="summary"
          value={formData.summary}
          onChange={handleInputChange}
          rows="4"
          placeholder="Write a professional summary or use the AI Summary Generator"
        ></textarea>
      </div>
    </div>
  );

  const renderSkillsField = () => (
    <div className="form-section">
      <h2>Skills</h2>
      <div className="form-group">
        <label>Skills (comma-separated)</label>
        <input
          type="text"
          value={formData.skills.join(', ')}
          onChange={(e) => {
            const skillsArray = e.target.value.split(',')
              .map(skill => skill.trim())
              .filter(skill => skill !== '');
            setFormData(prev => ({ ...prev, skills: skillsArray }));
          }}
          placeholder="e.g. JavaScript, React, Project Management"
        />
      </div>
    </div>
  );

  return (
    <div className="resume-form-page">
      <div className="container">
        <header>
          <h1>Create Your Resume</h1>
          <p>Fill in your details below and let our AI help optimize your resume</p>
        </header>
        
        <div className="resume-builder">
          <div className="form-container">
            <form>
              {renderBasicFields()}
              {renderJobFields()}
              {renderSummaryField()}
              {renderSkillsField()}
              
              {/* Other form sections would go here (experience, education, etc.) */}
              
              <div className="form-actions">
                <button type="button" className="save-button">Save Progress</button>
                <button type="button" className="preview-button">Preview Resume</button>
              </div>
            </form>
          </div>
          
          {/* Gemini AI integration */}
          <div className="ai-sidebar">
            <h2>Resume AI Assistant</h2>
            <p>Our AI can help optimize your resume for job success</p>
            
            {/* Only show AI features once we have some form data */}
            {formData.name && (
              <GeminiAIContainer 
                resumeData={formData}
                targetJobTitle={jobInfo.targetJobTitle}
                jobType={jobInfo.jobType}
                availableTemplates={availableTemplates}
                onUpdateResume={handleUpdateResume}
                onSelectTemplate={handleSelectTemplate}
              />
            )}
          </div>
        </div>
        
        {/* Display the selected template info if available */}
        {selectedTemplate && (
          <div className="selected-template">
            <h3>Selected Template: {selectedTemplate.name}</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeFormWithAI;