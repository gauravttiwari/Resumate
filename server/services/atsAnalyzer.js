// services/atsAnalyzer.js

// Job Description Keywords (can be customized based on job type)
const DEFAULT_JD_KEYWORDS = [
  'Java', 'React', 'Node.js', 'MongoDB', 'Spring Boot', 'API', 'SQL',
  'JavaScript', 'Python', 'AWS', 'Docker', 'Kubernetes', 'Agile',
  'REST', 'Microservices', 'Git', 'CI/CD', 'TypeScript', 'Express'
];

/**
 * Calculate ATS Score based on algorithmic analysis
 * @param {string|object} resumeData - Resume text or parsed resume object
 * @param {array} customKeywords - Optional custom keywords from job description
 * @returns {object} - ATS score and detailed breakdown
 */
function calculateATSScore(resumeData, customKeywords = []) {
  // Convert resume data to text
  let text = '';
  if (typeof resumeData === 'string') {
    text = resumeData;
  } else if (resumeData && typeof resumeData === 'object') {
    text = resumeData.rawText || JSON.stringify(resumeData);
  }

  const lowerText = text.toLowerCase();
  let score = 0;
  let breakdown = {};

  // 1. SECTION CHECKS (50 points total - 10 points per section)
  const sections = {
    'summary': ['summary', 'objective', 'profile', 'about'],
    'skills': ['skills', 'technical skills', 'competencies', 'expertise'],
    'education': ['education', 'qualification', 'academic', 'degree'],
    'experience': ['experience', 'employment', 'work history', 'professional'],
    'projects': ['projects', 'portfolio', 'work samples']
  };

  let sectionScore = 0;
  Object.keys(sections).forEach(section => {
    const keywords = sections[section];
    const found = keywords.some(keyword => lowerText.includes(keyword));
    
    if (found) {
      sectionScore += 10;
      breakdown[section] = 'Present ✓';
    } else {
      breakdown[section] = 'Missing ✗';
    }
  });

  score += sectionScore;

  // 2. KEYWORD MATCH (40 points max)
  const keywordsToCheck = customKeywords.length > 0 ? customKeywords : DEFAULT_JD_KEYWORDS;
  
  const foundKeywords = keywordsToCheck.filter(keyword =>
    lowerText.includes(keyword.toLowerCase())
  );

  const keywordScore = Math.round((foundKeywords.length / keywordsToCheck.length) * 40);
  score += keywordScore;

  breakdown['keywordMatch'] = `${foundKeywords.length}/${keywordsToCheck.length} matched`;
  breakdown['foundKeywords'] = foundKeywords.join(', ');
  breakdown['missingKeywords'] = keywordsToCheck
    .filter(k => !foundKeywords.includes(k))
    .join(', ');

  // 3. FORMATTING CHECK (10 points)
  let formatScore = 0;
  const hasValidFormatting = {
    bulletPoints: text.includes('•') || text.includes('-') || text.includes('*'),
    properLength: text.length > 500 && text.length < 10000,
    hasNumbers: /\d/.test(text), // Contains numbers (dates, metrics, etc.)
    hasEmail: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text),
    hasPhone: /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text)
  };

  if (hasValidFormatting.bulletPoints) formatScore += 2;
  if (hasValidFormatting.properLength) formatScore += 2;
  if (hasValidFormatting.hasNumbers) formatScore += 2;
  if (hasValidFormatting.hasEmail) formatScore += 2;
  if (hasValidFormatting.hasPhone) formatScore += 2;

  score += formatScore;

  breakdown['formatting'] = formatScore >= 8 ? 'Excellent' : formatScore >= 5 ? 'Good' : 'Needs Improvement';
  breakdown['formatDetails'] = {
    bulletPoints: hasValidFormatting.bulletPoints ? '✓' : '✗',
    properLength: hasValidFormatting.properLength ? '✓' : '✗',
    hasMetrics: hasValidFormatting.hasNumbers ? '✓' : '✗',
    hasEmail: hasValidFormatting.hasEmail ? '✓' : '✗',
    hasPhone: hasValidFormatting.hasPhone ? '✓' : '✗'
  };

  // Ensure score is between 0-100
  score = Math.min(Math.max(score, 0), 100);

  // Calculate rating
  let rating = 'Poor';
  if (score >= 80) rating = 'Excellent';
  else if (score >= 60) rating = 'Good';
  else if (score >= 40) rating = 'Fair';

  return {
    total: score,
    rating: rating,
    breakdown: breakdown,
    parseRate: calculateParseRate(text),
    issues: generateIssues(breakdown, hasValidFormatting, foundKeywords, keywordsToCheck)
  };
}

/**
 * Calculate parse rate (how well the resume can be parsed by ATS)
 */
function calculateParseRate(text) {
  let parseRate = 100;

  // Reduce parse rate for potential issues
  if (text.length < 500) parseRate -= 20;
  if (!/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text)) parseRate -= 10;
  if (!text.includes('\n')) parseRate -= 10; // No line breaks (potential formatting issue)
  
  return Math.max(parseRate, 0);
}

/**
 * Generate list of issues found in the resume
 */
function generateIssues(breakdown, formatDetails, foundKeywords, totalKeywords) {
  const issues = [];

  // Check for missing sections
  Object.keys(breakdown).forEach(key => {
    if (breakdown[key] === 'Missing ✗') {
      issues.push(`Missing ${key} section. Consider adding this to improve ATS compatibility.`);
    }
  });

  // Check formatting issues
  if (!formatDetails.bulletPoints) {
    issues.push('No bullet points detected. Use bullet points to improve readability.');
  }
  if (!formatDetails.properLength) {
    issues.push('Resume length is not optimal. Aim for 500-2000 words.');
  }
  if (!formatDetails.hasEmail) {
    issues.push('No email address detected. Add your contact information.');
  }
  if (!formatDetails.hasPhone) {
    issues.push('No phone number detected. Add your phone number.');
  }
  if (!formatDetails.hasMetrics) {
    issues.push('Add quantifiable achievements (numbers, percentages, metrics).');
  }

  // Check keyword match
  const matchPercentage = (foundKeywords.length / totalKeywords.length) * 100;
  if (matchPercentage < 50) {
    issues.push(`Only ${foundKeywords.length}/${totalKeywords.length} keywords matched. Add more relevant keywords from the job description.`);
  }

  return issues;
}

/**
 * Extract keywords from job description text
 */
function extractKeywordsFromJobDescription(jobDescription) {
  if (!jobDescription) return DEFAULT_JD_KEYWORDS;

  // Simple keyword extraction (can be enhanced with NLP)
  const text = jobDescription.toLowerCase();
  const words = text.split(/\s+/);
  
  // Common technical terms and skills
  const techKeywords = [
    'java', 'python', 'javascript', 'react', 'angular', 'vue', 'node',
    'express', 'mongodb', 'sql', 'postgresql', 'mysql', 'aws', 'azure',
    'docker', 'kubernetes', 'git', 'agile', 'scrum', 'api', 'rest',
    'microservices', 'spring', 'django', 'flask', 'typescript', 'html',
    'css', 'frontend', 'backend', 'fullstack', 'devops', 'ci/cd'
  ];

  const foundTechKeywords = techKeywords.filter(keyword => 
    text.includes(keyword)
  );

  return foundTechKeywords.length > 0 ? foundTechKeywords : DEFAULT_JD_KEYWORDS;
}

module.exports = {
  calculateATSScore,
  extractKeywordsFromJobDescription,
  DEFAULT_JD_KEYWORDS
};
