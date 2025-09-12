# ResuMate - AI-Powered Resume Builder

An intelligent resume builder powered by Google's Gemini AI that helps you create professional, ATS-optimized resumes.

## 🚀 Features

- **AI-Powered Content Suggestions**: Get intelligent recommendations for your resume content
- **ATS Optimization**: Ensure your resume passes Applicant Tracking Systems
- **Multiple Templates**: Choose from professional templates including JobFit Pro, Modern Sidebar, and more
- **Real-time Preview**: See changes instantly as you build your resume
- **Smart Keyword Optimization**: Get suggestions for industry-relevant keywords
- **Grammar & Style Correction**: AI-powered writing improvements
- **PDF Export**: Generate professional PDF resumes

## 🛠️ Tech Stack

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js with Express
- **AI Integration**: Google Gemini AI
- **PDF Generation**: Custom PDF generation
- **Styling**: Tailwind CSS

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/gauravttiwari/Resumate.git
   cd Resumate
   ```

2. Install dependencies:
   ```bash
   # Install server dependencies
   cd server && npm install
   
   # Install client dependencies
   cd ../client && npm install
   ```

3. Set up environment variables:
   ```bash
   # Create .env file in server directory
   cp server/.env.example server/.env
   # Add your Gemini API key
   ```

4. Run the application:
   ```bash
   # Start server (from server directory)
   npm start
   
   # Start client (from client directory)
   npm start
   ```

## 🔧 Configuration

Add your Gemini API key to the server/.env file:
```
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-1.5-flash
```

## 📁 Project Structure

```
resumate/
├── client/          # React frontend
├── server/          # Node.js backend
├── output/          # Generated files
└── docs/           # Documentation
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🚀 Deployment

The application can be deployed on platforms like Vercel, Netlify, or Heroku. See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

---

**Made with ❤️ by Gaurav Tiwari**