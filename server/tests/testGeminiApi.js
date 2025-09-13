// tests/testGeminiApi.js

const geminiService = require('../services/geminiService');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Check if API key is present
if (!process.env.GEMINI_API_KEY) {
  console.error(
    '\x1b[31m%s\x1b[0m',
    'ERROR: GEMINI_API_KEY is missing in .env file'
  );
  console.log(
    'Please create a .env file in the server directory with your Gemini API key:'
  );
  console.log('GEMINI_API_KEY=your_api_key_here');
  process.exit(1);
}

// Sample resume data for testing
const sampleResumeData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '(555) 123-4567',
  location: 'New York, NY',
  title: 'Software Engineer',
  summary: 'Experienced software engineer with a focus on web development.',
  workExperience: [
    {
      company: 'Tech Company',
      position: 'Senior Developer',
      startDate: '2020-01',
      endDate: 'Present',
      description:
        'Developed and maintained web applications using React and Node.js.',
    },
  ],
  skills: ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB'],
  education: [
    {
      institution: 'University of Technology',
      degree: 'Bachelor of Science in Computer Science',
      date: '2019',
    },
  ],
};

// Helper function to run a test and log results
async function runTest(name, testFn) {
  try {
    console.log(`\n\x1b[34m[TEST] ${name}\x1b[0m`);
    console.time('Test duration');
    const result = await testFn();
    console.timeEnd('Test duration');
    console.log('\x1b[32m[SUCCESS]\x1b[0m');
    console.log('Result:', JSON.stringify(result, null, 2));
    return true;
  } catch (error) {
    console.timeEnd('Test duration');
    console.log('\x1b[31m[FAILED]\x1b[0m');
    console.error('Error:', error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('\x1b[35m=== Gemini API Test Suite ===\x1b[0m');

  let passCount = 0;
  const totalTests = 3;

  // Test 1: Generate content
  if (
    await runTest('Generate simple content', () =>
      geminiService.generateContent(
        'Write a brief welcome message for a resume builder application.'
      )
    )
  )
    passCount++;

  // Test 2: Optimize resume
  if (
    await runTest('Optimize resume', () =>
      geminiService.optimizeResume(sampleResumeData, 'Full Stack Developer')
    )
  )
    passCount++;

  // Test 3: Generate summary
  if (
    await runTest('Generate professional summary', () =>
      geminiService.generateSummary(sampleResumeData)
    )
  )
    passCount++;

  // Print test summary
  console.log(`\n\x1b[35m=== Test Results ===\x1b[0m`);
  console.log(`Tests passed: ${passCount}/${totalTests}`);

  if (passCount === totalTests) {
    console.log(
      '\x1b[32m✓ All tests passed! Gemini AI integration is working correctly.\x1b[0m'
    );
  } else {
    console.log(
      `\x1b[33m⚠ ${
        totalTests - passCount
      } test(s) failed. Check the error messages above.\x1b[0m`
    );
  }
}

// Start the tests
runAllTests().catch((error) => {
  console.error('\x1b[31mTest suite failed:\x1b[0m', error);
});
