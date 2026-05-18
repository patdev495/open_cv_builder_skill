@echo off
title Start CV Builder Pro - Development Mode
cls

echo ====================================================================
echo               CV BUILDER PRO - DEVELOPMENT LAUNCHER
echo ====================================================================
echo.
echo [*] Dang khoi chay 2 dich vu trong cac cua so Terminal rieng biet...
echo.

:: 1. Launch Backend in a new command window
echo [*] Khoi dong Backend (FastAPI tren cong 8000)...
start "CV Builder Pro - Backend (FastAPI)" cmd /k "cd backend && uv run python main.py"

:: 2. Wait 1 second for backend port preparation
timeout /t 1 /nobreak > nul

:: 3. Launch Frontend in another new command window
echo [*] Khoi dong Frontend (Vite tren cong 5173)...
start "CV Builder Pro - Frontend (Vite)" cmd /k "cd frontend && npm run dev"

echo.
echo ====================================================================
echo  [SUCCESS] Ca hai dich vu dang duoc khoi chay!
echo  - Backend API:   http://localhost:8000/docs
echo  - Frontend Web:  http://localhost:5173
echo.
echo  De tat he thong, vui long dong 2 cua so Terminal vua duoc mo.
echo ====================================================================
echo.
pause
