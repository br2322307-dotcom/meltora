@echo off
title MeltOra - Fullstack Development Server
echo ========================================================
echo       Starting MeltOra (Flask Backend + React Frontend)
echo ========================================================
echo.

rem 1. Start Flask Backend on Port 5000 in background window
start "Meltora Backend (Flask:5000)" cmd /k "cd /d %~dp0backend && python app.py"

rem 2. Start Vite Frontend on Port 5173
echo Backend starting at http://127.0.0.1:5000 ...
echo Starting Frontend at http://localhost:5173 ...
echo.
cd /d %~dp0my-react-app
npm run dev
