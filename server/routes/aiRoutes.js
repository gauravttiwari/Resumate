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

/**
 * Route to generate career path recommendations
 */
router.post('/career-path-recommendations', async (req, res) => {
  try {
    const { resumeData, currentRole, experienceLevel } = req.body;

    if (!resumeData || !currentRole) {
      return res
        .status(400)
        .json({ success: false, message: 'Resume data and current role are required' });
    }

    const careerRecommendations = await geminiService.generateCareerPathRecommendations(
      resumeData, 
      currentRole, 
      experienceLevel || 'mid-level'
    );
    
    res.status(200).json({ success: true, data: careerRecommendations });
  } catch (error) {
    console.error('Error generating career path recommendations:', error);
    res
      .status(500)
      .json({
        success: false,
        message: 'Failed to generate career path recommendations',
        error: error.message,
      });
  }
});

/**
 * Route to generate skill gap analysis
 */
router.post('/skill-gap-analysis', async (req, res) => {
  try {
    const { resumeData, currentRole, targetRole } = req.body;

    if (!resumeData || !currentRole) {
      return res
        .status(400)
        .json({ success: false, message: 'Resume data and current role are required' });
    }

    const skillGapAnalysis = await geminiService.generateSkillGapAnalysis(
      resumeData, 
      currentRole, 
      targetRole || currentRole
    );
    
    res.status(200).json({ success: true, data: skillGapAnalysis });
  } catch (error) {
    console.error('Error generating skill gap analysis:', error);
    res
      .status(500)
      .json({
        success: false,
        message: 'Failed to generate skill gap analysis',
        error: error.message,
      });
  }
});

/**
 * Route to get industry trends and notifications
 */
router.get('/industry-trends/:industry?', async (req, res) => {
  try {
    const { industry } = req.params;
    const trends = geminiService.getIndustryTrends(industry || 'IT');
    
    res.status(200).json({ success: true, data: trends });
  } catch (error) {
    console.error('Error getting industry trends:', error);
    res
      .status(500)
      .json({
        success: false,
        message: 'Failed to get industry trends',
        error: error.message,
      });
  }
});

/**
 * Route to get personalized trend notifications
 */
router.post('/trend-notifications', async (req, res) => {
  try {
    const { resumeData, currentRole } = req.body;
    
    if (!resumeData) {
      return res
        .status(400)
        .json({ success: false, message: 'Resume data is required' });
    }

    const industry = geminiService.getIndustryTrends().industry || 'IT';
    const trends = geminiService.getIndustryTrends(industry);
    const notifications = geminiService.generateTrendNotifications(trends, industry);
    
    res.status(200).json({ success: true, data: { notifications, trends } });
  } catch (error) {
    console.error('Error generating trend notifications:', error);
    res
      .status(500)
      .json({
        success: false,
        message: 'Failed to generate trend notifications',
        error: error.message,
      });
  }
});

/**
 * Route to get suggestions history for a user
 */
router.get('/suggestions-history', async (req, res) => {
  try {
    const { userId = 'anonymous', limit, type, startDate, endDate } = req.query;

    const options = {};
    if (limit) options.limit = parseInt(limit);
    if (type) options.type = type;
    if (startDate) options.startDate = startDate;
    if (endDate) options.endDate = endDate;

    const history = await geminiService.getSuggestionsHistory(userId, options);
    res.status(200).json({ success: true, data: history });
  } catch (error) {
    console.error('Error getting suggestions history:', error);
    res
      .status(500)
      .json({
        success: false,
        message: 'Failed to get suggestions history',
        error: error.message,
      });
  }
});

/**
 * Route to get suggestions statistics for a user
 */
router.get('/suggestions-stats', async (req, res) => {
  try {
    const { userId = 'anonymous' } = req.query;

    const stats = await geminiService.getSuggestionStats(userId);
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error('Error getting suggestions stats:', error);
    res
      .status(500)
      .json({
        success: false,
        message: 'Failed to get suggestions stats',
        error: error.message,
      });
  }
});

/**
 * Route to mark a suggestion as read
 */
router.patch('/suggestions/:id/read', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await geminiService.markSuggestionAsRead(id);
    
    if (result.success) {
      res.status(200).json({ success: true, data: result.suggestion });
    } else {
      res.status(404).json({ success: false, message: result.error });
    }
  } catch (error) {
    console.error('Error marking suggestion as read:', error);
    res
      .status(500)
      .json({
        success: false,
        message: 'Failed to mark suggestion as read',
        error: error.message,
      });
  }
});

/**
 * Route to delete a suggestion from history
 */
router.delete('/suggestions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId = 'anonymous' } = req.query;

    const result = await geminiService.deleteSuggestionFromHistory(id, userId);
    
    if (result.success) {
      res.status(200).json({ success: true, data: result.suggestion });
    } else {
      res.status(404).json({ success: false, message: result.error });
    }
  } catch (error) {
    console.error('Error deleting suggestion:', error);
    res
      .status(500)
      .json({
        success: false,
        message: 'Failed to delete suggestion',
        error: error.message,
      });
  }
});

/**
 * Route to clear all suggestions history for a user
 */
router.delete('/suggestions-history', async (req, res) => {
  try {
    const { userId = 'anonymous' } = req.query;

    const result = await geminiService.clearSuggestionsHistory(userId);
    res.status(200).json({ success: true, data: { clearedCount: result.clearedCount } });
  } catch (error) {
    console.error('Error clearing suggestions history:', error);
    res
      .status(500)
      .json({
        success: false,
        message: 'Failed to clear suggestions history',
        error: error.message,
      });
  }
});

module.exports = router;
