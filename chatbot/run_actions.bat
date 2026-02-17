@echo off
call venv\Scripts\activate.bat
echo Starting Rasa Action Server...
rasa run actions
pause
