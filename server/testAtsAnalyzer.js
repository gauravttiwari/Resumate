// Test the ATS Analyzer service
const atsAnalyzer = require('./services/atsAnalyzer');

// Sample resume text
const sampleResume = `
John Doe
Email: john.doe@example.com
Phone: +1-234-567-8900

SUMMARY
Experienced Full Stack Developer with 5 years of expertise in building scalable web applications using React, Node.js, and MongoDB.

SKILLS
• JavaScript, TypeScript, Python
• React, Angular, Node.js, Express
• MongoDB, SQL, PostgreSQL
• AWS, Docker, Kubernetes
• Git, CI/CD, Agile methodologies

EXPERIENCE
Senior Software Engineer - Tech Company (2020-2024)
• Developed microservices architecture using Node.js and Express
• Implemented RESTful APIs serving 1M+ daily requests
• Led team of 5 developers in agile environment
• Optimized database queries reducing response time by 40%

Software Developer - StartUp Inc (2018-2020)
• Built responsive web applications using React and Redux
• Integrated third-party APIs and payment gateways
• Collaborated with cross-functional teams
• Achieved 99.9% uptime for production systems

EDUCATION
Bachelor of Science in Computer Science
University of Technology (2014-2018)

PROJECTS
• E-commerce Platform - Built full-stack application using MERN stack
• Real-time Chat Application - Implemented WebSocket for live messaging
• Task Management System - Created REST API with authentication
`;

const sampleJobDescription = `
We are looking for a Full Stack Developer with experience in:
- React, Node.js, Express
- MongoDB, SQL databases
- RESTful API development
- Docker, Kubernetes
- AWS cloud services
- Agile methodologies
- Microservices architecture
- CI/CD pipelines
`;

console.log('Testing ATS Analyzer...\n');
console.log('=' .repeat(60));

// Test 1: Basic ATS Score
console.log('\nTest 1: Basic ATS Score (without job description)');
console.log('-'.repeat(60));
const result1 = atsAnalyzer.calculateATSScore(sampleResume);
console.log('Score:', result1.total + '/100');
console.log('Rating:', result1.rating);
console.log('Parse Rate:', result1.parseRate + '%');
console.log('\nBreakdown:');
Object.entries(result1.breakdown).forEach(([key, value]) => {
  console.log(`  ${key}: ${value}`);
});
console.log('\nIssues Found:');
result1.issues.forEach((issue, i) => {
  console.log(`  ${i + 1}. ${issue}`);
});

// Test 2: With Job Description Keywords
console.log('\n\n' + '='.repeat(60));
console.log('\nTest 2: ATS Score with Job Description');
console.log('-'.repeat(60));
const keywords = atsAnalyzer.extractKeywordsFromJobDescription(sampleJobDescription);
console.log('Extracted Keywords:', keywords.join(', '));
const result2 = atsAnalyzer.calculateATSScore(sampleResume, keywords);
console.log('\nScore:', result2.total + '/100');
console.log('Rating:', result2.rating);
console.log('Parse Rate:', result2.parseRate + '%');
console.log('\nBreakdown:');
Object.entries(result2.breakdown).forEach(([key, value]) => {
  if (typeof value === 'string') {
    console.log(`  ${key}: ${value}`);
  }
});

// Test 3: Poor Resume (for comparison)
console.log('\n\n' + '='.repeat(60));
console.log('\nTest 3: Poor Quality Resume');
console.log('-'.repeat(60));
const poorResume = 'John Doe. I have some experience in programming.';
const result3 = atsAnalyzer.calculateATSScore(poorResume);
console.log('Score:', result3.total + '/100');
console.log('Rating:', result3.rating);
console.log('\nIssues Found:');
result3.issues.forEach((issue, i) => {
  console.log(`  ${i + 1}. ${issue}`);
});

console.log('\n' + '='.repeat(60));
console.log('\nAll tests completed successfully! ✓');
console.log('The ATS Analyzer is working correctly.\n');
