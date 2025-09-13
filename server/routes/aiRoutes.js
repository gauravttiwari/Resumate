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
      return res
        .status(400)
        .json({
          success: false,
          message: 'Resume data and target job title are required',
        });
    }

    const optimizationSuggestions = await geminiService.optimizeResume(
      resumeData,
      targetJobTitle
    );
    res.status(200).json({ success: true, data: optimizationSuggestions });
  } catch (error) {
    console.error('Error optimizing resume:', error);
    res
      .status(500)
      .json({
        success: false,
        message: 'Failed to optimize resume',
        error: error.message,
      });
  }
});

/**
 * Route to generate a professional summary
 */
router.post('/generate-summary', async (req, res) => {
  try {
    const { resumeData, resumeType } = req.body;

    if (!resumeData) {
      return res
        .status(400)
        .json({ success: false, message: 'Resume data is required' });
    }

    const summary = await geminiService.generateSummary(resumeData, resumeType || 'general');
    res.status(200).json({ success: true, data: { summary } });
  } catch (error) {
    console.error('Error generating summary:', error);
    res
      .status(500)
      .json({
        success: false,
        message: 'Failed to generate summary',
        error: error.message,
      });
  }
});

/**
 * Route for AI Chat functionality
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res
        .status(400)
        .json({ success: false, message: 'Message is required' });
    }

    const chatResponse = await geminiService.chatWithAI(message, context || {});
    res.status(200).json({ success: true, data: chatResponse });
  } catch (error) {
    console.error('Error in AI chat:', error);
    res
      .status(500)
      .json({
        success: false,
        message: 'Failed to get AI response',
        error: error.message,
      });
  }
});

/**
 * Route to recommend the best template
 */
router.post('/recommend-template', async (req, res) => {
  try {
    const { resumeData, jobType } = req.body;

    if (!resumeData || !jobType) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'Resume data and job type are required',
        });
    }

    const recommendation = await geminiService.recommendTemplate(
      resumeData,
      jobType
    );
    res.status(200).json({ success: true, data: recommendation });
  } catch (error) {
    console.error('Error recommending template:', error);
    res
      .status(500)
      .json({
        success: false,
        message: 'Failed to recommend template',
        error: error.message,
      });
  }
});

/**
 * Route to improve work experience descriptions
 */
router.post('/improve-experience', async (req, res) => {
  try {
    const { experiences } = req.body;

    if (!experiences || !Array.isArray(experiences)) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'Valid work experiences array is required',
        });
    }

    const improvedExperiences = await geminiService.improveWorkExperience(
      experiences
    );
    res
      .status(200)
      .json({ success: true, data: { experiences: improvedExperiences } });
  } catch (error) {
    console.error('Error improving work experience:', error);
    res
      .status(500)
      .json({
        success: false,
        message: 'Failed to improve work experience',
        error: error.message,
      });
  }
});

/**
 * Route to analyze resume and provide an ATS compatibility score
 */
router.post('/ats-score', async (req, res) => {
  try {
    const { resumeData, targetJobTitle } = req.body;

    if (!resumeData || !targetJobTitle) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'Resume data and target job title are required',
        });
    }

    const atsScore = await geminiService.getATSScore(
      resumeData,
      targetJobTitle
    );
    res.status(200).json({ success: true, data: atsScore });
  } catch (error) {
    console.error('Error calculating ATS score:', error);
    res
      .status(500)
      .json({
        success: false,
        message: 'Failed to calculate ATS score',
        error: error.message,
      });
  }
});

/**
 * Route to get answers for common resume building questions
 */
router.post('/resume-help', async (req, res) => {
  try {
    const { question, resumeContext } = req.body;

    if (!question) {
      return res
        .status(400)
        .json({ success: false, message: 'Question is required' });
    }

    const answer = await geminiService.getResumeHelp(question, resumeContext);
    res.status(200).json({ success: true, data: { question, answer } });
  } catch (error) {
    console.error('Error getting resume help:', error);
    res
      .status(500)
      .json({
        success: false,
        message: 'Failed to get resume help',
        error: error.message,
      });
  }
});

/**
 * Route to get comprehensive ATS analysis with suggestions
 */
router.post('/ats-analysis', async (req, res) => {
  try {
    const { resumeData, resumeType } = req.body;

    if (!resumeData) {
      return res
        .status(400)
        .json({ success: false, message: 'Resume data is required' });
    }

    const analysis = await geminiService.generateATSAnalysis(resumeData, resumeType || 'general');
    res.status(200).json({ success: true, data: analysis });
  } catch (error) {
    console.error('Error generating ATS analysis:', error);
    res
      .status(500)
      .json({
        success: false,
        message: 'Failed to generate ATS analysis',
        error: error.message,
      });
  }
});

/**
 * Route to get enhanced ATS analysis with job description parsing
 */
router.post('/enhanced-ats-analysis', async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;

    if (!resumeData) {
      return res
        .status(400)
        .json({ success: false, message: 'Resume data is required' });
    }

    const analysis = await geminiService.generateEnhancedATSAnalysis(resumeData, jobDescription);
    res.status(200).json({ success: true, data: analysis });
  } catch (error) {
    console.error('Error generating enhanced ATS analysis:', error);
    res
      .status(500)
      .json({
        success: false,
        message: 'Failed to generate enhanced ATS analysis',
        error: error.message,
      });
  }
});

/**
 * Route to search and recommend ATS-optimized templates
 */
router.post('/search-templates', async (req, res) => {
  try {
    const { jobTitle, industry, experienceLevel } = req.body;

    if (!jobTitle) {
      return res
        .status(400)
        .json({ success: false, message: 'Job title is required for template search' });
    }

    const templates = await geminiService.searchATSTemplates({
      jobTitle,
      industry: industry || 'general',
      experienceLevel: experienceLevel || 'mid-level'
    });
    
    res.status(200).json({ success: true, data: templates });
  } catch (error) {
    console.error('Error searching templates:', error);
    res
      .status(500)
      .json({
        success: false,
        message: 'Failed to search templates',
        error: error.message,
      });
  }
});

/**
 * Route to generate interview preparation content
 */
router.post('/interview-prep', async (req, res) => {
  try {
    const { field, jobRole, qualification } = req.body;

    if (!field || !qualification) {
      return res.status(400).json({
        success: false,
        message: 'Field and qualification are required'
      });
    }

    const interviewData = await geminiService.generateInterviewPrep(
      field,
      jobRole,
      qualification
    );

    res.status(200).json({
      success: true,
      questions: interviewData.questions,
      sampleAnswers: interviewData.sampleAnswers,
      tips: interviewData.tips
    });
  } catch (error) {
    console.error('Error generating interview prep:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate interview preparation',
      error: error.message
    });
  }
});

/**
 * Route to generate mock interview feedback
 */
router.post('/mock-interview-feedback', async (req, res) => {
  try {
    const { question, answer, field, jobRole } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: 'Question and answer are required'
      });
    }

    const feedback = await geminiService.generateMockInterviewFeedback(
      question,
      answer,
      field,
      jobRole
    );

    res.status(200).json({
      success: true,
      feedback: feedback.feedback
    });
  } catch (error) {
    console.error('Error generating mock interview feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate feedback',
      error: error.message
    });
  }
});

module.exports = router;
