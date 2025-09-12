# Setting Up the Development Environment

This guide walks you through setting up a development environment for the ResuMate project.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v14.0.0 or later)
- **npm** (v6.0.0 or later)
- **Git** (for version control)
- **VS Code** (recommended editor)

## Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/resumate.git
cd resumate
```

## Step 2: Install Dependencies

```bash
npm install
```

This will install all required dependencies defined in `package.json`.

## Step 3: VS Code Extensions

Install the following VS Code extensions for an optimal development experience:

1. **ESLint** - For JavaScript linting
2. **Prettier** - For code formatting
3. **Tailwind CSS IntelliSense** - For Tailwind CSS class suggestions
4. **ES7+ React/Redux/React-Native snippets** - For React snippets

## Step 4: Configure VS Code Settings

Create or update `.vscode/settings.json` with the following configuration:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.includeLanguages": {
    "javascript": "javascript",
    "html": "HTML"
  },
  "tailwindCSS.emmetCompletions": true,
  "css.validate": false
}
```

## Step 5: Environment Variables

Create a `.env` file in the project root:

```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_DEBUG=true
```

## Step 6: Start Development Server

```bash
npm start
```

This will start the development server at `http://localhost:3000`.

## Step 7: Building for Production

To create a production build:

```bash
npm run build
```

The optimized build files will be in the `build` directory.

## Project Structure

```
resumate/
├── client/
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── assets/
│   ├── src/
│   │   ├── components/
│   │   ├── styles/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── server/ (if applicable)
│   └── index.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Common Issues & Troubleshooting

### Issue: Node Sass version incompatibility

**Solution:** Update node-sass to be compatible with your Node.js version
```bash
npm uninstall node-sass
npm install node-sass@latest
```

### Issue: Tailwind CSS classes not applying

**Solution:** Check your PostCSS config and make sure the content paths in `tailwind.config.js` are correctly set.

### Issue: ESLint errors

**Solution:** Run ESLint fix command
```bash
npx eslint --fix .
```

## Git Workflow

1. Create a new branch for each feature or bug fix
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit regularly with descriptive messages
   ```bash
   git add .
   git commit -m "Add feature: description of changes"
   ```

3. Push your branch to remote
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a pull request on GitHub

## Additional Resources

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
