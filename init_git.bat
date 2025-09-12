@echo off
echo Initializing Git repository for ResuMate...

git init
git add .
git commit -m "Initial commit of ResuMate project"

echo Git repository initialized successfully!
echo.
echo Next steps:
echo 1. Create a remote repository on GitHub or other git hosting service
echo 2. Connect this local repository using: git remote add origin YOUR_REPOSITORY_URL
echo 3. Push your code using: git push -u origin main
echo.
echo Happy coding!
pause
