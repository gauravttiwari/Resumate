import React, { useEffect } from 'react';
import './styles/HomeDesktop.css';

const HomeDesktop = ({ onStartClick }) => {
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
        <div className="hd-hero-content">
          <div className="hd-hero-inner">
            <div className="hd-animated-line" aria-hidden="true"></div>
            <div className="hd-hero-text">
              <h1>Build Your Professional Resume in Minutes</h1>
              <p className="hd-lead">Create ATS-friendly resumes that get you noticed by top companies like Google, Microsoft, Amazon and more. Choose from professional templates designed by experts.</p>
              <div className="hd-cta-row">
                <button className="hd-cta" onClick={onStartClick}>Get Started</button>
                <a className="hd-secondary" href="#">Explore Templates</a>
              </div>
            </div>
          </div>
        </div>
        <div className="hd-hero-visual">
          <div className="hd-preview-card">
            <img src={process.env.PUBLIC_URL + '/assets/hero-illustration.svg'} alt="Resume preview illustration" />
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
          <h2 className="section-title">This resume builder actually gets you the job</h2>
          <div className="cards-row">
            <div className="usecard reveal-on-scroll">
              <div className="usecard-visual">
                <img src={process.env.PUBLIC_URL + '/assets/hero-illustration.svg'} alt="Recruiter Outreach" />
              </div>
              <h4>Recruiter Outreach</h4>
              <p>Auto-match your resume with recruiters to get in front of hiring managers fast.</p>
            </div>
            <div className="usecard reveal-on-scroll">
              <div className="usecard-visual">
                <img src={process.env.PUBLIC_URL + '/assets/hero-illustration.svg'} alt="Interview prep" />
              </div>
              <h4>Interview prep</h4>
              <p>Improve your answers and practice with real interview questions.</p>
            </div>
            <div className="usecard reveal-on-scroll">
              <div className="usecard-visual">
                <img src={process.env.PUBLIC_URL + '/assets/hero-illustration.svg'} alt="Career coaching" />
              </div>
              <h4>Career coaching</h4>
              <p>Avoid mistakes with expert advice and improve your job search strategy.</p>
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
            <button className="btn-primary">Find resume examples</button>
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
