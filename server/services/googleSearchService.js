// services/googleSearchService.js

const https = require('https');

/**
 * Google Custom Search API Service for Resume Templates
 */
class GoogleSearchService {
  constructor() {
    this.apiKey = process.env.GOOGLE_API_KEY;
    this.searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
    this.baseUrl = 'https://www.googleapis.com/customsearch/v1';
  }

  /**
   * Search for ATS-friendly resume templates on Google
   * @param {string} jobTitle - Job title to search for
   * @param {string} industry - Industry category
   * @param {string} experienceLevel - Experience level
   * @returns {Promise<Array>} - Array of template search results
   */
  async searchResumeTemplates(jobTitle, industry = '', experienceLevel = '') {
    try {
      console.log('Searching Google for templates:', { jobTitle, industry, experienceLevel });

      // Construct intelligent search query
      const searchQuery = this.buildSearchQuery(jobTitle, industry, experienceLevel);
      console.log('Google search query:', searchQuery);

      // Perform Google Custom Search
      const searchResults = await this.performCustomSearch(searchQuery);
      
      // Parse and validate results
      const templates = this.parseTemplateResults(searchResults);
      
      console.log(`Found ${templates.length} templates from Google search`);
      return templates;

    } catch (error) {
      console.error('Error searching Google templates:', error);
      return this.getFallbackTemplates(jobTitle, industry);
    }
  }

  /**
   * Build intelligent search query for Google
   * @param {string} jobTitle - Job title
   * @param {string} industry - Industry
   * @param {string} experienceLevel - Experience level
   * @returns {string} - Optimized search query
   */
  buildSearchQuery(jobTitle, industry, experienceLevel) {
    const baseTerms = [
      'ATS-friendly resume template',
      'professional resume template',
      'CV template'
    ];

    const siteRestrictions = [
      'site:github.com',
      'site:canva.com',
      'site:resumegenius.com',
      'site:zety.com',
      'site:indeed.com',
      'site:templatemonster.com',
      'site:behance.net'
    ];

    // Construct query with job title and industry
    const jobTerms = jobTitle ? `"${jobTitle}"` : '';
    const industryTerms = industry && industry !== 'general' ? `${industry}` : '';
    const levelTerms = experienceLevel && experienceLevel !== 'mid-level' ? `${experienceLevel}` : '';

    // Combine all terms
    const searchTerms = [
      ...baseTerms,
      jobTerms,
      industryTerms,
      levelTerms
    ].filter(Boolean).join(' ');

    // Add site restrictions
    const siteFilter = `(${siteRestrictions.join(' OR ')})`;
    
    return `${searchTerms} ${siteFilter}`;
  }

  /**
   * Perform Google Custom Search API call
   * @param {string} query - Search query
   * @returns {Promise<Object>} - Search results
   */
  async performCustomSearch(query) {
    return new Promise((resolve, reject) => {
      if (!this.apiKey || !this.searchEngineId) {
        console.warn('Google API credentials not configured, using fallback');
        resolve({ items: [] });
        return;
      }

      const params = new URLSearchParams({
        key: this.apiKey,
        cx: this.searchEngineId,
        q: query,
        num: 8, // Number of results
        searchType: 'image', // Include images for previews
        safe: 'active',
        lr: 'lang_en'
      });

      const url = `${this.baseUrl}?${params}`;

      https.get(url, (response) => {
        let data = '';
        
        response.on('data', (chunk) => {
          data += chunk;
        });
        
        response.on('end', () => {
          try {
            const result = JSON.parse(data);
            resolve(result);
          } catch (error) {
            reject(new Error('Failed to parse Google API response'));
          }
        });
      }).on('error', (error) => {
        reject(error);
      });
    });
  }

  /**
   * Parse Google search results into template format
   * @param {Object} searchResults - Raw Google search results
   * @returns {Array} - Parsed template objects
   */
  parseTemplateResults(searchResults) {
    if (!searchResults.items || !Array.isArray(searchResults.items)) {
      return [];
    }

    return searchResults.items.map((item, index) => ({
      id: `google-template-${index}`,
      name: this.cleanTemplateName(item.title),
      source: 'Google Search',
      sourceUrl: item.link,
      previewUrl: item.image?.thumbnailLink || item.link,
      description: this.extractDescription(item.snippet),
      atsScore: this.estimateATSScore(item.title, item.snippet),
      industry: 'General',
      layoutStyle: this.detectLayoutStyle(item.title, item.snippet),
      experienceLevel: ['entry-level', 'mid-level', 'senior'],
      features: this.extractFeatures(item.title, item.snippet),
      relevanceScore: 85 - (index * 5), // Decrease by rank
      aiRecommendation: 'Google Recommended',
      isExternal: true,
      copyright: 'External Source - Check Original License',
      lastUpdated: new Date().toISOString()
    })).filter(template => template.name && template.sourceUrl);
  }

  /**
   * Clean and format template name
   * @param {string} title - Raw title from Google
   * @returns {string} - Cleaned template name
   */
  cleanTemplateName(title) {
    if (!title) return 'Resume Template';
    
    // Remove common noise words
    const cleanTitle = title
      .replace(/\s*-\s*(Free|Download|Template|Resume|CV)\s*/gi, '')
      .replace(/^\d+\.\s*/, '') // Remove numbering
      .replace(/\s+/g, ' ')
      .trim();
    
    return cleanTitle || 'Professional Resume Template';
  }

  /**
   * Extract meaningful description from snippet
   * @param {string} snippet - Google search snippet
   * @returns {string} - Clean description
   */
  extractDescription(snippet) {
    if (!snippet) return 'Professional resume template optimized for ATS systems';
    
    // Clean up snippet
    const cleanSnippet = snippet
      .replace(/\d{1,2}\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s*\d{4}/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    return cleanSnippet.substring(0, 120) + (cleanSnippet.length > 120 ? '...' : '');
  }

  /**
   * Estimate ATS compatibility score based on title and snippet
   * @param {string} title - Template title
   * @param {string} snippet - Template snippet
   * @returns {number} - Estimated ATS score
   */
  estimateATSScore(title, snippet) {
    const text = `${title} ${snippet}`.toLowerCase();
    let score = 70; // Base score
    
    // Positive indicators
    const positiveKeywords = [
      'ats', 'ats-friendly', 'applicant tracking', 
      'professional', 'clean', 'simple', 'minimal',
      'word', 'docx', 'pdf', 'format'
    ];
    
    // Negative indicators
    const negativeKeywords = [
      'creative', 'artistic', 'colorful', 'infographic',
      'graphic', 'design-heavy', 'complex', 'fancy'
    ];
    
    positiveKeywords.forEach(keyword => {
      if (text.includes(keyword)) score += 5;
    });
    
    negativeKeywords.forEach(keyword => {
      if (text.includes(keyword)) score -= 8;
    });
    
    return Math.max(60, Math.min(95, score));
  }

  /**
   * Detect layout style from title and snippet
   * @param {string} title - Template title
   * @param {string} snippet - Template snippet
   * @returns {string} - Layout style
   */
  detectLayoutStyle(title, snippet) {
    const text = `${title} ${snippet}`.toLowerCase();
    
    if (text.includes('sidebar') || text.includes('two-column')) return 'Sidebar';
    if (text.includes('minimal') || text.includes('simple')) return 'Minimal';
    if (text.includes('executive') || text.includes('senior')) return 'Executive';
    if (text.includes('modern') || text.includes('contemporary')) return 'Modern';
    if (text.includes('creative') || text.includes('design')) return 'Creative';
    
    return 'Traditional';
  }

  /**
   * Extract features from title and snippet
   * @param {string} title - Template title
   * @param {string} snippet - Template snippet
   * @returns {Array} - Array of features
   */
  extractFeatures(title, snippet) {
    const text = `${title} ${snippet}`.toLowerCase();
    const features = [];
    
    if (text.includes('ats') || text.includes('applicant tracking')) {
      features.push('ATS-Optimized');
    }
    if (text.includes('free')) {
      features.push('Free Template');
    }
    if (text.includes('word') || text.includes('docx')) {
      features.push('Word Format');
    }
    if (text.includes('pdf')) {
      features.push('PDF Ready');
    }
    if (text.includes('professional')) {
      features.push('Professional Design');
    }
    if (text.includes('editable') || text.includes('customizable')) {
      features.push('Fully Editable');
    }
    
    return features.length > 0 ? features : ['Professional Layout'];
  }

  /**
   * Get fallback templates when Google search fails
   * @param {string} jobTitle - Job title
   * @param {string} industry - Industry
   * @returns {Array} - Fallback templates
   */
  getFallbackTemplates(jobTitle, industry) {
    return [
      {
        id: 'fallback-1',
        name: `Professional ${jobTitle} Resume Template`,
        source: 'Fallback',
        sourceUrl: 'https://resumegenius.com/resume-templates',
        previewUrl: '/assets/template-placeholder.png',
        description: `Professional resume template optimized for ${jobTitle} positions`,
        atsScore: 85,
        industry: industry || 'General',
        layoutStyle: 'Professional',
        experienceLevel: ['entry-level', 'mid-level', 'senior'],
        features: ['ATS-Friendly', 'Professional Design', 'Industry-Focused'],
        relevanceScore: 75,
        aiRecommendation: 'Fallback Recommendation',
        isExternal: true,
        copyright: 'External Source'
      }
    ];
  }
}

module.exports = new GoogleSearchService();