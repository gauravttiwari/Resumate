import React from 'react';
import ResumeForm from './ResumeForm';
import ResumePreview from './ResumePreview';
import TemplateSelector from './TemplateSelector';
import HTMLResume, { generateResumePDF } from './HTMLResume';
import generatePlainText from './plainTextGenerator';
import { reportError, reportUsage } from './errorReporting';
import './App.css';

function App() {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generatedFiles, setGeneratedFiles] = React.useState(null);
  const [selectedTemplate, setSelectedTemplate] = React.useState('modern');
  const [theme, setTheme] = React.useState('light');
  const [formData, setFormData] = React.useState(null);
  const [toast, setToast] = React.useState({ show: false, message: '', type: 'success' });
  const resumeRef = React.useRef(null);
  
  // Handle form data changes for live preview
  const handleFormChange = (data) => {
    setFormData(data);
  };
  
  // Handle template selection change
  const handleTemplateChange = (template) => {
    setSelectedTemplate(template);
  };
  
  // Toggle between light and dark theme
  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  // Show toast notification
  const showToast = (message, type = 'success', duration = 5000) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, duration);
  };
  
  // Handler for form submission
  const handleFormSubmit = async (formData) => {
    try {
      setIsGenerating(true);
      setFormData(formData); // Update form data for preview
      
      // Generate plain text version
      const plainText = generatePlainText(formData);
      
      // Generate a client-side PDF
      const pdfResult = await generateResumePDF(formData, selectedTemplate);
      
      // Prepare filename
      const filename = formData.name ? formData.name.replace(/\s+/g, '_') : 'resume';
      
      // Send data to backend for storage
      const res = await fetch('http://localhost:5000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          resumeData: formData, 
          filename, 
          plainText, 
          template: selectedTemplate 
        })
      });
      
      if (res.ok) {
        const { json, txt } = await res.json();
        setGeneratedFiles({ 
          pdf: pdfResult.pdf, 
          json, 
          txt,
          clientPdf: pdfResult.pdf
        });
        setIsGenerating(false);
        showToast('Resume generated successfully!');
        
        // Open the PDF in a new tab
        window.open(pdfResult.pdf, '_blank');
        
      } else {
        throw new Error(`Server returned status ${res.status}`);
      }
    } catch (error) {
      console.error('Resume generation error:', error);
      reportError('Resume generation failed', {
        error: error.message || 'Unknown error',
        template: selectedTemplate
      });
      showToast(`Failed to generate resume: ${error.message}`, 'danger');
      setIsGenerating(false);
    }
  };

  return (
    <div className={`app ${theme}`}>
      <header className="app-header">
        <h1>ResuMate</h1>
        <div className="theme-toggle">
          <button onClick={handleThemeToggle}>
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </div>
      </header>
      
      <main className="app-main">
        <div className="template-selector-container">
          <h2>Choose a Template</h2>
          <TemplateSelector
            selectedTemplate={selectedTemplate}
            onChange={handleTemplateChange}
          />
        </div>
        
        <div className="resume-builder">
          <div className="form-container">
            <ResumeForm
              onSubmit={handleFormSubmit}
              onChange={handleFormChange}
              isSubmitting={isGenerating}
            />
          </div>
          
          <div className="preview-container">
            <h2>Preview</h2>
            {formData ? (
              <>
                <div className="resume-preview-wrapper">
                  <HTMLResume 
                    data={formData} 
                    template={selectedTemplate}
                    ref={resumeRef} 
                  />
                </div>
                <div className="preview-actions">
                  <button
                    onClick={() => handleFormSubmit(formData)}
                    disabled={isGenerating}
                    className="generate-button"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Resume'}
                  </button>
                </div>
              </>
            ) : (
              <div className="empty-preview">
                <p>Fill in the form to see your resume preview</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Toast notification */}
      {toast.show && (
        <div className={`toast toast-${toast.type}`}>
          <div className="toast-message">{toast.message}</div>
          <button onClick={() => setToast({ show: false, message: '', type: 'success' })}>×</button>
        </div>
      )}
      
      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} ResuMate - HTML-Powered Resume Builder</p>
      </footer>
    </div>
  );
}

export default App;
