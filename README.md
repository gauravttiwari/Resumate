# ResuMate - ATS-Friendly Resume Builder with Gemini AI

## Overview
ResuMate is a modern resume builder application designed to create professional, ATS-friendly resumes optimized for applications to major multinational corporations like Google, Microsoft, Amazon, and other tech giants. Now enhanced with Google's Gemini AI for intelligent resume optimization and assistance.

## Structure
- `client/`: React frontend for resume creation and PDF generation
- `server/`: Node.js backend for storing resume data and AI services
- `client/src/styles/`: Contains CSS styles for different resume templates
- `client/src/components/ai/`: AI-powered React components
- `server/services/`: Backend services including Gemini AI integration

## Features

### Core Features
- No login/signup required
- Multiple professionally designed ATS-optimized templates:
  - Standard Resume - Classic professional layout
  - Reverse-Chronological - Emphasis on work history
  - Modern Sidebar - Contemporary design with sidebar for contact information
  - Professional Clean - Minimalist design with clean typography
- MNC-approved resume formats
- Real-time resume preview
- Profile picture upload with image cropping

### 🚀 AI-Powered Features
- **Keyword Suggestions**: AI automatically suggests industry-relevant keywords based on target job role
- **Content Improvement**: Enhances work descriptions with impactful action verbs and achievements
- **ATS Compatibility Score**: Real-time analysis of how well your resume will perform in ATS systems
- **Skills Recommendations**: AI suggests relevant skills to add based on job title
- **Professional Summary Generation**: Auto-generates compelling professional summaries based on your experience
- **Template Recommendations**: AI suggests the best template based on job type and resume content
- **Interactive Resume Helper**: AI chat support to answer questions while building your resume

### Additional Features
- Edit functionality to update existing resumes
- HTML/CSS-based for maximum ATS compatibility
- Client-side PDF generation
- Responsive design for all devices

## Technology Stack
- **Frontend**: React.js with custom CSS
- **Backend**: Node.js with Express
- **AI Integration**: Google Generative AI (Gemini API)
- **PDF Generation**: html2canvas and jsPDF for client-side PDF creation
- **Storage**: File-based storage on the server and browser LocalStorage for autosaving
- **Natural Language Processing**: Google's Gemini Pro model for content analysis and generation
- **Version Control**: Git

## Getting Started

### Using VS Code Tasks (Recommended)
1. Open the project in VS Code
2. Press `Ctrl+Shift+P` to open the command palette
3. Type "Tasks: Run Task" and select it
4. Choose "Install All Dependencies" to install dependencies
5. Run the "Start Both" task to launch both client and server
6. The application will open automatically in your default browser

### Manual Setup
1. Install dependencies for both client and server
   ```bash
   # Install client dependencies
   cd client
   npm install
   
   # Install server dependencies
   cd ../server
   npm install
   ```

2. Start the development servers
   ```bash
   # Start the backend server (from the server directory)
   npm start
   
   # In a new terminal, start the React frontend (from the client directory)
   cd ../client
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Debugging
The project includes launch configurations for VS Code:
- "Launch Chrome against localhost" - Debug the React frontend
- "Launch Server" - Debug the Node.js backend
- "Launch Full Stack" - Debug both frontend and backend simultaneously

## Building for Production
To build the client for production:
1. Run the "Build Client" task in VS Code, or
2. Navigate to the client directory and run `npm run build`

This will create an optimized build in the `client/build` directory that can be deployed to a static hosting service.

## VS Code Extensions

For an enhanced development experience, check out the recommended VS Code extensions in the [EXTENSIONS.md](./EXTENSIONS.md) file.

## Contributing

Interested in contributing to ResuMate? Check out our [contribution guidelines](./CONTRIBUTING.md) for more information.

## ATS Optimization Tips
- **Use Relevant Keywords**: Include keywords from the job description in your resume
- **Simple Formatting**: Avoid complex layouts that might confuse ATS systems
- **Standard Fonts**: Use common fonts that are widely recognized
- **Proper File Format**: Submit your resume as a PDF for best compatibility
- **Quantify Achievements**: Use metrics and numbers to demonstrate your impact

## 🧠 Gemini AI Integration Guide

### Setting Up Gemini AI

1. **Get API Key**: Obtain a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

2. **Configure Environment Variables**: Add your API key to the `.env` file in the server directory:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-pro
   ```

3. **Install Additional Dependencies**:
   ```bash
   cd server
   npm install @google/generative-ai dotenv natural node-cache
   ```

### AI Services Available

The integration includes the following AI services:

#### 1. Resume Optimization
AI analyzes resume content and suggests improvements to make it ATS-friendly

#### 2. ATS Scoring
AI provides a detailed analysis of how well your resume will perform in ATS systems

#### 3. Summary Generation
AI generates professional summaries based on your experience and skills

#### 4. Template Recommendation
AI recommends the best template based on your job type and resume content

#### 5. Interactive Resume Helper
AI-powered chat interface to answer questions and provide guidance

### Using AI Components

The AI components are available in the `client/src/components/ai/` directory:

- `GeminiAIContainer`: Main container for all AI features
- `ATSScoreCard`: Displays ATS compatibility score
- `ResumeOptimizer`: Provides optimization suggestions
- `SummaryGenerator`: Generates professional summaries
- `ResumeHelper`: Interactive chat support

See the examples in `client/src/examples/` for detailed implementation guides.
