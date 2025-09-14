require('dotenv').config();
const https = require('https');

// Test Google Custom Search API
function testGoogleCustomSearch() {
    const apiKey = process.env.GOOGLE_API_KEY;
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
    
    if (!apiKey || !searchEngineId) {
        console.log('❌ Google API Key or Search Engine ID missing');
        return;
    }
    
    const query = 'test';
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${query}`;
    
    console.log('🔍 Testing Google Custom Search API...');
    
    https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            try {
                const result = JSON.parse(data);
                if (result.error) {
                    console.log('❌ Google Custom Search API Error:', result.error.message);
                } else {
                    console.log('✅ Google Custom Search API Working! Found', result.searchInformation?.totalResults, 'results');
                }
            } catch (error) {
                console.log('❌ Google Custom Search API Parse Error:', error.message);
            }
        });
    }).on('error', (error) => {
        console.log('❌ Google Custom Search API Request Error:', error.message);
    });
}

// Test Gemini API
function testGeminiAPI() {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
        console.log('❌ Gemini API Key missing');
        return;
    }
    
    console.log('🤖 Testing Gemini API - First checking available models...');
    
    // First check available models
    const modelOptions = {
        hostname: 'generativelanguage.googleapis.com',
        port: 443,
        path: `/v1/models?key=${apiKey}`,
        method: 'GET'
    };
    
    const modelReq = https.request(modelOptions, (res) => {
        let responseData = '';
        res.on('data', (chunk) => {
            responseData += chunk;
        });
        
        res.on('end', () => {
            try {
                const result = JSON.parse(responseData);
                if (result.error) {
                    console.log('❌ Gemini API Error (Models):', result.error.message);
                } else if (result.models) {
                    console.log('✅ Available Gemini models:');
                    result.models.forEach(model => {
                        console.log(`   - ${model.name}`);
                    });
                    
                    // Test with gemini-1.5-flash (better quota)
                    const flashModel = result.models.find(m => m.name === 'models/gemini-1.5-flash');
                    if (flashModel) {
                        testGeminiGeneration(apiKey, flashModel.name);
                    } else if (result.models.length > 0) {
                        testGeminiGeneration(apiKey, result.models[0].name);
                    }
                } else {
                    console.log('❌ Gemini API: No models found');
                }
            } catch (error) {
                console.log('❌ Gemini API Parse Error:', error.message);
            }
        });
    });
    
    modelReq.on('error', (error) => {
        console.log('❌ Gemini API Request Error:', error.message);
    });
    
    modelReq.end();
}

function testGeminiGeneration(apiKey, modelName) {
    console.log(`🤖 Testing text generation with ${modelName}...`);
    
    const data = JSON.stringify({
        contents: [{
            parts: [{
                text: "Hello, this is a test message."
            }]
        }]
    });
    
    const options = {
        hostname: 'generativelanguage.googleapis.com',
        port: 443,
        path: `/v1/${modelName}:generateContent?key=${apiKey}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };
    
    const req = https.request(options, (res) => {
        let responseData = '';
        res.on('data', (chunk) => {
            responseData += chunk;
        });
        
        res.on('end', () => {
            try {
                const result = JSON.parse(responseData);
                if (result.error) {
                    console.log('❌ Gemini API Error:', result.error.message);
                } else if (result.candidates && result.candidates.length > 0) {
                    console.log('✅ Gemini API Working! Response:', result.candidates[0].content.parts[0].text.substring(0, 50) + '...');
                } else {
                    console.log('❌ Gemini API: Unexpected response format');
                }
            } catch (error) {
                console.log('❌ Gemini API Parse Error:', error.message);
            }
        });
    });
    
    req.on('error', (error) => {
        console.log('❌ Gemini API Request Error:', error.message);
    });
    
    req.write(data);
    req.end();
}

// Test environment variables
function testEnvVariables() {
    console.log('🔧 Checking Environment Variables...');
    const requiredVars = [
        'GOOGLE_API_KEY',
        'GOOGLE_SEARCH_ENGINE_ID', 
        'GEMINI_API_KEY',
        'PORT',
        'ALLOWED_ORIGINS'
    ];
    
    requiredVars.forEach(varName => {
        if (process.env[varName]) {
            console.log(`✅ ${varName}: Present`);
        } else {
            console.log(`❌ ${varName}: Missing`);
        }
    });
    console.log('');
}

// Run all tests
console.log('🚀 Starting API Tests...\n');
testEnvVariables();
testGoogleCustomSearch();
setTimeout(() => testGeminiAPI(), 2000); // Wait 2 seconds between tests