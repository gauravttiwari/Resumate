import React, { useState } from 'react';
import './styles/HomeScreen.css';

const HomeScreen = ({ onStartClick }) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [quick, setQuick] = useState({ name: '', title: '', email: '' });
  const [quickSubmitting, setQuickSubmitting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleQuickChange = (e) => setQuick({ ...quick, [e.target.name]: e.target.value });
  const handleQuickSubmit = (e) => {
    e.preventDefault();
    setQuickSubmitting(true);
    // small UX delay to show feedback then start
    setTimeout(() => {
      setQuickSubmitting(false);
      onStartClick && onStartClick({ quickStart: true, data: quick });
    }, 600);
  };

  return (
    <div className="home-screen-container">
      <header className="hs-hero">
        <div className="hs-hero-left">
          <div className="hs-stack">
            <div className="brand">Resumate.</div>
            <h1>Create a resume that wins interviews</h1>
            <p className="hs-lead">Fast. Easy. Effective. The best CV maker online.</p>
            <p className="hs-sub">Whether you want to build a new CV from scratch or improve an existing one, let Resumate help you present your work life, personality, and skills on a CV that stands out.</p>
          </div>
          <div className="hs-cta-row">
            <button className="hs-cta" onClick={() => onStartClick && onStartClick({ template: selectedTemplate })}>{selectedTemplate ? 'Use selected template' : 'Create new CV'}</button>
            <button className="hs-cta hs-cta-secondary" onClick={() => onStartClick && onStartClick({ improve: true })}>Improve my CV</button>
            <a className="hs-cta-ghost" href="#templates">See templates</a>
          </div>

          <form className="hs-quickstart" onSubmit={handleQuickSubmit} aria-label="Quick start resume">
            <div className="qs-row">
              <input name="name" value={quick.name} onChange={handleQuickChange} placeholder="Full name" aria-label="Full name" />
              <input name="title" value={quick.title} onChange={handleQuickChange} placeholder="Desired role (e.g. Frontend Engineer)" aria-label="Desired role" />
            </div>
            <div className="qs-row">
              <input name="email" value={quick.email} onChange={handleQuickChange} placeholder="Email address" aria-label="Email" />
              <button className="hs-cta hs-cta-quick" type="submit" disabled={quickSubmitting}>{quickSubmitting ? 'Preparing…' : 'Quick start — free'}</button>
            </div>
          </form>
          <ul className="hs-badges">
            <li>Trusted by top tech recruiters</li>
            <li>Instant PDF export</li>
            <li>AI-powered suggestions</li>
          </ul>
        </div>
        <div className="hs-hero-right">
          <div className="mockup-wrap">
            <div className="mockup template-mockup visible" role="img" aria-label="Resume template preview">
              <div className="mockup-header">
                <div className="mock-name">Alexandra Doe</div>
                <div className="mock-contact">alex@example.com • (555) 888-1212</div>
              </div>
              <div className="mock-body">
                <aside className="mock-side">
                  <div className="side-section">
                    <div className="side-title">Skills</div>
                    <ul>
                      <li>React</li>
                      <li>Node.js</li>
                      <li>SQL</li>
                    </ul>
                  </div>
                  <div className="side-section">
                    <div className="side-title">Education</div>
                    <div className="muted">BSc Computer Science</div>
                  </div>
                </aside>
                <main className="mock-main">
                  <div className="section">
                    <div className="section-title">Experience</div>
                    <div className="job">
                      <div className="job-title">Senior Frontend Engineer</div>
                      <div className="job-company">Acme Corp — 2021 - Present</div>
                      <ul className="job-bullets">
                        <li>Led frontend migration to React and reduced bundle size by 30%.</li>
                        <li>Built CI/CD pipelines for preview PDFs.</li>
                      </ul>
                    </div>
                  </div>
                  <div className="section">
                    <div className="section-title">Projects</div>
                    <div className="project">JobFit Pro — Resume scoring and analytics</div>
                  </div>
                </main>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="hs-features" id="features">
        <h2>Features</h2>
        <div className="hs-features-grid">
          <div className="hs-feature">
            <div className="icon">🤖</div>
            <h3>AI Writing</h3>
            <p>Generate summaries, extract skills and improve role descriptions with one click.</p>
          </div>
          <div className="hs-feature">
            <div className="icon">📄</div>
            <h3>ATS-Ready Templates</h3>
            <p>Templates optimized for major applicant tracking systems and recruiter screens.</p>
          </div>
          <div className="hs-feature">
            <div className="icon">⚡</div>
            <h3>Instant Preview</h3>
            <p>See changes live and export perfectly formatted PDFs.</p>
          </div>
        </div>
      </section>

      <section className="hs-templates" id="templates">
        <h2>Templates</h2>
        <div className="hs-templates-grid">
          {[
            { id: 'jobfit', name: 'JobFit Pro', meta: 'Professional • ATS-friendly' },
            { id: 'sidebar', name: 'Modern Sidebar', meta: 'Clean • Two-column' },
            { id: 'proprofile', name: 'ProProfile', meta: 'Executive • Sleek' },
            { id: 'reverse', name: 'Reverse Chrono', meta: 'Classic • Timelines' }
          ].map(t => (
            <div key={t.id} className={`tile ${selectedTemplate === t.id ? 'tile-selected' : ''}`} onClick={() => setSelectedTemplate(t.id)} role="button" tabIndex={0} onKeyDown={(e)=>{ if(e.key==='Enter') setSelectedTemplate(t.id)}}>
              <div className="tile-thumb" aria-hidden="true">{/* small schematic thumbnail */}
                <div className="thumb-left" />
                <div className="thumb-right" />
              </div>
              <div className="tile-preview">{t.name}</div>
              <div className="tile-meta">{t.meta}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="hs-how">
        <h2>How it works</h2>
        <div className="hs-steps">
          <div className="step"><strong>1</strong><p>Pick a template</p></div>
          <div className="step"><strong>2</strong><p>Fill in your experience</p></div>
          <div className="step"><strong>3</strong><p>Improve with AI & export</p></div>
        </div>
      </section>

      <section className="hs-testimonials">
        <h2>What users say</h2>
        <div className="hs-test-grid">
          <div className="test-card">
            <div className="test-head"><div className="avatar">R</div><div className="who">Ravi • Product Manager</div></div>
            <blockquote>"The AI improved my descriptions and I started getting more interviews."</blockquote>
          </div>
          <div className="test-card">
            <div className="test-head"><div className="avatar">A</div><div className="who">Aisha • Software Engineer</div></div>
            <blockquote>"Beautiful templates and zero formatting issues during PDF export."</blockquote>
          </div>
        </div>
      </section>

      <footer className="hs-footer">
        <div className="hs-footer-cta">
          <h3>Ready to build a better resume?</h3>
          <button className="hs-cta" onClick={onStartClick}>Get Started — It's free</button>
        </div>
        <p className="hs-copyright">© {new Date().getFullYear()} ResuMate</p>
      </footer>
    </div>
  );
};

export default HomeScreen;