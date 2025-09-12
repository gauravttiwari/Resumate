# Contributing to ResuMate

Thank you for your interest in contributing to ResuMate! This document provides guidelines and instructions for contributing to this project.

## Development Setup

1. Fork and clone the repository
2. Install dependencies for both client and server
   ```bash
   # Install client dependencies
   cd client
   npm install
   
   # Install server dependencies
   cd ../server
   npm install
   ```
3. Start the development servers as described in the README.md

## Project Structure

- **client/** - React frontend application
  - **src/** - Source code
    - **components/** - React components
    - **styles/** - CSS styles for templates
    - **utils/** - Utility functions
  - **public/** - Static assets
- **server/** - Node.js backend
  - **index.js** - Main server file
  - **routes/** - API routes

## Adding New Resume Templates

To add a new resume template:

1. Create a new React component in `client/src/` (e.g., `NewTemplateResume.js`)
2. Create a CSS file in `client/src/styles/` (e.g., `NewTemplate.css`)
3. Import and add the new template to `App.js`
4. Add the template to the selection options in `TemplateSelector.js`

## Code Style Guidelines

- Use functional React components with hooks
- Follow the existing naming conventions
- Use descriptive variable and function names
- Add comments for complex code sections
- Format your code using Prettier
- Run ESLint to check for code quality issues

## Pull Request Process

1. Create a new branch for your feature or bug fix
2. Make your changes and commit them with descriptive commit messages
3. Push your branch to your fork
4. Submit a pull request to the main repository
5. Ensure your PR description clearly explains the changes and their purpose

## Testing

Before submitting a PR, please test your changes:

1. Ensure the application builds without errors
2. Test the functionality you've added or modified
3. Verify that existing features still work correctly
4. Test on different browsers if your changes affect the UI

## License

By contributing to ResuMate, you agree that your contributions will be licensed under the same license as the project.
