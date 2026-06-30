import os
import subprocess
import shutil

def replace_in_files(directory, old_str, new_str):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.ts', '.tsx', '.js', '.jsx')):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                if old_str in content:
                    content = content.replace(old_str, new_str)
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"URL mise a jour dans: {file}")

base_dir = os.path.dirname(os.path.abspath(__file__))
frontend_src = os.path.join(base_dir, 'frontend', 'src')
frontend_dir = os.path.join(base_dir, 'frontend')

print("==================================================")
print(" PREPARATION POUR LA PRODUCTION (cPanel)")
print("==================================================")

print("\n1. Configuration de l'URL de l'API (https://api.optuce.baitul.tech)...")
replace_in_files(frontend_src, 'http://127.0.0.1:8000', 'https://api.optuce.baitul.tech')
replace_in_files(frontend_src, 'http://localhost:8000', 'https://api.optuce.baitul.tech')

print("\n2. Compilation du projet React...")
try:
    # Use shell=True for windows
    subprocess.run('npm run build', shell=True, cwd=frontend_dir, check=True)
except subprocess.CalledProcessError:
    print("\n[ERREUR] La compilation a echoue. Veuillez verifier le code.")
    input("Appuyez sur Entree pour quitter...")
    exit(1)

print("\n3. Creation de l'archive froptuce.zip...")
dist_dir = os.path.join(frontend_dir, 'dist')
zip_path = os.path.join(base_dir, 'froptuce')
if os.path.exists(f"{zip_path}.zip"):
    os.remove(f"{zip_path}.zip")

shutil.make_archive(zip_path, 'zip', dist_dir)
print(f"\n[SUCCES] Le fichier a ete genere avec succes !")
print(f"-> {zip_path}.zip")
print("Vous pouvez maintenant importer ce fichier dans le dossier de optuce.baitul.tech sur cPanel.")
print("==================================================")
input("Appuyez sur Entree pour fermer...")
