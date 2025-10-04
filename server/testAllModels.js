// Test all available Gemini model versions
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testAllModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  console.log('🔑 API Key:', apiKey ? `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length-4)}` : 'NOT FOUND');
  console.log('\n🧪 Testing different Gemini models...\n');
  
  const modelsToTry = [
    'gemini-1.5-flash-latest',
    'gemini-1.5-flash',
    'gemini-1.5-pro-latest',
    'gemini-1.5-pro',
    'gemini-pro',
    'gemini-1.0-pro',
    'models/gemini-1.5-flash-latest',
    'models/gemini-1.5-flash',
    'models/gemini-pro'
  ];

  for (const modelName of modelsToTry) {
    try {
      console.log(`Testing: ${modelName}...`);
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: modelName });
      
      const result = await model.generateContent('Say hello');
      const text = result.response.text();
      
      console.log(`✅ SUCCESS! Model "${modelName}" is working!`);
      console.log(`   Response: ${text}\n`);
      
      console.log('─'.repeat(60));
      console.log('🎉 USE THIS MODEL IN YOUR CODE:');
      console.log(`   model: '${modelName}'`);
      console.log('─'.repeat(60));
      return; // Exit after first success
      
    } catch (error) {
      console.log(`❌ Failed: ${error.message.substring(0, 100)}...\n`);
    }
  }
  
  console.log('─'.repeat(60));
  console.log('❌ None of the models worked!');
  console.log('\n📝 Possible solutions:');
  console.log('1. Your API key may be from an old Google AI Studio account');
  console.log('2. Try creating a NEW API key at: https://aistudio.google.com/app/apikey');
  console.log('3. Make sure you select a Cloud project when creating the key');
  console.log('4. Or use the fallback algorithm (which already works perfectly!)');
}

testAllModels();
