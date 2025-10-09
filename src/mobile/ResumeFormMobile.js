import React, { useState } from 'react';
import * as aiService from '../services/aiService';
import './ResumeFormMobile.css';
import MobileNavbar from './MobileNavbar';

const ResumeFormMobile = ({ initialData = {}, onSubmit, onNavigate, onOpenAIChat }) => {
  const [formData, setFormData] = useState(() => ({
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    summary: initialData.summary || '',
    skills: initialData.skills || '' ,
    experience: initialData.experience || []
  }));

  const [aiLoading, setAiLoading] = useState(false);
  const [aiFeature, setAiFeature] = useState(''); // 'summary', 'skills', 'optimize'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e && e.preventDefault && e.preventDefault();
    if (onSubmit) onSubmit(formData);
  };

  const generateSummaryWithAI = async () => {
    if (!formData.name || !formData.experience.length) {
      alert('Please fill your name and at least one experience entry before generating summary.');
      return;
    }
    setAiLoading(true);
    setAiFeature('summary');
    try {
      const summary = await aiService.generateSummary(formData, 'general');
      setFormData(prev => ({ ...prev, summary }));
      alert('Summary generated successfully!');
    } catch (err) {
      console.error('Error generating summary', err);
      alert('Failed to generate summary.');
    } finally {
      setAiLoading(false);
      setAiFeature('');
    }
  };

  const suggestSkillsWithAI = async () => {
    if (!formData.name || !formData.experience.length) {
      alert('Please provide name and at least one experience to suggest skills.');
      return;
    }
    setAiLoading(true);
    setAiFeature('skills');
    try {
      const result = await aiService.optimizeResume(formData, 'general');
      // The optimizeResume may include suggested skills in result.skillsToAdd
      const suggested = result?.skillsToAdd ? result.skillsToAdd.join(', ') : result?.skills || '';
      if (suggested) {
        setFormData(prev => ({ ...prev, skills: prev.skills ? `${prev.skills}, ${suggested}` : suggested }));
        alert('Skills suggested and added to skills field.');
      } else {
        alert('No skill suggestions available.');
      }
    } catch (err) {
      console.error('Error suggesting skills', err);
      alert('Failed to suggest skills.');
    } finally {
      setAiLoading(false);
      setAiFeature('');
    }
  };

  const optimizeResumeWithAI = async () => {
    if (!formData.name) {
      alert('Please add your name before optimizing.');
      return;
    }
    setAiLoading(true);
    setAiFeature('optimize');
    try {
      const result = await aiService.optimizeResume(formData, 'general');
      // If optimize returns content suggestions, try to apply basic ones
      if (result?.contentSuggestions?.skills) {
        const curr = formData.skills || '';
        const added = result.skillsToAdd ? result.skillsToAdd.join(', ') : '';
        setFormData(prev => ({ ...prev, skills: added ? (curr ? `${curr}, ${added}` : added) : curr }));
      }
      alert('Optimization completed (basic). Review suggestions in console.');
      console.log('AI optimize result', result);
    } catch (err) {
      console.error('Error optimizing resume', err);
      alert('Failed to optimize resume.');
    } finally {
      setAiLoading(false);
      setAiFeature('');
    }
  };

  return (
    <div className="resume-form-mobile-container">
  <MobileNavbar onNavigate={onNavigate} onOpenAIChat={onOpenAIChat} />
      <header className="resume-form-mobile-header">
        <h2>Build Your Resume</h2>
      </header>
      <form className="resume-form-mobile-form" onSubmit={handleSubmit}>
        <label>
          Name
          <input name="name" value={formData.name} onChange={handleChange} type="text" placeholder="Enter your name" />
        </label>
        <label>
          Email
          <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Enter your email" />
        </label>
        <label>
          Phone
          <input name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="Enter your phone number" />
        </label>
        <label>
          Summary
          <textarea name="summary" value={formData.summary} onChange={handleChange} placeholder="Write a short summary"></textarea>
        </label>

        <div style={{display:'flex', gap:8, marginBottom:8}}>
          <button type="button" className={`ai-btn ${aiLoading && aiFeature === 'summary' ? 'loading' : ''}`} onClick={generateSummaryWithAI} disabled={aiLoading}>
            {aiLoading && aiFeature === 'summary' ? '🤖 Generating...' : '✨ AI Generate'}
          </button>
        </div>

        <label style={{display:'flex', flexDirection:'column'}}>
          Skills
          <div style={{display:'flex', gap:8, alignItems:'center'}}>
            <input name="skills" value={formData.skills} onChange={handleChange} type="text" placeholder="e.g. React, Node.js, AWS" />
            <button type="button" className={`ai-btn ${aiLoading && aiFeature === 'skills' ? 'loading' : ''}`} onClick={suggestSkillsWithAI} disabled={aiLoading}>
              {aiLoading && aiFeature === 'skills' ? '🤖 Generating...' : '⚡ AI Suggest Skills'}
            </button>
          </div>
        </label>

        {/* Basic experience entry for mobile to enable AI features requiring experience */}
        <label>
          Experience (one-line each)
          <textarea
            name="experienceText"
            value={formData.experience.join('\n')}
            onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value.split('\n').filter(Boolean) }))}
            placeholder="Role at Company - brief description (one per line)"
          />
        </label>

        <div style={{display:'flex', gap:8, marginTop:12}}>
          <button type="button" className={`ai-optimize-btn ${aiLoading && aiFeature === 'optimize' ? 'loading' : ''}`} onClick={optimizeResumeWithAI} disabled={aiLoading}>
            {aiLoading && aiFeature === 'optimize' ? '🤖 Optimizing...' : '🚀 AI Optimize Resume'}
          </button>
        </div>

        <div style={{marginTop:16}}>
          <button type="submit" className="resume-form-mobile-submit">Next</button>
        </div>
      </form>
    </div>
  );
};

export default ResumeFormMobile;
