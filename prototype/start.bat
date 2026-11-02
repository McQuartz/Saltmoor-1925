@echo off
REM Windows: Doppelklick startet einen lokalen Server und oeffnet das Spiel.
cd /d "%~dp0"
start "" http://localhost:8000/index.html
python -m http.server 8000
