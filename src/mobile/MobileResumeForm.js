import React, { useState, useRef } from 'react';
import './MobileResumeForm.css';

const sections = [
  'Personal Information',
  'Summary',
  'Skills',
  'Work Experience',
  'Education',
  'Projects',
  'Achievements & Certifications',
];

const MobileResumeForm = ({ resumeType = 'technical', onNavigate = () => {}, onOpenTemplates = () => {}, onOpenInterview = () => {}, onOpenAIChat = () => {} }) => {
  const [form, setForm] = useState({
    personal: { name: '', email: '', phone: '', location: '', linkedin: '', profileUrl: '', photo: '' },
    summary: '',
    skills: [''],
    experience: [{ company: '', role: '', duration: '', description: '' }],
    education: [{ school: '', degree: '', year: '' }],
    projects: [{ name: '', description: '' }],
    achievements: [{ name: '', issuer: '', start: '', end: '' }],
  });

  const refs = useRef(sections.map(() => React.createRef()));
  const iconMap = {
    'Personal Information': '👤',
    'Summary': '📝',
    'Skills': '💡',
    'Work Experience': '💼',
    'Education': '🎓',
    'Projects': '📁',
    'Achievements & Certifications': '🏆',
  };
  const getIcon = (i) => iconMap[sections[i]] || '📄';

  // Skills UI state
  const [skillInput, setSkillInput] = useState('')
  const defaultCategoryMap = {
    technical: 'Frontend',
    nontechnical: 'Management',
    diploma: 'Office',
    medical: 'Office'
  };
  const [selectedCategory, setSelectedCategory] = useState(defaultCategoryMap[resumeType] || 'All')
  const skillCategories = ['All','Frontend','Backend','DevOps','Data','Design','Management','Office']

  const skillChipMap = {
    Frontend: ['React', 'Angular', 'Vue', 'HTML', 'CSS', 'JavaScript', 'TypeScript'],
    Backend: ['Node.js', 'Express', 'Django', 'Flask', 'Spring', 'SQL', 'MongoDB'],
    DevOps: ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Azure', 'GCP', 'Terraform'],
    Data: ['SQL', 'Excel (advanced)', 'Pandas', 'NumPy', 'Tableau', 'Power BI'],
    Design: ['Figma', 'Adobe Photoshop', 'Illustrator', 'UX Research'],
    Management: ['Leadership', 'Communication', 'Project Management', 'Stakeholder Management'],
    Office: ['Customer Service', 'Point-of-Sale (POS)', 'Inventory Management', 'Scheduling', 'Bookkeeping', 'Data Entry', 'Basic First Aid', 'Forklift Operation', 'Quality Control']
  }

  if (resumeType === 'medical') {
    skillChipMap.Medical = ['Clinical Procedures', 'Patient Care', 'Medical Records', 'HIPAA Compliance', 'Pharmacology', 'Emergency Response'];
    if (!skillCategories.includes('Medical')) skillCategories.push('Medical');
  }
  if (resumeType === 'diploma') {
    skillChipMap.Vocational = ['Hands-on Training', 'Workshop Skills', 'Technical Drawing', 'Machine Operation'];
    if (!skillCategories.includes('Vocational')) skillCategories.push('Vocational');
  }

  const skillInputRef = useRef(null);

  const allChips = Array.from(new Set(Object.values(skillChipMap).flat()));
  const filteredChips = selectedCategory === 'All' ? allChips : (skillChipMap[selectedCategory] || []);

  // Bulk add modal state
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkSelected, setBulkSelected] = useState(new Set());

  const toggleBulkSelect = (chip) => {
    setBulkSelected(prev => {
      const next = new Set(prev);
      if (next.has(chip)) next.delete(chip); else next.add(chip);
      return next;
    });
  }

  const confirmBulkAdd = () => {
    const arr = Array.from(bulkSelected)
    if (arr.length) {
      setSkillInput(arr.join(', '))
      skillInputRef.current && skillInputRef.current.focus()
    }
    setBulkSelected(new Set())
    setShowBulkModal(false)
  }

  const cancelBulkAdd = () => {
    setBulkSelected(new Set());
    setShowBulkModal(false);
  }

  const addSkill = (skill) => {
    if(!skill) return
    const next = new Set(form.skills || [])
    next.add(skill)
    setForm(prev=>({ ...prev, skills: Array.from(next) }))
    setSkillInput('')
  }

  const addSkillFromInput = (e) => {
    e && e.preventDefault()
    const text = (skillInput || '').trim()
    if (!text) return
    const parts = text.split(/[,\n]+/).map(s => s.trim()).filter(Boolean)
    parts.forEach(p => addSkill(p))
  }

  const addSkillFromChip = (s) => {
    addSkill(s)
  }
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('home');

  const updateField = (path, value) => {
    setForm(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let cur = copy;
      for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]];
      cur[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  const validateSection = (index) => {
    switch (index) {
      case 0:
        return form.personal.name.trim() !== '' && form.personal.email.trim() !== '';
      case 1:
        return form.summary.trim().length >= 20;
      case 2:
        return form.skills.some(s => s && s.trim());
      case 3:
        return form.experience.some(e => (e.company && e.company.trim()) || (e.role && e.role.trim()));
      case 4:
        return form.education.some(ed => ed.school && ed.school.trim());
      case 5:
        return form.projects.some(p => p.name && p.name.trim());
      case 6:
        return form.achievements.some(a => a && a.trim());
      default:
        return false;
    }
  };

  const revealNext = (index) => {
    if (index + 1 >= sections.length) return;
    setVisible(prev => {
      const next = [...prev];
      next[index + 1] = true;
      return next;
    });
    setTimeout(() => {
      const node = refs.current[index + 1] && refs.current[index + 1].current;
      if (node && node.scrollIntoView) node.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  const handleAddSkill = () => setForm(prev => ({ ...prev, skills: [...prev.skills, ''] }));
  const handleAddExperience = () => setForm(prev => ({ ...prev, experience: [...prev.experience, { company: '', role: '', duration: '', description: '' }] }));
  const removeExperience = (index) => {
    setForm(prev => ({ ...prev, experience: prev.experience.filter((_, i) => i !== index) }));
  };
  const handleAddEducation = () => setForm(prev => ({ ...prev, education: [...prev.education, { school: '', degree: '', year: '' }] }));

  const handlePhotoChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm(prev => ({ ...prev, personal: { ...prev.personal, photo: reader.result } }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateSection(0)) {
      alert('Please complete Personal Information (name and email)');
      return;
    }
    setPreviewData(form);
    setShowPreview(true);
  };

  const handleClosePreview = () => setShowPreview(false);

  const handleDownloadPDF = () => {
    const win = window.open('', '_blank');
    if (!win) return alert('Popup blocked — allow popups to download PDF');
    const html = `<html><head><title>Resume</title></head><body><h1>${form.personal.name || 'Full Name'}</h1><p>${form.summary || ''}</p></body></html>`;
    win.document.write(html);
    win.document.close();
    setTimeout(() => { try { win.print(); } catch (e) { console.warn(e); } }, 500);
  };

  const handleSaveProgress = () => {
    try { localStorage.setItem('resumate_draft', JSON.stringify(form)); alert('Progress saved locally'); } catch (e) { alert('Save failed'); }
  };

  const handleGenerateSummary = () => {
    const sample = "I am a motivated professional exploring opportunities in India to apply my skills and drive results. I am eager to learn, adapt, and collaborate across teams to deliver measurable outcomes. I bring a proactive mindset, strong willingness to contribute, and a commitment to continuous growth.";
    setForm(prev => ({ ...prev, summary: sample }));
  }

  const handleImproveSummary = () => {
    const current = (form.summary || '').trim();
    if (!current) {
      handleGenerateSummary();
      return;
    }
    const improved = `${current} \n\nImproved: A concise, impact-focused summary highlighting results, collaboration, and a growth mindset.`;
    setForm(prev => ({ ...prev, summary: improved }));
  }

  const handleImproveExperience = (index) => {
    const current = (form.experience[index]?.description || '').trim();
    const sample = 'Led cross-functional development efforts, delivered features on time, and improved system performance through optimizations and code refactors.';
    const improved = current ? `${current}\n\nImproved: Focused on measurable outcomes, reduced load times and increased reliability.` : sample;
    setForm(prev => ({ ...prev, experience: prev.experience.map((ex, i) => i === index ? { ...ex, description: improved } : ex) }));
  }

  const handleImproveProject = (index) => {
    const current = (form.projects[index]?.description || '').trim();
    const sample = 'Built a full-stack solution that handled user authentication, real-time updates and payment processing; shipped to production with monitoring and CI/CD.';
    const improved = current ? `${current}\n\nImproved: Emphasized outcomes, performance gains, and measurable impact for users.` : sample;
    setForm(prev => ({ ...prev, projects: prev.projects.map((p, i) => i === index ? { ...p, description: improved } : p) }));
  }

  return (
    <div className="mobile-resume-form">
      <div className="top-nav">
        <div className="brand">
          <div className="logo">R</div>
          <div className="title">Resumate</div>
        </div>
        <div className="nav-actions">
          <button type="button" className="sidebar-toggle" onClick={() => setSidebarOpen(true)}>☰ Menu</button>
        </div>
      </div>
  <div className="app-sidebar" role="navigation" aria-hidden={!sidebarOpen} style={{ transform: sidebarOpen ? 'translateX(0)' : 'translateX(-110%)', zIndex: 9999 }}>
        <div className="sidebar-close"><button type="button" className="sidebar-toggle" onClick={() => setSidebarOpen(false)}>Close ✕</button></div>
        <div className="sidebar-menu">
          <button type="button" className={`sidebar-item ${selectedMenu === 'home' ? 'active' : ''}`} onClick={() => { setSelectedMenu('home'); setSidebarOpen(false); if (onNavigate) onNavigate('home'); else window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <span className="sidebar-icon">🏠</span>
            <span className="sidebar-label">Home</span>
          </button>
          <button type="button" className={`sidebar-item ${selectedMenu === 'create' ? 'active' : ''}`} onClick={() => { setSelectedMenu('create'); setSidebarOpen(false); if (onNavigate) onNavigate('type-selector'); else refs.current[0].current && refs.current[0].current.scrollIntoView({ behavior: 'smooth' }); }}>
            <span className="sidebar-icon">📄</span>
            <span className="sidebar-label">Create Resume</span>
          </button>
          <button type="button" className={`sidebar-item ${selectedMenu === 'templates' ? 'active' : ''}`} onClick={() => { setSelectedMenu('templates'); setSidebarOpen(false); if (onOpenTemplates) onOpenTemplates(); else setShowTemplatesModal(true); }}>
            <span className="sidebar-icon">📋</span>
            <span className="sidebar-label">Templates</span>
          </button>
          <button type="button" className={`sidebar-item ${selectedMenu === 'interview' ? 'active' : ''}`} onClick={() => { setSelectedMenu('interview'); setSidebarOpen(false); if (onOpenInterview) onOpenInterview(); else setShowInterviewModal(true); }}>
            <span className="sidebar-icon">🎯</span>
            <span className="sidebar-label">Interview Prep</span>
          </button>
          <button type="button" className={`sidebar-item ${selectedMenu === 'aichat' ? 'active' : ''}`} onClick={() => { setSelectedMenu('aichat'); setSidebarOpen(false); if (onOpenAIChat) onOpenAIChat(); else setShowAiChat(true); }}>
            <span className="sidebar-icon">💬</span>
            <span className="sidebar-label">AI Chat</span>
          </button>
          <div style={{ marginTop: '0.6rem' }}>
            <button type="button" className="sidebar-toggle" onClick={() => setShowFeatures(prev => !prev)}>{showFeatures ? 'Hide Features' : 'Show Features'}</button>
          </div>
          {showFeatures && (
            <div className="sidebar-features">
              <div className="feat" onClick={() => { setSidebarOpen(false); alert('Modern Templates'); }}>Modern Templates</div>
              <div className="feat" onClick={() => { setSidebarOpen(false); alert('Easy Editing'); }}>Easy Editing</div>
              <div className="feat" onClick={() => { setSidebarOpen(false); alert('ATS-Friendly'); }}>ATS-Friendly</div>
              <div className="feat" onClick={() => { setSidebarOpen(false); alert('AI-Powered Content'); }}>AI-Powered Content</div>
              <div className="feat" onClick={() => { setSidebarOpen(false); alert('Pre-written content'); }}>Pre-written content</div>
              <div className="feat" onClick={() => { setSidebarOpen(false); alert('Beat the competition'); }}>Beat the competition</div>
            </div>
          )}
        </div>
      </div>
  <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} style={{ display: sidebarOpen ? 'block' : 'none', opacity: sidebarOpen ? 1 : 0, zIndex: 9400 }} />
      <div className="progress-bar">
        <div className="progress" style={{ width: `100%` }} />
      </div>
  <h2 className="form-title">Create Your ATS-Friendly Resume for Top MNCs</h2>
  <p className="form-subtitle">Build a professional resume optimized for Applicant Tracking Systems used by companies like Google, Microsoft, Amazon, and other tech giants.</p>
      <form onSubmit={handleSubmit}>
        <section className="section personal-info" ref={refs.current[0]}>
          <h3><span className="section-icon">{getIcon(0)}</span>{sections[0]}</h3>
          <p className="section-desc">Enter your name, contact details, location and profile links so employers can reach you.</p>
          <label>Full Name*<input type="text" value={form.personal.name} onChange={e => updateField('personal.name', e.target.value)} required /></label>
          <label>Email*<input type="email" value={form.personal.email} onChange={e => updateField('personal.email', e.target.value)} required /></label>
          <label>Phone<input type="text" value={form.personal.phone} onChange={e => updateField('personal.phone', e.target.value)} /></label>
          <label>Location<input type="text" value={form.personal.location} onChange={e => updateField('personal.location', e.target.value)} /></label>
          <label>LinkedIn Profile (URL)<input type="url" value={form.personal.linkedin} onChange={e => updateField('personal.linkedin', e.target.value)} placeholder="https://www.linkedin.com/in/yourname" /></label>
          <label>Profile URL (optional)<input type="url" value={form.personal.profileUrl} onChange={e => updateField('personal.profileUrl', e.target.value)} placeholder="Personal website or Google profile" /></label>
          <label className="photo-input">Profile Photo<input type="file" accept="image/*" onChange={handlePhotoChange} /></label>
          {form.personal.photo && (
            <div className="photo-preview"><img src={form.personal.photo} alt="Profile" /></div>
          )}
          {/* no per-section save/continue; full form is visible */}
        </section>
        <section className="section summary" ref={refs.current[1]}>
          <h3><span className="section-icon">{getIcon(1)}</span>{sections[1]}</h3>
          <p className="section-desc">A short professional summary (2–4 lines) that highlights your strengths and career goals.</p>
          <div className="summary-intro">
            <h4>Craft Your Professional Summary</h4>
            <p>Write a compelling summary that showcases your unique value proposition and captures the recruiter's attention.</p>
          </div>
          <div className="summary-card">
            <div className="summary-card-inner">
              <textarea className="summary-textarea" placeholder="Type your professional summary here or use AI to generate / improve it." value={form.summary || ''} onChange={e => updateField('summary', e.target.value)} rows={5} />
            </div>
            <div className="summary-actions">
              <button type="button" className="btn-ai" onClick={() => handleGenerateSummary()}>✨ Generate with AI</button>
              <button type="button" className="btn-ai" onClick={() => handleImproveSummary()} style={{ marginLeft: '0.6rem' }}>🛠 Improve with AI</button>
            </div>
          </div>
        </section>

        <section className="section skills" ref={refs.current[2]}>
          <h3><span className="section-icon">{getIcon(2)}</span>{sections[2]}</h3>
          <p className="section-desc">List your core skills — technical and transferable — to show your qualifications at a glance.</p>
          <div className="skills-top">
              <h4>Add New Skill <span className="bulk-add" role="button" tabIndex="0" onClick={() => setShowBulkModal(true)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowBulkModal(true); } }}>Bulk Add</span></h4>
            <div className="skill-input-row">
              <input ref={skillInputRef} className="skill-input" placeholder="e.g. JavaScript, Leadership, Project Management (comma or newline separated)" value={skillInput || ''} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkillFromInput(); } }} />
            </div>
            <div className="skill-hint">Tip: Type multiple skills separated by commas or new lines and press Enter to add them all.</div>
          </div>

          <div className="skill-categories">
            <div className="categories-label">Categories</div>
            <select className="category-select" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
              <option value="All Categories">All Categories</option>
              {skillCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="skill-chips">
            {filteredChips.map((chip, idx) => (
              <button key={idx} type="button" className="skill-chip" onClick={() => { setSkillInput(chip); skillInputRef.current && skillInputRef.current.focus(); }}>+ {chip}</button>
            ))}
          </div>

            {showBulkModal && (
              <div className="bulk-modal" role="dialog" aria-modal="true">
                <div className="bulk-modal-card">
                  <h3>Select skills to add</h3>
                  <div className="bulk-grid">
                    {filteredChips.map((chip, i) => (
                      <button key={i} type="button" className={`bulk-chip ${bulkSelected.has(chip) ? 'selected' : ''}`} onClick={() => toggleBulkSelect(chip)}>{chip}{bulkSelected.has(chip) ? ' ✓' : ''}</button>
                    ))}
                  </div>
                  <div className="bulk-actions">
                    <button type="button" className="btn-primary" onClick={confirmBulkAdd}>Add Selected</button>
                    <button type="button" className="btn-ghost" onClick={cancelBulkAdd}>Cancel</button>
                  </div>
                </div>
                <div className="bulk-backdrop" onClick={cancelBulkAdd} />
              </div>
            )}

          <div className="current-skills">
            {form.skills.map((s, i) => (
              <span key={i} className="current-skill">{s}</span>
            ))}
          </div>
        </section>

        <section className="section experience" ref={refs.current[3]}>
          <h3><span className="section-icon">{getIcon(3)}</span>{sections[3]}</h3>
          <p className="section-desc">Add your work history with company, role, dates, and a short description of responsibilities and achievements.</p>
          {form.experience.map((exp, i) => (
            <div key={i} className="experience-item">
              <label>Company<input value={exp.company} onChange={e => setForm(prev => ({ ...prev, experience: prev.experience.map((ex, idx) => idx === i ? { ...ex, company: e.target.value } : ex) }))} /></label>
              <label>Role<input value={exp.role} onChange={e => setForm(prev => ({ ...prev, experience: prev.experience.map((ex, idx) => idx === i ? { ...ex, role: e.target.value } : ex) }))} /></label>
              <label>Duration<input value={exp.duration} onChange={e => setForm(prev => ({ ...prev, experience: prev.experience.map((ex, idx) => idx === i ? { ...ex, duration: e.target.value } : ex) }))} /></label>
                <label>Description
                  <textarea value={exp.description} onChange={e => setForm(prev => ({ ...prev, experience: prev.experience.map((ex, idx) => idx === i ? { ...ex, description: e.target.value } : ex) }))} />
                </label>
                <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.5rem' }}>
                  <button type="button" className="btn-ai" onClick={() => handleImproveExperience(i)}>🛠 Improve with AI</button>
                  <button type="button" onClick={() => removeExperience(i)} className="btn-remove">Remove</button>
                </div>
            </div>
          ))}
          <button type="button" onClick={handleAddExperience}>Add Experience</button>
        </section>

        <section className="section education" ref={refs.current[4]}>
          <h3><span className="section-icon">{getIcon(4)}</span>{sections[4]}</h3>
          <p className="section-desc">List your academic qualifications including school, degree and graduation year.</p>
          {form.education.map((ed, i) => (
            <div key={i} className="education-item">
              <label>School<input value={ed.school} onChange={e => setForm(prev => ({ ...prev, education: prev.education.map((ee, idx) => idx === i ? { ...ee, school: e.target.value } : ee) }))} /></label>
              <label>Degree<input value={ed.degree} onChange={e => setForm(prev => ({ ...prev, education: prev.education.map((ee, idx) => idx === i ? { ...ee, degree: e.target.value } : ee) }))} /></label>
              <label>Year<input value={ed.year} onChange={e => setForm(prev => ({ ...prev, education: prev.education.map((ee, idx) => idx === i ? { ...ee, year: e.target.value } : ee) }))} /></label>
            </div>
          ))}
          <button type="button" onClick={handleAddEducation}>Add Education</button>
        </section>

        <section className="section projects" ref={refs.current[5]}>
          <h3><span className="section-icon">{getIcon(5)}</span>{sections[5]}</h3>
          <p className="section-desc">Describe projects that demonstrate your skills; include your role and outcome where possible.</p>
          {form.projects.map((p, i) => (
            <div key={i} className="project-item">
              <label>Project Name<input value={p.name} onChange={e => setForm(prev => ({ ...prev, projects: prev.projects.map((pp, idx) => idx === i ? { ...pp, name: e.target.value } : pp) }))} /></label>
                <label>Description<textarea value={p.description} onChange={e => setForm(prev => ({ ...prev, projects: prev.projects.map((pp, idx) => idx === i ? { ...pp, description: e.target.value } : pp) }))} /></label>
                <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.5rem' }}>
                  <button type="button" className="btn-ai" onClick={() => handleImproveProject(i)}>🛠 Improve with AI</button>
                </div>
            </div>
          ))}
        </section>

        <section className="section achievements" ref={refs.current[6]}>
          <h3><span className="section-icon">{getIcon(6)}</span>{sections[6]}</h3>
          <p className="section-desc">Mention awards, certifications, and other notable accomplishments that strengthen your profile.</p>
                <div className="cert-list">
                  {form.achievements.map((c, idx) => (
                    <div key={idx} className="cert-item">
                      <label>Certificate / Award Name<input value={c.name} onChange={e => setForm(prev => ({ ...prev, achievements: prev.achievements.map((it,i) => i===idx ? { ...it, name: e.target.value } : it) }))} /></label>
                      <label>Issuer (Organization)<input value={c.issuer} onChange={e => setForm(prev => ({ ...prev, achievements: prev.achievements.map((it,i) => i===idx ? { ...it, issuer: e.target.value } : it) }))} /></label>
                      <div style={{ display: 'flex', gap: '0.6rem' }}>
                        <label style={{ flex: 1 }}>Start Date<input type="date" value={c.start} onChange={e => setForm(prev => ({ ...prev, achievements: prev.achievements.map((it,i) => i===idx ? { ...it, start: e.target.value } : it) }))} /></label>
                        <label style={{ flex: 1 }}>End Date<input type="date" value={c.end} onChange={e => setForm(prev => ({ ...prev, achievements: prev.achievements.map((it,i) => i===idx ? { ...it, end: e.target.value } : it) }))} /></label>
                      </div>
                      <div style={{ marginTop: '0.4rem' }}>
                        <button type="button" className="btn-remove" onClick={() => setForm(prev => ({ ...prev, achievements: prev.achievements.filter((_,i) => i!==idx) }))}>Remove</button>
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop: '0.6rem' }}>
                    <button type="button" onClick={() => setForm(prev => ({ ...prev, achievements: [...prev.achievements, { name: '', issuer: '', start: '', end: '' }] }))}>Add Certificate</button>
                  </div>
                </div>
            </section>
        <div className="form-navigation" style={{ marginTop: '1rem' }}>
          <div />
          <button type="submit" className="btn-submit">Generate Resume</button>
        </div>
      </form>
      {showPreview && (
        <div className="preview-modal" role="dialog" aria-modal="true">
          <div className="preview-card">
            <div className="preview-header">
              <div className="preview-icon">📄</div>
              <h2>Your Resume Is Ready</h2>
              <p>Your resume has been generated. Download, preview, or refine your document.</p>
              <div className="preview-actions">
                <button className="btn-primary" onClick={handleDownloadPDF}>Download PDF</button>
                <button className="btn-ghost" onClick={handleSaveProgress}>Save Progress</button>
                <button className="btn-ghost" onClick={() => { handleClosePreview(); }}>Edit Resume</button>
              </div>
            </div>
            <div className="preview-body">
              <h4>Live Preview</h4>
              <div className="preview-small">
                <div className="preview-name">{previewData?.personal?.name || 'Full Name'}</div>
                <div className="preview-summary">{previewData?.summary || 'Summary...'}</div>
              </div>
            </div>
          </div>
          <div className="preview-backdrop" onClick={handleClosePreview} />
        </div>
      )}
      {showTemplatesModal && (
        <div className="bulk-modal" role="dialog" aria-modal="true">
          <div className="bulk-modal-card">
            <h3>Templates</h3>
            <p>Choose from our templates:</p>
            <div className="bulk-grid">
              <button className="bulk-chip" onClick={() => { setShowTemplatesModal(false); alert('Selected Modern Template'); }}>Modern</button>
              <button className="bulk-chip" onClick={() => { setShowTemplatesModal(false); alert('Selected Professional Template'); }}>Professional</button>
              <button className="bulk-chip" onClick={() => { setShowTemplatesModal(false); alert('Selected Creative Template'); }}>Creative</button>
            </div>
            <div className="bulk-actions"><button className="btn-ghost" onClick={() => setShowTemplatesModal(false)}>Close</button></div>
          </div>
          <div className="bulk-backdrop" onClick={() => setShowTemplatesModal(false)} />
        </div>
      )}

      {showInterviewModal && (
        <div className="bulk-modal" role="dialog" aria-modal="true">
          <div className="bulk-modal-card">
            <h3>Interview Preparation</h3>
            <p>Quick practice prompts and tips.</p>
            <ul>
              <li>Tell me about yourself — practice answer builder</li>
              <li>Explain a challenging project — STAR method</li>
              <li>Behavioral question templates</li>
            </ul>
            <div className="bulk-actions"><button className="btn-ghost" onClick={() => setShowInterviewModal(false)}>Close</button></div>
          </div>
          <div className="bulk-backdrop" onClick={() => setShowInterviewModal(false)} />
        </div>
      )}

      {showAiChat && (
        <div className="bulk-modal" role="dialog" aria-modal="true">
          <div className="bulk-modal-card">
            <h3>AI Chat</h3>
            <p>Ask the AI for help with resume, summaries, interview answers.</p>
            <textarea placeholder="Type your question..." style={{ width: '100%', minHeight: 120 }} />
            <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.6rem' }}>
              <button className="btn-primary" onClick={() => alert('Demo: AI response appended below')}>Ask</button>
              <button className="btn-ghost" onClick={() => setShowAiChat(false)}>Close</button>
            </div>
          </div>
          <div className="bulk-backdrop" onClick={() => setShowAiChat(false)} />
        </div>
      )}
    </div>
  );
};

export default MobileResumeForm;
