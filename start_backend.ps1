# ============================================================
#  Optuce — Script de lancement complet
#  Exécuter depuis : c:\Users\pc\Documents\Optuce
#  Avec l'environnement virtuel activé (env\Scripts\activate)
# ============================================================

$ErrorActionPreference = "Stop"
$ProjectDir = "c:\Users\pc\Documents\Optuce"
Set-Location $ProjectDir

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  OPTUCE — Démarrage du projet" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# ── 1. Installer les dépendances Python ──────────────────────
Write-Host "[1/4] Installation des dépendances Python..." -ForegroundColor Yellow
pip install djangorestframework django-cors-headers djangorestframework-simplejwt pillow python-barcode django-filter requests --quiet
if ($LASTEXITCODE -ne 0) { Write-Host "ERREUR pip install" -ForegroundColor Red; exit 1 }
Write-Host "    OK - Dépendances installées" -ForegroundColor Green

# ── 2. Créer les migrations ──────────────────────────────────
Write-Host "`n[2/4] Création des migrations..." -ForegroundColor Yellow
python manage.py makemigrations ventes patients stocks atelier mutuelles crm 2>&1
if ($LASTEXITCODE -ne 0) { Write-Host "Avertissement lors de makemigrations" -ForegroundColor DarkYellow }
Write-Host "    OK - Migrations créées" -ForegroundColor Green

# ── 3. Appliquer les migrations ──────────────────────────────
Write-Host "`n[3/4] Application des migrations (base de données)..." -ForegroundColor Yellow
python manage.py migrate 2>&1
if ($LASTEXITCODE -ne 0) { Write-Host "ERREUR migrate" -ForegroundColor Red; exit 1 }
Write-Host "    OK - Base de données prête" -ForegroundColor Green

# ── 4. Créer le superutilisateur si inexistant ───────────────
Write-Host "`n[4/4] Vérification du superutilisateur..." -ForegroundColor Yellow
$createAdmin = @"
from django.contrib.auth.models import User
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@optuce.dz', 'admin123')
    print('Superutilisateur créé: admin / admin123')
else:
    print('Superutilisateur admin existant')
"@
$createAdmin | python manage.py shell
Write-Host "    OK" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  OPTUCE est prêt !" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Backend API  : http://127.0.0.1:8000/api/" -ForegroundColor White
Write-Host "  Admin Django : http://127.0.0.1:8000/admin/" -ForegroundColor White
Write-Host "  Login        : admin / admin123" -ForegroundColor White
Write-Host ""
Write-Host "  Lancement du serveur Django..." -ForegroundColor Cyan
Write-Host "  (Pour le frontend : ouvrir un AUTRE terminal -> cd frontend -> npm install -> npm run dev)" -ForegroundColor DarkGray
Write-Host ""

python manage.py runserver 0.0.0.0:8000
