# ============================================================
#  Optuce Frontend — Script de lancement
#  Ouvrir dans un SECOND terminal PowerShell
# ============================================================

$FrontendDir = "c:\Users\pc\Documents\Optuce\frontend"
Set-Location $FrontendDir

Write-Host "`n========================================" -ForegroundColor Magenta
Write-Host "  OPTUCE FRONTEND — Démarrage" -ForegroundColor Magenta
Write-Host "========================================`n" -ForegroundColor Magenta

# Vérifier si node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "[1/2] Installation des dépendances npm..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) { Write-Host "ERREUR npm install" -ForegroundColor Red; exit 1 }
    Write-Host "    OK - node_modules installé" -ForegroundColor Green
} else {
    Write-Host "[1/2] node_modules existant, passage à l'étape suivante..." -ForegroundColor Green
}

Write-Host "`n[2/2] Démarrage du serveur de développement Vite..." -ForegroundColor Yellow
Write-Host ""
Write-Host "  Frontend : http://localhost:5173/" -ForegroundColor White
Write-Host "  (Le frontend proxifie automatiquement vers http://localhost:8000/api/)" -ForegroundColor DarkGray
Write-Host ""

npm run dev
