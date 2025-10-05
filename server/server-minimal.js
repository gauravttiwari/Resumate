// Minimal server that tries to use express, falls back to http if needed
let server;

try {
  // Try to use Express
  const express = require('express');
  const cors = require('cors');
  const path = require('path');
  const fs = require('fs');
  
  const app = express();
  const port = process.env.PORT || 5000;
  
  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  
  // Basic routes
  app.get('/', (req, res) => {
    res.json({ 
      message: 'Resumate Server Running 🚀', 
      status: 'OK',
      timestamp: new Date().toISOString()
    });
  });
  
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'healthy', 
      service: 'Resumate API',
      version: '1.0.0'
    });
  });
  
  // Data directory setup
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Resume save endpoint
  app.post('/api/save-resume', (req, res) => {
    try {
      const { name, email, ...resumeData } = req.body;
      
      if (!name || !email) {
        return res.status(400).json({ 
          success: false, 
          message: 'Name and email are required' 
        });
      }
      
      const filename = `${name.replace(/\s+/g, '_')}_${Date.now()}.json`;
      const filePath = path.join(dataDir, filename);
      
      fs.writeFileSync(filePath, JSON.stringify({ name, email, ...resumeData }, null, 2));
      
      res.status(200).json({ success: true, filename });
    } catch (error) {
      console.error('Error saving resume:', error);
      res.status(500).json({ success: false, message: 'Failed to save resume' });
    }
  });
  
  // Start Express server
  server = app.listen(port, () => {
    console.log('✅ Express Server Started');
    console.log(`🚀 Running on: http://localhost:${port}`);
    console.log(`📊 Health Check: http://localhost:${port}/api/health`);
  });
  
  console.log('Using Express framework');
  
} catch (error) {
  console.log('⚠️  Express not available, using built-in HTTP server');
  console.log('Error:', error.message);
  
  // Fallback to basic HTTP server
  const http = require('http');
  const url = require('url');
  
  server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');
    
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }
    
    if (parsedUrl.pathname === '/' && req.method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({ 
        message: 'Resumate Server Running (HTTP Mode) 🚀', 
        status: 'OK',
        mode: 'fallback-http'
      }));
    } else if (parsedUrl.pathname === '/api/health' && req.method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({ 
        status: 'healthy', 
        service: 'Resumate API (HTTP)',
        mode: 'fallback'
      }));
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Not found' }));
    }
  });
  
  const port = 5000;
  server.listen(port, () => {
    console.log('✅ HTTP Server Started');
    console.log(`🚀 Running on: http://localhost:${port}`);
    console.log(`📊 Health Check: http://localhost:${port}/api/health`);
  });
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  if (server) {
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  }
});