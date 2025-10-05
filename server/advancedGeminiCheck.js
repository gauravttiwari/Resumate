// Advanced Gemini API Troubleshooter
const https = require('https');
require('dotenv').config();

async function comprehensiveDiagnosis() {
  console.log('🔧 Advanced Gemini API Troubleshooter\n');
  console.log('=' .repeat(80));
  
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ No API key found in .env file');
    return;
  }
  
  console.log('✅ API Key Found:', `${apiKey.substring(0, 12)}...${apiKey.substring(apiKey.length-4)}`);
  console.log('=' .repeat(80));
  
  // Test 1: Try different API versions
  console.log('\n📊 Test 1: Checking API Versions...\n');
  
  const apiVersions = ['v1beta', 'v1', 'v1alpha'];
  const models = ['gemini-pro', 'gemini-1.5-flash', 'gemini-1.5-pro', 'text-bison-001'];
  
  let workingCombo = null;
  
  for (const version of apiVersions) {
    for (const model of models) {
      try {
        const result = await testModelWithVersion(apiKey, model, version);
        if (result.success) {
          console.log(`✅ FOUND WORKING COMBINATION!`);
          console.log(`   API Version: ${version}`);
          console.log(`   Model: ${model}`);
          console.log(`   Response: ${result.response}\n`);
          workingCombo = { version, model };
          break;
        } else {
          console.log(`❌ ${version}/${model} - ${result.error.substring(0, 50)}...`);
        }
      } catch (error) {
        console.log(`❌ ${version}/${model} - ${error.message.substring(0, 50)}...`);
      }
    }
    if (workingCombo) break;
  }
  
  if (!workingCombo) {
    console.log('\n' + '─'.repeat(80));
    console.log('❌ No working combination found with current API key\n');
    
    // Test 2: Check if it's an authentication issue
    console.log('📊 Test 2: Checking API Key Authentication...\n');
    
    const authResult = await checkAuthentication(apiKey);
    if (authResult.authenticated) {
      console.log('✅ API Key is VALID and AUTHENTICATED');
      console.log('⚠️  But models are not accessible\n');
      
      console.log('🔍 DIAGNOSIS:');
      console.log('Your API key is valid but does NOT have access to Gemini models.');
      console.log('This is a Google Cloud PROJECT CONFIGURATION issue.\n');
      
      console.log('✅ SOLUTION - Enable Gemini API Properly:\n');
      console.log('Method 1: Use Google AI Studio (Easiest)');
      console.log('─'.repeat(80));
      console.log('1. Go to: https://aistudio.google.com/app/apikey');
      console.log('2. Click "Create API key"');
      console.log('3. Select "Create API key in NEW PROJECT" (Very Important!)');
      console.log('4. Wait 30 seconds for project setup');
      console.log('5. Copy the new API key');
      console.log('6. Test immediately - it should work!\n');
      
      console.log('Method 2: Enable Via Google Cloud Console');
      console.log('─'.repeat(80));
      console.log('1. Go to: https://console.cloud.google.com/');
      console.log('2. Select your project (top left dropdown)');
      console.log('3. Go to: APIs & Services > Library');
      console.log('4. Search: "Generative Language API"');
      console.log('5. Click "ENABLE"');
      console.log('6. Wait 2-3 minutes for propagation');
      console.log('7. Go to: https://aistudio.google.com/app/apikey');
      console.log('8. Create NEW API key in that project');
      console.log('9. Use the new key\n');
      
      console.log('Method 3: Create Completely Fresh Setup');
      console.log('─'.repeat(80));
      console.log('1. Go to: https://console.cloud.google.com/');
      console.log('2. Create NEW PROJECT (top left, "New Project")');
      console.log('3. Wait for project creation (1-2 minutes)');
      console.log('4. In new project: APIs & Services > Library');
      console.log('5. Enable "Generative Language API"');
      console.log('6. Go to: APIs & Services > Credentials');
      console.log('7. Click "+ CREATE CREDENTIALS" > "API key"');
      console.log('8. Copy the key immediately');
      console.log('9. Update server/.env file');
      console.log('10. Test: node checkApiAccess.js\n');
      
    } else {
      console.log('❌ API Key AUTHENTICATION FAILED');
      console.log('Error:', authResult.error);
      console.log('\n✅ SOLUTION: Create a completely new API key');
      console.log('Go to: https://aistudio.google.com/app/apikey\n');
    }
    
    console.log('─'.repeat(80));
    console.log('⚠️  IMPORTANT NOTES:');
    console.log('1. Free tier API keys sometimes have delays (wait 5-10 mins after creation)');
    console.log('2. Some regions may have restricted access');
    console.log('3. If billing is not enabled, only basic models work');
    console.log('4. Old API keys (before 2024) may not work with new models');
    console.log('─'.repeat(80));
    
  } else {
    console.log('\n' + '='.repeat(80));
    console.log('🎉 SUCCESS! Gemini API is Working!');
    console.log('='.repeat(80));
    console.log('\n📝 Update your code to use:');
    console.log(`   API Version: ${workingCombo.version}`);
    console.log(`   Model: ${workingCombo.model}\n`);
  }
}

function testModelWithVersion(apiKey, model, version) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      contents: [{
        parts: [{
          text: 'Hi'
        }]
      }]
    });
    
    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/${version}/models/${model}:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 5000
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
              error: data.error.message || 'Unknown error'
            });
          } else {
            resolve({
              success: false,
              error: `HTTP ${res.statusCode}`
            });
          }
        } catch (e) {
          resolve({ success: false, error: e.message });
        }
      });
    });
    
    req.on('error', (error) => {
      resolve({ success: false, error: error.message });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({ success: false, error: 'Timeout' });
    });
    
    req.write(postData);
    req.end();
  });
}

function checkAuthentication(apiKey) {
  return new Promise((resolve) => {
    // Try to access the models list endpoint
    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models?key=${apiKey}`,
      method: 'GET',
      timeout: 5000
    };
    
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (res.statusCode === 200) {
            resolve({ authenticated: true, models: data.models || [] });
          } else if (data.error) {
            resolve({ authenticated: false, error: data.error.message });
          } else {
            resolve({ authenticated: false, error: `HTTP ${res.statusCode}` });
          }
        } catch (e) {
          resolve({ authenticated: false, error: e.message });
        }
      });
    });
    
    req.on('error', (error) => {
      resolve({ authenticated: false, error: error.message });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({ authenticated: false, error: 'Timeout' });
    });
    
    req.end();
  });
}

comprehensiveDiagnosis().catch(console.error);
