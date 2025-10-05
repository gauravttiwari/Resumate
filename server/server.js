// Resumate Server - Handles missing dependencies gracefully
let express, cors, bodyParser, dotenv, aiRoutes;
let dependenciesAvailable = true;

const path = require('path');
const fs = require('fs');
const http = require('http');
const url = require('url');

// Try to load dependencies, fall back gracefully if not available
try {
  // Try loading from current directory first, then parent directory
  try {
    express = require('express');
  } catch (e) {
    express = require('../node_modules/express');
  }
  
  try {
    cors = require('cors');  
  } catch (e) {
    cors = require('../node_modules/cors');
  }
  
  try {
    bodyParser = require('body-parser');
  } catch (e) {
    bodyParser = require('../node_modules/body-parser');
  }
  
  try {
    dotenv = require('dotenv');
  } catch (e) {
    dotenv = require('../node_modules/dotenv');
  }
  
  // Load environment variables
  dotenv.config();
  
  try {
    aiRoutes = require('./routes/aiRoutes');
  } catch (err) {
    console.log('⚠️  AI routes not available:', err.message);
    aiRoutes = null;
  }
  
  console.log('✅ Express dependencies loaded successfully');
} catch (error) {
  console.log('⚠️  Express not available, using built-in HTTP server');
  console.log('Error:', error.message);
  dependenciesAvailable = false;
}

const port = process.env.PORT || 5000;

// Create a directory for storing resume data
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Helper function to save resume data
function saveResumeData(data) {
  const { name, email, ...resumeData } = data;
  
  if (!name || !email) {
    throw new Error('Name and email are required');
  }
  
  const filename = `${name.replace(/\s+/g, '_')}_${Date.now()}.json`;
  const filePath = path.join(dataDir, filename);
  
  fs.writeFileSync(filePath, JSON.stringify({ name, email, ...resumeData }, null, 2));
  
  return filename;
}

// Helper function to get resume data
function getResumeData(filename) {
  const filePath = path.join(dataDir, filename);
  
  if (!fs.existsSync(filePath)) {
    throw new Error('Resume not found');
  }
  
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

if (dependenciesAvailable) {
  // Express mode
  const app = express();
  
  // Enable CORS
  app.use(cors());
  
  // Parse JSON request bodies
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
  
  // Serve static files from the React app in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }
  
  // Use AI routes if available
  if (aiRoutes) {
    app.use('/api/ai', aiRoutes);
  }
  
  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'healthy', 
      service: 'Resumate API (Express)',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    });
  });
  
  // Root endpoint
  app.get('/', (req, res) => {
    res.json({ 
      message: 'Resumate Server Running 🚀', 
      status: 'OK',
      mode: 'express'
    });
  });
  
  // Route to save resume data
  app.post('/api/save-resume', (req, res) => {
    try {
      const filename = saveResumeData(req.body);
      res.status(200).json({ success: true, filename });
    } catch (error) {
      console.error('Error saving resume data:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  });
  
  // Route to retrieve resume data
  app.get('/api/resume/:filename', (req, res) => {
    try {
      const { filename } = req.params;
      const resumeData = getResumeData(filename);
      res.status(200).json({ success: true, data: resumeData });
    } catch (error) {
      console.error('Error retrieving resume data:', error);
      res.status(404).json({ success: false, message: error.message });
    }
  });
  
  // Catch-all handler for any request that doesn't match the above  
  app.use((req, res) => {
    if (process.env.NODE_ENV === 'production') {
      res.sendFile(path.join(__dirname, '../client/build/index.html'));
    } else {
      res.status(404).json({ error: 'API endpoint not found' });
    }
  });
  
  // Start the Express server
  app.listen(port, () => {
    console.log('✅ Express Server Started');
    console.log(`🚀 Running on: http://localhost:${port}`);
    console.log(`📊 Health Check: http://localhost:${port}/api/health`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const newPort = port + 1;
      console.log(`⚠️  Port ${port} is busy, trying port ${newPort}`);
      app.listen(newPort, () => {
        console.log('✅ Express Server Started');
        console.log(`🚀 Running on: http://localhost:${newPort}`);
        console.log(`📊 Health Check: http://localhost:${newPort}/api/health`);
      });
    } else {
      console.error('Server error:', err);
    }
  });
  
} else {
  // Fallback HTTP server mode
  const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');
    
    if (method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }
    
    // Helper to send JSON response
    const sendJSON = (statusCode, data) => {
      res.writeHead(statusCode);
      res.end(JSON.stringify(data));
    };
    
    // Routes
    if (parsedUrl.pathname === '/' && method === 'GET') {
      sendJSON(200, { 
        message: 'Resumate Server Running (HTTP Mode) 🚀', 
        status: 'OK',
        mode: 'fallback-http'
      });
    } else if (parsedUrl.pathname === '/api/health' && method === 'GET') {
      sendJSON(200, { 
        status: 'healthy', 
        service: 'Resumate API (HTTP)',
        mode: 'fallback',
        timestamp: new Date().toISOString()
      });
    } else if (parsedUrl.pathname === '/api/save-resume' && method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          const filename = saveResumeData(data);
          sendJSON(200, { success: true, filename });
        } catch (error) {
          console.error('Error saving resume:', error);
          sendJSON(500, { success: false, message: error.message });
        }
      });
    } else if (parsedUrl.pathname.startsWith('/api/resume/') && method === 'GET') {
      try {
        const filename = parsedUrl.pathname.split('/').pop();
        const resumeData = getResumeData(filename);
        sendJSON(200, { success: true, data: resumeData });
      } catch (error) {
        console.error('Error retrieving resume:', error);
        sendJSON(404, { success: false, message: error.message });
      }
    } else {
      sendJSON(404, { error: 'Not found' });
    }
  });
  
  server.listen(port, () => {
    console.log('✅ HTTP Server Started (Fallback Mode)');
    console.log(`🚀 Running on: http://localhost:${port}`);
    console.log(`📊 Health Check: http://localhost:${port}/api/health`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const newPort = port + 1;
      console.log(`⚠️  Port ${port} is busy, trying port ${newPort}`);
      server.listen(newPort, () => {
        console.log('✅ HTTP Server Started (Fallback Mode)');
        console.log(`🚀 Running on: http://localhost:${newPort}`);
        console.log(`📊 Health Check: http://localhost:${newPort}/api/health`);
      });
    } else {
      console.error('Server error:', err);
    }
  });
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  console.log('✅ Server closed');
  process.exit(0);
});
