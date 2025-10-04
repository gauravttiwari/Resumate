// routes/aiRoutes.js

const express = require('express');
const router = express.Router();
const geminiService = require('../services/geminiService');
const atsAnalyzer = require('../services/atsAnalyzer');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Google Generative AI client with API key from env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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

/**
 * Route: /exact-ats-score
 * Algorithmic ATS scoring with deterministic results
 * Accepts { resumeData, jobDescription, jobTitle }
 */
router.post('/exact-ats-score', async (req, res) => {
  try {
    const { resumeData, jobDescription, jobTitle } = req.body;

    if (!resumeData) {
      return res.status(400).json({
        success: false,
        message: 'Resume data is required'
      });
    }

    // Extract keywords from job description if provided
    let customKeywords = [];
    if (jobDescription && jobDescription.trim().length > 10) {
      customKeywords = atsAnalyzer.extractKeywordsFromJobDescription(jobDescription);
    }

    // Calculate ATS score using algorithmic approach
    const atsResult = atsAnalyzer.calculateATSScore(resumeData, customKeywords);

    // Generate professional AI-style suggestions
    let geminiSuggestions = '';
    
    // Try Gemini AI first (if available)
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 20) {
      try {
        const text = typeof resumeData === 'string' ? resumeData : (resumeData.rawText || JSON.stringify(resumeData));
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        const prompt = `Analyze the following resume for ATS improvement:

${text}

${jobDescription ? `Job Description:\n${jobDescription}\n\n` : ''}

Provide:
1. Missing important keywords
2. Improvements in Summary/Skills sections
3. Action verbs to add
4. Specific recommendations to improve ATS score

Response in short bullet points.`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        geminiSuggestions = response.text();
      } catch (geminiError) {
        console.warn('Gemini AI unavailable, using algorithmic suggestions');
        geminiSuggestions = ''; // Will use fallback below
      }
    }
    
    // Generate professional algorithmic suggestions if Gemini unavailable
    if (!geminiSuggestions || geminiSuggestions.trim().length === 0) {
      const suggestions = [];
      
      // Section-based suggestions
      if (atsResult.breakdown.sectionsScore < 50) {
        suggestions.push('**Critical Sections Missing:**');
        if (!atsResult.breakdown.sections?.summary) {
          suggestions.push('• Add a Professional Summary at the top (2-3 lines highlighting your expertise)');
        }
        if (!atsResult.breakdown.sections?.skills) {
          suggestions.push('• Create a Skills section with relevant technical and soft skills');
        }
        if (!atsResult.breakdown.sections?.experience) {
          suggestions.push('• Add Work Experience section with your professional history');
        }
        if (!atsResult.breakdown.sections?.education) {
          suggestions.push('• Include Education section with degrees and institutions');
        }
        if (!atsResult.breakdown.sections?.projects) {
          suggestions.push('• Consider adding a Projects section to showcase your work');
        }
        suggestions.push('');
      }
      
      // Keyword-based suggestions
      if (atsResult.breakdown.keywordScore < 30 && customKeywords.length > 0) {
        const missingKeywords = customKeywords.filter(kw => {
          const text = typeof resumeData === 'string' ? resumeData : JSON.stringify(resumeData);
          return !text.toLowerCase().includes(kw.toLowerCase());
        }).slice(0, 10);
        
        if (missingKeywords.length > 0) {
          suggestions.push('**Missing Key Terms from Job Description:**');
          suggestions.push(`• Incorporate these keywords: ${missingKeywords.join(', ')}`);
          suggestions.push('• Add them naturally in your Skills, Experience, or Summary sections');
          suggestions.push('');
        }
      }
      
      // Format-based suggestions
      if (atsResult.breakdown.formatScore < 8) {
        suggestions.push('**Format Improvements:**');
        const text = typeof resumeData === 'string' ? resumeData : JSON.stringify(resumeData);
        
        if (!text.includes('•') && !text.includes('-')) {
          suggestions.push('• Use bullet points (•) to list your responsibilities and achievements');
        }
        if (!/@/.test(text)) {
          suggestions.push('• Include a professional email address');
        }
        if (!/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(text)) {
          suggestions.push('• Add your phone number in a standard format');
        }
        if (!/\d+%|\d+x|\$\d+|increased|reduced|improved/i.test(text)) {
          suggestions.push('• Add quantifiable metrics (e.g., "increased sales by 40%", "reduced costs by $50K")');
        }
        suggestions.push('');
      }
      
      // Action verbs suggestions
      if (atsResult.total < 70) {
        suggestions.push('**Strong Action Verbs to Use:**');
        suggestions.push('• Leadership: Led, Directed, Managed, Supervised, Coordinated');
        suggestions.push('• Achievement: Achieved, Accomplished, Delivered, Exceeded, Surpassed');
        suggestions.push('• Innovation: Developed, Created, Designed, Launched, Pioneered');
        suggestions.push('• Improvement: Enhanced, Optimized, Streamlined, Upgraded, Transformed');
        suggestions.push('');
      }
      
      // Overall recommendations
      suggestions.push('**General ATS Tips:**');
      suggestions.push('• Keep formatting simple - avoid tables, images, and complex layouts');
      suggestions.push('• Use standard section headings (Experience, Education, Skills)');
      suggestions.push('• Save as .docx or .pdf for best ATS compatibility');
      suggestions.push('• Match your resume keywords to the job description');
      suggestions.push('• Use full spellings before abbreviations (e.g., "Search Engine Optimization (SEO)")');
      
      geminiSuggestions = suggestions.join('\n');
    }

    // Return comprehensive response
    return res.status(200).json({
      success: true,
      data: {
        atsScore: {
          totalScore: atsResult.total,
          rating: atsResult.rating,
          breakdown: atsResult.breakdown
        },
        parseRate: atsResult.parseRate,
        issues: atsResult.issues,
        issuesCount: atsResult.issues.length,
        geminiSuggestions: geminiSuggestions,
        summary: `Your resume scored ${atsResult.total}/100. ${atsResult.rating} compatibility with ATS systems.`,
        generatedSummary: geminiSuggestions
      }
    });
  } catch (error) {
    console.error('Error in exact ATS score calculation:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to calculate ATS score',
      error: error.message
    });
  }
});

/**
 * Route: /analyze-resume
 * Accepts { resumeFilePath } or { resumeData } (rawText or object)
 * Uses pdf-parse to extract text when a file path is provided and
 * uses the Google Generative AI client for suggestions.
 */
router.post('/analyze-resume', async (req, res) => {
  try {
    const { resumeFilePath, resumeData } = req.body;

    // Extract text
    let text = '';
    if (resumeData && typeof resumeData === 'string') {
      text = resumeData;
    } else if (resumeData && resumeData.rawText) {
      text = String(resumeData.rawText);
    } else if (resumeFilePath) {
      try {
        const pdfBuffer = fs.readFileSync(resumeFilePath);
        const parsed = await pdfParse(pdfBuffer);
        text = parsed && parsed.text ? parsed.text : pdfBuffer.toString('utf8');
      } catch (err) {
        console.warn('Failed to read/parse resumeFilePath, falling back to plain read:', err.message);
        try { text = fs.readFileSync(resumeFilePath, 'utf8'); } catch (e) { text = ''; }
      }
    } else if (resumeData && typeof resumeData === 'object') {
      try { text = JSON.stringify(resumeData); } catch (e) { text = '' }
    }

    // Keyword set (can be provided in request body)
    const JD_KEYWORDS = Array.isArray(req.body.JD_KEYWORDS) && req.body.JD_KEYWORDS.length > 0
      ? req.body.JD_KEYWORDS
      : ['Java', 'React', 'Node.js', 'MongoDB', 'Spring Boot', 'API', 'SQL'];

    // Deterministic ATS scoring
    function calculateATSScore(t) {
      const lc = (t || '').toLowerCase();
      let score = 0;
      const breakdown = {};
      const sections = ['summary', 'skills', 'education', 'experience', 'projects'];
      sections.forEach(sec => {
        if (lc.includes(sec)) { score += 10; breakdown[sec] = 'Present'; }
        else { breakdown[sec] = 'Missing'; }
      });

      const foundKeywords = JD_KEYWORDS.filter(k => lc.includes(k.toLowerCase()));
      const keywordScore = Math.round((foundKeywords.length / Math.max(1, JD_KEYWORDS.length)) * 40);
      score += keywordScore;
      breakdown['keywords'] = `${foundKeywords.length}/${JD_KEYWORDS.length} matched`;

      if ((t || '').includes('•') || (t || '').includes('-')) { score += 10; breakdown['formatting'] = 'Good'; }
      else { breakdown['formatting'] = 'Weak'; }

      return { total: Math.min(100, score), breakdown, foundKeywords };
    }

    const atsResult = calculateATSScore(text);

    // Gemini suggestions via Google Generative AI client
    let geminiSuggestions = null;
    try {
      const model = genAI.getGenerativeModel ? genAI.getGenerativeModel({ model: 'gemini-pro' }) : genAI;
      const prompt = `Analyze the following resume text for ATS improvement:\n\n${text}\n\nGive me:\n1. Missing important keywords\n2. Improvements in Summary/Skills\n3. Action verbs to add\nResponse in short bullet points.`;

      // Try a few different client shapes for compatibility
      if (model && typeof model.generateContent === 'function') {
        const result = await model.generateContent(prompt);
        // result may vary by client version
        geminiSuggestions = (result && (result.outputText || result.response || result.text)) || result;
      } else if (typeof genAI.generate === 'function') {
        const result = await genAI.generate({ prompt });
        geminiSuggestions = result;
      } else {
        geminiSuggestions = null;
      }
    } catch (err) {
      console.warn('Gemini suggestion error:', err.message);
      geminiSuggestions = null;
    }

    const payload = {
      ats_score: atsResult.total,
      breakdown: atsResult.breakdown,
      gemini_suggestions: geminiSuggestions,
      parseRate: Math.min(100, Math.max(40, Math.round((text.length > 0 ? Math.min(1, text.length / 2000) : 0) * 100)))
    };

    return res.status(200).json({ success: true, data: payload });
  } catch (error) {
    console.error('analyze-resume handler error:', error);
    return res.status(500).json({ success: false, message: 'Error analyzing resume', error: error.message });
  }
});

module.exports = router;
