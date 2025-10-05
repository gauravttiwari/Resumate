// Test Google Custom Search API
require('dotenv').config();

async function testGoogleSearchAPI() {
  const apiKey = process.env.GOOGLE_API_KEY;
  const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
  
  console.log('🔍 Testing Google Custom Search API\n');
  console.log('API Key:', apiKey ? `${apiKey.substring(0, 12)}...${apiKey.substring(apiKey.length-4)}` : 'NOT FOUND');
  console.log('Search Engine ID:', searchEngineId || 'NOT FOUND');
  
  if (!apiKey || !searchEngineId) {
    console.error('\n❌ Google Search API not configured');
    return;
  }
  
  try {
    const https = require('https');
    const query = 'resume template';
    
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}&num=1`;
    
    console.log('\n📡 Testing API call...');
    
    const result = await new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject);
    });
    
    if (result.status === 200 && result.data.items) {
      console.log('✅ Google Custom Search API is WORKING!');
      console.log(`✅ Found ${result.data.items.length} results`);
      console.log(`✅ Search quota: ${result.data.searchInformation?.totalResults || 'N/A'} total results\n`);
      console.log('📝 This API is used for template search feature (optional)');
      console.log('📝 Your GOOGLE_API_KEY is valid and active!\n');
    } else if (result.data.error) {
      console.error('❌ API Error:', result.data.error.message);
      
      if (result.data.error.code === 403) {
        console.log('\n📝 Quota exceeded or billing not enabled');
        console.log('This is OPTIONAL - app works without it');
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testGoogleSearchAPI();
