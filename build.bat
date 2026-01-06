@echo off
REM Build script for Windows
REM Runs the Python build script

echo Running MultiSearch build script...
echo.

python scripts\build.py

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Build failed with error code %ERRORLEVEL%
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo Press any key to exit...
pause > nul
