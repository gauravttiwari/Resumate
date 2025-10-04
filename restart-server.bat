@echo off
echo Stopping any process on port 5000...

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
    echo Found process: %%a
    taskkill /F /PID %%a
)

echo.
echo Starting backend server...
cd server
node server.js
