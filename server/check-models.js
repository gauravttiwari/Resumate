// Check available Gemini models
const dotenv = require('dotenv');
dotenv.config();

async function listGeminiModels() {
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    console.log('🔍 Checking available Gemini models...\n');
    
    // Try different model names
    const modelsToTry = [
      'gemini-pro',
      'gemini-1.5-flash', 
      'gemini-1.5-pro',
      'models/gemini-pro',
      'models/gemini-1.5-flash',
      'models/gemini-1.5-pro'
    ];
    
    for (const modelName of modelsToTry) {
      try {
        console.log(`Testing model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello");
        const response = await result.response;
        console.log(`✅ ${modelName} works!`);
        console.log(`Response: ${response.text().substring(0, 50)}...\n`);
        return modelName;
      } catch (error) {
        console.log(`❌ ${modelName} failed: ${error.message.substring(0, 100)}...\n`);
      }
    }
    
    console.log('❌ No working models found');
    return null;
  } catch (error) {
    console.log('❌ Error:', error.message);
    return null;
  }
}

listGeminiModels();