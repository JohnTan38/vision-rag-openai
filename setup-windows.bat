@echo off
echo ========================================
echo Vision RAG - Quick Setup (Windows)
echo ========================================
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please download from: https://nodejs.org
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

echo Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Installation failed!
    echo Try running: npm cache clean --force
    pause
    exit /b 1
)

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo To start the development server, run:
echo    npm run dev
echo.
echo Then open: http://localhost:3000
echo ========================================
pause
