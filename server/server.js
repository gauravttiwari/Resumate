const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const aiRoutes = require('./routes/aiRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Parse JSON request bodies
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Create a directory for storing resume data
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Use AI routes
app.use('/api/ai', aiRoutes);

// Route to save resume data
app.post('/api/save-resume', (req, res) => {
  try {
    const { name, email, ...resumeData } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }
    
    // Create a unique filename
    const filename = `${name.replace(/\s+/g, '_')}_${Date.now()}.json`;
    const filePath = path.join(dataDir, filename);
    
    // Write the data to a file
    fs.writeFileSync(filePath, JSON.stringify({ name, email, ...resumeData }, null, 2));
    
    res.status(200).json({ success: true, filename });
  } catch (error) {
    console.error('Error saving resume data:', error);
    res.status(500).json({ success: false, message: 'Failed to save resume data' });
  }
});

// Route to retrieve resume data
app.get('/api/resume/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(dataDir, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    
    const resumeData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    res.status(200).json({ success: true, data: resumeData });
  } catch (error) {
    console.error('Error retrieving resume data:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve resume data' });
  }
});

// Catch-all handler for any request that doesn't match the above
app.get('*', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  } else {
    res.status(404).send('API endpoint not found');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
