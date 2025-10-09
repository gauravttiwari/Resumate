import React, { useEffect, useState } from 'react';
import './styles/HomeDesktop.css';

const HomeDesktop = ({ onStartClick, onOpenATS }) => {
  const [rotatingText, setRotatingText] = useState('a remote job');
  
  useEffect(() => {
    const rotatingTexts = ['a remote job', 'paid more', 'hired faster', 'promoted', 'an interview'];
    let currentIndex = 0;
    
    const rotateInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % rotatingTexts.length;
      setRotatingText(rotatingTexts[currentIndex]);
    }, 2500); // Change every 2.5 seconds

    return () => clearInterval(rotateInterval);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll('.reveal-on-scroll');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.15 });
    els.forEach(el => obs.observe(el));
    // Smooth tilt with requestAnimationFrame and inertia (mirrors root)
    const cards = Array.from(document.querySelectorAll('.carousel-card'));
    const state = new Map();
    function rafLoop() {
      cards.forEach(card => {
        const s = state.get(card) || { tx: 0, ty: 0, vx: 0, vy: 0 };
        s.tx += (s.vx - s.tx) * 0.15;
        s.ty += (s.vy - s.ty) * 0.15;
        const rotX = s.ty * 10;
        const rotY = s.tx * -14;
        card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(0) translateY(-6px) scale(1.02)`;
        const sheen = card.querySelector('.card-sheen');
        if (sheen) {
          const intensity = Math.max(0, (s.tx + 0.5));
          sheen.style.background = `linear-gradient(120deg, rgba(255,255,255,${0.06 + intensity * 0.4}) 0%, rgba(255,255,255,0) 40%)`;
        }
        state.set(card, s);
      });
      rafId = requestAnimationFrame(rafLoop);
    }
    let rafId = requestAnimationFrame(rafLoop);

    function attachCard(card) {
      state.set(card, { tx: 0, ty: 0, vx: 0, vy: 0 });
      function onMove(e) {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / rect.width;
        const dy = (e.clientY - cy) / rect.height;
        const s = state.get(card);
        s.vx = dx; s.vy = dy;
      }
      function onLeave() { const s = state.get(card); s.vx = 0; s.vy = 0; }
      function onFocus() { const s = state.get(card); s.vx = 0; s.vy = 0; card.style.transition = 'transform 260ms ease'; setTimeout(()=>card.style.transition=''); }
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
      card.addEventListener('focus', onFocus);
      card.addEventListener('blur', onLeave);
      listeners.push({ card, onMove, onLeave, onFocus });
    }
    const listeners = [];
    cards.forEach(attachCard);

    return () => {
      obs.disconnect();
      listeners.forEach(l => {
        l.card.removeEventListener('mousemove', l.onMove);
        l.card.removeEventListener('mouseleave', l.onLeave);
        l.card.removeEventListener('focus', l.onFocus);
        l.card.removeEventListener('blur', l.onLeave);
      });
      cancelAnimationFrame(rafId);
    };
  }, []);
  return (
    <div className="home-desktop-container">

      <section className="hd-hero">
        <div className="hd-hero-inner">
          <div className="hd-hero-left">
            <h1 className="hd-hero-title">This resume builder gets you<br /><span className="hd-highlight" key={rotatingText}>{String(rotatingText)}</span></h1>
            <p className="hd-lead">Only 2% of resumes win. Yours will be one of them.</p>

            <div className="hd-cta-row">
              <button className="btn-primary big" onClick={onStartClick}>Create my resume</button>
              <button className="btn-outline" onClick={onOpenATS}>Upload my resume</button>
            </div>

            <div className="hd-trust-row">
              <div className="trust-item">✔️ 39% more likely to land the job</div>
              <div className="trust-item trust-rating">⭐ Trustpilot <span className="muted">4.4 out of 5 | 10 reviews</span></div>
            </div>
          </div>

          <div className="hd-hero-right">
            <div className="hero-preview-container">
              <img 
                src={process.env.PUBLIC_URL + '/assets/hero-preview.png'} 
                alt="Resume Preview" 
                className="hero-preview-image"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="hd-features">
        <div className="feature">
          <h3>Modern Templates</h3>
          <p>Access a wide range of professionally designed templates.</p>
        </div>
        <div className="feature">
          <h3>Easy Editing</h3>
          <p>Customize your resume with our intuitive editor.</p>
        </div>
        <div className="feature">
          <h3>ATS-Friendly</h3>
          <p>Ensure your resume passes Applicant Tracking Systems.</p>
        </div>
      </section>

      {/* New features grid (6 items) */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Get hired fast with a powerful resume</h2>
          <div className="features-grid reveal-on-scroll">
            <div className="feature-item reveal-on-scroll">
              <div className="icon">📄</div>
              <h4>A better resume in minutes</h4>
              <p>Replace your old resume in a few simple clicks. Our builder gives recruiters what they want.</p>
            </div>
            <div className="feature-item reveal-on-scroll">
              <div className="icon">🔒</div>
              <h4>ATS-friendly templates</h4>
              <p>Tick every box and make sure your resume is never filtered out by hiring software.</p>
            </div>
            <div className="feature-item reveal-on-scroll">
              <div className="icon">✍️</div>
              <h4>Pre-written content</h4>
              <p>Save time by adding pre-approved, tested content from professional writers.</p>
            </div>
            <div className="feature-item reveal-on-scroll">
              <div className="icon">🤖</div>
              <h4>Easy with AI</h4>
              <p>Quickly generate formal phrases and summaries. Sound professional, faster.</p>
            </div>
            <div className="feature-item reveal-on-scroll">
              <div className="icon">🏆</div>
              <h4>Beat the competition</h4>
              <p>Our templates are designed to make you more attractive to recruiters.</p>
            </div>
            <div className="feature-item reveal-on-scroll">
              <div className="icon">💰</div>
              <h4>Get paid more</h4>
              <p>Our salary analyzer tells you if your job offer is competitive.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Three-card use cases */}
      <section className="usecases">
        <div className="container">
          <div className="usecases-header">
            <h2 className="section-title">This resume builder actually gets you the job</h2>
            <div className="usecases-cta">
              <button className="hd-cta" onClick={onStartClick}>Get hired faster</button>
            </div>
          </div>

          {/* template preview is embedded inside the Templates card visual (see Templates card below) */}

          <div className="cards-row">
            <div className="usecard reveal-on-scroll">
              <div className="usecard-visual">
                <div className="usecard-visual-inner">
                  <img src={process.env.PUBLIC_URL + '/assets/hero-illustration.svg'} alt="ATS Scanner" />
                </div>
              </div>
              <h4>ATS Scanner</h4>
              <p>Upload or paste your resume and get an accurate ATS score with actionable fixes to boost your pass rate.</p>
              <div className="usecard-meta">
                <div className="ats-preview">
                  <div className="ats-score">82<span className="ats-subl">/100</span></div>
                  <div className="ats-breakdown">Keywords ✓ &nbsp; Formatting ✓ &nbsp; Content ✓</div>
                  <div className="usecard-actions">
                    <button className="btn-secondary" onClick={onOpenATS}>Scan resume</button>
                    <button className="btn-link" onClick={onOpenATS}>View report</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="usecard reveal-on-scroll">
              <div className="usecard-visual">
                <div className="usecard-visual-inner">
                  {/* Embedded template stage (compact) */}
                  <div className="template-stage in-card">
                    <div className="tmpl-card tmpl-left">
                      <img src={process.env.PUBLIC_URL + '/assets/hero-illustration.svg'} alt="tmpl-left" />
                    </div>
                    <div className="tmpl-card tmpl-center">
                      <img src={process.env.PUBLIC_URL + '/assets/hero-illustration.svg'} alt="tmpl-center" />
                    </div>
                    <div className="tmpl-card tmpl-right">
                      <img src={process.env.PUBLIC_URL + '/assets/hero-illustration.svg'} alt="tmpl-right" />
                    </div>
                  </div>
                </div>
              </div>
              <h4>Templates & Builder</h4>
              <p>Choose ATS-friendly templates and build a professional resume with pre-written content and easy editing tools.</p>
              <div className="usecard-actions" style={{ marginTop: 12 }}>
                <button className="btn-secondary" onClick={onStartClick}>Explore templates</button>
              </div>
            </div>

            <div className="usecard reveal-on-scroll">
              <div className="usecard-visual">
                <div className="usecard-visual-inner">
                  <img src={process.env.PUBLIC_URL + '/assets/hero-illustration.svg'} alt="Interview Prep" />
                </div>
              </div>
              <h4>Interview Prep</h4>
              <p>Practice with real interview questions, get feedback, and improve your answers using AI-powered analytics.</p>
              <div className="usecard-meta">
                <div className="interview-preview">
                  <div className="interview-stat">Words/min: <strong>110</strong> <span className="badge">Average</span></div>
                  <div className="usecard-actions">
                    <button className="btn-secondary" onClick={() => alert('Interview Practice feature coming soon!')}>Practice</button>
                    <button className="btn-link" onClick={() => alert('Interview Tips:\n\n1. Practice common questions\n2. Speak clearly and confidently\n3. Research the company\n4. Prepare questions to ask')}>Tips</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Templates carousel-like section (dark blue) */}
      <section className="templates-section">
        <div className="container templates-inner">
          <div className="templates-top-center">
            <h2>Proven resume templates</h2>
            <p className="templates-lead">These resume templates are here because they work. Every one is tried and tested on real hiring managers.</p>
          </div>

          <div className="templates-carousel">
            <div className="carousel-track">
              <div className="carousel-card reveal-on-scroll" tabIndex={0}>
                <div className="card-depth"></div>
                <div className="card-sheen"></div>
                <div className="card-inner"><img src={process.env.PUBLIC_URL + '/assets/hero-illustration.svg'} alt="template1"/></div>
              </div>
              <div className="carousel-card reveal-on-scroll" tabIndex={0}>
                <div className="card-depth"></div>
                <div className="card-sheen"></div>
                <div className="card-inner"><img src={process.env.PUBLIC_URL + '/assets/hero-illustration.svg'} alt="template2"/></div>
              </div>
              <div className="carousel-card reveal-on-scroll" tabIndex={0}>
                <div className="card-depth"></div>
                <div className="card-sheen"></div>
                <div className="card-inner"><img src={process.env.PUBLIC_URL + '/assets/hero-illustration.svg'} alt="template3"/></div>
              </div>
            </div>
          </div>

          <div className="templates-cta-center">
            <button className="btn-primary" onClick={onStartClick}>Find resume examples</button>
          </div>
        </div>
      </section>

      <footer className="hd-footer">
        <p>&copy; {new Date().getFullYear()} ResuMate. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomeDesktop;
