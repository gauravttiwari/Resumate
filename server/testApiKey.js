// Test API Key Validity
require('dotenv').config();

async function testApiKey() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  console.log('🔑 Testing GEMINI_API_KEY...\n');
  console.log('API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT FOUND');
  
  if (!apiKey) {
    console.error('\n❌ GEMINI_API_KEY not set in .env file');
    console.log('\n📝 To fix this:');
    console.log('1. Go to: https://makersuite.google.com/app/apikey');
    console.log('2. Create a new API key');
    console.log('3. Add to server/.env file:');
    console.log('   GEMINI_API_KEY=your_api_key_here');
    return;
  }

  // Test with direct HTTP request using native https
  const https = require('https');
  
  try {
    console.log('\n🧪 Testing API key with simple request...');
    
    const postData = JSON.stringify({
      contents: [{
        parts: [{
          text: 'Say hello'
        }]
      }]
    });
    
    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const data = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            resolve({ ok: res.statusCode === 200, data: JSON.parse(body) });
          } catch (e) {
            reject(e);
          }
        });
      });
      req.on('error', reject);
      req.write(postData);
      req.end();
    });
    
    if (response.ok) {
      console.log('✅ API Key is VALID!');
      console.log('\n📝 Response:', response.data.candidates[0].content.parts[0].text);
    } else {
      console.error('❌ API Key Error:');
      console.error(JSON.stringify(response.data, null, 2));
      
      if (response.data.error?.status === 'PERMISSION_DENIED') {
        console.log('\n📝 API key may be invalid or expired');
        console.log('Get a new one from: https://makersuite.google.com/app/apikey');
      } else if (response.data.error?.message?.includes('API key')) {
        console.log('\n📝 API key format issue');
      }
    }
  } catch (error) {
    console.error('❌ Network Error:', error.message);
  }
}

testApiKey();
