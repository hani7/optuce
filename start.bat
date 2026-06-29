@echo off
cd /d "%~dp0"
echo =======================================================
echo     OPTUCE - DEMARRAGE AUTOMATIQUE
echo =======================================================

echo [1/4] Activation de l'environnement virtuel et installation des dependances...
call env\Scripts\activate.bat
pip install djangorestframework django-cors-headers djangorestframework-simplejwt pillow python-barcode django-filter requests

echo.
echo [2/4] Creation et application des migrations...
python manage.py makemigrations ventes patients stocks atelier mutuelles crm
python manage.py migrate

echo.
echo [3/4] Creation du compte Administrateur (admin / admin123)...
python manage.py shell -c "from django.contrib.auth.models import User; User.objects.create_superuser('admin','a@a.dz','admin123') if not User.objects.filter(username='admin').exists() else print('Compte existant')"

echo.
echo [4/4] Lancement des serveurs...
echo =======================================================
echo   - Backend (Django) se lancera dans une nouvelle fenetre
echo   - Frontend (React) se lancera dans une autre fenetre
echo =======================================================

:: Lancer le backend dans une nouvelle fenetre CMD
start "Optuce Backend" cmd /k "call env\Scripts\activate.bat & python manage.py runserver"

:: Lancer le frontend dans une nouvelle fenetre CMD
cd frontend
echo Installation des dependances npm (cela peut prendre une minute)...
call npm install
start "Optuce Frontend" cmd /k "npm run dev"

echo.
echo Termine ! Vous pouvez acceder a l'application sur :
echo http://localhost:5173/
echo.
pause
