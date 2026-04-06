@echo off
echo Killing all Node and npm processes...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM npm.exe >nul 2>&1
echo ✓ All processes cleared
echo Waiting 3 seconds...
timeout /t 3 /nobreak
echo Ready to start npm servers
