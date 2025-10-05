// Monitor API activation after billing setup
const dotenv = require('dotenv');
dotenv.config();

async function monitorApiActivation() {
  console.log('🔄 Monitoring API Activation...\n');
  console.log('Run this script after enabling billing to check when APIs become active.\n');
  
  if (!global.fetch) {
    global.fetch = require('node-fetch');
  }
  
  let attempt = 1;
  const maxAttempts = 10;
  
  while (attempt <= maxAttempts) {
    console.log(`📡 Attempt ${attempt}/${maxAttempts} - Testing Google Search API...`);
    
    try {
      const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&q=test&num=1`;
      const response = await fetch(searchUrl);
      const data = await response.json();
      
      if (response.status === 200) {
        console.log('🎉 SUCCESS! Google Search API is now working!');
        console.log(`   Found ${data.searchInformation.totalResults} results`);
        console.log('   ✅ Both APIs are now functional!');
        break;
      } else {
        console.log(`   ❌ Still not working: ${data.error?.message}`);
        
        if (attempt < maxAttempts) {
          console.log('   ⏳ Waiting 30 seconds before next attempt...\n');
          await new Promise(resolve => setTimeout(resolve, 30000));
        }
      }
      
    } catch (error) {
      console.log(`   ❌ Network error: ${error.message}`);
    }
    
    attempt++;
  }
  
  if (attempt > maxAttempts) {
    console.log('\n⚠️  API still not active after 10 attempts.');
    console.log('Please verify:');
    console.log('1. Billing is enabled');
    console.log('2. Custom Search API is enabled');
    console.log('3. Wait a bit longer (up to 15 minutes)');
  }
}

// Show current status first
async function showCurrentStatus() {
  console.log('📋 Current API Status:');
  console.log('======================');
  
  // Test Gemini
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    await model.generateContent("test");
    console.log('Gemini AI: ✅ WORKING');
  } catch (error) {
    console.log('Gemini AI: ❌ FAILED');
  }
  
  // Test Google Search
  try {
    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&q=test&num=1`;
    const response = await fetch(searchUrl);
    if (response.status === 200) {
      console.log('Google Search: ✅ WORKING');
    } else {
      console.log('Google Search: ❌ FAILED (billing/API not enabled)');
    }
  } catch (error) {
    console.log('Google Search: ❌ FAILED');
  }
  
  console.log('\n');
}

showCurrentStatus().then(() => {
  console.log('💡 After enabling billing and Custom Search API, this script will');
  console.log('   automatically monitor until both APIs are working!\n');
  monitorApiActivation();
}).catch(console.error);