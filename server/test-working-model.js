// Quick test with working Gemini model
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
dotenv.config();

async function testWorkingModel() {
  console.log('🚀 Testing Gemini 2.5 Flash...\n');
  
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    console.log('Generating content with Gemini 2.5 Flash...');
    const result = await model.generateContent("Write a brief welcome message for a resume builder app called Resumate");
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ SUCCESS! Gemini API is working!');
    console.log('\n📝 Response:');
    console.log(text);
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testWorkingModel();