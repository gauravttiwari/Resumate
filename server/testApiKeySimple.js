// Test API Key Validity with Gemini SDK
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testApiKey() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  console.log('🔑 Testing GEMINI_API_KEY...\n');
  console.log('API Key:', apiKey ? `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length-4)}` : 'NOT FOUND');
  
  if (!apiKey) {
    console.error('\n❌ GEMINI_API_KEY not set in .env file');
    console.log('\n📝 To fix this:');
    console.log('1. Go to: https://aistudio.google.com/app/apikey');
    console.log('2. Create a new API key');
    console.log('3. Add to server/.env file:');
    console.log('   GEMINI_API_KEY=your_api_key_here');
    return;
  }

  try {
    console.log('\n🧪 Testing with Gemini SDK...');
    const genAI = new GoogleGenerativeAI(apiKey);
    // Try gemini-1.5-flash first (free tier)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    console.log('Sending test request...');
    const result = await model.generateContent('Say hello in one word');
    const response = result.response;
    const text = response.text();
    
    console.log('✅ API Key is VALID!');
    console.log('✅ Gemini AI is working!\n');
    console.log('📝 Test Response:', text);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    
    if (error.message.includes('API_KEY_INVALID') || error.message.includes('PERMISSION_DENIED')) {
      console.log('\n📝 Your API key is invalid or expired');
      console.log('Get a new one from: https://aistudio.google.com/app/apikey');
    } else if (error.message.includes('404') || error.message.includes('not found')) {
      console.log('\n📝 Model "gemini-pro" not available with your API key');
      console.log('Try these models instead: gemini-1.5-pro, gemini-1.5-flash');
      console.log('\nOr upgrade your API key at: https://aistudio.google.com');
    } else if (error.message.includes('quota')) {
      console.log('\n📝 API quota exceeded');
      console.log('Wait a few minutes or upgrade your plan');
    }
  }
}

testApiKey();
