// Test the enhanced ATS API with sample resume
const https = require('https');
const http = require('http');

const sampleResume = `
JOHN DOE
Email: john.doe@email.com
Phone: +1234567890

SUMMARY
Experienced Software Developer with 5 years in full-stack development.

SKILLS
JavaScript, React, Node.js, Python, SQL, MongoDB

EXPERIENCE
Senior Developer at Tech Corp (2020-2024)
• Developed microservices using Node.js
• Led team of 5 developers
• Reduced costs by 40%

EDUCATION
Bachelor of Science in Computer Science
MIT University (2014-2018)
`;

const jobDescription = `
Looking for Full Stack Developer with:
- React, Node.js, Express
- MongoDB, SQL
- Docker, Kubernetes
- AWS experience
- Team leadership
`;

const postData = JSON.stringify({
  resumeData: sampleResume,
  jobDescription: jobDescription,
  jobTitle: 'Full Stack Developer'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/ai/exact-ats-score',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('🧪 Testing Enhanced ATS API...\n');
console.log('Sending request to: http://localhost:5000/api/ai/exact-ats-score\n');

const req = http.request(options, (res) => {
  let body = '';
  
  res.on('data', (chunk) => {
    body += chunk;
  });
  
  res.on('end', () => {
    console.log('Response Status:', res.statusCode);
    console.log('─'.repeat(80));
    
    try {
      const response = JSON.parse(body);
      
      if (response.success) {
        console.log('\n✅ SUCCESS! ATS Analysis Complete\n');
        
        console.log('📊 ATS SCORE:', response.data.atsScore.totalScore + '/100');
        console.log('⭐ RATING:', response.data.atsScore.rating);
        console.log('📈 PARSE RATE:', response.data.parseRate + '%');
        
        console.log('\n📋 BREAKDOWN:');
        console.log('  Sections Score:', response.data.atsScore.breakdown.sectionsScore + '/50');
        console.log('  Keyword Score:', response.data.atsScore.breakdown.keywordScore + '/40');
        console.log('  Format Score:', response.data.atsScore.breakdown.formatScore + '/10');
        
        console.log('\n🔍 ISSUES FOUND:', response.data.issuesCount);
        if (response.data.issues && response.data.issues.length > 0) {
          response.data.issues.forEach(issue => {
            console.log('  ' + issue);
          });
        }
        
        console.log('\n💡 AI-STYLE SUGGESTIONS:');
        console.log('─'.repeat(80));
        console.log(response.data.geminiSuggestions || response.data.generatedSummary);
        console.log('─'.repeat(80));
        
        console.log('\n✅ Test Complete! Enhanced algorithmic suggestions working!');
        
      } else {
        console.error('❌ API returned error:', response.error);
      }
      
    } catch (error) {
      console.error('❌ Failed to parse response:', error.message);
      console.log('Raw response:', body);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
  console.log('\n📝 Make sure backend server is running:');
  console.log('   cd server && npm start');
});

req.write(postData);
req.end();
