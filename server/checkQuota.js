require('dotenv').config();
const https = require('https');

function checkGeminiQuota() {
    const apiKey = process.env.GEMINI_API_KEY;
    
    console.log('🔍 Checking Gemini API Quota Status...');
    
    // Try with a simpler request to check quota
    const data = JSON.stringify({
        contents: [{
            parts: [{
                text: "Hi"
            }]
        }]
    });
    
    // Use the free model gemini-1.5-flash which has higher quota
    const options = {
        hostname: 'generativelanguage.googleapis.com',
        port: 443,
        path: `/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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
            console.log(`Status Code: ${res.statusCode}`);
            console.log('Response Headers:', res.headers);
            
            try {
                const result = JSON.parse(responseData);
                if (result.error) {
                    if (result.error.code === 429) {
                        console.log('❌ Quota Exceeded - Details:');
                        console.log('   Message:', result.error.message);
                        console.log('   Status:', result.error.status);
                        console.log('\n💡 Solutions:');
                        console.log('   1. Wait for quota reset (usually monthly)');
                        console.log('   2. Upgrade to paid plan at https://ai.google.dev/');
                        console.log('   3. Use a different API key if available');
                    } else {
                        console.log('❌ Other API Error:', result.error.message);
                    }
                } else {
                    console.log('✅ Quota OK! API is working');
                }
            } catch (error) {
                console.log('❌ Parse Error:', error.message);
                console.log('Raw Response:', responseData);
            }
        });
    });
    
    req.on('error', (error) => {
        console.log('❌ Request Error:', error.message);
    });
    
    req.write(data);
    req.end();
}

checkGeminiQuota();