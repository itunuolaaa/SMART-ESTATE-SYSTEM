@echo off
call venv\Scripts\activate.bat
echo Starting Rasa Chatbot Server...
rasa run --enable-api --cors "*"
pause
