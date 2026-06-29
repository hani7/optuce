# ============================================================
#  Optuce — Script de vérification + lancement
#  Double-cliquer ou exécuter dans PowerShell
# ============================================================

Write-Host "`n=====================================================" -ForegroundColor Cyan
Write-Host "   OPTUCE - Gestion Optique Professionnelle" -ForegroundColor Cyan  
Write-Host "=====================================================`n" -ForegroundColor Cyan

$ProjectDir = "c:\Users\pc\Documents\Optuce"
Set-Location $ProjectDir

# Détecter l'environnement virtuel
$EnvActivate = "$ProjectDir\env\Scripts\Activate.ps1"
$PythonExe = "$ProjectDir\env\Scripts\python.exe"
$PipExe = "$ProjectDir\env\Scripts\pip.exe"

if (Test-Path $EnvActivate) {
    Write-Host "[OK] Environnement virtuel détecté" -ForegroundColor Green
    & $EnvActivate
} else {
    Write-Host "[INFO] Pas d'environnement virtuel, utilisation du Python système" -ForegroundColor Yellow
    $PythonExe = "python"
    $PipExe = "pip"
}

# ── 1. Installer les dépendances ────────────────────────────
Write-Host "`n[1/4] Installation des dépendances Python..." -ForegroundColor Yellow
& $PipExe install djangorestframework django-cors-headers djangorestframework-simplejwt pillow python-barcode django-filter requests --quiet
Write-Host "      OK" -ForegroundColor Green

# ── 2. Makemigrations ───────────────────────────────────────
Write-Host "`n[2/4] Création des migrations..." -ForegroundColor Yellow
& $PythonExe manage.py makemigrations ventes patients stocks atelier mutuelles crm
Write-Host "      OK" -ForegroundColor Green

# ── 3. Migrate ──────────────────────────────────────────────
Write-Host "`n[3/4] Application des migrations..." -ForegroundColor Yellow
& $PythonExe manage.py migrate
Write-Host "      OK" -ForegroundColor Green

# ── 4. Créer superuser ──────────────────────────────────────
Write-Host "`n[4/4] Création du compte admin..." -ForegroundColor Yellow
$script = @"
from django.contrib.auth.models import User
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@optuce.dz', 'admin123')
    print('COMPTE CREE: admin / admin123')
else:
    print('Compte admin existant')
"@
$script | & $PythonExe manage.py shell
Write-Host "      OK" -ForegroundColor Green

# ── LANCEMENT ───────────────────────────────────────────────
Write-Host "`n=====================================================" -ForegroundColor Green
Write-Host "   PRET ! Le backend Optuce va démarrer..." -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Green
Write-Host ""
Write-Host "  [Backend]  http://127.0.0.1:8000/api/" -ForegroundColor White
Write-Host "  [Admin]    http://127.0.0.1:8000/admin/" -ForegroundColor White
Write-Host "  [Login]    admin / admin123" -ForegroundColor Yellow
Write-Host ""
Write-Host "  IMPORTANT: Pour le frontend, ouvrez UN AUTRE PowerShell et tapez:" -ForegroundColor Magenta
Write-Host "    cd c:\Users\pc\Documents\Optuce\frontend" -ForegroundColor White
Write-Host "    npm install" -ForegroundColor White  
Write-Host "    npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "  [Frontend] http://localhost:5173/" -ForegroundColor Cyan
Write-Host ""
Write-Host "Appuyez sur Ctrl+C pour arreter le serveur`n" -ForegroundColor DarkGray

& $PythonExe manage.py runserver 127.0.0.1:8000
