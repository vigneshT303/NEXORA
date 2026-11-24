@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    https://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM ----------------------------------------------------------------------------
@REM Apache Maven Wrapper startup batch script, version 3.3.2
@REM ----------------------------------------------------------------------------

@IF "%__MVNW_ARG0_NAME__%"=="" (SET __MVNW_ARG0_NAME__=%~nx0)
@SET __MVNW_CMD__=%~2
@IF "%__MVNW_CMD__%"=="" (SET __MVNW_CMD__=%~f0)
@SET __BASE_DIR__=%~dp1
@IF "%__BASE_DIR__%"=="" (SET __BASE_DIR__=%~dp0)

@ECHO OFF
SETLOCAL ENABLEEXTENSIONS ENABLEDELAYEDEXPANSION

@REM Auto-detect JAVA_HOME if not set or invalid
IF NOT EXIST "%JAVA_HOME%\bin\java.exe" (
  IF EXIST "C:\Users\vigne\AppData\Local\Programs\Eclipse Adoptium\jdk-21.0.13.10002-hotspot\bin\java.exe" (
    SET "JAVA_HOME=C:\Users\vigne\AppData\Local\Programs\Eclipse Adoptium\jdk-21.0.13.10002-hotspot"
    SET "PATH=C:\Users\vigne\AppData\Local\Programs\Eclipse Adoptium\jdk-21.0.13.10002-hotspot\bin;!PATH!"
    ECHO [EMS] Using JDK 21 at: !JAVA_HOME!
  ) ELSE IF EXIST "C:\Users\vigne\Downloads\jdk-25.0.5.0.3_windows-x64_bin\jdk-25.0.5.0.3\bin\java.exe" (
    SET "JAVA_HOME=C:\Users\vigne\Downloads\jdk-25.0.5.0.3_windows-x64_bin\jdk-25.0.5.0.3"
    SET "PATH=C:\Users\vigne\Downloads\jdk-25.0.5.0.3_windows-x64_bin\jdk-25.0.5.0.3\bin;!PATH!"
    ECHO [EMS] Using JDK 25 at: !JAVA_HOME!
  )
)

SET "MAVEN_PROJECTBASEDIR=%__BASE_DIR__%"
IF NOT "%MAVEN_PROJECTBASEDIR:~-1%"=="\" SET "MAVEN_PROJECTBASEDIR=%MAVEN_PROJECTBASEDIR%\"

SET "WRAPPER_DIR=%MAVEN_PROJECTBASEDIR%.mvn\wrapper"
SET "WRAPPER_PROP=%WRAPPER_DIR%\maven-wrapper.properties"

IF NOT EXIST "%WRAPPER_PROP%" (
  ECHO Error: Cannot find %WRAPPER_PROP%
  EXIT /B 1
)

FOR /F "tokens=1,2 delims==" %%A IN ('findstr /R "^distributionUrl=" "%WRAPPER_PROP%"') DO (
  SET "DIST_URL=%%B"
)

IF "%DIST_URL%"=="" (
  ECHO Error: No distributionUrl found in %WRAPPER_PROP%
  EXIT /B 1
)

SET "MVN_ZIP_NAME=apache-maven-3.9.9-bin.zip"
SET "TARGET_DIR=%USERPROFILE%\.m2\wrapper\dists\apache-maven-3.9.9"
SET "MAVEN_HOME=%TARGET_DIR%\apache-maven-3.9.9"
SET "MVN_EXEC=%MAVEN_HOME%\bin\mvn.cmd"

IF NOT EXIST "%MVN_EXEC%" (
  ECHO Maven wrapper: Downloading Maven 3.9.9...
  IF NOT EXIST "%TARGET_DIR%" MKDIR "%TARGET_DIR%"
  powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object System.Net.WebClient).DownloadFile('%DIST_URL%', '%TARGET_DIR%\%MVN_ZIP_NAME%')"
  IF ERRORLEVEL 1 (
    ECHO Error: Failed to download Maven. Please ensure internet access or install Maven manually.
    EXIT /B 1
  )
  ECHO Maven wrapper: Extracting Maven...
  powershell -Command "Expand-Archive -Path '%TARGET_DIR%\%MVN_ZIP_NAME%' -DestinationPath '%TARGET_DIR%' -Force"
)

IF NOT EXIST "%MVN_EXEC%" (
  ECHO Error: Maven executable not found at %MVN_EXEC%
  EXIT /B 1
)

"%MVN_EXEC%" %*
