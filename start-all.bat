@echo off
echo ========================================================
echo Starting Employee Management System (EMS Pro)
echo ========================================================

REM Auto-detect JAVA_HOME if not already set
if "%JAVA_HOME%"=="" (
    if exist "%LOCALAPPDATA%\Programs\Eclipse Adoptium\jdk-21.0.13.10002-hotspot" (
        set "JAVA_HOME=%LOCALAPPDATA%\Programs\Eclipse Adoptium\jdk-21.0.13.10002-hotspot"
        set "PATH=%LOCALAPPDATA%\Programs\Eclipse Adoptium\jdk-21.0.13.10002-hotspot\bin;%PATH%"
    )
)

echo Launching Spring Boot Backend...
start "EMS Backend (Spring Boot)" cmd /c "start-backend.bat"
timeout /t 5 /nobreak >nul
echo Launching React Frontend...
start "EMS Frontend (Vite React)" cmd /c "start-frontend.bat"
echo.
echo EMS Pro is starting up!
echo Frontend URL: http://localhost:5173
echo Backend API:  http://localhost:8080/api
echo ========================================================
pause
