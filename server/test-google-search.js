require('dotenv').config();
const googleSearch = require('./services/googleSearchService');

(async () => {
  try {
    console.log('Starting Google template search test...');
    const templates = await googleSearch.searchResumeTemplates('Software Engineer', 'tech', 'mid-level');
    console.log('Templates returned:', templates.length);
    console.log(JSON.stringify(templates, null, 2));
  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  }
})();