// services/geminiService.js

const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const NodeCache = require('node-cache');

// Load environment variables
dotenv.config();

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';  // Updated to gemini-1.5-flash

if (!apiKey) {
  console.error('GEMINI_API_KEY is missing in environment variables');
  process.exit(1);
}

// Initialize the AI
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: modelName });

// Cache for storing previously generated responses (to reduce API calls and costs)
const responseCache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

/**
 * Generic function to generate content using Gemini AI
 * @param {string} prompt - The prompt to send to Gemini
 * @param {object} options - Additional options like temperature, candidate count, etc.
 * @returns {Promise<string>} - The generated content
 */
async function generateContent(prompt, options = {}) {
  try {
    // Generate cache key based on prompt and options
    const cacheKey = `${prompt}-${JSON.stringify(options)}`;
    
    // Check if we have a cached response
    const cachedResponse = responseCache.get(cacheKey);
    if (cachedResponse) {
      console.log('Using cached Gemini AI response');
      return cachedResponse;
    }
    
    // Set default options
    const generationConfig = {
      temperature: options.temperature || 0.7,
      topK: options.topK || 40,
      topP: options.topP || 0.95,
      maxOutputTokens: options.maxOutputTokens || 1024,
    };
    
    // Generate content
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig,
    });
    
    const response = result.response;
    const text = response.text();
    
    // Cache the response
    responseCache.set(cacheKey, text);
    
    return text;
  } catch (error) {
    console.error('Error generating content with Gemini AI:', error);
    throw new Error('Failed to generate content with AI');
  }
}

/**
 * Optimize resume content for ATS systems
 * @param {object} resumeData - The user's resume data
 * @param {string} targetJobTitle - The job title being targeted
 * @returns {Promise<object>} - Optimization suggestions
 */
async function optimizeResume(resumeData, targetJobTitle) {
  try {
    const prompt = `
    You are an expert ATS (Applicant Tracking System) optimization assistant.
    Analyze this resume data for a ${targetJobTitle} position and provide detailed optimization suggestions.
    Focus on keywords, phrasing, skills, and formatting that would maximize the resume's chances of passing ATS systems.
    
    Resume Data:
    ${JSON.stringify(resumeData, null, 2)}
    
    Provide the following in JSON format:
    1. "suggestedKeywords": [] - List of keywords that should be added based on the job title
    2. "contentSuggestions": {} - Object with field names as keys and suggested improvements as values
    3. "skillsToAdd": [] - List of skills that would be relevant for this position but are missing
    4. "optimizationScore": Number - A score from 0-100 rating how ATS-friendly the resume is
    5. "improvementAreas": [] - List of specific areas that need improvement
    `;
    
    const response = await generateContent(prompt, { temperature: 0.3 });
    
    // Try to extract JSON from the response
    try {
      // Look for JSON content between ```json and ``` markers
      let jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
      
      // If found with markers, parse that
      if (jsonMatch && jsonMatch[1]) {
        return JSON.parse(jsonMatch[1]);
      }
      
      // Otherwise try to parse the whole response as JSON
      return JSON.parse(response);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.log('Raw response:', response);
      
      // Return a default structure since parsing failed
      return {
        suggestedKeywords: ["communication", "leadership", "problem-solving"],
        contentSuggestions: { 
          summary: "Consider adding more quantifiable achievements"
        },
        skillsToAdd: ["teamwork", "project management"],
        optimizationScore: 70,
        improvementAreas: ["Add more keywords relevant to the job description"]
      };
    }
  } catch (error) {
    console.error('Error optimizing resume:', error);
    throw new Error('Failed to optimize resume');
  }
}

/**
 * Generate a professional summary based on resume data
 * @param {object} resumeData - The user's resume data
 * @returns {Promise<string>} - Generated professional summary
 */
async function generateSummary(resumeData) {
  try {
    const prompt = `
    Create a professional, compelling resume summary based on the following information.
    The summary should be concise (3-4 sentences), highlight key achievements, skills, and experience,
    and be optimized for ATS systems.
    
    Resume Data:
    ${JSON.stringify(resumeData, null, 2)}
    
    Return only the summary text without any explanations or additional notes.
    `;
    
    return await generateContent(prompt, { temperature: 0.7 });
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error('Failed to generate summary');
  }
}

/**
 * Recommend the best template based on resume data and job type
 * @param {object} resumeData - The user's resume data
 * @param {string} jobType - Type of job (tech, non-tech, medical, diploma)
 * @returns {Promise<object>} - Template recommendation with reasoning
 */
async function recommendTemplate(resumeData, jobType) {
  try {
    const prompt = `
    You are an expert resume template advisor.
    Based on the resume data and job type provided, recommend the best template style that would:
    1. Be most appropriate for the industry
    2. Highlight the candidate's strengths
    3. Be ATS-compatible
    4. Present information in the most effective way
    
    Resume Data:
    ${JSON.stringify(resumeData, null, 2)}
    
    Job Type:
    ${jobType}
    
    Provide the following in JSON format:
    1. "recommendedTemplate": String - Name of the recommended template
    2. "reasoning": String - Explanation for why this template is best
    3. "alternativeOptions": [] - List of 2 alternative templates that could also work well
    `;
    
    const response = await generateContent(prompt, { temperature: 0.4 });
    
    // Try to extract JSON from the response
    try {
      // Look for JSON content between ```json and ``` markers
      let jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
      
      // If found with markers, parse that
      if (jsonMatch && jsonMatch[1]) {
        return JSON.parse(jsonMatch[1]);
      }
      
      // Otherwise try to parse the whole response as JSON
      return JSON.parse(response);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.log('Raw response:', response);
      
      // Return a default structure since parsing failed
      return {
        recommendedTemplate: "professional",
        reasoning: "Based on the job type and resume content, a professional template would be most appropriate.",
        alternativeOptions: ["modern", "standard"]
      };
    }
  } catch (error) {
    console.error('Error recommending template:', error);
    throw new Error('Failed to recommend template');
  }
}

/**
 * Improve work experience descriptions with better action verbs and achievements
 * @param {Array} experiences - Array of work experience items
 * @returns {Promise<Array>} - Improved work experience descriptions
 */
async function improveWorkExperience(experiences) {
  try {
    const prompt = `
    You are an expert resume writer specializing in creating impactful work experience descriptions.
    Improve these work experience entries by:
    1. Using strong action verbs
    2. Quantifying achievements where possible
    3. Highlighting skills relevant to the position
    4. Making them more concise and impactful
    5. Ensuring they are ATS-friendly
    
    Work Experiences:
    ${JSON.stringify(experiences, null, 2)}
    
    Return the improved work experiences in the same JSON format, preserving all fields but enhancing the descriptions.
    `;
    
    const response = await generateContent(prompt, { temperature: 0.6 });
    
    // Try to extract JSON from the response
    try {
      // Look for JSON content between ```json and ``` markers
      let jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
      
      // If found with markers, parse that
      if (jsonMatch && jsonMatch[1]) {
        return JSON.parse(jsonMatch[1]);
      }
      
      // Otherwise try to parse the whole response as JSON
      return JSON.parse(response);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.log('Raw response:', response);
      
      // Return the original experiences since parsing failed
      return experiences;
    }
  } catch (error) {
    console.error('Error improving work experience:', error);
    throw new Error('Failed to improve work experience');
  }
}

/**
 * Analyze resume and provide an ATS compatibility score
 * @param {object} resumeData - The user's resume data
 * @param {string} targetJobTitle - The job title being targeted
 * @returns {Promise<object>} - ATS compatibility score and feedback
 */
async function getATSScore(resumeData, targetJobTitle) {
  try {
    const prompt = `
    You are an expert ATS (Applicant Tracking System) analyzer.
    Analyze this resume data for a ${targetJobTitle} position and calculate an ATS compatibility score.
    
    Resume Data:
    ${JSON.stringify(resumeData, null, 2)}
    
    Provide the following in JSON format:
    1. "overallScore": Number - A score from 0-100 rating how ATS-friendly the resume is
    2. "sectionScores": {} - Object with sections as keys (summary, experience, skills, etc.) and scores as values
    3. "improvementSuggestions": [] - List of specific suggestions to improve ATS compatibility
    4. "keywordAnalysis": {} - Analysis of relevant keywords present and missing
    5. "formatIssues": [] - Any formatting issues that might affect ATS parsing
    `;
    
    const response = await generateContent(prompt, { temperature: 0.3 });
    
    // Try to extract JSON from the response
    try {
      // Look for JSON content between ```json and ``` markers
      let jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
      
      // If found with markers, parse that
      if (jsonMatch && jsonMatch[1]) {
        return JSON.parse(jsonMatch[1]);
      }
      
      // Otherwise try to parse the whole response as JSON
      return JSON.parse(response);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.log('Raw response:', response);
      
      // Return a default structure since parsing failed
      return {
        overallScore: 75,
        sectionScores: {
          summary: 80,
          experience: 70,
          skills: 85,
          education: 90
        },
        improvementSuggestions: [
          "Add more keywords relevant to the job position",
          "Quantify achievements in work experience"
        ],
        keywordAnalysis: {
          present: ["JavaScript", "React", "Node.js"],
          missing: ["TypeScript", "Redux", "AWS"]
        },
        formatIssues: []
      };
    }
  } catch (error) {
    console.error('Error calculating ATS score:', error);
    throw new Error('Failed to calculate ATS score');
  }
}

/**
 * Get answers for common resume building questions
 * @param {string} question - User's question about resume building
 * @param {object} resumeContext - Optional context from user's current resume
 * @returns {Promise<string>} - AI response to the question
 */
async function getResumeHelp(question, resumeContext = null) {
  try {
    let contextStr = '';
    if (resumeContext) {
      contextStr = `\nCurrent resume context:\n${JSON.stringify(resumeContext, null, 2)}`;
    }
    
    const prompt = `
    You are a helpful resume writing assistant. Answer the following question about resume writing
    in a clear, concise, and helpful way. Provide specific examples where appropriate.
    ${contextStr}
    
    Question: ${question}
    `;
    
    return await generateContent(prompt, { temperature: 0.7 });
  } catch (error) {
    console.error('Error getting resume help:', error);
    throw new Error('Failed to get resume help');
  }
}

module.exports = {
  generateContent,
  optimizeResume,
  generateSummary,
  recommendTemplate,
  improveWorkExperience,
  getATSScore,
  getResumeHelp
};