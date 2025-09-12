@echo off
echo ======================================
echo ResuMate Setup - AI Version
echo ======================================
echo.

echo Installing server dependencies...
cd server
npm install express cors body-parser @google/generative-ai dotenv natural node-cache

echo.
echo Installing client dependencies...
cd ..\client
npm install html2canvas jspdf

echo.
echo Setting up Gemini API...

cd ..

REM Check if .env file exists
if exist "server\.env" (
    echo An existing .env file was found in the server directory.
    set /p overwrite="Do you want to update it? (Y/N): "
    if /i "%%overwrite%%" neq "Y" (
        goto skip_api_setup
    )
)

echo.
echo Please enter your Gemini API key (from https://makersuite.google.com/app/apikey):
set /p api_key="API key: "

REM Create or update .env file
echo Creating/updating .env file...
(
    echo PORT=5000
    echo MONGODB_URI=mongodb://localhost:27017/resumate
    echo JWT_SECRET=resumate_secret_key
    echo.
    echo # Google Gemini AI Configuration
    echo GEMINI_API_KEY=%%api_key%%
    echo GEMINI_MODEL=gemini-pro
    echo.
    echo # Cache Configuration
    echo CACHE_TTL=3600
    echo CACHE_CHECK_PERIOD=120
    echo.
    echo # Environment Configuration
    echo NODE_ENV=development
) > server\.env

echo.
echo API key has been saved to server\.env

:skip_api_setup
echo.
echo Setup complete! You can now run the application:
echo 1. Start the server: cd server && npm start
echo 2. Start the client: cd client && npm start
echo.
echo To test the API connection: cd server && node tests/testGeminiApi.js
echo.
echo ======================================
