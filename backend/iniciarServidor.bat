@echo off

cd /d "%~dp0"

if not exist ".venv\Scripts\activate.bat" (
    echo Virtual environment not found. Creating one...
    python -m venv venv
)

call .venv\Scripts\activate.bat

python main.py
deactivate

pause