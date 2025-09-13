// services/aiService.js

/**
 * Service to interact with the AI endpoints
 */

// API base URL - adjust based on your server configuration
const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Get resume optimization suggestions
 * @param {Object} resumeData - The resume data to optimize
 * @param {String} targetJobTitle - The job title being targeted
 * @returns {Promise<Object>} - Optimization suggestions
 */
export const optimizeResume = async (resumeData, targetJobTitle) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/optimize-resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resumeData, targetJobTitle }),
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to optimize resume');
    }

    // Check if response is in fallback mode
    if (result.data && result.data.fallbackMode) {
      console.warn('⚠️ AI service in fallback mode due to quota/service issues');
      return {
        ...result.data,
        isOfflineMode: true,
        message: 'AI service temporarily unavailable. Basic suggestions provided.'
      };
    }

    return result.data;
  } catch (error) {
    console.error('Error optimizing resume:', error);
    // Return fallback optimization data
    return {
      isOfflineMode: true,
      message: 'AI service unavailable. Basic optimization suggestions provided.',
      suggestedKeywords: ["professional", "experienced", "skilled", "results-driven"],
      contentSuggestions: {
        summary: "Add specific achievements and quantifiable results",
        experience: "Include action verbs and measurable outcomes"
      },
      skillsToAdd: ["Communication", "Problem-solving", "Leadership"],
      optimizationScore: 70,
      improvementAreas: ["Add relevant keywords", "Quantify achievements"]
    };
  }
};

/**
 * Generate a professional summary
 * @param {Object} resumeData - The resume data to use for summary generation
 * @param {String} resumeType - The type of resume (technical, medical, diploma, non-technical)
 * @returns {Promise<String>} - Generated summary
 */
export const generateSummary = async (resumeData, resumeType = 'general') => {
  try {
    console.log('Calling summary API with:', { resumeData, resumeType });
    const response = await fetch(`${API_BASE_URL}/ai/generate-summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resumeData, resumeType }),
    });

    console.log('Response status:', response.status);
    const result = await response.json();
    console.log('API response:', result);
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to generate summary');
    }

    return result.data.summary || result.data;
  } catch (error) {
    console.error('Error generating summary:', error);
    // Return fallback summary
    return `Experienced professional with strong background in ${resumeType} field. Demonstrated ability to deliver results and contribute to team success. Seeking opportunities to apply skills and expertise in a challenging role that promotes growth and innovation.`;
  }
};

/**
 * Get template recommendations
 * @param {Object} resumeData - The resume data
 * @param {String} jobType - Type of job (tech, non-tech, medical, diploma)
 * @returns {Promise<Object>} - Template recommendations
 */
export const recommendTemplate = async (resumeData, jobType) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/recommend-template`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resumeData, jobType }),
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to recommend template');
    }

    return result.data;
  } catch (error) {
    console.error('Error recommending template:', error);
    throw error;
  }
};

/**
 * Improve work experience descriptions
 * @param {Array} experiences - Array of work experience items
 * @returns {Promise<Array>} - Improved work experience descriptions
 */
export const improveWorkExperience = async (experiences) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/improve-experience`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ experiences }),
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to improve work experience');
    }

    return result.data.experiences;
  } catch (error) {
    console.error('Error improving work experience:', error);
    throw error;
  }
};

/**
 * Get ATS compatibility score
 * @param {Object} resumeData - The resume data to analyze
 * @param {String} targetJobTitle - The job title being targeted
 * @returns {Promise<Object>} - ATS score and feedback
 */
export const getATSScore = async (resumeData, targetJobTitle) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/ats-score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resumeData, targetJobTitle }),
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to get ATS score');
    }

    return result.data;
  } catch (error) {
    console.error('Error getting ATS score:', error);
    throw error;
  }
};

/**
 * Get resume building help
 * @param {String} question - User's question about resume building
 * @param {Object} resumeContext - Optional context from user's current resume
 * @returns {Promise<String>} - AI response to the question
 */
export const getResumeHelp = async (question, resumeContext = null) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/resume-help`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, resumeContext }),
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to get resume help');
    }

    return result.data.answer;
  } catch (error) {
    console.error('Error getting resume help:', error);
    throw error;
  }
};

/**
 * Get comprehensive ATS analysis with score and suggestions
 * @param {Object} resumeData - The resume data to analyze
 * @param {String} resumeType - The type of resume (technical, medical, diploma, non-technical)
 * @returns {Promise<Object>} - ATS analysis with score and suggestions
 */
export const getATSAnalysis = async (resumeData, resumeType = 'general') => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/ats-analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resumeData, resumeType }),
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to get ATS analysis');
    }

    return result.data;
  } catch (error) {
    console.error('Error getting ATS analysis:', error);
    throw error;
  }
};

/**
 * Get enhanced ATS analysis with job description parsing and comprehensive scoring
 * @param {Object} resumeData - The resume data to analyze
 * @param {String} jobDescription - Optional job description for targeted analysis
 * @returns {Promise<Object>} - Enhanced ATS analysis with detailed breakdown
 */
export const getEnhancedATSAnalysis = async (resumeData, jobDescription = null) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/enhanced-ats-analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resumeData, jobDescription }),
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to get enhanced ATS analysis');
    }

    return result.data;
  } catch (error) {
    console.error('Error getting enhanced ATS analysis:', error);
    throw error;
  }
};

/**
 * Search for ATS-optimized templates using AI analysis
 * @param {Object} searchParams - Search parameters (jobTitle, industry, experienceLevel)
 * @returns {Promise<Array>} - Array of recommended templates
 */
export const searchTemplates = async (searchParams) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/search-templates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchParams),
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to search templates');
    }

    return result.data;
  } catch (error) {
    console.error('Error searching templates:', error);
    throw error;
  }
};

/**
 * Chat with AI assistant for resume guidance
 * @param {String} message - User's message/question
 * @param {Object} context - Optional context (current resume data)
 * @returns {Promise<Object>} - AI response with suggestions
 */
export const chatWithAI = async (message, context = {}) => {
  try {
    console.log('Sending chat message:', message);
    const response = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, context }),
    });

    const result = await response.json();
    console.log('Chat response:', result);
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to get AI response');
    }

    return result.data;
  } catch (error) {
    console.error('Error in AI chat:', error);
    // Fallback response
    return {
      message: getSmartFallbackResponse(message),
      suggestions: getRelevantSuggestions(message)
    };
  }
};

/**
 * Smart fallback responses based on user question
 */
function getSmartFallbackResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('skill') || lowerMessage.includes('technology')) {
    return `For technical skills, consider including:\n\n• Programming languages (Python, Java, JavaScript)\n• Frameworks (React, Node.js, Angular)\n• Databases (MySQL, MongoDB, PostgreSQL)\n• Tools (Git, Docker, AWS)\n• Soft skills (Communication, Problem-solving, Leadership)\n\nTailor skills to match the job description you're applying for!`;
  }
  
  if (lowerMessage.includes('summary') || lowerMessage.includes('objective')) {
    return `A professional summary should include:\n\n• Your professional title and years of experience\n• Key skills and expertise areas\n• Notable achievements with numbers/metrics\n• Value you bring to employers\n\nExample: "Experienced Software Developer with 5+ years building scalable web applications. Skilled in React, Node.js, and AWS. Led team of 4 developers and improved system performance by 40%."`;
  }
  
  if (lowerMessage.includes('template') || lowerMessage.includes('format')) {
    return `Template selection guide:\n\n• **Modern Clean**: Best for tech/creative roles\n• **Professional**: Ideal for corporate/finance positions\n• **ATS-Friendly**: Great for large companies with automated screening\n• **Creative**: Perfect for design/marketing roles\n\nChoose based on your industry and the company culture!`;
  }
  
  if (lowerMessage.includes('experience') || lowerMessage.includes('work') || lowerMessage.includes('job')) {
    return `For work experience descriptions:\n\n• Start with strong action verbs (Developed, Led, Implemented)\n• Include specific metrics and achievements\n• Use bullet points for readability\n• Focus on results, not just responsibilities\n• Quantify impact whenever possible\n\nExample: "Developed web application that increased user engagement by 35% and reduced load time by 50%."`;
  }
  
  if (lowerMessage.includes('ats') || lowerMessage.includes('keyword')) {
    return `ATS Optimization tips:\n\n• Use keywords from job descriptions\n• Include industry-standard terms\n• Avoid fancy formatting that ATS can't read\n• Use standard section headings\n• Include relevant certifications\n• Save as .docx format when possible\n\nATS systems scan for specific keywords, so mirror the job posting language!`;
  }
  
  return `I'm here to help with your resume! I can assist with:\n\n• Skills recommendations\n• Professional summary writing\n• Experience descriptions\n• Template selection\n• ATS optimization\n• Industry-specific advice\n\nWhat specific aspect would you like help with?`;
}

/**
 * Generate relevant action suggestions based on user question
 */
function getRelevantSuggestions(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('skill')) {
    return [
      { icon: '⚡', text: 'Auto-add suggested skills', action: 'auto-fill', data: { type: 'skills', content: 'JavaScript, React, Node.js, Python, SQL, Git, AWS, Problem-solving, Team Collaboration' }},
      { icon: '💼', text: 'Show industry-specific skills', action: 'ask' },
      { icon: '🎯', text: 'Help me choose relevant skills', action: 'ask' }
    ];
  }
  
  if (lowerMessage.includes('summary')) {
    return [
      { icon: '✨', text: 'Generate professional summary', action: 'auto-fill', data: { type: 'summary' }},
      { icon: '📝', text: 'Show summary examples', action: 'ask' },
      { icon: '🎯', text: 'Help me improve my summary', action: 'ask' }
    ];
  }
  
  if (lowerMessage.includes('template')) {
    return [
      { icon: '🎨', text: 'Recommend best template for me', action: 'ask' },
      { icon: '💼', text: 'Show professional templates', action: 'ask' },
      { icon: '🚀', text: 'Compare template features', action: 'ask' }
    ];
  }
  
  return [
    { icon: '💡', text: 'Give me resume tips', action: 'ask' },
    { icon: '🎯', text: 'Help optimize for ATS', action: 'ask' },
    { icon: '📈', text: 'Improve my experience section', action: 'ask' }
  ];
}

// Default export for backward compatibility
export default {
  optimizeResume,
  generateSummary,
  recommendTemplate,
  improveWorkExperience,
  getATSScore,
  getResumeHelp,
  getATSAnalysis,
  getEnhancedATSAnalysis,
  searchTemplates,
  chatWithAI,
};
