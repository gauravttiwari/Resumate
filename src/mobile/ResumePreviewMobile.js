import React, { useState } from 'react';
import './ResumePreviewMobile.css';
import '../styles/resume-mobile-overrides.css';
import MobileNavbar from './MobileNavbar';
import ResumePreview from '../ResumePreview';

const ResumePreviewMobile = ({ onNavigate, onOpenAIChat, onDownload = () => {}, onSave = () => {}, resumeData = {}, selectedTemplate = 'modern' }) => {
  const [templateStyle, setTemplateStyle] = useState(selectedTemplate ? (selectedTemplate === 'reverse-chrono' ? 'Classic' : 'Modern') : 'Modern');
  const [color, setColor] = useState('Blue');
  const [zoom, setZoom] = useState(34);

  const increaseZoom = () => setZoom((z) => Math.min(150, z + 10));
  const decreaseZoom = () => setZoom((z) => Math.max(10, z - 10));
  const resetZoom = () => setZoom(34);

  return (
    <div className="resume-preview-mobile-container">
      <MobileNavbar onNavigate={onNavigate} onOpenAIChat={onOpenAIChat} />

      <main className="rp-mobile-main">
        <section className="rp-hero-card">
          <div className="rp-icon">📄</div>
          <h1>Your Resume Is Ready</h1>
          <p>Your resume has been generated. Download, preview, or refine your document.</p>
          <div className="rp-hero-actions">
            <button className="btn-primary" onClick={onDownload}>Download PDF</button>
            <button className="btn-ghost" onClick={onSave}>Save Progress</button>
            <button className="btn-ghost" onClick={() => onNavigate && onNavigate('form')}>Edit Resume</button>
          </div>
        </section>

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
              <button className={`chip ${color === 'Bronze' ? 'active' : ''}`} onClick={() => setColor('Bronze')}>Bronze</button>
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
              {/* Render the real resume preview using ResumePreview component */}
              <ResumePreview data={resumeData || {}} template={templateStyle.toLowerCase()} color={color.toLowerCase()} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ResumePreviewMobile;
