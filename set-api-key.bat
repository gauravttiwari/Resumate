@echo off
echo ======================================
echo ResuMate - Set Gemini API Key
echo ======================================
echo.

REM Check if server directory exists
if not exist "server" (
    echo ERROR: Server directory not found.
    echo Please run this script from the root directory of the ResuMate project.
    exit /b 1
)

echo This script will update the Gemini API key in your .env file.
echo.

REM Check if .env file exists
if not exist "server\.env" (
    echo No .env file found. Creating a new one...
) else (
    echo Existing .env file found. Will update API key only.
)

echo.
echo Please enter your Gemini API key (from https://makersuite.google.com/app/apikey):
set /p api_key="API key: "

if exist "server\.env" (
    REM Update only the API key in the existing file
    powershell -Command "(Get-Content server\.env) -replace 'GEMINI_API_KEY=.*', 'GEMINI_API_KEY=%api_key%' | Set-Content server\.env"
) else (
    REM Create a new .env file
    (
        echo PORT=5000
        echo MONGODB_URI=mongodb://localhost:27017/resumate
        echo JWT_SECRET=resumate_secret_key
        echo.
        echo # Google Gemini AI Configuration
        echo GEMINI_API_KEY=%api_key%
        echo GEMINI_MODEL=gemini-pro
        echo.
        echo # Cache Configuration
        echo CACHE_TTL=3600
        echo CACHE_CHECK_PERIOD=120
        echo.
        echo # Environment Configuration
        echo NODE_ENV=development
    ) > server\.env
)

echo.
echo API key has been updated in server\.env
echo.

REM Ask if user wants to test the API
set /p test_api="Do you want to test the API connection? (Y/N): "
if /i "%test_api%" == "Y" (
    echo.
    echo Testing API connection...
    echo This may take a few moments...
    cd server
    node tests/testGeminiApi.js
    cd ..
)

echo.
echo Done!
pause