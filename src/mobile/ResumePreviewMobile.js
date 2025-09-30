import React, { useState } from 'react';
import './ResumePreviewMobile.css';
import '../styles/resume-mobile-overrides.css';
import ResumePreview from '../ResumePreview';

const ResumePreviewMobile = ({ onNavigate, onOpenAIChat, resumeData = {}, selectedTemplate = 'modern' }) => {
  const [templateStyle, setTemplateStyle] = useState(selectedTemplate ? (selectedTemplate === 'reverse-chrono' ? 'Classic' : 'Modern') : 'Modern');
  const [color, setColor] = useState('Blue');
  const [zoom, setZoom] = useState(34);

  const increaseZoom = () => setZoom((z) => Math.min(150, z + 10));
  const decreaseZoom = () => setZoom((z) => Math.max(10, z - 10));
  const resetZoom = () => setZoom(34);

  return (
    <div className="resume-preview-mobile-container">
      <header className="resume-preview-mobile-header">
        <h2>Resume Preview</h2>
      </header>
      <main className="rp-mobile-main">
        <section className="rp-live-preview">
          <h3>Live Preview</h3>
          <div className="rp-selects">
            <div className="rp-style-select">
              <button className={`chip ${templateStyle === 'Classic' ? 'active' : ''}`} onClick={() => setTemplateStyle('Classic')}>Classic</button>
              <button className={`chip ${templateStyle === 'Modern' ? 'active' : ''}`} onClick={() => setTemplateStyle('Modern')}>Modern</button>
              <button className={`chip ${templateStyle === 'Creative' ? 'active' : ''}`} onClick={() => setTemplateStyle('Creative')}>Creative</button>
            </div>
            <div className="rp-color-select">
              <button className={`chip ${color === 'Blue' ? 'active' : ''}`} onClick={() => setColor('Blue')}>Blue</button>
              <button className={`chip ${color === 'Olive' ? 'active' : ''}`} onClick={() => setColor('Olive')}>Olive</button>
              <button className={`chip ${color === 'Purple' ? 'active' : ''}`} onClick={() => setColor('Purple')}>Purple</button>
            </div>
          </div>

          <div className="rp-zoom-controls">
            <button onClick={decreaseZoom}>-</button>
            <div className="rp-zoom-value">{zoom}%</div>
            <button onClick={increaseZoom}>+</button>
            <button className="rp-reset" onClick={resetZoom}>Reset zoom</button>
          </div>

          <div className="rp-preview-box">
            <div className="rp-preview-paper" id="resume-to-pdf" style={{ transform: `scale(${zoom/100})`, transformOrigin: 'top left' }}>
              <ResumePreview data={resumeData || {}} template={templateStyle.toLowerCase()} color={color.toLowerCase()} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ResumePreviewMobile;
