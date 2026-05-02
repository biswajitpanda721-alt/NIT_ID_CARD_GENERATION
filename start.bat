@echo off
echo ============================================
echo   NIT Bhubaneswar ID Card System
echo ============================================
echo.

:: Check if node is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js nahi mila!
    echo.
    echo Node.js download karo: https://nodejs.org
    echo (LTS version download karo)
    echo.
    pause
    exit
)

:: Install dependencies if needed
if not exist "node_modules" (
    echo [INFO] Pehli baar chal raha hai - packages install ho rahe hain...
    echo Please wait...
    npm install
    echo.
)

echo [OK] Starting server...
echo.
echo Kuch seconds mein browser automatically khul jaayega.
echo Browser na khule toh manually open karo: http://localhost:3000/login.html
echo.
echo Server band karne ke liye yeh window close karo ya Ctrl+C dabaao.
echo ============================================
echo.

:: Open browser after 2 seconds
start /b cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:3000/login.html"

:: Start server
node server.js
pause
