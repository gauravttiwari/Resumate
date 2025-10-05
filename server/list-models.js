// List available Gemini models
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
dotenv.config();

async function listAvailableModels() {
  console.log('🔍 Checking available Gemini models...\n');
  
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Try to list models via API
    console.log('Attempting to list models...');
    
    // Alternative: Try the REST API directly
    if (!global.fetch) {
      global.fetch = require('node-fetch');
    }
    
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
    console.log('Making request to list models API...');
    
    const response = await fetch(apiUrl);
    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Available models:');
      
      if (data.models) {
        data.models.forEach((model, index) => {
          console.log(`${index + 1}. ${model.name} - ${model.displayName || 'No display name'}`);
          if (model.description) {
            console.log(`   Description: ${model.description.substring(0, 100)}...`);
          }
        });
      } else {
        console.log('No models found in response');
        console.log('Response:', JSON.stringify(data, null, 2));
      }
    } else {
      const errorText = await response.text();
      console.log('❌ Failed to list models:');
      console.log('Error:', errorText);
    }
    
  } catch (error) {
    console.log('❌ Error listing models:', error.message);
  }
}

listAvailableModels();