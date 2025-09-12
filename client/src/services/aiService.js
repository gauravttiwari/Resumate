// services/aiService.js

/**
 * Service to interact with the AI endpoints
 */

// API base URL - adjust based on your server configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ resumeData, targetJobTitle })
    });
    
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to optimize resume');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error optimizing resume:', error);
    throw error;
  }
};

/**
 * Generate a professional summary
 * @param {Object} resumeData - The resume data to use for summary generation
 * @returns {Promise<String>} - Generated summary
 */
export const generateSummary = async (resumeData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/generate-summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ resumeData })
    });
    
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to generate summary');
    }
    
    return result.data.summary;
  } catch (error) {
    console.error('Error generating summary:', error);
    throw error;
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
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ resumeData, jobType })
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
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ experiences })
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
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ resumeData, targetJobTitle })
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
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ question, resumeContext })
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

export default {
  optimizeResume,
  generateSummary,
  recommendTemplate,
  improveWorkExperience,
  getATSScore,
  getResumeHelp
};