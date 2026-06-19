@echo off
title Aplikasi Bantuan Siswa Tangerang
color 0B

echo.
echo  ╔══════════════════════════════════════════════════════════╗
echo  ║                                                          ║
echo  ║   Aplikasi Bantuan Siswa Tangerang                        ║
echo  ║   Tangerang Cerdas ^& Program Indonesia Pintar            ║
echo  ║                                                          ║
echo  ╚══════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo [INFO] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js tidak ditemukan! Silakan install Node.js terlebih dahulu.
    pause
    exit /b 1
)

echo [INFO] Node.js found
echo.

echo [INFO] Installing dependencies...
call npm install
if errorlevel 1 (
    echo [ERROR] Gagal install dependencies!
    pause
    exit /b 1
)

echo [INFO] Memeriksa port 7122...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":7122" ^| find "LISTENING"') do (
    echo [INFO] Menutup proses PID: %%a yang berjalan di port 7122...
    taskkill /f /pid %%a >nul 2>&1
)

echo.
echo [INFO] Starting server...
echo.
echo [INFO] Server akan berjalan di: http://localhost:7122
echo [INFO] Tekan Ctrl+C untuk berhenti
echo.

npm start

pause
