@echo off
REM Kill all running Node/npm processes
echo Clearing old processes...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM npm.exe >nul 2>&1
timeout /t 3 /nobreak

REM Start backend server
echo.
echo Starting Backend on port 5000...
start cmd /k "cd server && npm start"

timeout /t 5 /nobreak

REM Start frontend server
echo Starting Frontend on port 3000...
start cmd /k "cd client && npm start"

echo.
echo ✓ Both servers starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
