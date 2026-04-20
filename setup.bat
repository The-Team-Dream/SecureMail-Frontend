@echo off
chcp 65001 > nul

:: ═══════════════════════════════════════════════════════════════
:: SecureMail-Frontend — Standalone Setup Script (Windows)
:: Usage: Double-click setup.bat OR run in terminal
:: ═══════════════════════════════════════════════════════════════

echo.
echo +==========================================+
echo ^|      SecureMail-Frontend Setup          ^|
echo +==========================================+
echo.

:: ── 1. Check Docker ────────────────────────────────────────────
docker info > nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)
echo [OK] Docker is running
echo.

:: ── 2. Create .env.standalone from example ─────────────────────
if not exist .env.standalone (
    copy .env.standalone.example .env.standalone > nul
    echo [OK] Created .env.standalone
) else (
    echo [INFO] .env.standalone already exists -- skipping copy
)
echo.

:: ── 3. Ask for Backend URL ─────────────────────────────────────
echo ------------------------------------------
echo   BACKEND URL SETUP
echo ------------------------------------------
echo.
echo   [!] This URL is baked into the JS bundle at build time.
echo       It must be reachable from the USER'S BROWSER,
echo       not from inside Docker.
echo.
echo   Press Enter to use default: http://localhost:3000
echo.
set /p backend_url="  Backend URL: "

if "%backend_url%"=="" (
    set backend_url=http://localhost:3000
    echo   [OK] Using default: http://localhost:3000
) else (
    echo   [OK] Backend URL set to: %backend_url%
)
echo.

:: ── 4. Update docker-compose.yml and .env.standalone ───────────
powershell -Command "(Get-Content docker-compose.yml) -replace 'NEXT_PUBLIC_API_URL: \".*\"', 'NEXT_PUBLIC_API_URL: \"%backend_url%\"' | Set-Content docker-compose.yml"
powershell -Command "(Get-Content .env.standalone) -replace '^NEXT_PUBLIC_API_URL=.*', 'NEXT_PUBLIC_API_URL=%backend_url%' | Set-Content .env.standalone"

echo [OK] Backend URL written to docker-compose.yml and .env.standalone
echo.

:: ── 5. Reminder ────────────────────────────────────────────────
echo ------------------------------------------
echo   REMINDER
echo ------------------------------------------
echo.
echo   The Frontend requires the Backend to be running.
echo   Make sure SecureMail-Backend is up on:
echo   %backend_url%
echo.
echo   If the Backend URL changes, re-run setup.bat
echo   to rebuild the image with the new URL.
echo.
echo ------------------------------------------
echo.
pause

:: ── 6. Start Docker Compose ────────────────────────────────────
echo.
echo [START] Starting SecureMail-Frontend...
echo         First build may take a few minutes
echo.
docker compose down > nul 2>&1
docker compose up --build -d

:: ── 7. Wait for service ────────────────────────────────────────
echo.
echo [WAIT] Waiting for Frontend to be ready...
set RETRIES=30

:waitloop
docker inspect securemail-frontend 2>nul | findstr /i "healthy" > nul
if not errorlevel 1 goto done

set /a RETRIES-=1
if %RETRIES%==0 (
    echo.
    echo [ERROR] Frontend failed to start. Check logs with:
    echo         docker compose logs frontend
    pause
    exit /b 1
)
echo   still waiting...
timeout /t 5 /nobreak > nul
goto waitloop

:: ── 8. Done ────────────────────────────────────────────────────
:done
echo.
echo +==========================================+
echo ^|      OK  Frontend is running!           ^|
echo +==========================================+
echo ^|  Dashboard: http://localhost:3001       ^|
echo ^|  Backend:   %backend_url%
echo +==========================================+
echo ^|  Logs:  docker compose logs -f frontend^|
echo ^|  Stop:  docker compose down            ^|
echo +==========================================+
echo.
pause
