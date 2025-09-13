// components/ai/GeminiAIContainer.js
import React, { useState } from 'react';
import ATSScoreCard from './ATSScoreCard';
import ResumeOptimizer from './ResumeOptimizer';
import SummaryGenerator from './SummaryGenerator';
import TemplateRecommender from './TemplateRecommender';
import ResumeHelper from './ResumeHelper';

/**
 * Container component that integrates all Gemini AI features
 */
const GeminiAIContainer = ({
  resumeData,
  targetJobTitle,
  jobType,
  availableTemplates,
  onUpdateResume,
  onSelectTemplate,
}) => {
  const [activeTab, setActiveTab] = useState('optimizer');

  const handleApplySuggestions = (suggestions) => {
    if (!onUpdateResume) return;

    // Create updated resume data with suggestions applied
    const updatedResumeData = { ...resumeData };

    // Apply keywords to skills
    if (suggestions.keywords && suggestions.keywords.length > 0) {
      updatedResumeData.skills = [
        ...(updatedResumeData.skills || []),
        ...suggestions.keywords.filter(
          (keyword) => !(updatedResumeData.skills || []).includes(keyword)
        ),
      ];
    }

    // Apply content improvements
    if (suggestions.contentImprovements) {
      Object.entries(suggestions.contentImprovements).forEach(
        ([field, improvement]) => {
          if (field in updatedResumeData) {
            updatedResumeData[field] = improvement;
          }
        }
      );
    }

    // Apply skills
    if (suggestions.skills && suggestions.skills.length > 0) {
      updatedResumeData.skills = [
        ...(updatedResumeData.skills || []),
        ...suggestions.skills.filter(
          (skill) => !(updatedResumeData.skills || []).includes(skill)
        ),
      ];
    }

    // Update resume data
    onUpdateResume(updatedResumeData);
  };

  const handleSummaryGenerated = (summary) => {
    if (!onUpdateResume) return;

    // Apply the generated summary to the resume data
    onUpdateResume({
      ...resumeData,
      summary,
    });
  };

  return (
    <div className="gemini-ai-container">
      <div className="ai-tabs">
        <button
          className={`tab-button ${activeTab === 'optimizer' ? 'active' : ''}`}
          onClick={() => setActiveTab('optimizer')}
        >
          Resume Optimizer
        </button>
        <button
          className={`tab-button ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          Summary Generator
        </button>
        <button
          className={`tab-button ${activeTab === 'template' ? 'active' : ''}`}
          onClick={() => setActiveTab('template')}
        >
          Template Recommender
        </button>
        <button
          className={`tab-button ${activeTab === 'ats' ? 'active' : ''}`}
          onClick={() => setActiveTab('ats')}
        >
          ATS Score
        </button>
      </div>

      <div className="ai-tab-content">
        {activeTab === 'optimizer' && (
          <ResumeOptimizer
            resumeData={resumeData}
            targetJobTitle={targetJobTitle}
            onApplySuggestions={handleApplySuggestions}
          />
        )}

        {activeTab === 'summary' && (
          <SummaryGenerator
            resumeData={resumeData}
            onSummaryGenerated={handleSummaryGenerated}
          />
        )}

        {activeTab === 'template' && (
          <TemplateRecommender
            resumeData={resumeData}
            jobType={jobType}
            availableTemplates={availableTemplates}
            onSelectTemplate={onSelectTemplate}
          />
        )}

        {activeTab === 'ats' && (
          <ATSScoreCard
            resumeData={resumeData}
            targetJobTitle={targetJobTitle}
          />
        )}
      </div>

      {/* The chat helper is always visible, floating in corner */}
      <ResumeHelper resumeData={resumeData} />
    </div>
  );
};

export default GeminiAIContainer;
