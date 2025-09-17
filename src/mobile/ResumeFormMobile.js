import React from 'react';
import './ResumeFormMobile.css';

const ResumeFormMobile = () => {
  return (
    <div className="resume-form-mobile-container">
      <header className="resume-form-mobile-header">
        <h2>Build Your Resume</h2>
      </header>
      <form className="resume-form-mobile-form">
        <label>
          Name
          <input type="text" placeholder="Enter your name" />
        </label>
        <label>
          Email
          <input type="email" placeholder="Enter your email" />
        </label>
        <label>
          Phone
          <input type="tel" placeholder="Enter your phone number" />
        </label>
        <label>
          Summary
          <textarea placeholder="Write a short summary"></textarea>
        </label>
        {/* Add more fields as needed */}
        <button type="submit" className="resume-form-mobile-submit">Next</button>
      </form>
    </div>
  );
};

export default ResumeFormMobile;
