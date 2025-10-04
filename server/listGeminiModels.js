// List available Gemini models
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found');
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    console.log('🔍 Fetching available models...\n');
    const models = await genAI.listModels();
    
    console.log('Available Models:');
    console.log('─'.repeat(60));
    
    for await (const model of models) {
      console.log(`\n📦 ${model.name}`);
      console.log(`   Display Name: ${model.displayName}`);
      console.log(`   Supported Methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

listModels();
