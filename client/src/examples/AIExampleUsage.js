// examples/AIExampleUsage.js

import React, { useState } from 'react';
import aiService from '../services/aiService';
import GeminiAIContainer from '../components/ai/GeminiAIContainer';

/**
 * Example component demonstrating how to use the AI services
 */
const AIExampleUsage = () => {
  // Sample resume data
  const [resumeData, setResumeData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    location: 'New York, NY',
    title: 'Software Engineer',
    summary: 'Experienced software engineer with a focus on web development.',
    workExperience: [
      {
        company: 'Tech Company',
        position: 'Senior Developer',
        startDate: '2020-01',
        endDate: 'Present',
        description: 'Developed and maintained web applications using React and Node.js.'
      }
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB'],
    education: [
      {
        institution: 'University of Technology',
        degree: 'Bachelor of Science in Computer Science',
        date: '2019'
      }
    ]
  });
  
  const [jobTitle, setJobTitle] = useState('Full Stack Developer');
  const [jobType, setJobType] = useState('tech');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  // Example of directly calling the AI service
  const handleOptimizeResume = async () => {
    setLoading(true);
    try {
      const optimizationResult = await aiService.optimizeResume(resumeData, jobTitle);
      setResult(optimizationResult);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };
  
  // Example of directly calling the AI service
  const handleGenerateSummary = async () => {
    setLoading(true);
    try {
      const summary = await aiService.generateSummary(resumeData);
      setResult({ summary });
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };
  
  // Example of using the GeminiAIContainer component
  const handleUpdateResume = (updatedResumeData) => {
    setResumeData(updatedResumeData);
    setResult({ message: 'Resume data updated successfully' });
  };
  
  // Example templates for demonstration
  const availableTemplates = [
    { id: 'standard', name: 'Standard Resume' },
    { id: 'modern', name: 'Modern Sidebar' },
    { id: 'professional', name: 'Professional Clean' },
    { id: 'reverse-chrono', name: 'Reverse Chronological' }
  ];
  
  const handleSelectTemplate = (templateId) => {
    setResult({ message: `Selected template: ${templateId}` });
  };

  return (
    <div className="ai-example-container">
      <h1>Gemini AI Integration Examples</h1>
      
      <h2>1. Direct API Calls</h2>
      <div className="example-actions">
        <button onClick={handleOptimizeResume} disabled={loading}>
          Optimize Resume
        </button>
        <button onClick={handleGenerateSummary} disabled={loading}>
          Generate Summary
        </button>
      </div>
      
      {loading && <div className="loading">Loading...</div>}
      
      {result && (
        <div className="result-container">
          <h3>Result:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
      
      <h2>2. Using GeminiAIContainer Component</h2>
      <div className="ai-container-example">
        <GeminiAIContainer
          resumeData={resumeData}
          targetJobTitle={jobTitle}
          jobType={jobType}
          availableTemplates={availableTemplates}
          onUpdateResume={handleUpdateResume}
          onSelectTemplate={handleSelectTemplate}
        />
      </div>
      
      <h2>3. Example Integration Code</h2>
      <pre className="code-example">
{`// Import the AI service
import aiService from '../services/aiService';

// Call the service in an async function
async function optimizeMyResume() {
  try {
    const result = await aiService.optimizeResume(resumeData, jobTitle);
    console.log(result);
    // Handle the result...
  } catch (error) {
    console.error('Error optimizing resume:', error);
  }
}`}
      </pre>
      
      <h2>4. Component Integration Example</h2>
      <pre className="code-example">
{`// In your component
import GeminiAIContainer from '../components/ai/GeminiAIContainer';

function ResumeBuilder() {
  // ...your component code
  
  return (
    <div className="resume-builder">
      <div className="form-container">
        {/* Your resume form components */}
      </div>
      
      <div className="ai-sidebar">
        <GeminiAIContainer
          resumeData={resumeData}
          targetJobTitle={jobTitle}
          jobType={jobType}
          availableTemplates={availableTemplates}
          onUpdateResume={handleUpdateResume}
          onSelectTemplate={handleSelectTemplate}
        />
      </div>
    </div>
  );
}`}
      </pre>
    </div>
  );
};

export default AIExampleUsage;