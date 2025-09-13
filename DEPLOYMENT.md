# Deployment Guide for ResuMate

This guide provides instructions for deploying the ResuMate application to various environments.

## Prerequisites

Before deploying, make sure you have:

1. Node.js (v16 or higher)
2. npm or yarn
3. A Gemini API key
4. (Optional) A MongoDB instance (local or cloud)

## Environment Setup

### Setting up Environment Variables

The application uses environment variables for configuration. Before deploying, you'll need to set these up:

#### Server Environment Variables

Create a `.env` file in the server directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resumate
JWT_SECRET=your_jwt_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-pro
CACHE_TTL=3600
CACHE_CHECK_PERIOD=120
NODE_ENV=production
```

#### Client Environment Variables

Create a `.env` file in the client directory with:

```
REACT_APP_API_URL=https://your-api-domain.com/api
```

## Deployment Options

### 1. Traditional Deployment

#### Building the Client

1. Navigate to the client directory

   ```bash
   cd client
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Build the client

   ```bash
   npm run build
   ```

4. The build will be in the `client/build` directory

#### Setting up the Server

1. Navigate to the server directory

   ```bash
   cd server
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the server in production mode
   ```bash
   NODE_ENV=production npm start
   ```

### 2. Docker Deployment

A Dockerfile and docker-compose.yml file are provided for easy containerization.

1. Build the Docker image

   ```bash
   docker-compose build
   ```

2. Start the containers
   ```bash
   docker-compose up -d
   ```

### 3. Cloud Deployment

#### Deploying to Heroku

1. Install the Heroku CLI

   ```bash
   npm install -g heroku
   ```

2. Login to Heroku

   ```bash
   heroku login
   ```

3. Create a new Heroku app

   ```bash
   heroku create resumate-app
   ```

4. Set environment variables

   ```bash
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set GEMINI_API_KEY=your_gemini_api_key
   heroku config:set GEMINI_MODEL=gemini-pro
   ```

5. Deploy the app
   ```bash
   git push heroku main
   ```

#### Deploying to Vercel

1. Install Vercel CLI

   ```bash
   npm install -g vercel
   ```

2. Login to Vercel

   ```bash
   vercel login
   ```

3. Deploy the app
   ```bash
   vercel --prod
   ```

## Post-Deployment Steps

After deploying, make sure to:

1. Verify that all API endpoints are working correctly
2. Test the AI features with sample data
3. Configure CORS settings if needed
4. Set up monitoring and logging
5. Configure backups for your database

## Maintenance

### Updating the Application

1. Pull the latest changes

   ```bash
   git pull origin main
   ```

2. Update dependencies

   ```bash
   cd client && npm install
   cd ../server && npm install
   ```

3. Rebuild and redeploy

### Monitoring

Consider setting up:

1. Application monitoring with tools like New Relic or Datadog
2. Error tracking with Sentry
3. Performance monitoring for API endpoints

### Backups

If using MongoDB:

1. Set up automated backups
2. Test restoration procedures
3. Store backups in secure, redundant storage

## Troubleshooting

### Common Issues

1. **API Connection Issues**

   - Check that the client is pointing to the correct API URL
   - Verify that CORS is configured correctly on the server

2. **Gemini AI Not Responding**

   - Check that your API key is valid
   - Verify that you haven't exceeded API rate limits
   - Check server logs for detailed error messages

3. **Database Connection Issues**
   - Verify MongoDB connection string
   - Check that network rules allow connections to the database
   - Ensure MongoDB is running and accessible

### Getting Help

If you encounter issues, check:

1. The project's GitHub issues
2. Documentation in the project's repository
3. Contact the development team for support

## Security Considerations

1. Keep API keys and secrets secure
2. Regularly update dependencies
3. Use HTTPS for all connections
4. Implement rate limiting on API endpoints
5. Sanitize user inputs to prevent injection attacks
