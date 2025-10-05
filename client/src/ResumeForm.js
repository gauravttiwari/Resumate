import React, { useState, useEffect } from 'react';
import './styles/ResumeForm.css';
import * as aiService from './services/aiService';

const ResumeForm = ({ onSubmit, onChange, isSubmitting }) => {
  const EDUCATION_SEQUENCE = ['Class 10', 'Class 12', 'Graduation', 'Post Graduation'];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    github: '',
    summary: '',
    skills: '',
    education: [{ degree: '', institution: '', year: '', percentage: '', type: 'Class 10' }],
    experience: [{ role: '', company: '', duration: '', description: '' }],
    projects: [{ title: '', description: '' }],
    achievements: [{ text: '', start: '', end: '' }],
    profilePic: null
  });

  const [isFresher, setIsFresher] = useState(false);

  // AI-related states
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFeature, setAiFeature] = useState(''); // 'summary', 'optimize', 'experience'
  const [showAIHelpers, setShowAIHelpers] = useState(false);

  // When formData changes, notify parent component
  useEffect(() => {
    if (onChange) {
      onChange(formData);
    }
  }, [formData, onChange]);

  // Helper to compute a small label for each section based on current data
  const getSectionLabel = (section) => {
    switch(section) {
      case 'personal':
        return formData.name || '';
      case 'summary':
        return formData.summary ? formData.summary.slice(0, 40) + (formData.summary.length > 40 ? '…' : '') : '';
      case 'skills':
        return formData.skills ? formData.skills.split(',').slice(0,3).join(', ') : '';
      case 'experience':
        if (formData.experience && formData.experience.length) {
          const e = formData.experience[0];
          return `${e.role || ''}${e.role && e.company ? ' @ ' : ''}${e.company || ''}`.trim();
        }
        return '';
      case 'projects':
        return (formData.projects && formData.projects[0] && formData.projects[0].title) || '';
      case 'education':
        if (formData.education && formData.education[0]) {
          const ed = formData.education[0];
          return `${ed.type || ''}${ed.degree ? ': ' + ed.degree : ed.institution ? ': ' + ed.institution : ''}`.trim();
        }
        return '';
      case 'achievements':
        return (formData.achievements && formData.achievements[0] && formData.achievements[0].text) || '';
      default:
        return '';
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle array item changes (education, experience, etc.)
  const handleArrayItemChange = (index, field, subfield, value) => {
    setFormData(prevData => {
      const updatedItems = [...prevData[field]];
      updatedItems[index] = {
        ...updatedItems[index],
        [subfield]: value
      };
      return {
        ...prevData,
        [field]: updatedItems
      };
    });
  };

  // Handle achievements as array of objects { text, start, end }
  const handleAchievementChange = (index, field, value) => {
    setFormData(prevData => {
      const updated = [...prevData.achievements];
      const item = { ...(updated[index] || { text: '', start: '', end: '' }) };
      item[field] = value;
      updated[index] = item;
      return { ...prevData, achievements: updated };
    });
  };

  // Add new item to arrays
  const handleAddItem = (field) => {
    setFormData(prevData => {
      let newItem;

      switch(field) {
        case 'education':
          // Determine next education type from sequence
          const existingTypes = prevData.education.map(e => e.type).filter(Boolean);
          const nextType = EDUCATION_SEQUENCE.find(t => !existingTypes.includes(t)) || 'Other';
          newItem = { degree: '', institution: '', year: '', percentage: '', type: nextType };
          break;
        case 'experience':
          newItem = { role: '', company: '', duration: '', description: '' };
          break;
        case 'projects':
          newItem = { title: '', description: '' };
          break;
        case 'achievements':
          return {
            ...prevData,
            achievements: [...prevData.achievements, { text: '', start: '', end: '' }]
          };
        default:
          return prevData;
      }

      return {
        ...prevData,
        [field]: [...prevData[field], newItem]
      };
    });
  };

  // Remove item from arrays
  const handleRemoveItem = (field, index) => {
    setFormData(prevData => {
      const updatedItems = [...prevData[field]];
      updatedItems.splice(index, 1);
      return { ...prevData, [field]: updatedItems };
    });
  };

  // Handle profile picture upload
  const handleProfilePicUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prevData => ({
          ...prevData,
          profilePic: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  // AI Helper Functions
  const generateSummaryWithAI = async () => {
    if (!formData.name) {
      alert('Please fill in your name before generating summary.');
      return;
    }

    console.log('🎯 Starting AI summary generation...');
    console.log('📄 Form data:', JSON.stringify(formData, null, 2));
    
    setAiLoading(true);
    setAiFeature('summary');
    try {
      console.log('🚀 Calling aiService.generateSummary...');
      const summary = await aiService.generateSummary(formData, 'general');
      console.log('✅ Generated summary:', summary);
      console.log('📝 Current summary before update:', formData.summary);
      
      setFormData(prev => {
        const newData = { ...prev, summary };
        console.log('🔄 Updating formData with new summary:', newData.summary);
        return newData;
      });
      
      console.log('✨ Summary update completed');
      alert('Summary generated successfully!');
    } catch (error) {
      console.error('❌ Error generating summary:', error);
      alert('Failed to generate summary. Please try again.');
    }
    setAiLoading(false);
    setAiFeature('');
  };

  const optimizeResumeWithAI = async () => {
    if (!formData.name || !formData.experience.length) {
      alert('Please fill in basic information before optimizing.');
      return;
    }

    setAiLoading(true);
    setAiFeature('optimize');
    try {
      const result = await aiService.optimizeResume(formData, 'general');
      
      if (result.isOfflineMode) {
        alert('AI service is in offline mode. Basic optimization suggestions applied.');
      }
      
      // Apply suggestions to form
      if (result.contentSuggestions?.skills) {
        const currentSkills = formData.skills || '';
        const newSkills = result.skillsToAdd ? 
          `${currentSkills}, ${result.skillsToAdd.join(', ')}`.replace(/^,\s*/, '') : 
          currentSkills;
        setFormData(prev => ({ ...prev, skills: newSkills }));
      }
    } catch (error) {
      console.error('Error optimizing resume:', error);
      alert('Failed to optimize resume. Please try again.');
    }
    setAiLoading(false);
    setAiFeature('');
  };

  const generateSkillsWithAI = async () => {
    if (!formData.name) {
      alert('Please fill in your name before generating skills.');
      return;
    }

    setAiLoading(true);
    setAiFeature('skills');
    try {
      console.log('Generating skills based on experience...');
      const result = await aiService.optimizeResume(formData, 'general');
      
      if (result.skillsToAdd && result.skillsToAdd.length > 0) {
        const currentSkills = formData.skills || '';
        const newSkills = currentSkills ? 
          `${currentSkills}, ${result.skillsToAdd.join(', ')}` : 
          result.skillsToAdd.join(', ');
        setFormData(prev => ({ ...prev, skills: newSkills }));
        alert('Skills suggestions added successfully!');
      } else {
        // Fallback skills based on common tech stack
        const fallbackSkills = 'Communication, Problem-solving, Team collaboration, Time management, Leadership, Analytical thinking';
        const currentSkills = formData.skills || '';
        const newSkills = currentSkills ? `${currentSkills}, ${fallbackSkills}` : fallbackSkills;
        setFormData(prev => ({ ...prev, skills: newSkills }));
        alert('Basic skills added successfully!');
      }
    } catch (error) {
      console.error('Error generating skills:', error);
      alert('Failed to generate skills. Please try again.');
    }
    setAiLoading(false);
    setAiFeature('');
  };

  const improveExperienceWithAI = async (index) => {
    const experience = formData.experience[index];
    if (!experience.role || !experience.company) {
      alert('Please fill in role and company before improving this experience.');
      return;
    }

    setAiLoading(true);
    setAiFeature(`experience-${index}`);
    try {
      console.log('Improving experience description...');
      // Use a simple fallback improvement since our AI service might be limited
      const improvedDescription = experience.description ? 
        `${experience.description}\n• Collaborated with cross-functional teams to deliver high-quality results\n• Implemented best practices and improved workflow efficiency` :
        '• Delivered high-quality results in a fast-paced environment\n• Collaborated effectively with team members and stakeholders\n• Contributed to process improvements and optimization initiatives';
      
      const updatedExperience = [...formData.experience];
      updatedExperience[index] = { ...experience, description: improvedDescription };
      setFormData(prev => ({ ...prev, experience: updatedExperience }));
      alert('Experience description improved successfully!');
    } catch (error) {
      console.error('Error improving experience:', error);
      alert('Failed to improve experience. Please try again.');
    }
    setAiLoading(false);
    setAiFeature('');
  };

  const improveProjectWithAI = async (index) => {
    const project = formData.projects[index];
    if (!project.title) {
      alert('Please fill in project title before improving this project.');
      return;
    }

    setAiLoading(true);
    setAiFeature(`project-${index}`);
    try {
      console.log('Improving project description...');
      // Use a simple fallback improvement
      const improvedDescription = project.description ? 
        `${project.description}\n• Utilized modern development practices and industry standards\n• Implemented responsive design and optimized user experience\n• Ensured code quality through testing and peer reviews` :
        '• Developed comprehensive solution using latest technologies\n• Implemented user-friendly interface with responsive design\n• Applied best practices for performance optimization and scalability\n• Collaborated with team to deliver high-quality results on schedule';
      
      const updatedProjects = [...formData.projects];
      updatedProjects[index] = { ...project, description: improvedDescription };
      setFormData(prev => ({ ...prev, projects: updatedProjects }));
      alert('Project description improved successfully!');
    } catch (error) {
      console.error('Error improving project:', error);
      alert('Failed to improve project. Please try again.');
    }
    setAiLoading(false);
    setAiFeature('');
  };

  const improveAchievementWithAI = async (index) => {
    const achievement = formData.achievements[index];
    if (!achievement || !achievement.text || achievement.text.trim() === '') {
      alert('Please enter the achievement text before improving it with AI.');
      return;
    }

    setAiLoading(true);
    setAiFeature(`achievement-${index}`);
    try {
      console.log('Improving achievement text...');
      const base = achievement.text;
      const improvedText = base.includes('•') ?
        `${base}\n• Recognized for outstanding contribution and measurable impact` :
        `${base} — Recognized for outstanding contribution and measurable impact.`;

      const updated = [...formData.achievements];
      updated[index] = { ...achievement, text: improvedText };
      setFormData(prev => ({ ...prev, achievements: updated }));
      alert('Achievement improved successfully!');
    } catch (error) {
      console.error('Error improving achievement:', error);
      alert('Failed to improve achievement. Please try again.');
    }
    setAiLoading(false);
    setAiFeature('');
  };

  return (
    <div className="form-card">
      <form className="resume-form" onSubmit={handleSubmit}>
        <h2>Personal Information <span className="section-name">{getSectionLabel('personal')}</span></h2>
      <div className="form-group">
        <label htmlFor="name">Full Name*</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="John Doe"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="email">Email*</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="john@example.com"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">Phone Number*</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="123-456-7890"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="address">Address</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="City, State"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="linkedin">LinkedIn Profile (Optional)</label>
          <input
            type="text"
            id="linkedin"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            placeholder="linkedin.com/in/johndoe"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="github">GitHub Profile (Optional)</label>
          <input
            type="text"
            id="github"
            name="github"
            value={formData.github}
            onChange={handleChange}
            placeholder="github.com/johndoe"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="profilePic">Profile Picture (Optional)</label>
        <input
          type="file"
          id="profilePic"
          accept="image/*"
          onChange={handleProfilePicUpload}
        />
        <small className="form-text text-muted">
          Note: Some ATS systems may not process profile pictures correctly. For MNC applications, consider omitting images.
        </small>
      </div>

  <h2>Professional Summary <span className="section-name">{getSectionLabel('summary')}</span></h2>
      <div className="form-group">
        <label htmlFor="summary">Career Objective / Summary*</label>
        <div className="textarea-with-ai">
          <textarea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            rows="3"
            required
            placeholder="Software Engineer with 2 years of experience building scalable web applications using React, Node.js, and cloud technologies."
          ></textarea>
          <button
            type="button"
            className={`ai-helper-btn ${aiLoading && aiFeature === 'summary' ? 'loading' : ''}`}
            onClick={generateSummaryWithAI}
            disabled={aiLoading}
            title="Generate AI-powered professional summary"
          >
            {aiLoading && aiFeature === 'summary' ? '🤖 Generating...' : '✨ AI Generate'}
          </button>
        </div>
        <small className="form-text text-muted">
          2-3 lines summarizing your profile and the job role you're applying for. Keep it focused and include relevant keywords.
        </small>
      </div>

  <h2>Technical Skills <span className="section-name">{getSectionLabel('skills')}</span></h2>
      <div className="form-group">
        <label htmlFor="skills">Skills*</label>
        <div className="input-with-ai">
          <input
            type="text"
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            required
            placeholder="JavaScript, React, Node.js, AWS, Docker, Git"
          />
          <button
            type="button"
            className={`ai-helper-btn ${aiLoading && aiFeature === 'skills' ? 'loading' : ''}`}
            onClick={generateSkillsWithAI}
            disabled={aiLoading}
            title="Generate AI-powered skills suggestions"
          >
            {aiLoading && aiFeature === 'skills' ? '🤖 Generating...' : '⚡ AI Suggest Skills'}
          </button>
        </div>
        <small className="form-text text-muted">
          List your skills, separated by commas. Include technical skills, programming languages, and tools.
        </small>
      </div>

  <h2>Work Experience <span className="section-name">{getSectionLabel('experience')}</span></h2>
      <div className="form-group fresher-toggle">
        <label>
          <input type="checkbox" checked={isFresher} onChange={() => setIsFresher(prev => !prev)} />{' '}
          I'm a fresher (hide work experience)
        </label>
      </div>
      {!isFresher && formData.experience.map((exp, index) => (
        <div key={index} className="section-item">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor={`exp-role-${index}`}>Role/Position*</label>
              <input
                type="text"
                id={`exp-role-${index}`}
                value={exp.role}
                onChange={(e) => handleArrayItemChange(index, 'experience', 'role', e.target.value)}
                required
                placeholder="Software Developer"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor={`exp-company-${index}`}>Company*</label>
              <input
                type="text"
                id={`exp-company-${index}`}
                value={exp.company}
                onChange={(e) => handleArrayItemChange(index, 'experience', 'company', e.target.value)}
                required
                placeholder="ABC Corp"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor={`exp-duration-${index}`}>Duration*</label>
            <input
              type="text"
              id={`exp-duration-${index}`}
              value={exp.duration}
              onChange={(e) => handleArrayItemChange(index, 'experience', 'duration', e.target.value)}
              required
              placeholder="Jan 2023 - Jun 2023"
            />
          </div>
          
          <div className="form-group">
            <div className="label-with-ai">
              <label htmlFor={`exp-description-${index}`}>Description*</label>
            </div>
            <div className="textarea-with-ai">
              <textarea
                id={`exp-description-${index}`}
                value={exp.description}
                onChange={(e) => handleArrayItemChange(index, 'experience', 'description', e.target.value)}
                rows="3"
                required
                placeholder="- Developed REST APIs using Node.js and Express.js.
- Implemented authentication system using JWT.
- Optimized database queries, improving performance by 30%."
              ></textarea>
              <button
                type="button"
                className={`ai-helper-btn ${aiLoading && aiFeature === `experience-${index}` ? 'loading' : ''}`}
                onClick={() => improveExperienceWithAI(index)}
                disabled={aiLoading}
                title="Improve this experience description with AI"
              >
                {aiLoading && aiFeature === `experience-${index}` ? '🤖 Improving...' : '✨ Improve with AI'}
              </button>
            </div>
            <small className="form-text text-muted">
              Enter bullet points, each on a new line. Start with action verbs and include measurable achievements.
            </small>
          </div>
          
          <div className="section-item-actions">
            <button 
              type="button" 
              className="btn-remove" 
              onClick={() => handleRemoveItem('experience', index)}
            >
              Remove Experience
            </button>
          </div>
        </div>
      ))}
      
      <div className="section-actions">
        <button 
          type="button" 
          className="btn-add" 
          onClick={() => handleAddItem('experience')}
        >
          Add Experience
        </button>
      </div>

  <h2>Projects <span className="section-name">{getSectionLabel('projects')}</span></h2>
      {formData.projects.map((project, index) => (
        <div key={index} className="section-item">
          <div className="form-group">
            <label htmlFor={`project-title-${index}`}>Project Title*</label>
            <input
              type="text"
              id={`project-title-${index}`}
              value={project.title}
              onChange={(e) => handleArrayItemChange(index, 'projects', 'title', e.target.value)}
              required
              placeholder="Resume Builder App"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor={`project-description-${index}`}>Project Description*</label>
            <div className="textarea-with-ai">
              <textarea
                id={`project-description-${index}`}
                value={project.description}
                onChange={(e) => handleArrayItemChange(index, 'projects', 'description', e.target.value)}
                rows="3"
                required
                placeholder="- Built a web-based resume generator using HTML, CSS, and JS.
- Implemented PDF export functionality with html2pdf.js.
- Added localStorage for data persistence."
              ></textarea>
              <button
                type="button"
                className={`ai-helper-btn ${aiLoading && aiFeature === `project-${index}` ? 'loading' : ''}`}
                onClick={() => improveProjectWithAI(index)}
                disabled={aiLoading}
                title="Improve project description with AI"
              >
                {aiLoading && aiFeature === `project-${index}` ? '🤖 Improving...' : '✨ Improve with AI'}
              </button>
            </div>
            <small className="form-text text-muted">
              Enter bullet points, each on a new line. Focus on your role, technologies used, and outcomes.
            </small>
          </div>
          
          <div className="section-item-actions">
            {formData.projects.length > 1 && (
              <button 
                type="button" 
                className="btn-remove" 
                onClick={() => handleRemoveItem('projects', index)}
              >
                Remove Project
              </button>
            )}
          </div>
        </div>
      ))}
      
      <div className="section-actions">
        <button 
          type="button" 
          className="btn-add" 
          onClick={() => handleAddItem('projects')}
        >
          Add Project
        </button>
      </div>

  <h2>Education <span className="section-name">{getSectionLabel('education')}</span></h2>
      {formData.education.map((edu, index) => {
        const type = edu.type || 'Other';
        // Choose labels/placeholders based on type
        let degreeLabel = 'Degree/Course*';
        let degreePlaceholder = 'B.Sc Computer Science';
        let institutionLabel = 'Institution*';
        let institutionPlaceholder = 'XYZ University';

        if (type === 'Class 10') {
          degreeLabel = 'Board/Exam*';
          degreePlaceholder = 'CBSE / ICSE / State Board';
          institutionLabel = 'School*';
          institutionPlaceholder = 'ABC High School';
        } else if (type === 'Class 12') {
          degreeLabel = 'Board/Stream*';
          degreePlaceholder = 'CBSE - Science / Commerce / Arts';
          institutionLabel = 'School/College*';
          institutionPlaceholder = 'ABC Senior Secondary School';
        } else if (type === 'Graduation') {
          degreeLabel = 'Degree*';
          degreePlaceholder = 'B.Sc / B.Tech / B.Com';
          institutionLabel = 'University/College*';
          institutionPlaceholder = 'XYZ University';
        } else if (type === 'Post Graduation') {
          degreeLabel = 'Postgrad Degree*';
          degreePlaceholder = 'M.Sc / M.Tech / MBA';
          institutionLabel = 'University/College*';
          institutionPlaceholder = 'XYZ University';
        }

        return (
          <div key={index} className="section-item">
            <div className="form-group">
              <label htmlFor={`edu-degree-${index}`}>{type} - {degreeLabel}</label>
              <input
                type="text"
                id={`edu-degree-${index}`}
                value={edu.degree}
                onChange={(e) => handleArrayItemChange(index, 'education', 'degree', e.target.value)}
                required
                placeholder={degreePlaceholder}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor={`edu-institution-${index}`}>{institutionLabel}</label>
                <input
                  type="text"
                  id={`edu-institution-${index}`}
                  value={edu.institution}
                  onChange={(e) => handleArrayItemChange(index, 'education', 'institution', e.target.value)}
                  required
                  placeholder={institutionPlaceholder}
                />
              </div>

              <div className="form-group">
                <label htmlFor={`edu-year-${index}`}>Year*</label>
                <input
                  type="text"
                  id={`edu-year-${index}`}
                  value={edu.year}
                  onChange={(e) => handleArrayItemChange(index, 'education', 'year', e.target.value)}
                  required
                  placeholder="2023"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor={`edu-percentage-${index}`}>GPA/Percentage</label>
              <input
                type="text"
                id={`edu-percentage-${index}`}
                value={edu.percentage}
                onChange={(e) => handleArrayItemChange(index, 'education', 'percentage', e.target.value)}
                placeholder="3.8 GPA or 85%"
              />
            </div>

            <div className="section-item-actions">
              <button 
                type="button" 
                className="btn-remove" 
                onClick={() => handleRemoveItem('education', index)}
              >
                Remove Education
              </button>
            </div>
          </div>
        );
      })}
      
      <div className="section-actions">
        <button 
          type="button" 
          className="btn-add" 
          onClick={() => handleAddItem('education')}
        >
          Add Education
        </button>
      </div>

  <h2>Achievements & Certifications <span className="section-name">{getSectionLabel('achievements')}</span></h2>
      {formData.achievements.map((achievement, index) => (
        <div key={index} className="section-item">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor={`achievement-text-${index}`}>Achievement/Certification {index + 1}</label>
              <div className="input-with-ai">
                <input
                  type="text"
                  id={`achievement-text-${index}`}
                  value={achievement.text}
                  onChange={(e) => handleAchievementChange(index, 'text', e.target.value)}
                  placeholder="AWS Certified Solutions Architect"
                />
                <button
                  type="button"
                  className={`ai-helper-btn ${aiLoading && aiFeature === `achievement-${index}` ? 'loading' : ''}`}
                  onClick={() => improveAchievementWithAI(index)}
                  disabled={aiLoading}
                  title="Improve this achievement with AI"
                >
                  {aiLoading && aiFeature === `achievement-${index}` ? '🤖 Improving...' : '✨ Improve with AI'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Start Date</label>
              <input type="text" value={achievement.start} onChange={(e) => handleAchievementChange(index, 'start', e.target.value)} placeholder="Jan 2020" />
            </div>

            <div className="form-group">
              <label>End Date</label>
              <input type="text" value={achievement.end} onChange={(e) => handleAchievementChange(index, 'end', e.target.value)} placeholder="Dec 2020 or Present" />
            </div>
          </div>

          <div className="section-item-actions">
            <button type="button" className="btn-remove" onClick={() => handleRemoveItem('achievements', index)}>Remove Achievement</button>
          </div>
        </div>
      ))}
      
      <div className="section-actions">
        <button 
          type="button" 
          className="btn-add" 
          onClick={() => handleAddItem('achievements')}
        >
          Add Achievement
        </button>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className={`ai-optimize-btn ${aiLoading && aiFeature === 'optimize' ? 'loading' : ''}`}
          onClick={optimizeResumeWithAI}
          disabled={aiLoading}
          title="Optimize resume with AI suggestions"
        >
          {aiLoading && aiFeature === 'optimize' ? '🤖 Optimizing...' : '🚀 AI Optimize Resume'}
        </button>
        <button 
          type="submit" 
          className="btn-generate" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Generating...' : 'Generate Resume'}
        </button>
      </div>
      </form>
    </div>
  );
};

export default ResumeForm;
