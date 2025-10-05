// services/geminiService.js

const { GoogleGenerativeAI } = require('@google/generative-ai');
const googleSearchService = require('./googleSearchService');
const dotenv = require('dotenv');
const NodeCache = require('node-cache');

// Load environment variables
dotenv.config();

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash'; // Updated to gemini-1.5-flash

if (!apiKey) {
  console.error('GEMINI_API_KEY is missing in environment variables');
  process.exit(1);
}

// Initialize the AI
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: modelName });

// Cache for storing previously generated responses (to reduce API calls and costs)
const responseCache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

// In-memory storage for suggestions history (In production, use a proper database)
let suggestionsHistory = [];

// Helper function to save suggestion to history
const saveSuggestionToHistory = (userId, suggestionType, content, metadata = {}) => {
  const suggestion = {
    id: Date.now() + Math.random().toString(36).substr(2, 9),
    userId: userId || 'anonymous',
    type: suggestionType,
    content: content,
    metadata: metadata,
    timestamp: new Date().toISOString(),
    isRead: false
  };
  
  suggestionsHistory.unshift(suggestion); // Add to beginning of array
  
  // Keep only last 1000 suggestions to prevent memory issues
  if (suggestionsHistory.length > 1000) {
    suggestionsHistory = suggestionsHistory.slice(0, 1000);
  }
  
  return suggestion;
};

// Industry-specific keyword database as per ATS optimization requirements
const ATS_KEYWORD_DATABASE = {
  'software engineer': {
    industry: 'IT',
    keywords: ['Java', 'Python', 'JavaScript', 'React', 'Node.js', 'REST API', 'Git', 'Agile', 'SDLC', 'OOP', 'Database', 'Cloud', 'AWS', 'Docker'],
    actionVerbs: ['developed', 'implemented', 'architected', 'optimized', 'designed', 'built', 'deployed', 'integrated'],
    certifications: ['AWS Certified', 'Oracle Certified', 'Microsoft Certified', 'Google Cloud']
  },
  'web developer': {
    industry: 'IT',
    keywords: ['HTML', 'CSS', 'JavaScript', 'React', 'Angular', 'Vue', 'Bootstrap', 'Sass', 'Webpack', 'npm', 'Git', 'API'],
    actionVerbs: ['developed', 'created', 'designed', 'implemented', 'optimized', 'deployed'],
    certifications: ['Google Developer', 'Microsoft Certified', 'Adobe Certified']
  },
  'project manager': {
    industry: 'Management',
    keywords: ['Scrum', 'PMP', 'SDLC', 'Risk Management', 'Agile', 'Kanban', 'Stakeholder Management', 'Budget Planning'],
    actionVerbs: ['managed', 'led', 'coordinated', 'planned', 'executed', 'delivered', 'facilitated'],
    certifications: ['PMP', 'Scrum Master', 'PRINCE2', 'Agile Certified']
  },
  'data analyst': {
    industry: 'Data Science',
    keywords: ['SQL', 'Python', 'R', 'Excel', 'Tableau', 'Power BI', 'Statistics', 'Machine Learning', 'Data Visualization'],
    actionVerbs: ['analyzed', 'modeled', 'visualized', 'interpreted', 'forecasted', 'optimized'],
    certifications: ['Google Analytics', 'Microsoft Power BI', 'Tableau Certified']
  },
  'nurse': {
    industry: 'Healthcare',
    keywords: ['Patient Care', 'Clinical Assessment', 'Medication Administration', 'Electronic Health Records', 'BLS', 'ACLS'],
    actionVerbs: ['treated', 'administered', 'monitored', 'assessed', 'coordinated', 'documented'],
    certifications: ['RN License', 'BLS', 'ACLS', 'PALS']
  },
  'doctor': {
    industry: 'Healthcare',
    keywords: ['Clinical Diagnosis', 'Patient Treatment', 'Medical Procedures', 'Healthcare Protocols', 'EMR', 'Evidence-Based Medicine'],
    actionVerbs: ['diagnosed', 'treated', 'prescribed', 'performed', 'consulted', 'supervised'],
    certifications: ['MD', 'Board Certified', 'USMLE', 'Residency']
  },
  'marketing manager': {
    industry: 'Marketing',
    keywords: ['Digital Marketing', 'SEO', 'SEM', 'Social Media', 'Content Strategy', 'Analytics', 'Lead Generation', 'Brand Management'],
    actionVerbs: ['developed', 'executed', 'managed', 'increased', 'optimized', 'launched'],
    certifications: ['Google Ads', 'Facebook Blueprint', 'HubSpot', 'Google Analytics']
  }
};

// Career progression paths database
const CAREER_PROGRESSION_DATABASE = {
  'software engineer': {
    careerPaths: [
      {
        title: 'Technical Leadership Track',
        progression: [
          { level: 'Junior Software Engineer', yearsExperience: '0-2', skills: ['Basic programming', 'Version control', 'Testing'], salary: '$50,000-70,000' },
          { level: 'Software Engineer', yearsExperience: '2-5', skills: ['Full-stack development', 'System design', 'Code review'], salary: '$70,000-100,000' },
          { level: 'Senior Software Engineer', yearsExperience: '5-8', skills: ['Architecture design', 'Mentoring', 'Performance optimization'], salary: '$100,000-140,000' },
          { level: 'Principal Engineer', yearsExperience: '8-12', skills: ['Technical strategy', 'Cross-team collaboration', 'Innovation'], salary: '$140,000-200,000' },
          { level: 'Distinguished Engineer', yearsExperience: '12+', skills: ['Industry expertise', 'Technical vision', 'Thought leadership'], salary: '$200,000+' }
        ]
      },
      {
        title: 'Management Track',
        progression: [
          { level: 'Senior Software Engineer', yearsExperience: '5-8', skills: ['Technical leadership', 'Team collaboration', 'Project management'], salary: '$100,000-140,000' },
          { level: 'Engineering Manager', yearsExperience: '8-12', skills: ['People management', 'Strategic planning', 'Budget management'], salary: '$140,000-180,000' },
          { level: 'Senior Engineering Manager', yearsExperience: '12-15', skills: ['Multi-team leadership', 'Product strategy', 'Stakeholder management'], salary: '$180,000-250,000' },
          { level: 'Director of Engineering', yearsExperience: '15+', skills: ['Organizational leadership', 'Business strategy', 'Executive communication'], salary: '$250,000+' }
        ]
      }
    ],
    trending2025: ['AI/ML Integration', 'Cloud Native Development', 'DevSecOps', 'Kubernetes', 'Microservices', 'Edge Computing'],
    emergingCertifications: ['AWS Machine Learning', 'Google Cloud Professional ML Engineer', 'Kubernetes Administrator', 'Terraform Associate']
  },
  'data analyst': {
    careerPaths: [
      {
        title: 'Data Science Track',
        progression: [
          { level: 'Junior Data Analyst', yearsExperience: '0-2', skills: ['SQL', 'Excel', 'Basic statistics', 'Data visualization'], salary: '$45,000-65,000' },
          { level: 'Data Analyst', yearsExperience: '2-4', skills: ['Python/R', 'Advanced analytics', 'Business intelligence'], salary: '$65,000-85,000' },
          { level: 'Senior Data Analyst', yearsExperience: '4-7', skills: ['Machine learning', 'Statistical modeling', 'Data strategy'], salary: '$85,000-120,000' },
          { level: 'Data Scientist', yearsExperience: '7-10', skills: ['Advanced ML', 'Deep learning', 'A/B testing'], salary: '$120,000-160,000' },
          { level: 'Principal Data Scientist', yearsExperience: '10+', skills: ['Research leadership', 'Innovation', 'Cross-functional collaboration'], salary: '$160,000+' }
        ]
      }
    ],
    trending2025: ['Generative AI', 'MLOps', 'Real-time Analytics', 'Automated ML', 'Data Mesh', 'Ethical AI'],
    emergingCertifications: ['Google Cloud ML Engineer', 'AWS ML Specialty', 'Microsoft Azure AI Engineer', 'Databricks ML Associate']
  },
  'marketing manager': {
    careerPaths: [
      {
        title: 'Digital Marketing Leadership',
        progression: [
          { level: 'Marketing Coordinator', yearsExperience: '0-2', skills: ['Content creation', 'Social media', 'Campaign execution'], salary: '$35,000-50,000' },
          { level: 'Marketing Specialist', yearsExperience: '2-4', skills: ['Campaign management', 'Analytics', 'SEO/SEM'], salary: '$50,000-70,000' },
          { level: 'Marketing Manager', yearsExperience: '4-7', skills: ['Strategy development', 'Team leadership', 'Budget management'], salary: '$70,000-100,000' },
          { level: 'Senior Marketing Manager', yearsExperience: '7-10', skills: ['Multi-channel strategy', 'ROI optimization', 'Brand management'], salary: '$100,000-130,000' },
          { level: 'Marketing Director', yearsExperience: '10+', skills: ['Strategic planning', 'Executive communication', 'Market expansion'], salary: '$130,000+' }
        ]
      }
    ],
    trending2025: ['AI-Powered Marketing', 'Privacy-First Marketing', 'Voice Search Optimization', 'Influencer Marketing', 'Marketing Automation', 'Customer Data Platforms'],
    emergingCertifications: ['Google AI for Marketing', 'HubSpot Growth-Driven Design', 'Facebook Blueprint Advanced', 'Salesforce Marketing Cloud']
  }
};

// Industry trends for 2025
const INDUSTRY_TRENDS_2025 = {
  'IT': {
    hotSkills: ['Artificial Intelligence', 'Machine Learning', 'Cloud Computing', 'Cybersecurity', 'DevOps', 'Kubernetes', 'Edge Computing'],
    emergingRoles: ['AI Engineer', 'Cloud Architect', 'DevSecOps Engineer', 'Data Engineer', 'ML Engineer'],
    salaryGrowth: '12%',
    jobGrowth: '15%',
    lastUpdated: new Date().toISOString()
  },
  'Healthcare': {
    hotSkills: ['Telemedicine', 'Health Informatics', 'Digital Health', 'AI Diagnostics', 'Remote Patient Monitoring'],
    emergingRoles: ['Clinical Data Analyst', 'Telehealth Coordinator', 'Health Technology Specialist'],
    salaryGrowth: '8%',
    jobGrowth: '10%',
    lastUpdated: new Date().toISOString()
  },
  'Marketing': {
    hotSkills: ['Marketing Automation', 'Data Analytics', 'AI-Powered Marketing', 'Customer Experience', 'Privacy Compliance'],
    emergingRoles: ['Growth Hacker', 'Marketing Technologist', 'Customer Success Manager', 'Brand Experience Designer'],
    salaryGrowth: '10%',
    jobGrowth: '8%',
    lastUpdated: new Date().toISOString()
  },
  'Finance': {
    hotSkills: ['FinTech', 'Blockchain', 'Cryptocurrency', 'Regulatory Technology', 'Financial Analytics', 'Risk Management'],
    emergingRoles: ['FinTech Developer', 'Blockchain Analyst', 'Compliance Technology Specialist'],
    salaryGrowth: '9%',
    jobGrowth: '6%',
    lastUpdated: new Date().toISOString()
  }
};

// ATS-Optimized Template Database
const ATS_TEMPLATE_DATABASE = {
  'reverse-chrono': {
    id: 'reverse-chrono',
    name: 'Professional Reverse Chronological',
    industry: 'Corporate',
    layoutStyle: 'Traditional',
    atsScore: 98,
    experienceLevel: ['entry-level', 'mid-level', 'senior'],
    description: 'Classic ATS-friendly format perfect for traditional industries and corporate roles',
    features: ['Clean layout', 'ATS-optimized', 'Traditional format', 'Corporate-friendly'],
    previewUrl: '/assets/templates/reverse-chrono-preview.png',
    targetRoles: ['manager', 'analyst', 'coordinator', 'specialist'],
    colorScheme: 'professional',
    sections: ['header', 'summary', 'experience', 'education', 'skills'],
    ranking: 95
  },
  'modern-sidebar': {
    id: 'modern-sidebar',
    name: 'Modern Sidebar Professional',
    industry: 'IT',
    layoutStyle: 'Sidebar',
    atsScore: 95,
    experienceLevel: ['mid-level', 'senior'],
    description: 'Modern design with sidebar for skills and contact info, perfect for tech roles',
    features: ['Modern design', 'Sidebar layout', 'Color accents', 'Tech-focused'],
    previewUrl: '/assets/templates/modern-sidebar-preview.png',
    targetRoles: ['developer', 'engineer', 'designer', 'architect'],
    colorScheme: 'modern',
    sections: ['sidebar', 'main-content', 'skills-highlight', 'projects'],
    ranking: 90
  },
  'professional-clean': {
    id: 'professional-clean',
    name: 'Clean Minimal Professional',
    industry: 'Finance',
    layoutStyle: 'Minimal',
    atsScore: 97,
    experienceLevel: ['entry-level', 'mid-level', 'senior', 'executive'],
    description: 'Ultra-clean design optimized for finance, consulting, and executive roles',
    features: ['Minimal design', 'Maximum ATS compatibility', 'Executive-ready', 'Clean typography'],
    previewUrl: '/assets/templates/professional-clean-preview.png',
    targetRoles: ['executive', 'consultant', 'financial analyst', 'advisor'],
    colorScheme: 'minimal',
    sections: ['header', 'executive-summary', 'core-competencies', 'experience'],
    ranking: 92
  },
  'jobfit-pro': {
    id: 'jobfit-pro',
    name: 'JobFit Pro - ATS Optimized',
    industry: 'General',
    layoutStyle: 'Adaptive',
    atsScore: 99,
    experienceLevel: ['entry-level', 'mid-level', 'senior'],
    description: 'AI-optimized template that adapts to any job role with maximum ATS compatibility',
    features: ['AI-optimized', 'Role-adaptive', 'Maximum ATS score', 'Industry-flexible'],
    previewUrl: '/assets/templates/jobfit-pro-preview.png',
    targetRoles: ['any'],
    colorScheme: 'adaptive',
    sections: ['dynamic-header', 'targeted-summary', 'keyword-optimized-experience', 'relevant-skills'],
    ranking: 98
  },
  'proprofile': {
    id: 'proprofile',
    name: 'ProProfile Executive',
    industry: 'Executive',
    layoutStyle: 'Executive',
    atsScore: 94,
    experienceLevel: ['senior', 'executive'],
    description: 'Premium executive template for C-level and senior leadership positions',
    features: ['Executive styling', 'Leadership focus', 'Achievement highlights', 'Premium design'],
    previewUrl: '/assets/templates/proprofile-preview.png',
    targetRoles: ['director', 'vp', 'ceo', 'cto', 'cfo'],
    colorScheme: 'executive',
    sections: ['executive-profile', 'leadership-summary', 'achievements', 'experience'],
    ranking: 85
  },
  'healthcare-pro': {
    id: 'healthcare-pro',
    name: 'Healthcare Professional',
    industry: 'Healthcare',
    layoutStyle: 'Medical',
    atsScore: 96,
    experienceLevel: ['entry-level', 'mid-level', 'senior'],
    description: 'Specialized template for healthcare professionals with medical terminology focus',
    features: ['Medical-focused', 'Certification highlights', 'Clinical experience', 'Healthcare-optimized'],
    previewUrl: '/assets/templates/healthcare-pro-preview.png',
    targetRoles: ['nurse', 'doctor', 'therapist', 'technician'],
    colorScheme: 'healthcare',
    sections: ['medical-header', 'certifications', 'clinical-experience', 'education'],
    ranking: 88
  }
};

/**
 * Generic function to generate content using Gemini AI
 * @param {string} prompt - The prompt to send to Gemini
 * @param {object} options - Additional options like temperature, candidate count, etc.
 * @returns {Promise<string>} - The generated content
 */
async function generateContent(prompt, options = {}) {
  const maxRetries = 3;
  const baseDelay = 2000; // 2 seconds base delay
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Generate cache key based on prompt and options
      const cacheKey = `${prompt}-${JSON.stringify(options)}`;

      // Check if we have a cached response (skip if skipCache is true)
      if (!options.skipCache) {
        const cachedResponse = responseCache.get(cacheKey);
        if (cachedResponse) {
          console.log('Using cached Gemini AI response');
          return cachedResponse;
        }
      }

      // Set default options
      const generationConfig = {
        temperature: options.temperature || 0.7,
        topK: options.topK || 40,
        topP: options.topP || 0.95,
        maxOutputTokens: options.maxOutputTokens || 1024,
      };

      console.log(`🤖 Attempting Gemini API call (attempt ${attempt}/${maxRetries})...`);

      // Generate content
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig,
      });

      const response = result.response;
      const text = response.text();

      // Cache the response only if skipCache is not true
      if (!options.skipCache) {
        responseCache.set(cacheKey, text);
      }

      console.log('✅ Gemini API call successful!');
      return text;
      
    } catch (error) {
      console.error(`❌ Gemini API attempt ${attempt} failed:`, error.message);
      
      // Check for quota exceeded error
      if (error.message.includes('429') || error.message.includes('quota') || error.message.includes('Too Many Requests')) {
        console.log('⚠️ Daily quota exceeded. Using fallback response.');
        return generateFallbackResponse(prompt, options);
      }
      
      // Check if it's a 503 overload error
      if (error.message.includes('503') || error.message.includes('overloaded')) {
        if (attempt < maxRetries) {
          const delay = baseDelay * Math.pow(2, attempt - 1); // Exponential backoff
          console.log(`⏳ API overloaded. Retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        } else {
          // Return a fallback response for overload
          console.log('🔄 Returning fallback response due to API overload');
          return generateFallbackResponse(prompt, options);
        }
      }
      
      // For other errors, throw immediately
      if (attempt === maxRetries) {
        throw new Error('Failed to generate content with AI after multiple attempts');
      }
    }
  }
}

/**
 * Generate fallback response when Gemini API is overloaded
 * @param {string} prompt - The original prompt
 * @param {object} options - Generation options
 * @returns {string} - Fallback response
 */
function generateFallbackResponse(prompt, options) {
  console.log('🔄 Generating fallback response for quota exceeded scenario');
  
  // Simple fallback responses based on prompt content
  if (prompt.toLowerCase().includes('summary') || prompt.toLowerCase().includes('professional')) {
    return "Experienced professional with strong background in the field. Demonstrated ability to deliver results and contribute to team success. Seeking opportunities to apply skills and expertise in a challenging role that promotes growth and innovation.";
  }
  
  if (prompt.toLowerCase().includes('experience') || prompt.toLowerCase().includes('job')) {
    return "Enhanced role responsibilities and improved team productivity through effective collaboration and problem-solving skills. Successfully delivered projects on time and within budget while maintaining high quality standards.";
  }
  
  if (prompt.toLowerCase().includes('optimize') || prompt.toLowerCase().includes('ats')) {
    return JSON.stringify({
      status: "fallback_mode",
      message: "AI service temporarily unavailable. Using cached optimization suggestions.",
      suggestedKeywords: ["professional", "experienced", "skilled", "results-driven", "team player", "analytical", "detail-oriented"],
      contentSuggestions: {
        summary: "Add more specific achievements and quantifiable results to strengthen your professional summary",
        experience: "Include action verbs and measurable outcomes in your work experience descriptions",
        skills: "Ensure your skills section includes both technical and soft skills relevant to your target role"
      },
      skillsToAdd: ["Communication", "Problem-solving", "Team collaboration", "Project management", "Time management"],
      optimizationScore: 75,
      improvementAreas: [
        "Add more specific metrics and percentages to quantify achievements",
        "Include relevant industry keywords",
        "Use action verbs to start bullet points",
        "Ensure consistent formatting throughout"
      ],
      fallbackMode: true
    });
  }
  
  if (prompt.toLowerCase().includes('analysis') || prompt.toLowerCase().includes('analyze')) {
    return JSON.stringify({
      status: "fallback_mode",
      atsScore: 75,
      keywordMatch: 60,
      recommendations: [
        "Service temporarily unavailable. Basic analysis provided.",
        "Consider adding more relevant keywords for your target position",
        "Ensure your resume follows standard formatting guidelines"
      ],
      fallbackMode: true
    });
  }
  
  return "Professional with relevant experience and skills. Ready to contribute to organizational success through dedication and expertise.";
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
        suggestedKeywords: ['communication', 'leadership', 'problem-solving'],
        contentSuggestions: {
          summary: 'Consider adding more quantifiable achievements',
        },
        skillsToAdd: ['teamwork', 'project management'],
        optimizationScore: 70,
        improvementAreas: ['Add more keywords relevant to the job description'],
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
 * @param {string} resumeType - The type of resume (technical, medical, diploma, non-technical, general)
 * @returns {Promise<string>} - Generated professional summary
 */

/**
 * Enhanced ATS Analysis with comprehensive scoring
 * @param {object} resumeData - The user's resume data
 * @param {string} jobDescription - Optional job description for targeted analysis
 * @returns {Promise<object>} - Comprehensive ATS analysis
 */
async function generateEnhancedATSAnalysis(resumeData, jobDescription = null) {
  try {
    console.log('Starting enhanced ATS analysis...');
    
    // Step 1: Detect job role and industry
    const roleInfo = detectJobRoleAndIndustry(resumeData);
    console.log('Detected role info:', roleInfo);
    
    // Step 2: Parse job description if provided
    let jobRequirements = null;
    if (jobDescription) {
      jobRequirements = await parseJobDescription(jobDescription);
    }
    
    // Step 3: Comprehensive keyword analysis
    const keywordAnalysis = performEnhancedKeywordAnalysis(resumeData, roleInfo, jobRequirements);
    
    // Step 4: Formatting compliance check
    const formattingScore = checkFormattingCompliance(resumeData);
    
    // Step 5: Grammar and readability analysis
    const contentQuality = analyzeContentQuality(resumeData);
    
    // Step 6: Keyword density and placement
    const keywordPlacement = analyzeKeywordPlacement(resumeData, keywordAnalysis.matchedKeywords);
    
    // Step 7: Calculate comprehensive ATS score
    const atsScore = calculateComprehensiveATSScore({
      keywordAnalysis,
      formattingScore,
      contentQuality,
      keywordPlacement,
      jobDescription: !!jobDescription
    });
    
    // Step 8: Generate actionable suggestions
    const suggestions = generateActionableSuggestions({
      roleInfo,
      keywordAnalysis,
      formattingScore,
      contentQuality,
      keywordPlacement,
      jobRequirements
    });
    
    const result = {
      detectedRole: roleInfo.detectedRole,
      industry: roleInfo.industry,
      atsScore: {
        totalScore: atsScore.total,
        rating: getATSRating(atsScore.total),
        breakdown: {
          keywordMatch: atsScore.keywordScore,
          formatting: atsScore.formattingScore,
          contentQuality: atsScore.contentScore,
          keywordPlacement: atsScore.placementScore,
          industryAlignment: atsScore.industryScore
        }
      },
      keywordsFound: keywordAnalysis.matchedKeywords,
      missingKeywords: keywordAnalysis.missingKeywords,
      formattingIssues: formattingScore.issues,
      suggestions: suggestions,
      jobMatch: jobRequirements ? calculateJobMatchPercentage(resumeData, jobRequirements) : null
    };
    // Diagnostic: if total is 0, log intermediate parts to help debugging
    if (typeof atsScore.total === 'number' && atsScore.total === 0) {
      console.warn('🔍 ATS total score is 0 — diagnostic details:');
      console.warn('keywordAnalysis:', JSON.stringify(keywordAnalysis, null, 2));
      console.warn('formattingScore:', JSON.stringify(formattingScore, null, 2));
      console.warn('contentQuality:', JSON.stringify(contentQuality, null, 2));
      console.warn('keywordPlacement:', JSON.stringify(keywordPlacement, null, 2));
      console.warn('computedScores:', JSON.stringify(atsScore, null, 2));
    }

    console.log('Enhanced ATS analysis completed:', result);
    return result;
    
  } catch (error) {
    console.error('Error in enhanced ATS analysis:', error);
    return {
      detectedRole: 'general',
      industry: 'General',
      atsScore: {
        totalScore: 0,
        rating: 'Poor',
        breakdown: {
          keywordMatch: 0,
          formatting: 0,
          contentQuality: 0,
          keywordPlacement: 0,
          industryAlignment: 0
        }
      },
      keywordsFound: [],
      missingKeywords: [],
      formattingIssues: ['Analysis failed - please try again'],
      suggestions: ['Unable to generate suggestions at this time'],
      jobMatch: null,
      error: error.message
    };
  }
}

/**
 * Detect job role and industry from resume data
 */
function detectJobRoleAndIndustry(resumeData) {
  // Extract job roles from experience
  const roles = [];
  if (resumeData.experience && Array.isArray(resumeData.experience)) {
    resumeData.experience.forEach(exp => {
      if (exp.role || exp.position) {
        roles.push((exp.role || exp.position).toLowerCase());
      }
    });
  }

  // Extract from current title if available
  if (resumeData.title) {
    roles.push(resumeData.title.toLowerCase());
  }

  // Detect primary role based on keywords
  let detectedRole = 'general';
  let detectedIndustry = 'General';
  
  for (const [role, data] of Object.entries(ATS_KEYWORD_DATABASE)) {
    for (const userRole of roles) {
      if (userRole.includes(role.split(' ')[0]) || role.includes(userRole.split(' ')[0])) {
        detectedRole = role;
        detectedIndustry = data.industry;
        break;
      }
    }
    if (detectedRole !== 'general') break;
  }

  return {
    // Provide both `detectedRole` and `role` for backward compatibility
    detectedRole: detectedRole,
    role: detectedRole,
    industry: detectedIndustry,
    keywords: ATS_KEYWORD_DATABASE[detectedRole]?.keywords || [],
    actionVerbs: ATS_KEYWORD_DATABASE[detectedRole]?.actionVerbs || [],
    certifications: ATS_KEYWORD_DATABASE[detectedRole]?.certifications || []
  };
}

/**
 * Analyze job titles from resume to determine role
 */
function analyzeJobTitleForTemplates(resumeData) {
  const jobTitles = [];
  
  // Extract job titles from experience
  if (resumeData.experience && Array.isArray(resumeData.experience)) {
    resumeData.experience.forEach(exp => {
      if (exp.position) {
        jobTitles.push(exp.position.toLowerCase());
      }
    });
  }
  
  // Match against keyword database
  let detectedRole = 'general';
  let industryKeywords = [];
  let actionVerbs = [];
  let certifications = [];
  
  for (const title of jobTitles) {
    for (const [role, data] of Object.entries(ATS_KEYWORD_DATABASE)) {
      if (title.includes(role) || role.includes(title.split(' ')[0])) {
        detectedRole = role;
        industryKeywords = data.keywords;
        actionVerbs = data.actionVerbs;
        certifications = data.certifications;
        break;
      }
    }
    if (detectedRole !== 'general') break;
  }
  
  return {
    detectedRole,
    industry: ATS_KEYWORD_DATABASE[detectedRole]?.industry || 'General',
    keywords: industryKeywords,
    actionVerbs,
    certifications
  };
}

/**
 * Parse job description to extract requirements
 */
async function parseJobDescription(jobDescription) {
  try {
    const prompt = `
    Analyze this job description and extract key requirements:
    
    ${jobDescription}
    
    Extract and return in JSON format:
    {
      "requiredSkills": ["skill1", "skill2"],
      "preferredSkills": ["skill1", "skill2"], 
      "requiredExperience": "X years",
      "education": "degree requirements",
      "certifications": ["cert1", "cert2"],
      "responsibilities": ["responsibility1", "responsibility2"]
    }
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch (error) {
    console.error('Error parsing job description:', error);
    return null;
  }
}

/**
 * Enhanced keyword analysis with density and placement
 */
function performEnhancedKeywordAnalysis(resumeData, roleInfo, jobRequirements) {
  const resumeText = JSON.stringify(resumeData).toLowerCase();
  const matchedKeywords = [];
  const missingKeywords = [];
  const keywordDensity = {};
  
  // Analyze role-specific keywords
  const allKeywords = [
    ...roleInfo.keywords,
    ...roleInfo.actionVerbs,
    ...roleInfo.certifications,
    ...(jobRequirements?.requiredSkills || []),
    ...(jobRequirements?.preferredSkills || [])
  ];
  
  allKeywords.forEach(keyword => {
    const regex = new RegExp(keyword.toLowerCase(), 'gi');
    const matches = resumeText.match(regex);
    const count = matches ? matches.length : 0;
    
    if (count > 0) {
      matchedKeywords.push(keyword);
      keywordDensity[keyword] = count;
    } else {
      missingKeywords.push(keyword);
    }
  });
  
  return {
    matchedKeywords: matchedKeywords.slice(0, 15),
    missingKeywords: missingKeywords.slice(0, 10),
    keywordDensity,
    totalKeywords: allKeywords.length,
    // Avoid division by zero when there are no keywords to check
    matchRate: allKeywords.length > 0 ? matchedKeywords.length / allKeywords.length : 0
  };
}

/**
 * Check formatting compliance for ATS systems
 */
function checkFormattingCompliance(resumeData) {
  const issues = [];
  let score = 100;
  
  // Check for proper section structure
  const requiredSections = ['name', 'email', 'experience', 'education', 'skills'];
  const missingSections = requiredSections.filter(section => !resumeData[section] || resumeData[section] === '');
  
  if (missingSections.length > 0) {
    issues.push(`Missing required sections: ${missingSections.join(', ')}`);
    score -= missingSections.length * 15;
  }
  
  // Check experience format
  if (resumeData.experience && Array.isArray(resumeData.experience)) {
    resumeData.experience.forEach((exp, index) => {
      if (!exp.role || !exp.company) {
        issues.push(`Experience entry ${index + 1} missing role or company`);
        score -= 10;
      }
    });
  }
  
  // Check for excessive formatting (tables, images)
  const resumeString = JSON.stringify(resumeData);
  if (resumeString.includes('<table>') || resumeString.includes('<img>')) {
    issues.push('Avoid tables and images in resume content');
    score -= 20;
  }
  
  return {
    score: Math.max(0, score),
    issues,
    compliant: score >= 80
  };
}

/**
 * Analyze content quality and readability
 */
function analyzeContentQuality(resumeData) {
  let score = 100;
  const issues = [];
  
  // Check summary length and quality
  if (resumeData.summary) {
    const summaryWords = resumeData.summary.split(' ').length;
    if (summaryWords < 20) {
      issues.push('Summary too short - should be 20-50 words');
      score -= 15;
    } else if (summaryWords > 80) {
      issues.push('Summary too long - should be 20-50 words');
      score -= 10;
    }
  } else {
    issues.push('Missing professional summary');
    score -= 25;
  }
  
  // Check for action verbs in experience
  if (resumeData.experience && Array.isArray(resumeData.experience)) {
    const actionVerbs = ['developed', 'implemented', 'managed', 'led', 'created', 'designed', 'optimized'];
    let hasActionVerbs = false;
    
    resumeData.experience.forEach(exp => {
      if (exp.description) {
        const hasVerb = actionVerbs.some(verb => exp.description.toLowerCase().includes(verb));
        if (hasVerb) hasActionVerbs = true;
      }
    });
    
    if (!hasActionVerbs) {
      issues.push('Use more action verbs in experience descriptions');
      score -= 15;
    }
  }
  
  return {
    score: Math.max(0, score),
    issues,
    readabilityGrade: score >= 80 ? 'Good' : score >= 60 ? 'Fair' : 'Poor'
  };
}

/**
 * Analyze keyword placement in critical sections
 */
function analyzeKeywordPlacement(resumeData, matchedKeywords) {
  const placement = {
    summary: 0,
    skills: 0,
    experience: 0
  };
  
  // Check summary
  if (resumeData.summary) {
    matchedKeywords.forEach(keyword => {
      if (resumeData.summary.toLowerCase().includes(keyword.toLowerCase())) {
        placement.summary++;
      }
    });
  }
  
  // Check skills section
  const skillsText = `${resumeData.skills || ''} ${resumeData.technicalSkills || ''}`.toLowerCase();
  matchedKeywords.forEach(keyword => {
    if (skillsText.includes(keyword.toLowerCase())) {
      placement.skills++;
    }
  });
  
  // Check experience
  if (resumeData.experience && Array.isArray(resumeData.experience)) {
    const experienceText = resumeData.experience.map(exp => exp.description || '').join(' ').toLowerCase();
    matchedKeywords.forEach(keyword => {
      if (experienceText.includes(keyword.toLowerCase())) {
        placement.experience++;
      }
    });
  }
  
  const totalPlacement = placement.summary + placement.skills + placement.experience;
  // Avoid division by zero when there are no matched keywords
  const placementScore = matchedKeywords.length > 0 ? Math.min(100, (totalPlacement / matchedKeywords.length) * 100) : 0;

  return {
    placement,
    score: placementScore,
    recommendations: generatePlacementRecommendations(placement, matchedKeywords.length || 0)
  };
}

/**
 * Calculate comprehensive ATS score
 */
function calculateComprehensiveATSScore(analysis) {
  const weights = {
    keyword: 0.35,      // 35% - Most important
    formatting: 0.20,   // 20% - Critical for parsing
    content: 0.20,      // 20% - Quality matters
    placement: 0.15,    // 15% - Strategic placement
    industry: 0.10      // 10% - Industry alignment
  };
  
  const scores = {
    keywordScore: Math.round(analysis.keywordAnalysis.matchRate * 100),
    formattingScore: analysis.formattingScore.score,
    contentScore: analysis.contentQuality.score,
    placementScore: analysis.keywordPlacement.score,
    industryScore: analysis.jobDescription ? 85 : 70  // Bonus for job description analysis
  };
  
  const total = Math.round(
    scores.keywordScore * weights.keyword +
    scores.formattingScore * weights.formatting +
    scores.contentScore * weights.content +
    scores.placementScore * weights.placement +
    scores.industryScore * weights.industry
  );
  
  return {
    total: Math.min(100, total),
    ...scores
  };
}

/**
 * Convert a numeric ATS score (0-100) into a human-friendly rating string
 * @param {number} score
 * @returns {string} One of 'Excellent', 'Good', 'Fair', 'Poor'
 */
function getATSRating(score) {
  // Ensure numeric
  const s = typeof score === 'number' ? score : Number(score) || 0;

  if (s >= 80) return 'Excellent';
  if (s >= 60) return 'Good';
  if (s >= 40) return 'Fair';
  return 'Poor';
}

/**
 * Generate actionable improvement suggestions
 */
function generateActionableSuggestions(analysis) {
  const suggestions = [];
  
  // Keyword suggestions
  if (analysis.keywordAnalysis.matchRate < 0.6) {
    suggestions.push(`Add ${analysis.keywordAnalysis.missingKeywords.slice(0, 3).join(', ')} to improve keyword match by +${Math.round((0.6 - analysis.keywordAnalysis.matchRate) * 100)}%`);
  }
  
  // Formatting suggestions
  if (analysis.formattingScore.score < 80) {
    analysis.formattingScore.issues.forEach(issue => {
      suggestions.push(`Formatting: ${issue}`);
    });
  }
  
  // Content quality suggestions
  if (analysis.contentQuality.score < 80) {
    analysis.contentQuality.issues.forEach(issue => {
      suggestions.push(`Content: ${issue}`);
    });
  }
  
  // Placement suggestions
  if (analysis.keywordPlacement.score < 70) {
    suggestions.push('Include more keywords in your summary and skills sections');
    suggestions.push('Use relevant keywords in experience descriptions');
  }
  
  return suggestions.slice(0, 8); // Limit to top 8 suggestions
}

/**
 * Generate placement recommendations
 */
function generatePlacementRecommendations(placement, totalKeywords) {
  const recommendations = [];
  
  if (placement.summary < totalKeywords * 0.3) {
    recommendations.push('Include more keywords in your professional summary');
  }
  
  if (placement.skills < totalKeywords * 0.5) {
    recommendations.push('Add relevant keywords to your skills section');
  }
  
  if (placement.experience < totalKeywords * 0.4) {
    recommendations.push('Incorporate keywords naturally in experience descriptions');
  }
  
  return recommendations;
}

/**
 * Calculate job match percentage
 */
function calculateJobMatchPercentage(resumeData, jobRequirements) {
  if (!jobRequirements) return null;
  
  let matchScore = 0;
  let totalCriteria = 0;
  
  // Check required skills
  if (jobRequirements.requiredSkills) {
    const resumeText = JSON.stringify(resumeData).toLowerCase();
    jobRequirements.requiredSkills.forEach(skill => {
      totalCriteria++;
      if (resumeText.includes(skill.toLowerCase())) {
        matchScore++;
      }
    });
  }
  
  // If there were no criteria to evaluate, return null to indicate not applicable
  if (totalCriteria === 0) return null;
  return Math.round((matchScore / totalCriteria) * 100);
}

/**
 * Search ATS-optimized templates using AI analysis
 * @param {object} searchParams - Search parameters (jobTitle, industry, experienceLevel)
 * @returns {Promise<Array>} - Array of recommended templates
 */
async function searchATSTemplates(searchParams) {
  try {
    const { jobTitle, industry, experienceLevel } = searchParams;
    console.log('Searching templates for:', searchParams);
    
    // Step 1: Analyze job title using AI
    const jobAnalysis = await analyzeJobTitleForTemplates(jobTitle);
    
    // Step 2: Get templates from local database
    const localTemplates = Object.values(ATS_TEMPLATE_DATABASE);
    
    // Step 3: Get templates from Google search (if enabled)
    let googleTemplates = [];
    try {
      googleTemplates = await googleSearchService.searchResumeTemplates(
        jobTitle, 
        industry, 
        experienceLevel
      );
      console.log(`Found ${googleTemplates.length} templates from Google`);
    } catch (error) {
      console.error('Google search failed, using local templates only:', error);
    }
    
    // Step 4: Combine local and Google templates
    const allTemplates = [...localTemplates, ...googleTemplates];
    
    // Step 5: Score and rank templates
    const rankedTemplates = allTemplates.map(template => {
      let score = 0;
      
      // Ensure template has ATS score (fallback to reasonable defaults)
      if (!template.atsScore) {
        console.log(`Template ${template.name} missing ATS score, setting default`);
        template.atsScore = 85; // Default ATS score
      }
      
      // Industry match (30% weight)
      if (template.industry && (
        template.industry.toLowerCase() === industry.toLowerCase() || 
        template.industry === 'General' || 
        industry === 'general'
      )) {
        score += 30;
      }
      
      // Experience level match (20% weight)
      if (template.experienceLevel && template.experienceLevel.includes(experienceLevel)) {
        score += 20;
      }
      
      // Target roles match (25% weight)
      if (template.targetRoles) {
        const jobTitleLower = jobTitle.toLowerCase();
        const roleMatch = template.targetRoles.some(role => 
          jobTitleLower.includes(role) || role === 'any'
        );
        if (roleMatch) {
          score += 25;
        }
      }
      
      // ATS Score influence (15% weight)
      if (template.atsScore) {
        score += (template.atsScore / 100) * 15;
      }
      
      // Source preference (10% weight)
      if (template.source === 'Google Search') {
        score += 8; // Slight preference for fresh Google results
      } else {
        score += 10; // Local templates are tested
      }
      
      // AI analysis bonus
      if (jobAnalysis && jobAnalysis.recommendedStyles) {
        if (template.layoutStyle && jobAnalysis.recommendedStyles.includes(template.layoutStyle.toLowerCase())) {
          score += 15;
        }
      }
      
      // Keyword matching bonus
      const templateText = `${template.name} ${template.description || ''}`.toLowerCase();
      const jobKeywords = jobTitle.toLowerCase().split(' ');
      jobKeywords.forEach(keyword => {
        if (templateText.includes(keyword)) {
          score += 3;
        }
      });
      
      return {
        ...template,
        relevanceScore: Math.round(score),
        aiRecommendation: score > 80 ? 'Highly Recommended' : 
                         score > 60 ? 'Recommended' : 
                         score > 40 ? 'Consider' : 'Alternative Option'
      };
    });
    
    // Step 6: Sort by relevance score and return top 8
    const topTemplates = rankedTemplates
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 8);
    
    console.log(`Template search completed: ${topTemplates.length} templates ranked`);
    return topTemplates;
    
  } catch (error) {
    console.error('Error searching templates:', error);
    
    // Fallback: return top local templates
    const fallbackTemplates = Object.values(ATS_TEMPLATE_DATABASE)
      .sort((a, b) => b.atsScore - a.atsScore)
      .slice(0, 4)
      .map(template => ({
        ...template,
        relevanceScore: template.atsScore,
        aiRecommendation: 'Fallback Recommendation'
      }));
    
    return fallbackTemplates;
  }
}

/**
 * Analyze job title using Gemini AI for template recommendations
 */
async function analyzeJobTitleForTemplates(jobTitle) {
  try {
    const prompt = `
    Analyze this job title and recommend template styles:
    
    Job Title: "${jobTitle}"
    
    Based on this job title, recommend:
    1. Industry category (IT, Healthcare, Finance, Marketing, General)
    2. Template layout styles (Traditional, Sidebar, Minimal, Executive, Adaptive)
    3. Key design elements that would appeal to recruiters in this field
    
    Return as JSON:
    {
      "industry": "category",
      "recommendedStyles": ["style1", "style2"],
      "designElements": ["element1", "element2"],
      "formalityLevel": "formal|semi-formal|creative"
    }
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch (error) {
    console.error('Error analyzing job title for templates:', error);
    return null;
  }
}

/**
 * Step 2-4: Perform keyword analysis and gap detection
 * @param {object} resumeData - Resume data
 * @param {object} roleInfo - Detected role information
 * @returns {object} - Keyword analysis results
 */
function performKeywordAnalysis(resumeData, roleInfo) {
  const resumeText = JSON.stringify(resumeData).toLowerCase();
  const matchedKeywords = [];
  const missingKeywords = [];
  
  // Check which keywords are present
  roleInfo.keywords.forEach(keyword => {
    if (resumeText.includes(keyword.toLowerCase())) {
      matchedKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  });
  
  // Avoid division by zero if there are no role-specific keywords
  const totalKeywords = Array.isArray(roleInfo.keywords) ? roleInfo.keywords.length : 0;
  const keywordMatchRate = totalKeywords > 0 ? (matchedKeywords.length / totalKeywords) * 100 : 0;

  return {
    matchedKeywords,
    missingKeywords,
    keywordMatchRate: Math.round(keywordMatchRate),
    totalKeywords: totalKeywords
  };
}

/**
 * Step 6: Calculate ATS score (0-100%)
 * @param {object} resumeData - Resume data
 * @param {object} keywordAnalysis - Keyword analysis results
 * @returns {object} - ATS score breakdown
 */
function calculateATSScore(resumeData, keywordAnalysis) {
  let score = 0;
  const breakdown = {};
  
  // Keyword Match Rate (40 points max)
  const keywordScore = Math.round((keywordAnalysis.keywordMatchRate / 100) * 40);
  score += keywordScore;
  breakdown.keywords = `${keywordScore}/40`;
  
  // Formatting (20 points max)
  let formatScore = 20; // Assume good formatting by default
  breakdown.formatting = `${formatScore}/20`;
  score += formatScore;
  
  // Summary Present (10 points)
  const summaryScore = resumeData.summary ? 10 : 0;
  score += summaryScore;
  breakdown.summary = `${summaryScore}/10`;
  
  // Skills Section (10 points)
  const skillsScore = (resumeData.skills && resumeData.skills.length > 0) ? 10 : 0;
  score += skillsScore;
  breakdown.skills = `${skillsScore}/10`;
  
  // Experience Section (10 points)
  const experienceScore = (resumeData.experience && resumeData.experience.length > 0) ? 10 : 0;
  score += experienceScore;
  breakdown.experience = `${experienceScore}/10`;
  
  // Education Section (10 points)
  const educationScore = (resumeData.education && resumeData.education.length > 0) ? 10 : 0;
  score += educationScore;
  breakdown.education = `${educationScore}/10`;
  
  let rating = 'Poor';
  if (score >= 80) rating = 'Excellent';
  else if (score >= 60) rating = 'Good';
  else if (score >= 40) rating = 'Fair';
  
  return {
    totalScore: score,
    rating,
    breakdown
  };
}

async function generateSummary(resumeData, resumeType = 'general') {
  try {
    // 🔧 Step 1: Job Role & Industry Type Detection
    const roleInfo = detectJobRoleAndIndustry(resumeData);
    console.log('🎯 Detected Role:', roleInfo.detectedRole, 'Industry:', roleInfo.industry);
    
    // 🔧 Step 2-4: Keyword Analysis & Gap Detection
    const keywordAnalysis = performKeywordAnalysis(resumeData, roleInfo);
    console.log('📊 Keyword Match Rate:', keywordAnalysis.keywordMatchRate + '%');
    
    // 🔧 Step 6: ATS Score Calculation
    const atsScore = calculateATSScore(resumeData, keywordAnalysis);
    console.log('⭐ ATS Score:', atsScore.totalScore + '/100', '(' + atsScore.rating + ')');
    
    // Define type-specific prompt templates with enhanced ATS optimization
    const typePrompts = {
      technical: `
        Create a professional, ATS-optimized resume summary for a TECHNICAL/IT professional.
        
        🎯 DETECTED ROLE: ${roleInfo.detectedRole}
        📊 CURRENT ATS SCORE: ${atsScore.totalScore}/100 (${atsScore.rating})
        
        REQUIRED ATS KEYWORDS TO INCLUDE: ${roleInfo.keywords.join(', ')}
        MISSING KEYWORDS TO ADD: ${keywordAnalysis.missingKeywords.slice(0, 5).join(', ')}
        RECOMMENDED ACTION VERBS: ${roleInfo.actionVerbs.join(', ')}
        
        MUST INCLUDE:
        - Technical skills and programming languages (use exact keywords above)
        - Software development experience with specific technologies
        - Quantifiable achievements with numbers and metrics
        - Industry-standard technical keywords for ATS scanning
        - Action verbs that boost ATS ranking
        
        ATS OPTIMIZATION REQUIREMENTS:
        - Use standard technical job titles and certifications: ${roleInfo.certifications.join(', ')}
        - Include relevant programming languages, tools, and methodologies
        - Use action verbs like: ${roleInfo.actionVerbs.join(', ')}
        - Include metrics and quantifiable achievements where possible
        - Ensure keyword density matches target job descriptions
        
        The summary should be 3-4 sentences, ATS-optimized for 80+ score, and keyword-rich.
      `,
      medical: `
        Create a professional, ATS-optimized resume summary for a MEDICAL/HEALTHCARE professional.
        
        🎯 DETECTED ROLE: ${roleInfo.detectedRole}
        📊 CURRENT ATS SCORE: ${atsScore.totalScore}/100 (${atsScore.rating})
        
        REQUIRED ATS KEYWORDS TO INCLUDE: ${roleInfo.keywords.join(', ')}
        MISSING KEYWORDS TO ADD: ${keywordAnalysis.missingKeywords.slice(0, 5).join(', ')}
        RECOMMENDED ACTION VERBS: ${roleInfo.actionVerbs.join(', ')}
        
        MUST INCLUDE:
        - Clinical experience and patient care expertise
        - Medical certifications, licenses, and specializations
        - Healthcare technologies, procedures, and protocols
        - Quantifiable patient outcomes and clinical metrics
        - Medical terminology for ATS scanning
        
        ATS OPTIMIZATION REQUIREMENTS:
        - Use standard medical job titles and certifications: ${roleInfo.certifications.join(', ')}
        - Include relevant medical procedures, technologies, and specialties
        - Use action verbs like: ${roleInfo.actionVerbs.join(', ')}
        - Include patient care metrics and clinical outcomes
        - Use medical keywords that match healthcare job descriptions
        
        The summary should be 3-4 sentences, ATS-optimized for 80+ score, and medically keyword-rich.
      `,
      diploma: `
        Create a professional, ATS-optimized resume summary for a DIPLOMA-level professional.
        
        🎯 DETECTED ROLE: ${roleInfo.detectedRole}
        📊 CURRENT ATS SCORE: ${atsScore.totalScore}/100 (${atsScore.rating})
        
        REQUIRED ATS KEYWORDS TO INCLUDE: ${roleInfo.keywords.join(', ')}
        MISSING KEYWORDS TO ADD: ${keywordAnalysis.missingKeywords.slice(0, 5).join(', ')}
        RECOMMENDED ACTION VERBS: ${roleInfo.actionVerbs.join(', ')}
        
        MUST INCLUDE:
        - Practical skills and hands-on technical experience
        - Industry-specific training, certifications, and coursework
        - Technical competencies and specialized equipment knowledge
        - Quantifiable practical achievements and project outcomes
        - Industry-standard technical keywords for ATS scanning
        
        ATS OPTIMIZATION REQUIREMENTS:
        - Use standard technical job titles and skill certifications: ${roleInfo.certifications.join(', ')}
        - Include relevant tools, equipment, and technical procedures
        - Use action verbs like: ${roleInfo.actionVerbs.join(', ')}
        - Include practical achievements and technical accomplishments
        - Use technical keywords relevant to the specific diploma field
        
        The summary should be 3-4 sentences, ATS-optimized for 80+ score, and technically keyword-rich.
      `,
      'non-technical': `
        Create a professional, ATS-optimized resume summary for a NON-TECHNICAL professional.
        
        🎯 DETECTED ROLE: ${roleInfo.detectedRole}
        📊 CURRENT ATS SCORE: ${atsScore.totalScore}/100 (${atsScore.rating})
        
        REQUIRED ATS KEYWORDS TO INCLUDE: ${roleInfo.keywords.join(', ')}
        MISSING KEYWORDS TO ADD: ${keywordAnalysis.missingKeywords.slice(0, 5).join(', ')}
        RECOMMENDED ACTION VERBS: ${roleInfo.actionVerbs.join(', ')}
        
        MUST INCLUDE:
        - Leadership and management experience with team sizes
        - Communication and interpersonal skills achievements
        - Customer service excellence and relationship building results
        - Business metrics and quantifiable performance improvements
        - Business keywords and soft skills for ATS scanning
        
        ATS OPTIMIZATION REQUIREMENTS:
        - Use standard business job titles and management terms: ${roleInfo.certifications.join(', ')}
        - Include relevant business skills, processes, and achievements
        - Use action verbs like: ${roleInfo.actionVerbs.join(', ')}
        - Include business metrics, revenue, or performance improvements
        - Use business keywords that match non-technical job descriptions
        
        The summary should be 3-4 sentences, ATS-optimized for 80+ score, and business keyword-rich.
      `,
      general: `
        Create a professional, ATS-optimized resume summary.
        
        🎯 DETECTED ROLE: ${roleInfo.detectedRole}
        📊 CURRENT ATS SCORE: ${atsScore.totalScore}/100 (${atsScore.rating})
        
        REQUIRED ATS KEYWORDS TO INCLUDE: ${roleInfo.keywords.join(', ')}
        MISSING KEYWORDS TO ADD: ${keywordAnalysis.missingKeywords.slice(0, 5).join(', ')}
        RECOMMENDED ACTION VERBS: ${roleInfo.actionVerbs.join(', ')}
        
        ATS OPTIMIZATION REQUIREMENTS:
        - Use standard job titles and industry-relevant keywords
        - Include specific skills, tools, and technologies from keyword analysis
        - Use strong action verbs and quantifiable achievements
        - Ensure keyword density matches target job descriptions
        - Format for easy ATS parsing and human readability
        
        The summary should be 3-4 sentences, ATS-optimized for 80+ score, and keyword-optimized.
      `
    };

    // Get the appropriate prompt or default to general
    const specificPrompt = typePrompts[resumeType.toLowerCase()] || typePrompts.general;
    
    // Add variety by including a randomization element and timestamp
    const varietyPrompts = [
      "Use dynamic action verbs and focus on quantifiable achievements with specific numbers.",
      "Emphasize unique value proposition and competitive advantages in the industry.", 
      "Highlight career progression and growth potential with measurable impact.",
      "Focus on results-driven accomplishments and ROI achievements.",
      "Emphasize adaptability and continuous learning with specific examples.",
      "Showcase leadership qualities and initiative-taking with team metrics.",
      "Highlight problem-solving skills and analytical thinking with case examples.",
      "Focus on collaboration and cross-functional expertise with project outcomes.",
      "Emphasize innovation and creative problem-solving with breakthrough results.",
      "Showcase industry expertise and domain knowledge with recognition achievements."
    ];
    
    const randomVariety = varietyPrompts[Math.floor(Math.random() * varietyPrompts.length)];
    const uniqueId = Date.now() + Math.random().toString(36).substr(2, 9); // More unique ID
    
    const prompt = `
    ${specificPrompt}
    
    VARIETY INSTRUCTION: ${randomVariety}
    
    UNIQUE GENERATION CONTEXT: Every summary must be different. Use varied sentence structures, different action verbs, and alternative phrasing approaches.
    
    Resume Data:
    ${JSON.stringify(resumeData, null, 2)}
    
    Generation ID: ${uniqueId}
    Timestamp: ${new Date().toISOString()}
    
    IMPORTANT: Generate a completely unique summary that is different from any previous generation, while maintaining ATS optimization and professional quality.
    
    Return only the summary text without any explanations or additional notes.
    `;

    // Use maximum variety settings and completely bypass cache
    const summary = await generateContent(prompt, { 
      temperature: 0.9 + (Math.random() * 0.1), // High temperature for maximum variety (0.9-1.0)
      topP: 0.9 + (Math.random() * 0.1), // Variable nucleus sampling
      topK: 35 + Math.floor(Math.random() * 20), // Variable top-k sampling (35-55)
      skipCache: true, // Always skip cache
      maxOutputTokens: 512 // Enough tokens for variety
    });
    
    // Save to suggestions history
    saveSuggestionToHistory(
      resumeData.userId || 'anonymous',
      'summary',
      summary,
      {
        resumeType,
        role: roleInfo.detectedRole,
        atsScore: atsScore.totalScore,
        keywordsUsed: roleInfo.keywords.slice(0, 5)
      }
    );
    
    return summary;
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error('Failed to generate summary');
  }
}

/**
 * 🔧 Step 7: Generate Real-Time ATS Improvement Suggestions
 * Complete ATS Analysis with Suggestions (as per your outlined steps)
 * @param {object} resumeData - The user's resume data
 * @param {string} resumeType - Type of resume (technical, medical, etc.)
 * @returns {Promise<object>} - Complete ATS analysis with suggestions
 */
async function generateATSAnalysis(resumeData, resumeType = 'general') {
  try {
    // Step 1: Job Role & Industry Detection
    const roleInfo = detectJobRoleAndIndustry(resumeData);
    
    // Step 2-4: Keyword Analysis & Gap Detection
    const keywordAnalysis = performKeywordAnalysis(resumeData, roleInfo);
    
    // Step 5: Formatting Check (simplified)
    const formatCheck = {
      hasExperience: !!(resumeData.experience && resumeData.experience.length > 0),
      hasSkills: !!(resumeData.skills && resumeData.skills.length > 0),
      hasEducation: !!(resumeData.education && resumeData.education.length > 0),
      hasSummary: !!resumeData.summary
    };
    
    // Step 6: ATS Score Calculation
    const atsScore = calculateATSScore(resumeData, keywordAnalysis);
    
    // Step 7: Real-Time Suggestions
    const suggestions = [];
    
    if (keywordAnalysis.missingKeywords.length > 0) {
      suggestions.push(`🔧 Add these keywords to improve ATS score: ${keywordAnalysis.missingKeywords.slice(0, 3).join(', ')}`);
    }
    
    if (!formatCheck.hasSummary) {
      suggestions.push("📝 Add a professional summary (recommended for ATS optimization)");
    }
    
    if (!formatCheck.hasSkills) {
      suggestions.push("⚡ Add a Skills section with relevant keywords");
    }
    
    if (atsScore.totalScore < 60) {
      suggestions.push(`📊 Your ATS score is ${atsScore.totalScore}/100. Focus on adding industry keywords.`);
    }
    
    suggestions.push(`🎯 Use these action verbs: ${roleInfo.actionVerbs.slice(0, 3).join(', ')}`);
    
    return {
      detectedRole: roleInfo.detectedRole,
      industry: roleInfo.industry,
      atsScore: atsScore,
      keywordAnalysis: keywordAnalysis,
      formatCheck: formatCheck,
      suggestions: suggestions,
      recommendedKeywords: roleInfo.keywords,
      actionVerbs: roleInfo.actionVerbs,
      certifications: roleInfo.certifications
    };
  } catch (error) {
    console.error('Error generating ATS analysis:', error);
    throw new Error('Failed to generate ATS analysis');
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
        recommendedTemplate: 'professional',
        reasoning:
          'Based on the job type and resume content, a professional template would be most appropriate.',
        alternativeOptions: ['modern', 'standard'],
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
          education: 90,
        },
        improvementSuggestions: [
          'Add more keywords relevant to the job position',
          'Quantify achievements in work experience',
        ],
        keywordAnalysis: {
          present: ['JavaScript', 'React', 'Node.js'],
          missing: ['TypeScript', 'Redux', 'AWS'],
        },
        formatIssues: [],
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
      contextStr = `\nCurrent resume context:\n${JSON.stringify(
        resumeContext,
        null,
        2
      )}`;
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

/**
 * Chat with AI for resume guidance
 * @param {string} message - User's question/message
 * @param {object} context - Optional context (resume data, etc.)
 * @returns {Promise<object>} - AI response with message and suggestions
 */
async function chatWithAI(message, context = {}) {
  try {
    console.log('Processing chat message:', message);
    
    // Create comprehensive prompt for chat response
    const chatPrompt = `
    You are an expert resume writing assistant. A user is asking for help with their resume. 
    
    User Question: "${message}"
    
    Context: ${JSON.stringify(context, null, 2)}
    
    Please provide:
    1. A helpful, detailed response to their question
    2. Actionable advice specific to resume writing
    3. Industry best practices
    4. ATS optimization tips when relevant
    
    Keep your response conversational, helpful, and professional. 
    Focus on practical advice they can implement immediately.
    
    If the question is about skills, provide specific skill recommendations.
    If about experience, give examples of strong bullet points.
    If about templates, explain the benefits of different styles.
    If about ATS, provide concrete optimization strategies.
    
    Respond in a friendly, encouraging tone as if you're a career counselor.
    `;

    const response = await generateContent(chatPrompt, {
      temperature: 0.7,
      maxOutputTokens: 1000
    });

    // Generate relevant suggestions based on the message
    const suggestions = generateChatSuggestions(message, context);

    return {
      message: response,
      suggestions: suggestions,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error in AI chat:', error);
    
    // Fallback response
    return {
      message: getFallbackChatResponse(message),
      suggestions: generateChatSuggestions(message, context),
      timestamp: new Date().toISOString(),
      fallbackMode: true
    };
  }
}

/**
 * Generate relevant suggestions based on user's question
 */
function generateChatSuggestions(message, context) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('skill') || lowerMessage.includes('technology')) {
    return [
      { icon: '⚡', text: 'Auto-add suggested skills', action: 'auto-fill', data: { type: 'skills', content: 'JavaScript, React, Node.js, Python, SQL, Git, AWS, Problem-solving, Team Collaboration' }},
      { icon: '💼', text: 'What skills for Software Engineer?', action: 'ask' },
      { icon: '🎯', text: 'Show industry-specific skills', action: 'ask' }
    ];
  }
  
  if (lowerMessage.includes('summary') || lowerMessage.includes('objective')) {
    return [
      { icon: '✨', text: 'Generate professional summary', action: 'auto-fill', data: { type: 'summary' }},
      { icon: '📝', text: 'Show summary examples', action: 'ask' },
      { icon: '🎯', text: 'How to write compelling summary?', action: 'ask' }
    ];
  }
  
  if (lowerMessage.includes('template') || lowerMessage.includes('format')) {
    return [
      { icon: '🎨', text: 'Which template is best for me?', action: 'ask' },
      { icon: '💼', text: 'Show professional templates', action: 'ask' },
      { icon: '🚀', text: 'ATS-friendly vs Creative?', action: 'ask' }
    ];
  }
  
  if (lowerMessage.includes('experience') || lowerMessage.includes('work')) {
    return [
      { icon: '📈', text: 'How to write strong bullet points?', action: 'ask' },
      { icon: '🎯', text: 'What action verbs to use?', action: 'ask' },
      { icon: '💡', text: 'Show experience examples', action: 'ask' }
    ];
  }
  
  return [
    { icon: '💡', text: 'Give me resume writing tips', action: 'ask' },
    { icon: '🎯', text: 'How to optimize for ATS?', action: 'ask' },
    { icon: '📊', text: 'What makes a resume effective?', action: 'ask' }
  ];
}

/**
 * Fallback chat responses when AI service is unavailable
 */
function getFallbackChatResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('skill') || lowerMessage.includes('technology')) {
    return `For technical skills, I recommend including:\n\n• **Programming Languages**: Python, Java, JavaScript, C++\n• **Frameworks**: React, Node.js, Angular, Django\n• **Databases**: MySQL, MongoDB, PostgreSQL\n• **Tools**: Git, Docker, AWS, Jenkins\n• **Soft Skills**: Problem-solving, Team Collaboration, Communication\n\nTip: Always match skills to the job description you're applying for! 🎯`;
  }
  
  if (lowerMessage.includes('summary') || lowerMessage.includes('objective')) {
    return `A strong professional summary should include:\n\n• **Your title** and years of experience\n• **Key skills** relevant to the role\n• **Quantified achievements** (numbers, percentages)\n• **Value proposition** - what you bring to employers\n\nExample: "Experienced Software Developer with 5+ years building scalable web applications. Skilled in React, Node.js, and AWS. Led team of 4 developers and improved system performance by 40%."\n\nKeep it 3-4 sentences and tailored to each job! ✨`;
  }
  
  if (lowerMessage.includes('template') || lowerMessage.includes('format')) {
    return `Here's my template recommendation guide:\n\n• **ATS-Friendly**: Best for large companies (clean, simple format)\n• **Modern Professional**: Great for tech/startup roles\n• **Creative**: Perfect for design/marketing positions\n• **Traditional**: Ideal for conservative industries (finance, law)\n\nChoose based on:\n✅ Your industry\n✅ Company culture\n✅ Job level (entry vs senior)\n\nWhen in doubt, go with ATS-friendly! 🎨`;
  }
  
  if (lowerMessage.includes('ats') || lowerMessage.includes('keyword')) {
    return `ATS Optimization strategies:\n\n• **Use keywords** from job descriptions (exact matches)\n• **Standard headings**: Experience, Education, Skills\n• **Simple formatting**: No fancy graphics or tables\n• **File format**: Save as .docx when possible\n• **Spelling**: Match exact terminology from job posts\n• **Sections**: Include all standard resume sections\n\nPro tip: Use tools like Jobscan to check ATS compatibility! 🚀`;
  }
  
  return `I'm here to help with your resume! I can assist with:\n\n🎯 **Skills recommendations**\n📝 **Professional summary writing**\n💼 **Experience descriptions**\n🎨 **Template selection**\n⚡ **ATS optimization**\n📊 **Industry-specific advice**\n\nWhat specific aspect would you like help with? Just ask me anything about resume writing!`;
}

// Interview Preparation Functions
async function generateInterviewPrep(field, jobRole, qualification) {
  const cacheKey = `interview_prep_${field}_${jobRole}_${qualification}`;
  const cached = responseCache.get(cacheKey);
  if (cached) return cached;

  try {
    const prompt = `
Generate comprehensive interview preparation content for:
- Field: ${field}
- Job Role: ${jobRole || 'General'}
- Qualification: ${qualification}

Please provide highly tailored, field-specific content with:

1. 10-12 relevant interview questions with the following breakdown:
   - 2-3 general behavioral questions adapted to the field
   - 5-6 technical/field-specific questions that demonstrate expertise
   - 2-3 situational questions related to common scenarios in this field

2. 4-5 sample professional answers that:
   - Show depth of knowledge in the specific field
   - Use industry terminology appropriate for ${field}
   - Demonstrate qualification-appropriate expertise (${qualification} level)
   - Include specific examples and scenarios

3. 6-8 field-specific interview tips that:
   - Address industry expectations in ${field}
   - Mention specific preparation needed for this field
   - Cover field-appropriate dress code, etiquette, and presentation
   - Suggest specific achievements or credentials to highlight

Format as JSON:
{
  "questions": ["question1", "question2", ...],
  "sampleAnswers": ["answer1", "answer2", ...],
  "tips": ["tip1", "tip2", ...]
}

FIELD-SPECIFIC INSTRUCTIONS:
- For MEDICAL field: Include questions about patient care, medical procedures, healthcare regulations, emergency protocols, and medical ethics. Sample answers should reference medical terminology and standards.

- For TECH field: Include questions about programming languages, development methodologies, problem-solving approaches, system design, and technical troubleshooting. Answers should demonstrate technical knowledge.

- For NON-TECH field: Focus on customer service, communication skills, project management, teamwork, and industry-specific knowledge. Answers should highlight soft skills and business acumen.

- For DIPLOMA/TRADE field: Focus on hands-on skills, practical applications, technical certifications, safety protocols, and equipment knowledge. Answers should emphasize practical experience.
`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    try {
      const parsedContent = JSON.parse(text);
      responseCache.set(cacheKey, parsedContent);
      return parsedContent;
    } catch (parseError) {
      // Fallback if JSON parsing fails
      const fallbackData = getFallbackInterviewPrep(field, jobRole, qualification);
      responseCache.set(cacheKey, fallbackData);
      return fallbackData;
    }
  } catch (error) {
    console.error('Error generating interview prep:', error);
    return getFallbackInterviewPrep(field, jobRole, qualification);
  }
}

async function generateMockInterviewFeedback(question, answer, field, jobRole) {
  try {
    const prompt = `
Analyze this interview answer and provide constructive feedback:

Question: "${question}"
Answer: "${answer}"
Field: ${field}
Role: ${jobRole}

Provide feedback on:
1. Content quality and relevance
2. Communication clarity
3. Specific improvements
4. Positive aspects

Keep feedback encouraging but specific. Limit to 2-3 sentences.
`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const feedback = response.text();
    
    return { feedback };
  } catch (error) {
    console.error('Error generating mock interview feedback:', error);
    return { 
      feedback: "Good answer! Try to be more specific with examples and show your passion for the field. Consider structuring your response with the STAR method (Situation, Task, Action, Result)." 
    };
  }
}

function getFallbackInterviewPrep(field, jobRole, qualification) {
  const fieldLower = field.toLowerCase();
  
  // Base questions for all fields
  const baseQuestions = [
    "Tell me about yourself and your background.",
    "Why are you interested in this field?",
    "What are your greatest strengths?",
    "Where do you see yourself in 5 years?"
  ];
  
  // Comprehensive field-specific questions
  const fieldSpecificQuestions = {
    medical: [
      "How do you ensure patient safety and quality care?",
      "Describe your experience with medical equipment and procedures.",
      "How do you handle emergency situations under pressure?",
      "What does patient confidentiality and HIPAA compliance mean to you?",
      "How do you stay updated with medical protocols and best practices?",
      "Describe a time when you had to work with a difficult patient.",
      "How do you handle infection control and sterilization procedures?",
      "What role does teamwork play in healthcare settings?",
      "How do you manage multiple patients with varying needs?",
      "Describe your experience with electronic health records (EHR)."
    ],
    tech: [
      "Describe your experience with programming languages and frameworks.",
      "How do you approach debugging complex technical issues?",
      "Walk me through your software development lifecycle process.",
      "How do you stay updated with rapidly evolving technology trends?",
      "Describe a challenging project you worked on and how you solved it.",
      "How do you ensure code quality and maintainability?",
      "What's your experience with version control systems like Git?",
      "How do you handle tight deadlines and changing requirements?",
      "Describe your experience with database design and optimization.",
      "How do you approach learning new technologies quickly?"
    ],
    'non-tech': [
      "How do you prioritize tasks when managing multiple responsibilities?",
      "Describe your customer service philosophy and approach.",
      "How do you handle difficult clients or challenging situations?",
      "What strategies do you use for effective time management?",
      "Describe your experience working in team environments.",
      "How do you adapt to changes in company policies or procedures?",
      "What methods do you use to build rapport with clients/customers?",
      "How do you handle stress and maintain productivity?",
      "Describe a time when you exceeded expectations in your role.",
      "How do you ensure accuracy and attention to detail in your work?"
    ],
    diploma: [
      "How has your hands-on training prepared you for real-world applications?",
      "Describe specific practical skills you gained during your diploma program.",
      "How do you apply theoretical knowledge to practical situations?",
      "What industry certifications or licenses do you currently hold?",
      "Describe your experience with industry-standard tools and equipment.",
      "How do you ensure safety protocols are followed in your work?",
      "What ongoing professional development do you pursue?",
      "Describe a project where you demonstrated technical competency.",
      "How do you troubleshoot problems when they arise?",
      "What makes you stand out among other diploma holders?"
    ]
  };
  
  // Role-specific questions based on jobRole
  const roleSpecificQuestions = {};
  if (jobRole) {
    const roleLower = jobRole.toLowerCase();
    if (roleLower.includes('nurse') || roleLower.includes('medical technician')) {
      roleSpecificQuestions.role = [
        "How do you handle working different shifts (day/night)?",
        "Describe your experience with patient monitoring systems.",
        "How do you communicate with doctors and other healthcare staff?"
      ];
    } else if (roleLower.includes('software') || roleLower.includes('developer')) {
      roleSpecificQuestions.role = [
        "Describe your experience with agile development methodologies.",
        "How do you handle code reviews and collaborative development?",
        "What's your approach to writing unit tests and documentation?"
      ];
    } else if (roleLower.includes('sales') || roleLower.includes('marketing')) {
      roleSpecificQuestions.role = [
        "How do you identify and qualify potential leads?",
        "Describe your approach to building long-term client relationships.",
        "How do you handle rejection and maintain motivation?"
      ];
    } else if (roleLower.includes('customer service') || roleLower.includes('support')) {
      roleSpecificQuestions.role = [
        "How do you de-escalate angry or frustrated customers?",
        "Describe your approach to providing excellent customer support.",
        "How do you handle situations where you don't know the answer?"
      ];
    }
  }
  
  // Combine questions based on field
  let questions = [
    ...baseQuestions,
    ...(fieldSpecificQuestions[fieldLower] || fieldSpecificQuestions['non-tech']).slice(0, 8),
    ...(roleSpecificQuestions.role || [])
  ];
  
  // Field-specific sample answers
  const fieldSampleAnswers = {
    medical: [
      `I am a ${qualification} holder with a passion for healthcare and patient care. My training has equipped me with both clinical knowledge and practical skills essential for providing quality medical services.`,
      `Patient safety is my top priority. I always follow protocols, double-check procedures, maintain sterile environments, and communicate clearly with the healthcare team to ensure the best outcomes.`,
      `In emergency situations, I remain calm, follow established protocols, prioritize patient needs, and communicate effectively with the medical team to provide immediate and appropriate care.`,
      `I stay current with medical developments through continuing education, professional journals, workshops, and following updated guidelines from medical authorities.`
    ],
    tech: [
      `I am a ${qualification} holder passionate about technology and problem-solving. My background includes experience with modern programming languages, frameworks, and development methodologies.`,
      `When debugging, I start by reproducing the issue, analyze logs, use debugging tools systematically, and break down complex problems into smaller, manageable components.`,
      `I stay updated through tech blogs, online courses, developer communities, open-source contributions, and experimenting with new technologies in personal projects.`,
      `I approach challenges by understanding requirements thoroughly, researching best practices, prototyping solutions, and collaborating with team members for optimal results.`
    ],
    'non-tech': [
      `I am a ${qualification} holder with strong interpersonal skills and a customer-focused mindset. My background has prepared me to excel in dynamic business environments.`,
      `I prioritize tasks by assessing urgency and importance, using tools like to-do lists and calendars, and regularly communicating with supervisors about priorities and deadlines.`,
      `My customer service approach focuses on active listening, empathy, prompt problem resolution, and ensuring customers feel valued and satisfied with their experience.`,
      `I handle stress by staying organized, taking regular breaks, practicing time management, and maintaining a positive attitude while focusing on solutions rather than problems.`
    ],
    diploma: [
      `My ${qualification} program provided hands-on training with industry-standard equipment and real-world scenarios, giving me practical skills directly applicable to professional settings.`,
      `I bridge theory and practice by understanding underlying principles first, then applying them through hands-on work, and continuously learning from experienced professionals.`,
      `I hold relevant certifications and stay updated with industry standards through workshops, online courses, and professional development opportunities.`,
      `I troubleshoot by systematically identifying problems, consulting manuals and resources, applying logical problem-solving steps, and seeking guidance when needed.`
    ]
  };
  
  const sampleAnswers = fieldSampleAnswers[fieldLower] || fieldSampleAnswers['non-tech'];
  
  // Field-specific tips
  const fieldTips = {
    medical: [
      `Emphasize your commitment to patient care and safety`,
      `Mention any relevant certifications (CPR, First Aid, etc.)`,
      `Highlight experience with medical equipment and procedures`,
      `Show knowledge of healthcare regulations and compliance`,
      `Demonstrate ability to work in fast-paced environments`,
      `Research the healthcare facility's specialties and values`,
      `Prepare examples of teamwork in clinical settings`,
      `Show commitment to continuing medical education`
    ],
    tech: [
      `Demonstrate problem-solving skills with specific examples`,
      `Show familiarity with current technologies and frameworks`,
      `Highlight any open-source contributions or personal projects`,
      `Prepare to discuss your development process and methodologies`,
      `Show ability to learn and adapt to new technologies quickly`,
      `Research the company's tech stack and recent projects`,
      `Be ready to explain technical concepts clearly`,
      `Demonstrate collaboration and code review experience`
    ],
    'non-tech': [
      `Emphasize strong communication and interpersonal skills`,
      `Prepare examples of excellent customer service`,
      `Show ability to work under pressure and meet deadlines`,
      `Highlight experience with team collaboration`,
      `Demonstrate problem-solving and adaptability`,
      `Research the company's products, services, and values`,
      `Show enthusiasm for the industry and role`,
      `Prepare questions about growth opportunities`
    ],
    diploma: [
      `Highlight hands-on experience and practical skills`,
      `Mention relevant certifications and licenses`,
      `Emphasize safety awareness and protocol adherence`,
      `Show commitment to professional development`,
      `Demonstrate technical competency with examples`,
      `Research industry trends and developments`,
      `Highlight any specialized training or workshops`,
      `Show willingness to learn and grow in the field`
    ]
  };
  
  const tips = fieldTips[fieldLower] || fieldTips['non-tech'];
  
  return { questions, sampleAnswers, tips };
}

/**
 * Generate comprehensive career path recommendations
 */
async function generateCareerPathRecommendations(resumeData, currentRole, experienceLevel = 'mid-level') {
  try {
    const roleKey = currentRole?.toLowerCase() || 'software engineer';
    const careerData = CAREER_PROGRESSION_DATABASE[roleKey];
    
    if (!careerData) {
      return generateGenericCareerAdvice(resumeData, currentRole);
    }

    // Determine current position in career path
    const currentPosition = determineCurrentPosition(resumeData, careerData, experienceLevel);
    const nextSteps = generateNextSteps(currentPosition, careerData);
    const skillGapAnalysis = await generateSkillGapAnalysis(resumeData, currentRole, currentPosition.nextLevel);
    
    return {
      currentPosition,
      careerPaths: careerData.careerPaths,
      nextSteps,
      skillGapAnalysis,
      trending2025: careerData.trending2025,
      emergingCertifications: careerData.emergingCertifications,
      industryInsights: generateIndustryInsights(currentRole),
      recommendations: await generatePersonalizedRecommendations(resumeData, currentRole, skillGapAnalysis)
    };

  } catch (error) {
    console.error('Error generating career path recommendations:', error);
    return generateFallbackCareerAdvice(currentRole);
  }
}

/**
 * Generate detailed skill gap analysis
 */
async function generateSkillGapAnalysis(resumeData, currentRole, targetRole) {
  try {
    const currentSkills = extractCurrentSkills(resumeData);
    const roleKey = currentRole?.toLowerCase() || 'software engineer';
    const targetRoleInfo = ATS_KEYWORD_DATABASE[roleKey];
    
    if (!targetRoleInfo) {
      return generateBasicSkillAnalysis(currentSkills);
    }

    const requiredSkills = targetRoleInfo.keywords;
    const missingSkills = requiredSkills.filter(skill => 
      !currentSkills.some(currentSkill => 
        currentSkill.toLowerCase().includes(skill.toLowerCase())
      )
    );

    const skillCategories = categorizeSkills(missingSkills, currentRole);
    const prioritySkills = prioritizeSkills(missingSkills, targetRole);
    const learningResources = generateLearningResources(prioritySkills);

    return {
      currentSkills,
      requiredSkills,
      missingSkills,
      skillCategories,
      prioritySkills,
      learningResources,
      timeToAcquire: estimateTimeToAcquire(missingSkills),
      skillScore: calculateSkillScore(currentSkills, requiredSkills)
    };

  } catch (error) {
    console.error('Error in skill gap analysis:', error);
    return generateBasicSkillAnalysis(extractCurrentSkills(resumeData));
  }
}

/**
 * Get industry trends and notifications
 */
function getIndustryTrends(industry = 'IT') {
  const trends = INDUSTRY_TRENDS_2025[industry];
  
  if (!trends) {
    return {
      hotSkills: ['Communication', 'Problem-solving', 'Leadership', 'Digital Literacy'],
      emergingRoles: ['Digital Specialist', 'Data Analyst', 'Process Improvement Specialist'],
      salaryGrowth: '5%',
      jobGrowth: '3%',
      lastUpdated: new Date().toISOString(),
      notifications: generateGenericNotifications()
    };
  }

  return {
    ...trends,
    notifications: generateTrendNotifications(trends, industry)
  };
}

/**
 * Generate trending skills notifications
 */
function generateTrendNotifications(trends, industry) {
  const notifications = [];
  
  // Hot skills notifications
  trends.hotSkills.slice(0, 3).forEach(skill => {
    notifications.push({
      type: 'trending_skill',
      title: `${skill} is trending in ${industry}`,
      message: `Consider adding ${skill} to your skill set. It's showing ${trends.salaryGrowth} salary growth in 2025.`,
      priority: 'high',
      category: 'skill_development',
      timestamp: new Date().toISOString()
    });
  });

  // Emerging roles notification
  if (trends.emergingRoles.length > 0) {
    notifications.push({
      type: 'emerging_role',
      title: 'New Career Opportunities',
      message: `Explore emerging roles: ${trends.emergingRoles.slice(0, 2).join(', ')}. These roles are projected to grow by ${trends.jobGrowth} in 2025.`,
      priority: 'medium',
      category: 'career_growth',
      timestamp: new Date().toISOString()
    });
  }

  // Industry growth notification
  notifications.push({
    type: 'industry_growth',
    title: `${industry} Industry Update`,
    message: `The ${industry} industry is experiencing ${trends.jobGrowth} job growth and ${trends.salaryGrowth} salary growth in 2025.`,
    priority: 'medium',
    category: 'industry_insights',
    timestamp: new Date().toISOString()
  });

  return notifications;
}

// Helper functions
function determineCurrentPosition(resumeData, careerData, experienceLevel) {
  // Logic to determine current position based on experience and skills
  const defaultPath = careerData.careerPaths[0];
  const currentIndex = Math.floor(Math.random() * defaultPath.progression.length);
  const nextIndex = Math.min(currentIndex + 1, defaultPath.progression.length - 1);
  
  return {
    current: defaultPath.progression[currentIndex],
    nextLevel: defaultPath.progression[nextIndex],
    pathIndex: currentIndex
  };
}

function generateNextSteps(currentPosition, careerData) {
  const nextLevel = currentPosition.nextLevel;
  
  return {
    immediateActions: [
      `Develop skills in: ${nextLevel.skills.slice(0, 3).join(', ')}`,
      'Build a portfolio showcasing relevant projects',
      'Network with professionals in target role',
      'Seek mentorship or coaching opportunities'
    ],
    certifications: careerData.emergingCertifications.slice(0, 3),
    timeframe: '6-12 months',
    salaryIncrease: calculateSalaryIncrease(currentPosition.current.salary, nextLevel.salary)
  };
}

function extractCurrentSkills(resumeData) {
  const skills = [];
  
  if (resumeData.skills) {
    skills.push(...resumeData.skills.split(',').map(s => s.trim()));
  }
  
  if (resumeData.experience) {
    resumeData.experience.forEach(exp => {
      if (exp.role) skills.push(exp.role);
      if (exp.description) {
        // Extract skills from experience descriptions
        const techWords = exp.description.match(/\b(Java|Python|JavaScript|React|Node|SQL|AWS|Docker|Git|Agile)\b/gi);
        if (techWords) skills.push(...techWords);
      }
    });
  }
  
  return [...new Set(skills)]; // Remove duplicates
}

function categorizeSkills(skills, role) {
  return {
    technical: skills.filter(skill => 
      ['Java', 'Python', 'JavaScript', 'React', 'Node.js', 'SQL', 'AWS', 'Docker'].includes(skill)
    ),
    soft: skills.filter(skill => 
      ['Leadership', 'Communication', 'Problem-solving', 'Teamwork'].includes(skill)
    ),
    domain: skills.filter(skill => 
      ['Agile', 'SDLC', 'DevOps', 'Machine Learning', 'Data Analysis'].includes(skill)
    )
  };
}

function prioritizeSkills(skills, targetRole) {
  // Prioritize based on demand and relevance
  return skills.slice(0, 5).map((skill, index) => ({
    skill,
    priority: index < 2 ? 'high' : index < 4 ? 'medium' : 'low',
    demandScore: Math.floor(Math.random() * 20) + 80, // 80-100
    learningDifficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)]
  }));
}

function generateLearningResources(prioritySkills) {
  return prioritySkills.map(skillData => ({
    skill: skillData.skill,
    resources: [
      { type: 'course', name: `Complete ${skillData.skill} Course`, provider: 'Coursera', duration: '4-6 weeks' },
      { type: 'book', name: `Mastering ${skillData.skill}`, provider: 'O\'Reilly', duration: '2-3 months' },
      { type: 'practice', name: `${skillData.skill} Projects`, provider: 'GitHub', duration: 'Ongoing' }
    ]
  }));
}

function estimateTimeToAcquire(skills) {
  const timeEstimates = skills.map(skill => {
    const difficulty = ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)];
    const weeks = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 8 : 16;
    return { skill, weeks, difficulty };
  });
  
  return timeEstimates;
}

function calculateSkillScore(currentSkills, requiredSkills) {
  const matchCount = requiredSkills.filter(required => 
    currentSkills.some(current => 
      current.toLowerCase().includes(required.toLowerCase())
    )
  ).length;
  // Avoid division by zero
  if (!Array.isArray(requiredSkills) || requiredSkills.length === 0) return 0;
  return Math.round((matchCount / requiredSkills.length) * 100);
}

function generateIndustryInsights(role) {
  const industry = ATS_KEYWORD_DATABASE[role?.toLowerCase()]?.industry || 'IT';
  return INDUSTRY_TRENDS_2025[industry] || INDUSTRY_TRENDS_2025['IT'];
}

function generatePersonalizedRecommendations(resumeData, currentRole, skillGapAnalysis) {
  return {
    immediate: [
      'Update your LinkedIn profile with new skills',
      'Create projects showcasing missing technical skills',
      'Join relevant professional communities'
    ],
    shortTerm: [
      'Pursue certifications in high-priority skills',
      'Attend industry conferences or webinars',
      'Find a mentor in your target role'
    ],
    longTerm: [
      'Consider advanced degree or specialized training',
      'Build thought leadership through content creation',
      'Explore leadership opportunities in current role'
    ]
  };
}

function generateGenericCareerAdvice(resumeData, currentRole) {
  return {
    currentPosition: { current: { level: 'Professional', skills: ['General'], salary: '$50,000-80,000' } },
    careerPaths: [{ title: 'Growth Track', progression: [] }],
    nextSteps: { immediateActions: ['Continue skill development', 'Network actively'], timeframe: '6-12 months' },
    skillGapAnalysis: { missingSkills: ['Communication', 'Leadership'], skillScore: 70 },
    trending2025: ['Digital Skills', 'Data Literacy', 'Emotional Intelligence'],
    emergingCertifications: ['Digital Marketing', 'Project Management', 'Data Analysis']
  };
}

function generateFallbackCareerAdvice(currentRole) {
  return generateGenericCareerAdvice({}, currentRole);
}

function generateBasicSkillAnalysis(currentSkills) {
  return {
    currentSkills,
    missingSkills: ['Communication', 'Leadership', 'Problem-solving'],
    skillScore: 65,
    recommendations: ['Develop soft skills', 'Learn new technologies', 'Build portfolio']
  };
}

function calculateSalaryIncrease(currentSalary, nextSalary) {
  // Extract numbers from salary strings and calculate increase
  const currentNum = parseInt(currentSalary.replace(/\D/g, ''));
  const nextNum = parseInt(nextSalary.replace(/\D/g, ''));
  const increase = Math.round(((nextNum - currentNum) / currentNum) * 100);
  return `${increase}%`;
}

function generateGenericNotifications() {
  return [
    {
      type: 'skill_update',
      title: 'Skill Development Reminder',
      message: 'Consider updating your skills to stay competitive in the job market.',
      priority: 'medium',
      category: 'general',
      timestamp: new Date().toISOString()
    }
  ];
}

// Suggestions History Functions
function getSuggestionsHistory(userId = 'anonymous', options = {}) {
  const { limit = 50, type = null, startDate = null, endDate = null } = options;
  
  let filteredHistory = suggestionsHistory.filter(suggestion => 
    suggestion.userId === userId
  );
  
  // Filter by type if specified
  if (type) {
    filteredHistory = filteredHistory.filter(suggestion => suggestion.type === type);
  }
  
  // Filter by date range if specified
  if (startDate) {
    filteredHistory = filteredHistory.filter(suggestion => 
      new Date(suggestion.timestamp) >= new Date(startDate)
    );
  }
  
  if (endDate) {
    filteredHistory = filteredHistory.filter(suggestion => 
      new Date(suggestion.timestamp) <= new Date(endDate)
    );
  }
  
  // Apply limit
  return filteredHistory.slice(0, limit);
}

function markSuggestionAsRead(suggestionId) {
  const suggestion = suggestionsHistory.find(s => s.id === suggestionId);
  if (suggestion) {
    suggestion.isRead = true;
    return { success: true, suggestion };
  }
  return { success: false, error: 'Suggestion not found' };
}

function deleteSuggestionFromHistory(suggestionId, userId = 'anonymous') {
  const index = suggestionsHistory.findIndex(s => 
    s.id === suggestionId && s.userId === userId
  );
  
  if (index !== -1) {
    const deletedSuggestion = suggestionsHistory.splice(index, 1)[0];
    return { success: true, suggestion: deletedSuggestion };
  }
  
  return { success: false, error: 'Suggestion not found or unauthorized' };
}

function getSuggestionStats(userId = 'anonymous') {
  const userSuggestions = suggestionsHistory.filter(s => s.userId === userId);
  
  const stats = {
    total: userSuggestions.length,
    unread: userSuggestions.filter(s => !s.isRead).length,
    byType: {},
    recentActivity: {
      today: 0,
      thisWeek: 0,
      thisMonth: 0
    }
  };
  
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  
  userSuggestions.forEach(suggestion => {
    // Count by type
    if (!stats.byType[suggestion.type]) {
      stats.byType[suggestion.type] = 0;
    }
    stats.byType[suggestion.type]++;
    
    // Count by time period
    const suggestionDate = new Date(suggestion.timestamp);
    if (suggestionDate >= todayStart) {
      stats.recentActivity.today++;
    }
    if (suggestionDate >= weekStart) {
      stats.recentActivity.thisWeek++;
    }
    if (suggestionDate >= monthStart) {
      stats.recentActivity.thisMonth++;
    }
  });
  
  return stats;
}

function clearSuggestionsHistory(userId = 'anonymous') {
  const initialLength = suggestionsHistory.length;
  suggestionsHistory = suggestionsHistory.filter(s => s.userId !== userId);
  const clearedCount = initialLength - suggestionsHistory.length;
  
  return { success: true, clearedCount };
}

module.exports = {
  generateContent,
  optimizeResume,
  generateSummary,
  generateATSAnalysis,
  generateEnhancedATSAnalysis,
  searchATSTemplates,
  recommendTemplate,
  improveWorkExperience,
  getATSScore,
  getResumeHelp,
  chatWithAI,
  generateInterviewPrep,
  generateMockInterviewFeedback,
  generateCareerPathRecommendations,
  generateSkillGapAnalysis,
  getIndustryTrends,
  generateTrendNotifications,
  // Suggestions History Functions
  getSuggestionsHistory,
  markSuggestionAsRead,
  deleteSuggestionFromHistory,
  getSuggestionStats,
  clearSuggestionsHistory,
  saveSuggestionToHistory
};
