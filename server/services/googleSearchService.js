// services/googleSearchService.js

const https = require('https');
const path = require('path');
// Ensure environment variables from server/.env are loaded even when cwd differs
require('dotenv').config({ path: path.join(__dirname, '../.env') });

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
      const searchQuery = this.buildSearchQuery(jobTitle, industry, experienceLevel, true);
      console.log('Google search query:', searchQuery);

      // Perform Google Custom Search
      const searchResults = await this.performCustomSearch(searchQuery);
      
      // Parse and validate results
      const templates = this.parseTemplateResults(searchResults);
      console.log(`Found ${templates.length} templates from Google search`);

      // If Google returned no items, log raw response to help diagnose
      if ((!searchResults.items || searchResults.items.length === 0) && searchResults) {
        try {
          console.log('Google raw response (truncated):', JSON.stringify(searchResults, null, 2).substring(0, 4000));
        } catch (e) {
          console.log('Could not stringify Google response');
        }
      }

      // If no templates found with site restrictions, retry a broader search without site filters
      if (templates.length === 0) {
        console.log('No templates found with site restrictions, retrying without site filters');
        const broaderQuery = this.buildSearchQuery(jobTitle, industry, experienceLevel, false);
        console.log('Broader Google search query:', broaderQuery);
        const broaderResults = await this.performCustomSearch(broaderQuery);
        const broaderTemplates = this.parseTemplateResults(broaderResults);
        console.log(`Found ${broaderTemplates.length} templates from broader Google search`);
        if ((!broaderResults.items || broaderResults.items.length === 0) && broaderResults) {
          try {
            console.log('Broader Google raw response (truncated):', JSON.stringify(broaderResults, null, 2).substring(0, 4000));
          } catch (e) {
            console.log('Could not stringify broader Google response');
          }
        }
        if (broaderTemplates.length > 0) return broaderTemplates;
      }

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
  buildSearchQuery(jobTitle, industry, experienceLevel, useSiteRestrictions = true) {
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

    // Add site restrictions when requested
    if (useSiteRestrictions) {
      const siteFilter = `(${siteRestrictions.join(' OR ')})`;
      return `${searchTerms} ${siteFilter}`;
    }

    return searchTerms;
  }

  /**
   * Perform Google Custom Search API call
   * @param {string} query - Search query
   * @returns {Promise<Object>} - Search results
   */
  async performCustomSearch(query) {
    return new Promise((resolve, reject) => {
      if (!this.apiKey || !this.searchEngineId) {
        // Log presence without exposing keys
        console.warn('Google API credentials not configured, using fallback', {
          hasApiKey: !!this.apiKey,
          hasSearchEngineId: !!this.searchEngineId,
          searchEngineIdPreview: this.searchEngineId ? this.searchEngineId.slice(-6) : null
        });
        resolve({ items: [] });
        return;
      }

      const params = new URLSearchParams({
        key: this.apiKey,
        cx: this.searchEngineId,
        q: query,
        num: 8, // Number of results
        // Do not force image-only results; allow web results so templates are discoverable
        safe: 'active',
        lr: 'lang_en'
      });

      const url = `${this.baseUrl}?${params}`;
      console.log('Google Custom Search URL:', url);

      const req = https.get(url, (response) => {
        let data = '';

        console.log('Google response statusCode:', response.statusCode);

        response.on('data', (chunk) => {
          data += chunk;
        });

        response.on('end', () => {
          if (response.statusCode < 200 || response.statusCode >= 300) {
            console.error('Google API returned non-2xx status', response.statusCode, data.substring(0, 1000));
            // Resolve with empty items so caller uses fallback templates
            resolve({ items: [] });
            return;
          }

          try {
            const result = JSON.parse(data);
            resolve(result);
          } catch (error) {
            console.error('Failed to parse Google API response body:', data.substring(0, 1000));
            reject(new Error('Failed to parse Google API response'));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });
      // safety timeout
      req.setTimeout(10000, () => {
        req.abort();
        reject(new Error('Google API request timed out'));
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

    return searchResults.items.map((item, index) => {
      // Helper: get best image from pagemap or metatags
      const pageMap = item.pagemap || {};
      let preview = null;

      // prefer cse_image
      if (Array.isArray(pageMap.cse_image) && pageMap.cse_image[0] && pageMap.cse_image[0].src) {
        preview = pageMap.cse_image[0].src;
      }

      // try metatags og:image
      if (!preview && Array.isArray(pageMap.metatags) && pageMap.metatags[0]) {
        const og = pageMap.metatags[0]['og:image'] || pageMap.metatags[0]['twitter:image'];
        if (og) preview = og;
      }

      // fallback to image thumbnail or link
      if (!preview && item.image && item.image.thumbnailLink) preview = item.image.thumbnailLink;
      if (!preview && item.link) preview = item.link;

      // sanitize fields
      const rawTitle = (item.title || item.htmlTitle || '').replace(/\s+/g, ' ').trim();
      const name = this.cleanTemplateName(rawTitle);

      const rawSnippet = (item.snippet || item.htmlSnippet || '').replace(/\s+/g, ' ').trim();
      const description = this.extractDescription(rawSnippet);

      const rawLink = (item.link || item.formattedUrl || '').trim();
      // try to decode and sanitize URL
      let sourceUrl = rawLink;
      try {
        sourceUrl = decodeURIComponent(rawLink);
      } catch (e) {
        // ignore decode errors
      }

      return {
        id: `google-template-${index}`,
        name,
        source: 'Google Search',
        sourceUrl,
        previewUrl: preview,
        description,
        atsScore: this.estimateATSScore(rawTitle, rawSnippet),
        industry: 'General',
        layoutStyle: this.detectLayoutStyle(rawTitle, rawSnippet),
        experienceLevel: ['entry-level', 'mid-level', 'senior'],
        features: this.extractFeatures(rawTitle, rawSnippet),
        relevanceScore: 85 - (index * 5), // Decrease by rank
        aiRecommendation: 'Google Recommended',
        isExternal: true,
        copyright: 'External Source - Check Original License',
        lastUpdated: new Date().toISOString()
      };
    }).filter(template => template.name && template.sourceUrl);
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