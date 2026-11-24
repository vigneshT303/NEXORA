@echo off
echo ========================================================
echo Starting EMS Spring Boot Backend on http://localhost:8080
echo ========================================================

REM Auto-detect JAVA_HOME if not already set or invalid
if not exist "%JAVA_HOME%\bin\java.exe" (
    if exist "C:\Users\vigne\AppData\Local\Programs\Eclipse Adoptium\jdk-21.0.13.10002-hotspot\bin\java.exe" (
        set "JAVA_HOME=C:\Users\vigne\AppData\Local\Programs\Eclipse Adoptium\jdk-21.0.13.10002-hotspot"
        set "PATH=C:\Users\vigne\AppData\Local\Programs\Eclipse Adoptium\jdk-21.0.13.10002-hotspot\bin;%PATH%"
        echo [EMS] Configured JAVA_HOME to JDK 21: %JAVA_HOME%
    ) else if exist "C:\Users\vigne\Downloads\jdk-25.0.5.0.3_windows-x64_bin\jdk-25.0.5.0.3\bin\java.exe" (
        set "JAVA_HOME=C:\Users\vigne\Downloads\jdk-25.0.5.0.3_windows-x64_bin\jdk-25.0.5.0.3"
        set "PATH=C:\Users\vigne\Downloads\jdk-25.0.5.0.3_windows-x64_bin\jdk-25.0.5.0.3\bin;%PATH%"
        echo [EMS] Configured JAVA_HOME to JDK 25: %JAVA_HOME%
    )
)

cd backend
if exist mvnw.cmd (
    call mvnw.cmd spring-boot:run
) else (
    call mvn spring-boot:run
)
pause
