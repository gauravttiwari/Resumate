// Advanced API diagnostics
const dotenv = require('dotenv');
dotenv.config();

async function advancedDiagnostics() {
  console.log('🔬 Advanced API Diagnostics...\n');
  
  // Check environment variables
  console.log('📋 Environment Check:');
  console.log(`Google API Key: ${process.env.GOOGLE_API_KEY ? 'SET ✓' : 'MISSING ✗'}`);
  console.log(`Gemini API Key: ${process.env.GEMINI_API_KEY ? 'SET ✓' : 'MISSING ✗'}`);
  console.log(`Search Engine ID: ${process.env.GOOGLE_SEARCH_ENGINE_ID ? 'SET ✓' : 'MISSING ✗'}`);
  console.log('');
  
  // Test Google Search API with detailed response
  console.log('🔍 Google Search API Detailed Test:');
  try {
    if (!global.fetch) {
      global.fetch = require('node-fetch');
    }
    
    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&q=test&num=1`;
    
    console.log('Making request to Google API...');
    const response = await fetch(searchUrl);
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('Response body (first 200 chars):', responseText.substring(0, 200));
    
    if (response.status === 200) {
      console.log('✅ Google Search API is working!');
      const data = JSON.parse(responseText);
      if (data.searchInformation) {
        console.log(`Found ${data.searchInformation.totalResults} results`);
      }
    } else {
      console.log('❌ Google Search API failed');
      try {
        const errorData = JSON.parse(responseText);
        console.log('Error details:', JSON.stringify(errorData, null, 2));
      } catch (e) {
        console.log('Raw error:', responseText);
      }
    }
    
  } catch (error) {
    console.log('❌ Google API request failed:', error.message);
  }
  
  console.log('\n🤖 Gemini API Detailed Test:');
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    
    console.log('Creating Gemini AI instance...');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Try different model names
    const modelsToTry = ['gemini-pro', 'gemini-1.5-flash', 'gemini-1.5-pro'];
    
    for (const modelName of modelsToTry) {
      console.log(`\nTrying model: ${modelName}`);
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        console.log('Model created, attempting generation...');
        
        const result = await model.generateContent("Hello, just testing!");
        const response = await result.response;
        const text = response.text();
        
        console.log(`✅ SUCCESS with ${modelName}!`);
        console.log(`Response: ${text.substring(0, 100)}...`);
        break; // Stop on first success
        
      } catch (modelError) {
        console.log(`❌ ${modelName} failed: ${modelError.message.substring(0, 150)}...`);
      }
    }
    
  } catch (error) {
    console.log('❌ Gemini module error:', error.message);
  }
  
  console.log('\n📊 Diagnostic Summary:');
  console.log('- Check if API keys need more time to activate (up to 10 minutes)');
  console.log('- Verify API restrictions match the intended use');
  console.log('- Ensure billing is enabled if required');
  console.log('- Check quota limits in Google Cloud Console');
}

advancedDiagnostics();