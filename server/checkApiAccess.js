// Check Gemini API Key Status and Access
const https = require('https');
require('dotenv').config();

async function checkApiAccess() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  console.log('🔍 Checking Gemini API Access...\n');
  console.log('API Key:', apiKey ? `${apiKey.substring(0, 15)}...${apiKey.substring(apiKey.length-4)}` : 'NOT FOUND');
  
  if (!apiKey) {
    console.error('\n❌ GEMINI_API_KEY not found in .env file');
    return;
  }
  
  // Test 1: Check API key validity with direct HTTP call
  console.log('\n📡 Test 1: Checking API key validity...');
  
  const testModels = [
    'gemini-pro',
    'gemini-1.5-flash',
    'gemini-1.5-pro'
  ];
  
  for (const modelName of testModels) {
    try {
      const result = await makeApiCall(apiKey, modelName);
      
      if (result.success) {
        console.log(`✅ ${modelName} - WORKING!`);
        console.log(`   Response: ${result.response}`);
        return; // Exit after first success
      } else {
        console.log(`❌ ${modelName} - ${result.error}`);
      }
    } catch (error) {
      console.log(`❌ ${modelName} - ${error.message}`);
    }
  }
  
  console.log('\n' + '─'.repeat(80));
  console.log('❌ API Key Issue Detected!');
  console.log('\n🔍 Diagnosis:');
  console.log('Your API key exists but cannot access any Gemini models.');
  console.log('\n💡 Possible Reasons:');
  console.log('1. Free tier API keys may have restricted access');
  console.log('2. API key may be from old Google AI Studio (pre-2024)');
  console.log('3. Generative Language API not enabled in project');
  console.log('4. Billing may need to be enabled for model access');
  console.log('\n✅ SOLUTION:');
  console.log('Create a FRESH API key with these steps:');
  console.log('1. Go to: https://aistudio.google.com/app/apikey');
  console.log('2. Click "Create API key"');
  console.log('3. Select "Create API key in new project" (Important!)');
  console.log('4. Wait for project creation');
  console.log('5. Copy the new API key');
  console.log('6. Replace in server/.env: GEMINI_API_KEY=your_new_key');
  console.log('\n📝 Alternative: Use Enhanced Algorithm (Already Working!)');
  console.log('Your app has intelligent algorithmic suggestions that work without AI.');
}

function makeApiCall(apiKey, modelName) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      contents: [{
        parts: [{
          text: 'Hello'
        }]
      }]
    });
    
    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          
          if (res.statusCode === 200 && data.candidates) {
            resolve({
              success: true,
              response: data.candidates[0]?.content?.parts[0]?.text || 'OK'
            });
          } else if (data.error) {
            resolve({
              success: false,
              error: data.error.message.substring(0, 60) + '...'
            });
          } else {
            resolve({
              success: false,
              error: `HTTP ${res.statusCode}`
            });
          }
        } catch (e) {
          reject(e);
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.write(postData);
    req.end();
  });
}

checkApiAccess().catch(console.error);
