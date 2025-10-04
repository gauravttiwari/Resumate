// Quick Test - Verify Gemini AI Integration
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testGeminiIntegration() {
  console.log('🧪 Testing Gemini AI Integration...\n');

  // Step 1: Check API Key
  console.log('Step 1: Checking GEMINI_API_KEY...');
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found in .env file!');
    console.log('\n📝 Add this to server/.env:');
    console.log('GEMINI_API_KEY=your_api_key_here');
    return;
  }
  console.log('✅ GEMINI_API_KEY found\n');

  // Step 2: Initialize Gemini
  console.log('Step 2: Initializing Gemini AI...');
  const genAI = new GoogleGenerativeAI(apiKey);
  // Try multiple model names in order of preference
  let model;
  const modelNames = ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro'];
  
  for (const modelName of modelNames) {
    try {
      model = genAI.getGenerativeModel({ model: modelName });
      console.log(`✅ Using model: ${modelName}\n`);
      break;
    } catch (err) {
      console.log(`⚠️  ${modelName} not available, trying next...`);
    }
  }
  
  if (!model) {
    console.error('❌ No compatible model found');
    return;
  }
  console.log('✅ Gemini AI initialized\n');

  // Step 3: Test with Sample Resume
  console.log('Step 3: Testing with sample resume...');
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
  `.trim();

  const jobDescription = `
Looking for Full Stack Developer with:
- React, Node.js, Express
- MongoDB, SQL
- Docker, Kubernetes
- AWS experience
- Team leadership
  `.trim();

  const prompt = `Analyze the following resume for ATS improvement:

${sampleResume}

Job Description:
${jobDescription}

Provide:
1. Missing important keywords
2. Improvements in Summary/Skills sections
3. Action verbs to add
4. Specific recommendations to improve ATS score

Response in short bullet points.`;

  try {
    console.log('Calling Gemini AI...');
    const result = await model.generateContent(prompt);
    const response = result.response;
    const suggestions = response.text();

    console.log('\n✅ Gemini AI Response:\n');
    console.log('─'.repeat(60));
    console.log(suggestions);
    console.log('─'.repeat(60));

    // Step 4: Verify Suggestions Quality
    console.log('\n\nStep 4: Verifying suggestions quality...');
    const hasMissingKeywords = suggestions.toLowerCase().includes('docker') || 
                               suggestions.toLowerCase().includes('kubernetes') ||
                               suggestions.toLowerCase().includes('aws');
    const hasActionVerbs = suggestions.toLowerCase().includes('verb') || 
                           suggestions.toLowerCase().includes('action');
    const hasImprovements = suggestions.toLowerCase().includes('improve') ||
                           suggestions.toLowerCase().includes('add') ||
                           suggestions.toLowerCase().includes('enhance');

    if (hasMissingKeywords) console.log('✅ Identifies missing keywords');
    else console.log('⚠️  May not identify missing keywords');

    if (hasActionVerbs) console.log('✅ Suggests action verbs');
    else console.log('⚠️  May not suggest action verbs');

    if (hasImprovements) console.log('✅ Provides improvement suggestions');
    else console.log('⚠️  May not provide improvements');

    console.log('\n✅ Gemini AI Integration Working!\n');

  } catch (error) {
    console.error('\n❌ Error calling Gemini AI:');
    console.error('Error:', error.message);
    
    if (error.message.includes('API key')) {
      console.log('\n📝 Your API key may be invalid. Get a new one from:');
      console.log('https://makersuite.google.com/app/apikey');
    } else if (error.message.includes('quota')) {
      console.log('\n📝 API quota exceeded. Wait or upgrade your plan.');
    } else if (error.message.includes('network')) {
      console.log('\n📝 Network error. Check your internet connection.');
    }
  }
}

// Run test
testGeminiIntegration().catch(console.error);
