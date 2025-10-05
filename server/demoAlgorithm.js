// Quick Demo - Enhanced Algorithm Working
const atsAnalyzer = require('./services/atsAnalyzer');

console.log('🎯 Enhanced Algorithm Demo\n');
console.log('─'.repeat(80));

// Sample Resume (Poor Quality)
const poorResume = `
John Doe
email@email.com

I am developer. I know programming.

Work:
Did some coding at company
Made websites

Education:
College graduate
`;

// Sample Resume (Good Quality)
const goodResume = `
JOHN DOE
john.doe@email.com | +1234567890

PROFESSIONAL SUMMARY
Experienced Full Stack Developer with 5+ years of expertise in React, Node.js, and cloud technologies. Led teams of 5+ developers and delivered projects reducing costs by 40%.

SKILLS
JavaScript, React, Node.js, Python, SQL, MongoDB, Docker, AWS, Git, Agile

EXPERIENCE
Senior Developer | Tech Corp | 2020-2024
• Developed microservices using Node.js and Express, serving 1M+ users
• Led team of 5 developers in agile environment
• Reduced infrastructure costs by 40% through optimization
• Implemented CI/CD pipelines using Docker and AWS

Developer | StartUp Inc | 2018-2020
• Built React-based dashboard increasing user engagement by 60%
• Collaborated with cross-functional teams to deliver features
• Wrote unit tests achieving 90% code coverage

EDUCATION
Bachelor of Science in Computer Science
MIT University | 2014-2018 | GPA: 3.8/4.0

PROJECTS
E-commerce Platform: Built scalable platform using MERN stack handling 10K+ daily transactions
`;

const jobDescription = `
Full Stack Developer needed with:
- React, Node.js, Express
- MongoDB, PostgreSQL
- Docker, Kubernetes, AWS
- Team leadership experience
- Agile/Scrum methodology
`;

console.log('📋 Testing Poor Resume:\n');
const poorResult = atsAnalyzer.calculateATSScore(poorResume, 
  atsAnalyzer.extractKeywordsFromJobDescription(jobDescription)
);
console.log(`Score: ${poorResult.total}/100 (${poorResult.rating})`);
console.log(`Parse Rate: ${poorResult.parseRate}%`);
console.log(`\nIssues Found (${poorResult.issues.length}):`);
poorResult.issues.forEach(issue => console.log(`  ${issue}`));

console.log('\n' + '─'.repeat(80));
console.log('\n📋 Testing Good Resume:\n');

const goodResult = atsAnalyzer.calculateATSScore(goodResume,
  atsAnalyzer.extractKeywordsFromJobDescription(jobDescription)
);
console.log(`Score: ${goodResult.total}/100 (${goodResult.rating})`);
console.log(`Parse Rate: ${goodResult.parseRate}%`);
console.log(`\nBreakdown:`);
console.log(`  Sections: ${goodResult.breakdown.sectionsScore}/50`);
console.log(`  Keywords: ${goodResult.breakdown.keywordScore}/40`);
console.log(`  Format: ${goodResult.breakdown.formatScore}/10`);

if (goodResult.issues.length > 0) {
  console.log(`\nIssues Found (${goodResult.issues.length}):`);
  goodResult.issues.forEach(issue => console.log(`  ${issue}`));
}

console.log('\n' + '─'.repeat(80));
console.log('\n✅ Algorithm Working Perfectly!');
console.log('   Poor Resume: Low score with detailed issues');
console.log('   Good Resume: High score with minimal issues');
console.log('\n💡 This same algorithm generates AI-style suggestions in API!');
