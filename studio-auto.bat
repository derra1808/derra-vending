@echo off
cd /d "%~dp0"
echo Demarrage Derra Studio AUTO (jusqu a 10 videos / jour)...
echo Laisse cette fenetre ouverte. Ctrl+C pour arreter.
echo.
npm run studio:auto
pause
