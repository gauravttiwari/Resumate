@echo off
echo ======================================
echo ResuMate - Removing LaTeX Dependencies
echo ======================================
echo.

echo Step 1: Backing up original files...
copy "server\index.js" "server\index.js.bak"
copy "client\src\App.js" "client\src\App.js.bak"
copy "client\src\ResumePreview.js" "client\src\ResumePreview.js.bak" 2>nul
copy "README.md" "README.md.bak"

echo.
echo Step 2: Updating to HTML-based approach...
copy "server\index.js.new" "server\index.js"
copy "client\src\App.js.new" "client\src\App.js"
copy "client\src\ResumePreview.js.new" "client\src\ResumePreview.js"
copy "README.md.new" "README.md"

echo.
echo Step 3: Installing required dependencies...
cd client
call npm install html2canvas jspdf --save
cd ..

echo.
echo ======================================
echo Conversion Complete!
echo ======================================
echo.
echo The application now uses HTML-based resume generation instead of LaTeX.
echo.
echo To start the application:
echo 1. Start server: cd server && npm start
echo 2. Start client: cd client && npm start
echo.
echo ======================================
pause
