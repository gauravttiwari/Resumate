const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json({limit: '5mb'}));  // Increased limit for larger files

const OUTPUT_DIR = path.join(__dirname, '../output');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

app.post('/generate', (req, res) => {
  try {
    console.log('Received resume generation request');
    
    // Log the entire request body for debugging
    console.log('Request body:', JSON.stringify(req.body).substring(0, 200) + '...');
    
    // Validate request body
    const { resumeData, filename: rawFilename, plainText, template = 'modern' } = req.body;
    
    if (!resumeData) {
      console.error('No resume data provided');
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({ error: 'No resume data provided' });
    }
    
    // Sanitize filename and provide default if not provided
    const filename = rawFilename 
      ? rawFilename.replace(/[^a-z0-9_-]/gi, '_') 
      : `resume_${Date.now()}`;
    
    console.log(`Generating resume with filename: ${filename}, template: ${template}`);
    
    // Create output directory if it doesn't exist
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    // Handle profile picture (if any)
    if (resumeData.profilePic) {
      const base64Data = resumeData.profilePic;
      const matches = base64Data.match(/^data:image\/([a-zA-Z]+);base64,/);
      
      if (matches && matches.length > 1) {
        const imageType = matches[1];
        const base64Image = base64Data.replace(/^data:image\/[^;]+;base64,/, '');
        const imageFileName = `${filename}_profile.${imageType}`;
        const imagePath = path.join(OUTPUT_DIR, imageFileName);
        
        // Save image file
        fs.writeFileSync(imagePath, base64Image, 'base64');
        console.log(`Profile image saved to ${imagePath}`);
        
        // Replace base64 data with file path
        resumeData.profilePicPath = imageFileName;
      }
    }
    
    // Save JSON data for future use
    const jsonPath = path.join(OUTPUT_DIR, `${filename}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(resumeData, null, 2));
    console.log(`Resume data saved to ${jsonPath}`);
    
    // Save plain text version
    if (plainText) {
      const txtPath = path.join(OUTPUT_DIR, `${filename}.txt`);
      fs.writeFileSync(txtPath, plainText);
      console.log(`Plain text file saved to ${txtPath}`);
    }
    
    // Return success response with file paths
    res.setHeader('Content-Type', 'application/json');
    res.json({
      message: 'Resume data saved successfully',
      json: `${filename}.json`,
      txt: plainText ? `${filename}.txt` : null
    });
  } catch (error) {
    console.error('Unexpected error during resume generation:', error);
    // Make sure the error message is always a string
    const errorMessage = error.message || 'Unknown error';
    const errorStack = error.stack || '';
    
    // Ensure proper headers for JSON response
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({ 
      error: 'Server error', 
      details: errorMessage,
      stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
    });
  }
});

app.get('/download/:type/:filename', (req, res) => {
  const { type, filename } = req.params;
  const filePath = path.join(OUTPUT_DIR, `${filename}.${type}`);
  
  if (fs.existsSync(filePath)) {
    // Set appropriate content type
    const contentTypes = {
      'pdf': 'application/pdf',
      'json': 'application/json',
      'txt': 'text/plain'
    };
    
    res.setHeader('Content-Type', contentTypes[type] || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}.${type}`);
    res.download(filePath);
  } else {
    // Return JSON response for the 404 error
    res.setHeader('Content-Type', 'application/json');
    res.status(404).json({ 
      error: 'File not found',
      details: `The requested file ${filename}.${type} does not exist.` 
    });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
