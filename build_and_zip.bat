@echo off
echo =========================================
echo    Compilation et Compression du Frontend
echo =========================================

cd frontend
echo 1. Compilation de React (npm run build)...
call npm run build

cd ..
echo.
echo 2. Creation du fichier froptuce.zip...
if exist froptuce.zip del froptuce.zip

powershell -command "Compress-Archive -Path frontend\dist\* -DestinationPath froptuce.zip"

echo.
echo =========================================
echo TERMINE !
echo Le fichier froptuce.zip a ete cree dans le dossier optuce.
echo Vous pouvez maintenant l'importer sur le File Manager de cPanel 
echo et l'extraire dans votre dossier public (ex: public_html ou froptuce).
echo =========================================
pause
