const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Create a simple logo for ResuMate application
function generateLogo(size, outputPath) {
  // Create a canvas with the specified size
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Fill background
  ctx.fillStyle = '#4a86e8'; // Blue background
  ctx.fillRect(0, 0, size, size);
  
  // Add a document icon
  ctx.fillStyle = '#ffffff'; // White
  const margin = size * 0.2;
  const docWidth = size - (margin * 2);
  const docHeight = size - (margin * 2);
  
  // Draw document shape
  ctx.fillRect(margin, margin, docWidth, docHeight);
  
  // Add document lines
  ctx.fillStyle = '#4a86e8'; // Blue lines
  const lineHeight = size * 0.05;
  const lineMargin = size * 0.3;
  const lineWidth = size * 0.4;
  
  // Draw 4 lines representing text in document
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(
      lineMargin,
      margin + (size * 0.25) + (i * (lineHeight * 1.5)),
      lineWidth,
      lineHeight
    );
  }
  
  // Add "R" for ResuMate in the corner
  ctx.fillStyle = '#ff6b6b'; // Red for the R
  ctx.font = `bold ${size * 0.25}px Arial, sans-serif`;
  ctx.fillText('R', size * 0.7, size * 0.3);
  
  // Save the image
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  
  console.log(`Generated logo: ${outputPath}`);
}

// Create both sizes
const publicDir = path.join(__dirname, 'public');
generateLogo(192, path.join(publicDir, 'logo192.png'));
generateLogo(512, path.join(publicDir, 'logo512.png'));

console.log('Logo generation complete!');
