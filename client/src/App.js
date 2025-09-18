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
import InterviewPrep from './InterviewPrep';
import AIExampleUsage from './examples/AIExampleUsage';
import AIChatModal from './components/AIChatModal';
import aiService from './services/aiService';


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
  const [activeView, setActiveView] = useState('home'); // 'home', 'type-selector', 'form', 'templates', 'preview', 'interview-prep', or 'ai-chat'
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [resumeType, setResumeType] = useState(null); // 'technical', 'medical', 'diploma', or 'nontechnical'
  const [isAnalyzingATS, setIsAnalyzingATS] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  
  // Template search states
  const [templateSearchQuery, setTemplateSearchQuery] = useState('');
  const [recommendedTemplates, setRecommendedTemplates] = useState([]);
  const [isSearchingTemplates, setIsSearchingTemplates] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  
  // Popular job roles for search suggestions
  const popularJobRoles = [
    'Software Engineer', 'Data Scientist', 'Product Manager', 'Marketing Manager',
    'Sales Representative', 'Business Analyst', 'UX/UI Designer', 'Project Manager',
    'DevOps Engineer', 'Full Stack Developer', 'Data Analyst', 'Digital Marketing Specialist'
  ];
  const [showTemplateResults, setShowTemplateResults] = useState(false);
  
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

  // Handle auto-fill from AI chat
  const handleChatAutoFill = (data) => {
    if (data.type === 'skills' && data.content && resumeData) {
      setResumeData(prev => ({ ...prev, skills: data.content }));
      showToast('Skills added successfully from AI suggestion!');
    } else if (data.type === 'summary' && resumeData) {
      // Generate summary with AI
      showToast('Summary will be generated with AI!');
    }
    setShowChatModal(false);
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

  // Handle ATS Analysis
  const handleATSAnalysis = async () => {
    if (!resumeData) {
      showToast('No resume data available for analysis.', 'danger');
      return;
    }

    setIsAnalyzingATS(true);
    try {
      const analysis = await aiService.getEnhancedATSAnalysis(resumeData);
      
      if (analysis && analysis.atsScore) {
        // Create detailed analysis display
        const message = `
🎯 ATS ANALYSIS REPORT
═══════════════════════════════════════

📊 OVERALL ATS SCORE: ${analysis.atsScore.totalScore}/100 (${analysis.atsScore.rating})

🔍 DETECTED PROFILE:
Role: ${analysis.detectedRole || 'General'}
Industry: ${analysis.industry || 'General'}

� DETAILED BREAKDOWN:
• Keyword Match: ${analysis.atsScore.breakdown?.keywordMatch || 0}/100
• Formatting: ${analysis.atsScore.breakdown?.formatting || 0}/100  
• Content Quality: ${analysis.atsScore.breakdown?.contentQuality || 0}/100
• Keyword Placement: ${analysis.atsScore.breakdown?.keywordPlacement || 0}/100
• Industry Alignment: ${analysis.atsScore.breakdown?.industryAlignment || 0}/100

✅ KEYWORDS FOUND (${analysis.keywordsFound?.length || 0}):
${analysis.keywordsFound?.slice(0, 8).join(', ') || 'None detected'}

⚠️ MISSING KEYWORDS (${analysis.missingKeywords?.length || 0}):
${analysis.missingKeywords?.slice(0, 5).join(', ') || 'None'}

${analysis.formattingIssues?.length > 0 ? `
🚫 FORMATTING ISSUES:
${analysis.formattingIssues.slice(0, 3).map(issue => `• ${issue}`).join('\n')}
` : ''}

💡 TOP RECOMMENDATIONS:
${analysis.suggestions?.slice(0, 5).map(s => `• ${s}`).join('\n') || 'No specific suggestions available.'}

${analysis.jobMatch ? `🎯 JOB MATCH: ${analysis.jobMatch}%` : ''}
        `;
        
        alert(message);
        showToast(`ATS Score: ${analysis.atsScore.totalScore}/100 - Analysis completed!`);
      } else {
        showToast('Unable to analyze resume. Please check your data and try again.', 'warning');
      }
    } catch (error) {
      console.error('Error getting enhanced ATS analysis:', error);
      showToast('Failed to analyze resume. Please try again.', 'danger');
    } finally {
      setIsAnalyzingATS(false);
    }
  };

  // Handle Template Search
  const handleTemplateSearch = async () => {
    if (!templateSearchQuery.trim()) {
      showToast('Please enter a job role to search templates', 'warning');
      return;
    }

    setIsSearchingTemplates(true);
    try {
      const searchResults = await aiService.searchTemplates({
        jobTitle: templateSearchQuery,
        industry: resumeType || 'general',
        experienceLevel: 'mid-level' // Can be made dynamic
      });
      
      console.log('🔍 Template search results:', searchResults);
      searchResults.forEach((template, index) => {
        console.log(`Template ${index + 1}: ${template.name}, ATS Score: ${template.atsScore}`);
      });
      
      setRecommendedTemplates(searchResults);
      setShowTemplateResults(true);
      setActiveView('template-search');
      showToast(`Found ${searchResults.length} ATS-optimized templates!`);
    } catch (error) {
      console.error('Error searching templates:', error);
      showToast('Failed to search templates. Please try again.', 'danger');
    } finally {
      setIsSearchingTemplates(false);
    }
  };

  // Handle template selection from search results
  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template.id);
    showToast(`Template "${template.name}" selected! Complete the form to generate your resume.`);
    
    if (resumeData) {
      // If resume data exists, go to preview with new template
      setActiveView('preview');
    } else {
      // If no resume data, go to form
      setActiveView('form');
    }
  };

  // Handle template inspiration from external sources
  const handleInspireFromTemplate = (template) => {
    const inspirationMessage = `
🎨 TEMPLATE INSPIRATION

Template: ${template.name}
Source: ${template.source}
ATS Score: ${template.atsScore}%

💡 DESIGN INSPIRATION:
• Layout Style: ${template.layoutStyle}
• Industry Focus: ${template.industry}
• Key Features: ${template.features?.join(', ') || 'Professional design'}

📝 RECOMMENDED APPROACH:
1. Visit the original template for design reference
2. Use our built-in templates with similar styling
3. Apply the design principles to your resume content

🔗 Original Source: ${template.sourceUrl}

Would you like to use our "${template.layoutStyle}" template with similar styling?
    `;
    
    const useInspiration = window.confirm(inspirationMessage);
    
    if (useInspiration) {
      // Find similar local template
      const similarLocalTemplate = Object.values({
        'reverse-chrono': 'reverse-chrono',
        'modern-sidebar': 'modern-sidebar', 
        'professional-clean': 'professional-clean',
        'jobfit-pro': 'jobfit-pro',
        'proprofile': 'proprofile'
      }).find(id => {
        const localTemplate = recommendedTemplates.find(t => t.id === id && !t.isExternal);
        return localTemplate && localTemplate.layoutStyle === template.layoutStyle;
      });
      
      if (similarLocalTemplate) {
        setSelectedTemplate(similarLocalTemplate);
        showToast(`Inspired by "${template.name}" - Applied similar local template!`);
        if (resumeData) {
          setActiveView('preview');
        } else {
          setActiveView('form');
        }
      } else {
        // Use default best template
        setSelectedTemplate('jobfit-pro');
        showToast(`Inspired by "${template.name}" - Using our best ATS template!`);
        if (resumeData) {
          setActiveView('preview');
        } else {
          setActiveView('form');
        }
      }
    }
  };

  // Handle template preview
  const handlePreviewTemplate = (template) => {
    if (template.isExternal) {
      // For external templates, open in new tab
      window.open(template.sourceUrl, '_blank');
      showToast(`Opening preview for "${template.name}" in new tab`);
    } else {
      // For local templates, show preview with sample data
      const sampleData = {
        personalInfo: {
          fullName: 'John Doe',
          title: 'Senior Software Engineer',
          email: 'john.doe@email.com',
          phone: '+1 (555) 123-4567',
          location: 'San Francisco, CA',
          linkedin: 'linkedin.com/in/johndoe',
          github: 'github.com/johndoe'
        },
        summary: 'Experienced software engineer with 5+ years in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of leading high-performance teams and delivering scalable solutions.',
        experience: [
          {
            company: 'Tech Corp',
            role: 'Senior Software Engineer',
            position: 'Senior Software Engineer',
            duration: '2020 - Present',
            location: 'San Francisco, CA',
            description: 'Led development of microservices architecture\nReduced deployment time by 40%\nManaged team of 5 junior developers\nImplemented CI/CD pipelines',
            achievements: ['Led development of microservices architecture', 'Reduced deployment time by 40%']
          },
          {
            company: 'StartupXYZ',
            role: 'Full Stack Developer',
            position: 'Full Stack Developer',
            duration: '2018 - 2020',
            location: 'Austin, TX',
            description: 'Built responsive web applications using React and Node.js\nIntegrated third-party APIs and payment systems\nOptimized database queries improving performance by 60%',
            achievements: ['Built 3 major client applications', 'Improved performance by 60%']
          }
        ],
        skills: 'JavaScript, React, Node.js, Python, AWS, Docker, MongoDB, PostgreSQL',
        technicalSkills: 'React, Node.js, Python, AWS, Docker, Kubernetes',
        softSkills: 'Leadership, Communication, Problem-solving, Team management',
        projects: [
          {
            title: 'E-commerce Platform',
            description: 'Built a full-stack e-commerce platform using MERN stack\nImplemented payment integration with Stripe\nAdded real-time chat support\nDeployed on AWS with auto-scaling',
            technologies: 'React, Node.js, MongoDB, AWS',
            duration: '2023'
          },
          {
            title: 'Task Management App',
            description: 'Developed a collaborative task management application\nImplemented real-time updates using WebSockets\nAdded drag-and-drop functionality\nIntegrated with third-party calendar APIs',
            technologies: 'React, Express, Socket.io, MySQL',
            duration: '2022'
          }
        ],
        education: [
          {
            degree: 'Bachelor of Computer Science',
            school: 'State University',
            year: '2018',
            location: 'California, USA',
            gpa: '3.8/4.0'
          }
        ],
        certifications: [
          'AWS Certified Developer Associate (2023)',
          'Certified Kubernetes Administrator (2022)',
          'MongoDB Certified Developer (2021)'
        ],
        achievements: [
          'Employee of the Year 2023 at Tech Corp',
          'Led team that won company hackathon 2022',
          'Speaker at React Conference 2023',
          'Published article on microservices architecture with 10K+ views'
        ],
        languages: 'English - Native, Spanish - Intermediate, French - Basic'
      };

      setResumeData(sampleData);
      setSelectedTemplate(template.id);
      setActiveView('preview');
      showToast(`Previewing "${template.name}" template with sample data`);
    }
  };

  return (
    <div className="app">
      {!showChatModal && (
        <header className="app-header">
          <div className="header-container">
            <div className="app-logo">
              <h1>ResuMate</h1>
              <p className="app-tagline">AI-Powered Professional Resume Builder</p>
            </div>
          
          {/* Template Search Bar - Center of Navigation */}
          <div className="template-search-container">
            <div className="search-input-wrapper">
              <input
                type="text"
                className="template-search-input"
                placeholder="Search ATS templates by role (e.g., Software Engineer, Marketing Manager)"
                value={templateSearchQuery}
                onChange={(e) => setTemplateSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTemplateSearch()}
                onFocus={() => setShowSearchSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 300)}
              />
              <button 
                className={`search-button ${isSearchingTemplates ? 'loading' : ''}`}
                onClick={handleTemplateSearch}
                disabled={isSearchingTemplates || !templateSearchQuery.trim()}
              >
                {isSearchingTemplates ? '' : 'Search'}
              </button>
            </div>
            
            {/* Search Suggestions */}
            {showSearchSuggestions && templateSearchQuery.length === 0 && (
              <div className="search-suggestions">
                {popularJobRoles.slice(0, 6).map((role, index) => (
                  <div 
                    key={index}
                    className="search-suggestion"
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevent input blur
                      setTemplateSearchQuery(role);
                      setShowSearchSuggestions(false);
                    }}
                    onClick={() => {
                      setTemplateSearchQuery(role);
                      setShowSearchSuggestions(false);
                    }}
                  >
                    <span className="search-suggestion-icon">💼</span>
                    <span>{role}</span>
                  </div>
                ))}
              </div>
            )}
            
            {/* Filtered Suggestions */}
            {showSearchSuggestions && templateSearchQuery.length > 0 && (
              <div className="search-suggestions">
                {popularJobRoles
                  .filter(role => role.toLowerCase().includes(templateSearchQuery.toLowerCase()))
                  .slice(0, 4)
                  .map((role, index) => (
                    <div 
                      key={index}
                      className="search-suggestion"
                      onMouseDown={(e) => {
                        e.preventDefault(); // Prevent input blur
                        setTemplateSearchQuery(role);
                        setShowSearchSuggestions(false);
                      }}
                      onClick={() => {
                        setTemplateSearchQuery(role);
                        setShowSearchSuggestions(false);
                      }}
                    >
                      <span className="search-suggestion-icon">🎯</span>
                      <span>{role}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="app-nav">
            <button 
              className={`nav-link ${activeView === 'home' ? 'active' : ''}`}
              onClick={() => setActiveView('home')}
            >
              🏠 Home
            </button>
            {resumeType && (
              <button 
                className={`nav-link ${activeView === 'form' ? 'active' : ''}`}
                onClick={() => setActiveView('form')}
              >
                📝 Create Resume
              </button>
            )}
            <button 
              className={`nav-link ${activeView === 'templates' ? 'active' : ''}`}
              onClick={() => resumeType ? setActiveView('templates') : showToast('Please select a resume type first', 'warning')}
            >
              📋 Templates
            </button>
            <button 
              className={`nav-link ${activeView === 'interview-prep' ? 'active' : ''}`}
              onClick={() => setActiveView('interview-prep')}
            >
              🎯 Interview Prep
            </button>
            {resumeData && (
              <button 
                className={`nav-link ${activeView === 'preview' ? 'active' : ''}`}
                onClick={() => setActiveView('preview')}
              >
                👁️ Preview
              </button>
            )}
            <button 
              className="nav-link ai-chat-btn"
              onClick={() => setShowChatModal(true)}
            >
              💬 AI Chat
            </button>
          </nav>
        </div>
      </header>
      )}

      {!showChatModal && (
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
        
        {activeView === 'interview-prep' && (
          <InterviewPrep />
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
        
        {activeView === 'template-search' && (
          <div className="template-search-results">
            <div className="search-header">
              <h2>🎯 AI-Recommended Templates for "{templateSearchQuery}"</h2>
              <p>ATS-optimized templates ranked by relevance and compatibility</p>
              <button 
                className="btn-back"
                onClick={() => setActiveView('home')}
              >
                ← Back to Home
              </button>
            </div>
            
            {recommendedTemplates.length > 0 ? (
              <div className="template-grid">
                {recommendedTemplates.map((template, index) => (
                  <div key={template.id} className="template-card">
                    <div className="template-rank">#{index + 1}</div>
                    {template.source && (
                      <div className="template-source">{template.source}</div>
                    )}
                    <div className="template-preview">
                      {template.previewUrl ? (
                        <img 
                          src={template.previewUrl} 
                          alt={template.name}
                          className="template-image"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        className="template-placeholder"
                        style={{ 
                          display: template.previewUrl ? 'none' : 'flex',
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '3rem'
                        }}
                      >
                        📄
                      </div>
                      {template.isExternal && (
                        <div className="external-badge">🌐 External</div>
                      )}
                    </div>
                    <div className="template-info">
                      <h3>{template.name}</h3>
                      <div className="template-stats">
                        <span className="industry-tag">{template.industry || 'General'}</span>
                        <span className="ats-score">ATS: {template.atsScore || 85}%</span>
                        <span className="layout-type">{template.layoutStyle || 'Standard'}</span>
                        {template.aiRecommendation && (
                          <span className="ai-recommendation">{template.aiRecommendation}</span>
                        )}
                      </div>
                      <p className="template-description">{template.description}</p>
                      <div className="template-features">
                        {template.features?.map((feature, idx) => (
                          <span key={idx} className="feature-tag">✓ {feature}</span>
                        ))}
                      </div>
                      {template.copyright && (
                        <p className="copyright-notice">📄 {template.copyright}</p>
                      )}
                    </div>
                    <div className="template-actions">
                      {template.isExternal ? (
                        <>
                          <button 
                            className="btn-visit-external"
                            onClick={() => window.open(template.sourceUrl, '_blank')}
                          >
                            🔗 View Original
                          </button>
                          <button 
                            className="btn-inspire-template"
                            onClick={() => handleInspireFromTemplate(template)}
                          >
                            💡 Get Inspired
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            className="btn-select-template"
                            onClick={() => handleSelectTemplate(template)}
                          >
                            ✨ Select Template
                          </button>
                          <button 
                            className="btn-preview-template"
                            onClick={() => handlePreviewTemplate(template)}
                          >
                            👁️ Preview
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-templates">
                <div className="no-templates-icon">🔍</div>
                <h3>No templates found</h3>
                <p>Try searching with different job roles or keywords</p>
                <button 
                  className="btn-search-again"
                  onClick={() => setActiveView('home')}
                >
                  Search Again
                </button>
              </div>
            )}
          </div>
        )}
        
        {activeView === 'preview' && resumeData && (
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
              <button 
                className="btn-ats-score"
                onClick={handleATSAnalysis}
                disabled={isAnalyzingATS}
                style={{backgroundColor: '#28a745', color: 'white'}}
              >
                {isAnalyzingATS ? '🔄 Analyzing...' : '📊 ATS Score'}
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
        )}

        {activeView === 'preview' && !resumeData && (
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
      )}

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

      {/* AI Chat Modal */}
      <AIChatModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        onAutoFill={handleChatAutoFill}
      />
    </div>
  );
}

export default App;
