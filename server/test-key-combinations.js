// Quick test to check which key works for which service
const dotenv = require('dotenv');
dotenv.config();

async function quickTest() {
  console.log('🔍 Testing API Key Configuration...\n');
  
  // Test both possible key combinations
  const key1 = 'AIzaSyBi0OVZNIV8BKf2fWcJd7KDuT4PNu5Sagc'; // API key 2 (Custom Search API)
  const key2 = 'AIzaSyC9bJM_A9WdejjQCu63yFNaKA1yKizYFDo'; // resumate key (Generative Language API)
  const searchEngineId = '602860840bd944de1';
  
  // Make fetch available
  if (!global.fetch) {
    global.fetch = require('node-fetch');
  }
  
  console.log('Testing Key 1 (API key 2) for Google Search...');
  try {
    const url1 = `https://www.googleapis.com/customsearch/v1?key=${key1}&cx=${searchEngineId}&q=test&num=1`;
    const response1 = await fetch(url1);
    console.log(`Status: ${response1.status}`);
    if (response1.status === 200) {
      console.log('✅ Key 1 works for Google Search!');
    } else {
      const error1 = await response1.text();
      console.log(`❌ Key 1 failed: ${error1.substring(0, 100)}...`);
    }
  } catch (e) {
    console.log(`❌ Key 1 error: ${e.message}`);
  }
  
  console.log('\nTesting Key 2 (resumate) for Google Search...');
  try {
    const url2 = `https://www.googleapis.com/customsearch/v1?key=${key2}&cx=${searchEngineId}&q=test&num=1`;
    const response2 = await fetch(url2);
    console.log(`Status: ${response2.status}`);
    if (response2.status === 200) {
      console.log('✅ Key 2 works for Google Search!');
    } else {
      const error2 = await response2.text();
      console.log(`❌ Key 2 failed: ${error2.substring(0, 100)}...`);
    }
  } catch (e) {
    console.log(`❌ Key 2 error: ${e.message}`);
  }
  
  console.log('\nTesting Gemini API with both keys...');
  
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    
    console.log('Testing Key 1 for Gemini...');
    try {
      const genAI1 = new GoogleGenerativeAI(key1);
      const model1 = genAI1.getGenerativeModel({ model: "gemini-pro" });
      const result1 = await model1.generateContent("Say hello");
      console.log('✅ Key 1 works for Gemini!');
    } catch (e) {
      console.log(`❌ Key 1 failed for Gemini: ${e.message.substring(0, 100)}...`);
    }
    
    console.log('Testing Key 2 for Gemini...');
    try {
      const genAI2 = new GoogleGenerativeAI(key2);
      const model2 = genAI2.getGenerativeModel({ model: "gemini-pro" });
      const result2 = await model2.generateContent("Say hello");
      console.log('✅ Key 2 works for Gemini!');
    } catch (e) {
      console.log(`❌ Key 2 failed for Gemini: ${e.message.substring(0, 100)}...`);
    }
    
  } catch (error) {
    console.log('❌ Gemini module error:', error.message);
  }
}

quickTest();