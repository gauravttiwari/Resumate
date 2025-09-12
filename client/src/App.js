import React, { useState } from 'react';
import ResumeForm from './ResumeForm';
import TemplateSelector from './TemplateSelector';
import MncResume from './MncResume';
import ReverseChronoResume from './ReverseChronoResume';
import ModernSidebarResume from './ModernSidebarResume';
import ProfessionalCleanResume from './ProfessionalCleanResume';
import JobFitProResume from './JobFitProResume';
import ProProfileResume from './ProProfileResume';
import HomeScreen from './HomeScreen';
import ResumeTypeSelector from './ResumeTypeSelector';
import './styles/App.css';
import './styles/ReverseChrono.css'; // Import template styles
import './styles/ModernSidebar.css';
import './styles/ProfessionalClean.css';
import './styles/JobFitPro.css';
import './styles/ProProfile.css';

function App() {
  const [resumeData, setResumeData] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('reverse-chrono');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeView, setActiveView] = useState('home'); // 'home', 'type-selector', 'form', 'templates', or 'preview'
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [resumeType, setResumeType] = useState(null); // 'technical', 'medical', 'diploma', or 'nontechnical'
  
  // Handle form submission
  const handleFormSubmit = (formData) => {
    setIsGenerating(true);
    
    // Store the form data
    setResumeData(formData);
    
    // Simulate processing delay
    setTimeout(() => {
      setIsGenerating(false);
      setActiveView('preview');
      showToast('Resume generated successfully!');
    }, 1000);
  };

  // Update form data as user types
  const handleFormChange = (formData) => {
    setResumeData(formData);
  };
  
  // Handle template selection change
  const handleTemplateChange = (template) => {
    setSelectedTemplate(template);
  };
  
  // Show toast notification
  const showToast = (message, type = 'success', duration = 5000) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, duration);
  };
  
  // Handle PDF download
  const handleDownloadPDF = async () => {
    try {
      setIsGenerating(true);
      
      // Import the libraries for PDF generation
      const html2canvas = await import('html2canvas').then(module => module.default);
      const { jsPDF } = await import('jspdf');
      
      const resumeElement = document.getElementById('resume-to-pdf');
      
      if (!resumeElement) {
        throw new Error('Resume element not found');
      }
      
      // Process images before capturing
      const images = resumeElement.querySelectorAll('img');
      // Wait for all images to load
      const imagePromises = Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve; // Continue even if image fails
        });
      });
      
      await Promise.all(imagePromises);
      
      // Capture the resume as canvas
      const canvas = await html2canvas(resumeElement, {
        scale: 2, // Higher scale for better quality
        useCORS: true, // Allow loading cross-origin images
        allowTaint: true, // Allow tainted canvas for security constraints
        logging: false,
        backgroundColor: '#ffffff',
        imageTimeout: 15000 // Longer timeout for images
      });
      
      // Calculate dimensions to maintain aspect ratio
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Generate multiple pages if resume is longer than A4
      let heightLeft = imgHeight;
      let position = 0;
      
      // Only add additional pages if the resume is longer than one page
      if (heightLeft > pageHeight) {
        while (heightLeft > pageHeight) {
          position = heightLeft - pageHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, -position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
      }
      
      // Save the PDF
      const fileName = resumeData && resumeData.name ? 
        `${resumeData.name.replace(/\s+/g, '_')}_Resume.pdf` : 
        `Resume_${new Date().getTime()}.pdf`;
      
      pdf.save(fileName);
      
      setIsGenerating(false);
      showToast('PDF downloaded successfully!');
      
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      setIsGenerating(false);
      showToast('Failed to generate PDF. Please try again.', 'danger');
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-logo">
          <h1>ResuMate</h1>
          <p className="app-tagline">Professional MNC-approved Resume Builder</p>
        </div>
        <nav className="app-nav">
          <button 
            className={`nav-link ${activeView === 'home' ? 'active' : ''}`}
            onClick={() => setActiveView('home')}
          >
            Home
          </button>
          {resumeType && (
            <button 
              className={`nav-link ${activeView === 'form' ? 'active' : ''}`}
              onClick={() => setActiveView('form')}
            >
              Create Resume
            </button>
          )}
          <button 
            className={`nav-link ${activeView === 'templates' ? 'active' : ''}`}
            onClick={() => resumeType ? setActiveView('templates') : showToast('Please select a resume type first', 'warning')}
          >
            Templates
          </button>
          {resumeData && (
            <button 
              className={`nav-link ${activeView === 'preview' ? 'active' : ''}`}
              onClick={() => setActiveView('preview')}
            >
              Preview
            </button>
          )}
        </nav>
      </header>

      <main className="app-content">
        {activeView === 'home' && (
          <HomeScreen onStartClick={() => setActiveView('type-selector')} />
        )}
        
        {activeView === 'type-selector' && (
          <ResumeTypeSelector 
            onSelect={(type) => {
              setResumeType(type);
              setActiveView('form');
            }}
          />
        )}
        
        {activeView === 'form' && (
          <>
            <div className="app-intro">
              <h2>Create Your ATS-Friendly Resume for Top MNCs</h2>
              <p>
                Build a professional resume optimized for Applicant Tracking Systems 
                used by companies like Google, Microsoft, Amazon, and other tech giants.
              </p>
              {resumeType && (
                <div className="selected-resume-type">
                  <span>Selected Resume Type: </span>
                  <strong>
                    {resumeType === 'technical' ? 'Technical' : 
                     resumeType === 'medical' ? 'Medical' : 
                     resumeType === 'diploma' ? 'Diploma/Certificate' : 'Non-Technical'}
                  </strong>
                  <button 
                    onClick={() => setActiveView('type-selector')} 
                    className="change-type-btn"
                  >
                    Change
                  </button>
                </div>
              )}
            </div>
            <ResumeForm 
              initialData={resumeData} // Pass existing resume data when editing
              onSubmit={handleFormSubmit} 
              onChange={handleFormChange}
              isSubmitting={isGenerating}
              resumeType={resumeType}
            />
          </>
        )}
        
        {activeView === 'templates' && (
          <>
            <TemplateSelector
              selectedTemplate={selectedTemplate}
              onTemplateChange={handleTemplateChange}
              resumeType={resumeType}
            />
            {resumeData && (
              <div className="template-preview-actions">
                <button 
                  className="btn-preview"
                  onClick={() => setActiveView('preview')}
                >
                  Preview Resume
                </button>
              </div>
            )}
          </>
        )}
        
        {activeView === 'preview' && resumeData ? (
          <div className="resume-preview-container">
            <div className="resume-actions">
              <button 
                className="btn-download" 
                onClick={handleDownloadPDF}
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating PDF...' : 'Download PDF'}
              </button>
              <button 
                className="btn-edit"
                onClick={() => {
                  // Keep the existing form data when editing
                  setActiveView('form');
                }}
              >
                Edit Resume
              </button>
              <button 
                className="btn-change-template"
                onClick={() => setActiveView('templates')}
              >
                Change Template
              </button>
            </div>
            <div className="resume-preview" id="resume-to-pdf">
              {selectedTemplate === 'reverse-chrono' ? (
                <ReverseChronoResume
                  data={resumeData}
                  showProfile={true}
                />
              ) : selectedTemplate === 'modern-sidebar' ? (
                <ModernSidebarResume
                  data={resumeData}
                  showProfile={true}
                />
              ) : selectedTemplate === 'professional-clean' ? (
                <ProfessionalCleanResume
                  data={resumeData}
                  showProfile={true}
                />
              ) : selectedTemplate === 'jobfit-pro' ? (
                <JobFitProResume
                  data={resumeData}
                  showProfile={true}
                />
              ) : selectedTemplate === 'pro-profile' ? (
                <ProProfileResume
                  data={resumeData}
                  showProfile={true}
                />
              ) : (
                <MncResume 
                  data={resumeData} 
                  template={selectedTemplate} 
                />
              )}
            </div>
          </div>
        ) : activeView === 'preview' && (
          <div className="no-resume">
            <h2>No Resume Data</h2>
            <p>Please fill out the resume form first.</p>
            <button 
              className="btn-create"
              onClick={() => setActiveView('form')}
            >
              Create Resume
            </button>
          </div>
        )}
      </main>

      {/* Toast notification */}
      {toast.show && (
        <div className={`toast toast-${toast.type}`}>
          <span>{toast.message}</span>
          <button onClick={() => setToast({ ...toast, show: false })}>×</button>
        </div>
      )}

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} ResuMate - ATS-Optimized Resume Builder</p>
        <div className="footer-links">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Use</a>
          <a href="#contact">Contact</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
