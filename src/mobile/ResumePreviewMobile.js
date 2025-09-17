import React from 'react';
import './ResumePreviewMobile.css';

const ResumePreviewMobile = ({ name = 'John Doe', email = 'john@example.com', phone = '123-456-7890', summary = 'Professional summary goes here.' }) => {
  return (
    <div className="resume-preview-mobile-container">
      <header className="resume-preview-mobile-header">
        <h2>Resume Preview</h2>
      </header>
      <main className="resume-preview-mobile-main">
        <section className="resume-preview-mobile-section">
          <h3>{name}</h3>
          <p>{email} | {phone}</p>
          <div className="resume-preview-mobile-summary">
            <strong>Summary:</strong>
            <p>{summary}</p>
          </div>
          {/* Add more preview sections as needed */}
        </section>
      </main>
      <footer className="resume-preview-mobile-footer">
        <button className="resume-preview-mobile-download">Download PDF</button>
      </footer>
    </div>
  );
};

export default ResumePreviewMobile;
