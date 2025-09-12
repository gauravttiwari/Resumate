import React, { useState, useEffect } from 'react';
import './styles/ResumeForm.css';

const ResumeForm = ({ initialData, onSubmit, onChange, isSubmitting, resumeType }) => {
  const [isFresher, setIsFresher] = useState(false);
  const [formData, setFormData] = useState(() => {
    // If initialData is provided, use it; otherwise use default values
    if (initialData) {
      return {
        ...initialData,
        // Ensure array fields exist even if not in initialData
        education: initialData.education || [{ degree: '', institution: '', year: '', percentage: '' }],
        experience: initialData.experience || [{ role: '', company: '', duration: '', description: '' }],
        projects: initialData.projects || [{ title: '', description: '' }],
        achievements: initialData.achievements || [''],
        certifications: initialData.certifications || [''],
        licenses: initialData.licenses || [''],
        publications: initialData.publications || [''],
        clinicalExperience: initialData.clinicalExperience || [{ title: '', location: '', duration: '', details: '' }],
        vocationalTraining: initialData.vocationalTraining || [{ course: '', institution: '', duration: '', details: '' }],
      };
    }
    
    // Default form data when no initialData is provided
    return {
      name: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      github: '',
      summary: '',
      skills: '',
      technicalSkills: '',
      softSkills: '',
      languages: '',
      specializations: '',
      education: [{ degree: '', institution: '', year: '', percentage: '' }],
      experience: [{ role: '', company: '', duration: '', description: '' }],
      projects: [{ title: '', description: '' }],
      achievements: [''],
      certifications: [''],
      licenses: [''],
      publications: [''],
      clinicalExperience: [{ title: '', location: '', duration: '', details: '' }],
      vocationalTraining: [{ course: '', institution: '', duration: '', details: '' }],
      profilePic: null,
      sidebarColor: '#800000' // Default maroon color for sidebar
    };
  });

  // When formData changes, notify parent component
  useEffect(() => {
    if (onChange) {
      onChange(formData);
    }
  }, [formData, onChange]);
  
  // Update form structure when resume type changes
  useEffect(() => {
    if (resumeType) {
      const baseData = {
        ...formData,
        name: formData.name || '',
        email: formData.email || '',
        phone: formData.phone || '',
        address: formData.address || '',
        summary: formData.summary || '',
        education: formData.education || [{ degree: '', institution: '', year: '', percentage: '' }],
        experience: formData.experience || [{ role: '', company: '', duration: '', description: '' }],
        achievements: formData.achievements || [''],
      };
      
      // Add type-specific fields while preserving user data
      let updatedData = { ...baseData };
      
      switch(resumeType) {
        case 'technical':
          updatedData = {
            ...baseData,
            linkedin: formData.linkedin || '',
            github: formData.github || '',
            skills: formData.skills || '',
            projects: formData.projects || [{ title: '', description: '' }],
            certifications: formData.certifications || ['']
          };
          break;
        case 'medical':
          updatedData = {
            ...baseData,
            licenses: formData.licenses || [''],
            specializations: formData.specializations || '',
            clinicalExperience: formData.clinicalExperience || [{ title: '', location: '', duration: '', details: '' }],
            publications: formData.publications || ['']
          };
          break;
        case 'diploma':
          updatedData = {
            ...baseData,
            technicalSkills: formData.technicalSkills || '',
            vocationalTraining: formData.vocationalTraining || [{ course: '', institution: '', duration: '', details: '' }],
            certifications: formData.certifications || ['']
          };
          break;
        case 'nontechnical':
          updatedData = {
            ...baseData,
            linkedin: formData.linkedin || '',
            softSkills: formData.softSkills || '',
            languages: formData.languages || '',
            projects: formData.projects || [{ title: '', description: '' }]
          };
          break;
        default:
          break;
      }
      
      setFormData(updatedData);
    }
  }, [resumeType]);

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

  // Handle achievements as a simple array of strings
  const handleAchievementChange = (index, value) => {
    setFormData(prevData => {
      const updatedAchievements = [...prevData.achievements];
      updatedAchievements[index] = value;
      return {
        ...prevData,
        achievements: updatedAchievements
      };
    });
  };
  
  // Handler for licenses (medical)
  const handleLicenseChange = (index, value) => {
    setFormData(prevData => {
      const updatedLicenses = [...prevData.licenses];
      updatedLicenses[index] = value;
      return {
        ...prevData,
        licenses: updatedLicenses
      };
    });
  };
  
  // Handler for publications (medical)
  const handlePublicationChange = (index, value) => {
    setFormData(prevData => {
      const updatedPublications = [...prevData.publications];
      updatedPublications[index] = value;
      return {
        ...prevData,
        publications: updatedPublications
      };
    });
  };
  
  // Handler for certifications (technical/diploma)
  const handleCertificationChange = (index, value) => {
    setFormData(prevData => {
      const updatedCertifications = [...prevData.certifications];
      updatedCertifications[index] = value;
      return {
        ...prevData,
        certifications: updatedCertifications
      };
    });
  };

  // Add new item to arrays
  const handleAddItem = (field) => {
    setFormData(prevData => {
      let newItem;
      
      switch(field) {
        case 'education':
          newItem = { degree: '', institution: '', year: '', percentage: '' };
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
            achievements: [...prevData.achievements, '']
          };
        case 'licenses':
          return {
            ...prevData,
            licenses: [...prevData.licenses, '']
          };
        case 'publications':
          return {
            ...prevData,
            publications: [...prevData.publications, '']
          };
        case 'certifications':
          return {
            ...prevData,
            certifications: [...prevData.certifications, '']
          };
        case 'clinicalExperience':
          newItem = { title: '', location: '', duration: '', details: '' };
          break;
        case 'vocationalTraining':
          newItem = { course: '', institution: '', duration: '', details: '' };
          break;
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
      
      // Ensure there's always at least one empty item
      if (updatedItems.length === 0) {
        switch(field) {
          case 'education':
            updatedItems.push({ degree: '', institution: '', year: '', percentage: '' });
            break;
          case 'experience':
            updatedItems.push({ role: '', company: '', duration: '', description: '' });
            break;
          case 'projects':
            updatedItems.push({ title: '', description: '' });
            break;
          case 'achievements':
            updatedItems.push('');
            break;
          case 'licenses':
            updatedItems.push('');
            break;
          case 'publications':
            updatedItems.push('');
            break;
          case 'certifications':
            updatedItems.push('');
            break;
          case 'clinicalExperience':
            updatedItems.push({ title: '', location: '', duration: '', details: '' });
            break;
          case 'vocationalTraining':
            updatedItems.push({ course: '', institution: '', duration: '', details: '' });
            break;
          default:
            break;
        }
      }
      
      return {
        ...prevData,
        [field]: updatedItems
      };
    });
  };

  // Handle profile picture upload
  const handleProfilePicUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file is an image and not too large
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      
      if (file.size > 5000000) { // 5MB limit
        alert('Image file is too large. Please select an image smaller than 5MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        // Create an image element to verify the image loads correctly
        const img = new Image();
        img.onload = () => {
          setFormData(prevData => ({
            ...prevData,
            profilePic: event.target.result
          }));
        };
        img.onerror = () => {
          alert('There was an error loading the image. Please try another image.');
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // If fresher is selected, submit an empty experience array
    const dataToSubmit = isFresher 
      ? { ...formData, experience: [] }
      : formData;
      
    if (onSubmit) {
      onSubmit(dataToSubmit);
    }
  };

  return (
    <form className="resume-form" onSubmit={handleSubmit}>
      {resumeType && (
        <div className="resume-type-indicator">
          <span>Resume Type:</span>
          <strong className={`resume-type ${resumeType}`}>
            {resumeType === 'technical' ? 'Technical' : 
             resumeType === 'medical' ? 'Medical' : 
             resumeType === 'diploma' ? 'Diploma/Certificate' : 'Non-Technical'}
          </strong>
        </div>
      )}
      <h2>Personal Information</h2>
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

      <h2>Professional Summary</h2>
      <div className="form-group">
        <label htmlFor="summary">Career Objective / Summary*</label>
        <textarea
          id="summary"
          name="summary"
          value={formData.summary}
          onChange={handleChange}
          rows="3"
          required
          placeholder="Software Engineer with 2 years of experience building scalable web applications using React, Node.js, and cloud technologies."
        ></textarea>
        <small className="form-text text-muted">
          2-3 lines summarizing your profile and the job role you're applying for. Keep it focused and include relevant keywords.
        </small>
      </div>

      {/* Display different skills sections based on resume type */}
      {(!resumeType || (resumeType !== 'technical' && resumeType !== 'medical' && resumeType !== 'diploma' && resumeType !== 'nontechnical')) && (
        <>
          <h2>Skills</h2>
          <div className="form-group">
            <label htmlFor="skills">Professional Skills*</label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              required
              placeholder="List your key professional skills separated by commas"
            />
            <small className="form-text text-muted">
              Include skills relevant to your target job or industry.
            </small>
          </div>
        </>
      )}
      
      {resumeType === 'technical' && (
        <>
          <h2>Technical Skills</h2>
          <div className="form-group">
            <label htmlFor="skills">Skills*</label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              required
              placeholder="JavaScript, React, Node.js, Python, AWS, Docker, Git"
            />
            <small className="form-text text-muted">
              List your skills, separated by commas. Include technical skills, programming languages, and tools.
            </small>
          </div>
          
          {/* GitHub section for technical resumes */}
          <div className="form-group">
            <label htmlFor="github">GitHub Profile</label>
            <input
              type="text"
              id="github"
              name="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="github.com/username"
            />
            <small className="form-text text-muted">
              Include your GitHub profile to showcase your code portfolio.
            </small>
          </div>
          
          <h2>Certifications</h2>
          {formData.certifications && formData.certifications.map((cert, index) => (
            <div key={index} className="section-item achievement-item">
              <div className="form-group">
                <label htmlFor={`certification-${index}`}>Certification {index + 1}</label>
                <input
                  type="text"
                  id={`certification-${index}`}
                  value={cert}
                  onChange={(e) => handleCertificationChange(index, e.target.value)}
                  placeholder="AWS Certified Solutions Architect - Associate (2023)"
                />
              </div>
              
              <div className="section-item-actions">
                {formData.certifications && formData.certifications.length > 1 && (
                  <button 
                    type="button" 
                    className="btn-remove" 
                    onClick={() => handleRemoveItem('certifications', index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
          
          <div className="section-actions">
            <button 
              type="button" 
              className="btn-add" 
              onClick={() => handleAddItem('certifications')}
            >
              Add Certification
            </button>
            {formData.certifications && formData.certifications.length > 1 && (
              <button 
                type="button" 
                className="btn-remove-all" 
                onClick={() => setFormData(prev => ({
                  ...prev,
                  certifications: ['']
                }))}
              >
                Remove All
              </button>
            )}
          </div>
        </>
      )}
      
      {resumeType === 'medical' && (
        <>
          <h2>Medical Specialization</h2>
          <div className="form-group">
            <label htmlFor="specializations">Specialization*</label>
            <input
              type="text"
              id="specializations"
              name="specializations"
              value={formData.specializations}
              onChange={handleChange}
              required
              placeholder="Cardiology, Internal Medicine, Pediatrics"
            />
            <small className="form-text text-muted">
              List your medical specializations, separated by commas.
            </small>
          </div>
          
          <h2>Licenses & Registrations</h2>
          {formData.licenses && formData.licenses.map((license, index) => (
            <div key={index} className="section-item achievement-item">
              <div className="form-group">
                <label htmlFor={`license-${index}`}>License/Registration {index + 1}</label>
                <input
                  type="text"
                  id={`license-${index}`}
                  value={license}
                  onChange={(e) => handleLicenseChange(index, e.target.value)}
                  placeholder="Medical Council of India Registration No. 12345 (2022)"
                />
              </div>
              
              <div className="section-item-actions">
                {formData.licenses && formData.licenses.length > 1 && (
                  <button 
                    type="button" 
                    className="btn-remove" 
                    onClick={() => handleRemoveItem('licenses', index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
          
          <div className="section-actions">
            <button 
              type="button" 
              className="btn-add" 
              onClick={() => handleAddItem('licenses')}
            >
              Add License
            </button>
            {formData.licenses && formData.licenses.length > 1 && (
              <button 
                type="button" 
                className="btn-remove-all" 
                onClick={() => setFormData(prev => ({
                  ...prev,
                  licenses: ['']
                }))}
              >
                Remove All
              </button>
            )}
          </div>
          
          <h2>Clinical Experience</h2>
          {formData.clinicalExperience && formData.clinicalExperience.map((exp, index) => (
            <div key={index} className="section-item">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor={`clinical-title-${index}`}>Position/Role*</label>
                  <input
                    type="text"
                    id={`clinical-title-${index}`}
                    value={exp.title}
                    onChange={(e) => handleArrayItemChange(index, 'clinicalExperience', 'title', e.target.value)}
                    required
                    placeholder="Resident Doctor"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor={`clinical-location-${index}`}>Hospital/Clinic*</label>
                  <input
                    type="text"
                    id={`clinical-location-${index}`}
                    value={exp.location}
                    onChange={(e) => handleArrayItemChange(index, 'clinicalExperience', 'location', e.target.value)}
                    required
                    placeholder="Apollo Hospital"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor={`clinical-duration-${index}`}>Duration*</label>
                <input
                  type="text"
                  id={`clinical-duration-${index}`}
                  value={exp.duration}
                  onChange={(e) => handleArrayItemChange(index, 'clinicalExperience', 'duration', e.target.value)}
                  required
                  placeholder="Jan 2022 - Dec 2023"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor={`clinical-details-${index}`}>Details*</label>
                <textarea
                  id={`clinical-details-${index}`}
                  value={exp.details}
                  onChange={(e) => handleArrayItemChange(index, 'clinicalExperience', 'details', e.target.value)}
                  rows="3"
                  required
                  placeholder="- Diagnosed and treated over 500 patients with cardiovascular conditions.
- Assisted in 50+ cardiac surgeries.
- Conducted regular follow-ups with chronic patients."
                ></textarea>
              </div>
              
              <div className="section-item-actions">
                {formData.clinicalExperience && formData.clinicalExperience.length > 1 && (
                  <button 
                    type="button" 
                    className="btn-remove" 
                    onClick={() => handleRemoveItem('clinicalExperience', index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
          
          <div className="section-actions">
            <button 
              type="button" 
              className="btn-add" 
              onClick={() => handleAddItem('clinicalExperience')}
            >
              Add Clinical Experience
            </button>
            {formData.clinicalExperience && formData.clinicalExperience.length > 1 && (
              <button 
                type="button" 
                className="btn-remove-all" 
                onClick={() => setFormData(prev => ({
                  ...prev,
                  clinicalExperience: [{ title: '', location: '', duration: '', details: '' }]
                }))}
              >
                Remove All
              </button>
            )}
          </div>
          
          <h2>Publications</h2>
          {formData.publications && formData.publications.map((pub, index) => (
            <div key={index} className="section-item achievement-item">
              <div className="form-group">
                <label htmlFor={`publication-${index}`}>Publication {index + 1}</label>
                <input
                  type="text"
                  id={`publication-${index}`}
                  value={pub}
                  onChange={(e) => handlePublicationChange(index, e.target.value)}
                  placeholder="Smith J., et al. (2023). Novel Treatment Approaches for Hypertension. Journal of Cardiology, 45(2), 112-118."
                />
              </div>
              
              <div className="section-item-actions">
                {formData.publications && formData.publications.length > 1 && (
                  <button 
                    type="button" 
                    className="btn-remove" 
                    onClick={() => handleRemoveItem('publications', index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
          
          <div className="section-actions">
            <button 
              type="button" 
              className="btn-add" 
              onClick={() => handleAddItem('publications')}
            >
              Add Publication
            </button>
            {formData.publications && formData.publications.length > 1 && (
              <button 
                type="button" 
                className="btn-remove-all" 
                onClick={() => setFormData(prev => ({
                  ...prev,
                  publications: ['']
                }))}
              >
                Remove All
              </button>
            )}
          </div>
        </>
      )}
      
      {resumeType === 'diploma' && (
        <>
          <h2>Technical Skills</h2>
          <div className="form-group">
            <label htmlFor="technicalSkills">Technical Skills*</label>
            <input
              type="text"
              id="technicalSkills"
              name="technicalSkills"
              value={formData.technicalSkills}
              onChange={handleChange}
              required
              placeholder="Electrical Wiring, Circuit Design, PLC Programming, Mechanical Drawing"
            />
            <small className="form-text text-muted">
              List your technical skills and competencies, separated by commas.
            </small>
          </div>
          
          <h2>Vocational Training</h2>
          {formData.vocationalTraining && formData.vocationalTraining.map((training, index) => (
            <div key={index} className="section-item">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor={`training-course-${index}`}>Course/Program*</label>
                  <input
                    type="text"
                    id={`training-course-${index}`}
                    value={training.course}
                    onChange={(e) => handleArrayItemChange(index, 'vocationalTraining', 'course', e.target.value)}
                    required
                    placeholder="Industrial Automation Training"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor={`training-institution-${index}`}>Institution*</label>
                  <input
                    type="text"
                    id={`training-institution-${index}`}
                    value={training.institution}
                    onChange={(e) => handleArrayItemChange(index, 'vocationalTraining', 'institution', e.target.value)}
                    required
                    placeholder="Industrial Training Institute"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor={`training-duration-${index}`}>Duration*</label>
                <input
                  type="text"
                  id={`training-duration-${index}`}
                  value={training.duration}
                  onChange={(e) => handleArrayItemChange(index, 'vocationalTraining', 'duration', e.target.value)}
                  required
                  placeholder="Jun 2022 - Aug 2022"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor={`training-details-${index}`}>Details*</label>
                <textarea
                  id={`training-details-${index}`}
                  value={training.details}
                  onChange={(e) => handleArrayItemChange(index, 'vocationalTraining', 'details', e.target.value)}
                  rows="3"
                  required
                  placeholder="- Received hands-on training in PLC programming.
- Completed 5 practical projects involving circuit design.
- Learned troubleshooting techniques for common electrical issues."
                ></textarea>
              </div>
              
              <div className="section-item-actions">
                {formData.vocationalTraining && formData.vocationalTraining.length > 1 && (
                  <button 
                    type="button" 
                    className="btn-remove" 
                    onClick={() => handleRemoveItem('vocationalTraining', index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
          
          <div className="section-actions">
            <button 
              type="button" 
              className="btn-add" 
              onClick={() => handleAddItem('vocationalTraining')}
            >
              Add Training
            </button>
            {formData.vocationalTraining && formData.vocationalTraining.length > 1 && (
              <button 
                type="button" 
                className="btn-remove-all" 
                onClick={() => setFormData(prev => ({
                  ...prev,
                  vocationalTraining: [{ course: '', institution: '', duration: '', details: '' }]
                }))}
              >
                Remove All
              </button>
            )}
          </div>
          
          <h2>Certifications</h2>
          {formData.certifications && formData.certifications.map((cert, index) => (
            <div key={index} className="section-item achievement-item">
              <div className="form-group">
                <label htmlFor={`certification-${index}`}>Certification {index + 1}</label>
                <input
                  type="text"
                  id={`certification-${index}`}
                  value={cert}
                  onChange={(e) => handleCertificationChange(index, e.target.value)}
                  placeholder="Certified Electrical Technician (2023)"
                />
              </div>
              
              <div className="section-item-actions">
                {formData.certifications && formData.certifications.length > 1 && (
                  <button 
                    type="button" 
                    className="btn-remove" 
                    onClick={() => handleRemoveItem('certifications', index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
          
          <div className="section-actions">
            <button 
              type="button" 
              className="btn-add" 
              onClick={() => handleAddItem('certifications')}
            >
              Add Certification
            </button>
            {formData.certifications && formData.certifications.length > 1 && (
              <button 
                type="button" 
                className="btn-remove-all" 
                onClick={() => setFormData(prev => ({
                  ...prev,
                  certifications: ['']
                }))}
              >
                Remove All
              </button>
            )}
          </div>
        </>
      )}
      
      {resumeType === 'nontechnical' && (
        <>
          <h2>Professional Skills</h2>
          <div className="form-group">
            <label htmlFor="softSkills">Soft Skills*</label>
            <input
              type="text"
              id="softSkills"
              name="softSkills"
              value={formData.softSkills}
              onChange={handleChange}
              required
              placeholder="Communication, Leadership, Problem-solving, Teamwork, Time Management"
            />
            <small className="form-text text-muted">
              List your soft skills and professional competencies, separated by commas.
            </small>
          </div>
          
          <div className="form-group">
            <label htmlFor="languages">Languages</label>
            <input
              type="text"
              id="languages"
              name="languages"
              value={formData.languages}
              onChange={handleChange}
              placeholder="English (Fluent), Hindi (Native), French (Basic)"
            />
            <small className="form-text text-muted">
              List languages you can speak along with proficiency level.
            </small>
          </div>
          
          <div className="form-group">
            <label htmlFor="linkedin">LinkedIn Profile</label>
            <input
              type="text"
              id="linkedin"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="linkedin.com/in/username"
            />
            <small className="form-text text-muted">
              Include your LinkedIn profile to enhance your professional presence.
            </small>
          </div>
        </>
      )}

      {resumeType !== 'medical' && (
        <div className="section-header-with-options">
          <h2>Work Experience</h2>
          <div className="fresher-option">
            <input
              type="checkbox"
              id="isFresher"
              checked={isFresher}
              onChange={(e) => setIsFresher(e.target.checked)}
            />
            <label htmlFor="isFresher">I am a fresher (hide experience section)</label>
          </div>
        </div>
      )}

      {!isFresher && resumeType !== 'medical' && formData.experience && formData.experience.map((exp, index) => (
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
            <label htmlFor={`exp-description-${index}`}>Description*</label>
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
            <small className="form-text text-muted">
              Enter bullet points, each on a new line. Start with action verbs and include measurable achievements.
            </small>
          </div>
          
          <div className="section-item-actions">
            {formData.experience && formData.experience.length > 1 && (
              <button 
                type="button" 
                className="btn-remove" 
                onClick={() => handleRemoveItem('experience', index)}
              >
                Remove Experience
              </button>
            )}
          </div>
        </div>
      ))}
      
      {!isFresher && resumeType !== 'medical' && (
        <div className="section-actions">
          <button 
            type="button" 
            className="btn-add" 
            onClick={() => handleAddItem('experience')}
          >
            Add Experience
          </button>
          {formData.experience && formData.experience.length > 1 && (
            <button 
              type="button" 
              className="btn-remove-all" 
              onClick={() => setFormData(prev => ({
                ...prev,
                experience: [{ role: '', company: '', duration: '', description: '' }]
              }))}
            >
              Remove All
            </button>
          )}
        </div>
      )}

      <h2>Projects</h2>
      {formData.projects && formData.projects.map((project, index) => (
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
            <small className="form-text text-muted">
              Enter bullet points, each on a new line. Focus on your role, technologies used, and outcomes.
            </small>
          </div>
          
          <div className="section-item-actions">
            {formData.projects && formData.projects.length > 1 && (
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
        {formData.projects && formData.projects.length > 1 && (
          <button 
            type="button" 
            className="btn-remove-all" 
            onClick={() => setFormData(prev => ({
              ...prev,
              projects: [{ title: '', description: '' }]
            }))}
          >
            Remove All
          </button>
        )}
      </div>

      <h2>Education</h2>
      {formData.education && formData.education.map((edu, index) => (
        <div key={index} className="section-item">
          <div className="form-group">
            <label htmlFor={`edu-degree-${index}`}>Degree/Course*</label>
            <input
              type="text"
              id={`edu-degree-${index}`}
              value={edu.degree}
              onChange={(e) => handleArrayItemChange(index, 'education', 'degree', e.target.value)}
              required
              placeholder="B.Sc Computer Science"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor={`edu-institution-${index}`}>Institution*</label>
              <input
                type="text"
                id={`edu-institution-${index}`}
                value={edu.institution}
                onChange={(e) => handleArrayItemChange(index, 'education', 'institution', e.target.value)}
                required
                placeholder="XYZ University"
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
            {formData.education && formData.education.length > 1 && (
              <button 
                type="button" 
                className="btn-remove" 
                onClick={() => handleRemoveItem('education', index)}
              >
                Remove Education
              </button>
            )}
          </div>
        </div>
      ))}
      
      <div className="section-actions">
        <button 
          type="button" 
          className="btn-add" 
          onClick={() => handleAddItem('education')}
        >
          Add Education
        </button>
        {formData.education && formData.education.length > 1 && (
          <button 
            type="button" 
            className="btn-remove-all" 
            onClick={() => setFormData(prev => ({
              ...prev,
              education: [{ degree: '', institution: '', year: '', percentage: '' }]
            }))}
          >
            Remove All
          </button>
        )}
      </div>

      <h2>Achievements & Certifications</h2>
      {formData.achievements && formData.achievements.map((achievement, index) => (
        <div key={index} className="section-item achievement-item">
          <div className="form-group">
            <label htmlFor={`achievement-${index}`}>Achievement/Certification {index + 1}</label>
            <input
              type="text"
              id={`achievement-${index}`}
              value={achievement}
              onChange={(e) => handleAchievementChange(index, e.target.value)}
              placeholder="AWS Certified Solutions Architect (2024)"
            />
          </div>
          
          <div className="section-item-actions">
            {formData.achievements && formData.achievements.length > 1 && (
              <button 
                type="button" 
                className="btn-remove" 
                onClick={() => handleRemoveItem('achievements', index)}
              >
                Remove
              </button>
            )}
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
        {formData.achievements && formData.achievements.length > 1 && (
          <button 
            type="button" 
            className="btn-remove-all" 
            onClick={() => setFormData(prev => ({
              ...prev,
              achievements: ['']
            }))}
          >
            Remove All
          </button>
        )}
      </div>

      <h2>Template Customization</h2>
      <div className="form-group">
        <label htmlFor="sidebarColor">Sidebar Color (Modern Sidebar Template)</label>
        <div className="color-picker-container">
          <input
            type="color"
            id="sidebarColor"
            name="sidebarColor"
            value={formData.sidebarColor || '#800000'}
            onChange={handleChange}
            className="color-picker"
          />
          <span className="color-value">{formData.sidebarColor || '#800000'}</span>
        </div>
        <small className="form-text text-muted">Choose a sidebar color for the Modern Sidebar template</small>
      </div>

      <div className="form-actions">
        <button 
          type="submit" 
          className="btn-generate" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Generating...' : 'Generate Resume'}
        </button>
      </div>
    </form>
  );
};

export default ResumeForm;
