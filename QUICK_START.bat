@echo off
cls
echo ================================================
echo   Admin ^& Delivery System - Setup ^& Testing
echo ================================================
echo.

echo Installing dependencies...
call npm install

echo.
echo ================================================
echo   Services will start in the terminal
echo ================================================
echo.

echo Starting services...
echo Backend API: http://localhost:5001/api
echo Frontend: http://localhost:5173
echo.

npm run dev

echo.
echo ================================================
echo   Admin Panel
echo ================================================
echo URL: http://localhost:5173/admin/login
echo Email: admin@liminara.com
echo Password: admin123
echo.

echo ================================================
echo   Delivery Dashboard
echo ================================================
echo URL: http://localhost:5173/delivery/login
echo Email: agent1@liminara.com
echo Password: agent123
echo.

echo ================================================
echo   Test Suite
echo ================================================
echo Run: node tests/admin-delivery-tests.js
echo.

pause
