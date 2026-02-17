@echo off
call venv\Scripts\activate.bat
echo Training Rasa Model...
rasa train
pause
