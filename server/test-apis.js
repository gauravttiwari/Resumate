// Test script t    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' }); verify API keys are working
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

console.log('🔍 Testing API Keys...\n');

// Test Gemini API
async function testGeminiAPI() {
  try {
    console.log('📡 Testing Gemini API...');
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = "Say 'Hello from Gemini API' in exactly 5 words.";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Gemini API Response:', text);
    return true;
  } catch (error) {
    console.log('❌ Gemini API Error:', error.message);
    return false;
  }
}

// Test Google Custom Search API
async function testGoogleSearchAPI() {
  try {
    console.log('\n🔍 Testing Google Custom Search API...');
    
    const apiKey = process.env.GOOGLE_API_KEY;
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
    
    if (!apiKey || !searchEngineId) {
      throw new Error('Missing API key or Search Engine ID');
    }
    
    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=resume+templates&num=1`;
    
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    if (data.error) {
      throw new Error(`API Error: ${data.error.message}`);
    }
    
    if (data.items && data.items.length > 0) {
      console.log('✅ Google Search API Response:');
      console.log('   - Query: resume templates');
      console.log('   - Results found:', data.searchInformation.totalResults);
      console.log('   - First result:', data.items[0].title);
      return true;
    } else {
      console.log('⚠️  No search results found');
      return false;
    }
  } catch (error) {
    console.log('❌ Google Search API Error:', error.message);
    return false;
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting API Tests for Resumate...\n');
  
  const geminiWorking = await testGeminiAPI();
  const googleSearchWorking = await testGoogleSearchAPI();
  
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  console.log(`Gemini AI API: ${geminiWorking ? '✅ WORKING' : '❌ FAILED'}`);
  console.log(`Google Search API: ${googleSearchWorking ? '✅ WORKING' : '❌ FAILED'}`);
  
  if (geminiWorking && googleSearchWorking) {
    console.log('\n🎉 All APIs are working perfectly!');
    console.log('Your Resumate server is ready to use AI features! 🚀');
  } else {
    console.log('\n⚠️  Some APIs need attention. Check the error messages above.');
  }
}

// Make fetch available globally for older Node versions
if (!global.fetch) {
  global.fetch = require('node-fetch');
}

runTests().catch(console.error);