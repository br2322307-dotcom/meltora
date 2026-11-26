@echo off
title MeltOra - Production Server
echo ========================================================
echo       Building & Starting MeltOra Fullstack (Port 5000)
echo ========================================================
echo.

echo 1. Building React Production Bundle...
cd /d %~dp0my-react-app
call npm run build

echo.
echo 2. Launching Flask Fullstack Server...
cd /d %~dp0backend
python app.py
