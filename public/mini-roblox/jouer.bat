@echo off
title Mini Sandbox - Serveur local
cd /d "%~dp0"
echo.
echo  Mini Sandbox demarre...
echo  Ouvre dans ton navigateur :
echo.
echo  http://localhost:5500
echo.
echo  Ferme cette fenetre pour arreter le jeu.
echo.
npx --yes serve -p 5500 -n .
pause
