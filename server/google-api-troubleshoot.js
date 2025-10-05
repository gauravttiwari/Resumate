// Check Google API key status and provide solutions
const dotenv = require('dotenv');
dotenv.config();

async function googleApiTroubleshoot() {
  console.log('🔧 Google Search API Troubleshooting...\n');
  
  if (!global.fetch) {
    global.fetch = require('node-fetch');
  }
  
  // Test the API
  console.log('📡 Testing Google Custom Search API...');
  const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&q=test&num=1`;
  
  try {
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    if (response.status === 200) {
      console.log('✅ Google Search API is working!');
      console.log(`Found ${data.searchInformation.totalResults} results`);
    } else {
      console.log(`❌ Status: ${response.status}`);
      console.log('Error:', JSON.stringify(data, null, 2));
      
      // Provide specific solutions based on error
      if (data.error?.message?.includes('API key not valid')) {
        console.log('\n🛠️  SOLUTIONS FOR API KEY ERROR:');
        console.log('1. Wait 5-10 minutes for API key activation');
        console.log('2. Go to Google Cloud Console: https://console.cloud.google.com/');
        console.log('3. Navigate to "APIs & Services" > "Library"');
        console.log('4. Search for "Custom Search API" and ENABLE it');
        console.log('5. Check that billing is enabled for your project');
        console.log('6. Verify API key restrictions match your usage');
        console.log('\n📋 Current API Key (first 10 chars):', process.env.GOOGLE_API_KEY?.substring(0, 10) + '...');
      }
    }
    
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
  
  // Show alternative approach
  console.log('\n💡 ALTERNATIVE: You can continue development without Google Search API');
  console.log('The resume builder core features will work without it.');
  console.log('Search functionality can be added later once API issues are resolved.');
}

googleApiTroubleshoot();