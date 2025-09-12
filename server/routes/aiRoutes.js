// routes/aiRoutes.js

const express = require('express');
const router = express.Router();
const geminiService = require('../services/geminiService');

/**
 * Route to optimize resume content for ATS systems
 */
router.post('/optimize-resume', async (req, res) => {
  try {
    const { resumeData, targetJobTitle } = req.body;
    
    if (!resumeData || !targetJobTitle) {
      return res.status(400).json({ success: false, message: 'Resume data and target job title are required' });
    }
    
    const optimizationSuggestions = await geminiService.optimizeResume(resumeData, targetJobTitle);
    res.status(200).json({ success: true, data: optimizationSuggestions });
  } catch (error) {
    console.error('Error optimizing resume:', error);
    res.status(500).json({ success: false, message: 'Failed to optimize resume', error: error.message });
  }
});

/**
 * Route to generate a professional summary
 */
router.post('/generate-summary', async (req, res) => {
  try {
    const { resumeData } = req.body;
    
    if (!resumeData) {
      return res.status(400).json({ success: false, message: 'Resume data is required' });
    }
    
    const summary = await geminiService.generateSummary(resumeData);
    res.status(200).json({ success: true, data: { summary } });
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ success: false, message: 'Failed to generate summary', error: error.message });
  }
});

/**
 * Route to recommend the best template
 */
router.post('/recommend-template', async (req, res) => {
  try {
    const { resumeData, jobType } = req.body;
    
    if (!resumeData || !jobType) {
      return res.status(400).json({ success: false, message: 'Resume data and job type are required' });
    }
    
    const recommendation = await geminiService.recommendTemplate(resumeData, jobType);
    res.status(200).json({ success: true, data: recommendation });
  } catch (error) {
    console.error('Error recommending template:', error);
    res.status(500).json({ success: false, message: 'Failed to recommend template', error: error.message });
  }
});

/**
 * Route to improve work experience descriptions
 */
router.post('/improve-experience', async (req, res) => {
  try {
    const { experiences } = req.body;
    
    if (!experiences || !Array.isArray(experiences)) {
      return res.status(400).json({ success: false, message: 'Valid work experiences array is required' });
    }
    
    const improvedExperiences = await geminiService.improveWorkExperience(experiences);
    res.status(200).json({ success: true, data: { experiences: improvedExperiences } });
  } catch (error) {
    console.error('Error improving work experience:', error);
    res.status(500).json({ success: false, message: 'Failed to improve work experience', error: error.message });
  }
});

/**
 * Route to analyze resume and provide an ATS compatibility score
 */
router.post('/ats-score', async (req, res) => {
  try {
    const { resumeData, targetJobTitle } = req.body;
    
    if (!resumeData || !targetJobTitle) {
      return res.status(400).json({ success: false, message: 'Resume data and target job title are required' });
    }
    
    const atsScore = await geminiService.getATSScore(resumeData, targetJobTitle);
    res.status(200).json({ success: true, data: atsScore });
  } catch (error) {
    console.error('Error calculating ATS score:', error);
    res.status(500).json({ success: false, message: 'Failed to calculate ATS score', error: error.message });
  }
});

/**
 * Route to get answers for common resume building questions
 */
router.post('/resume-help', async (req, res) => {
  try {
    const { question, resumeContext } = req.body;
    
    if (!question) {
      return res.status(400).json({ success: false, message: 'Question is required' });
    }
    
    const answer = await geminiService.getResumeHelp(question, resumeContext);
    res.status(200).json({ success: true, data: { question, answer } });
  } catch (error) {
    console.error('Error getting resume help:', error);
    res.status(500).json({ success: false, message: 'Failed to get resume help', error: error.message });
  }
});

module.exports = router;