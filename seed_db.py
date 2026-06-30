import os
import django
import random
from datetime import date, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'optuce_p.settings')
django.setup()

from stocks.models import Categorie, Marque, Monture, Verre
from patients.models import Patient
from atelier.models import Fournisseur, AchatFournisseur
from ventes.models import Charge, Vente, LigneVente, Encaissement

def seed():
    print("Seeding database...")
    
    # 1. Patients
    noms = ['Benali', 'Saidi', 'Brahimi', 'Kaddour', 'Mansouri', 'Cherif', 'Haddad', 'Ziani', 'Bennacer', 'Mahrez']
    prenoms = ['Amine', 'Yacine', 'Sarah', 'Meriem', 'Karim', 'Nadia', 'Tarik', 'Lina', 'Walid', 'Ines']
    
    patients_created = 0
    for i in range(25):
        nom = random.choice(noms)
        prenom = random.choice(prenoms)
        phone = f"05{random.randint(40000000, 69999999)}"
        # Random DOB between 1950 and 2015
        start_date = date(1950, 1, 1)
        end_date = date(2015, 1, 1)
        dob = start_date + timedelta(days=random.randint(0, (end_date - start_date).days))
        
        Patient.objects.get_or_create(
            nom=nom,
            prenom=prenom,
            telephone=phone,
            date_naissance=dob
        )
        patients_created += 1
    print(f"✅ {patients_created} patients seeded.")

    # 2. Categories
    cat_solaire, _ = Categorie.objects.get_or_create(nom='Solaire', defaults={'description': 'Lunettes de soleil'})
    cat_optique, _ = Categorie.objects.get_or_create(nom='Optique', defaults={'description': 'Lunettes de vue'})
    cat_sport, _ = Categorie.objects.get_or_create(nom='Sport', defaults={'description': 'Lunettes de sport'})
    cat_enfant, _ = Categorie.objects.get_or_create(nom='Enfant', defaults={'description': 'Lunettes pour enfants'})
    
    cat_unifocal, _ = Categorie.objects.get_or_create(nom='Unifocal', defaults={'description': 'Verres unifocaux'})
    cat_progressif, _ = Categorie.objects.get_or_create(nom='Progressif', defaults={'description': 'Verres progressifs'})
    cat_bifocal, _ = Categorie.objects.get_or_create(nom='Bifocal', defaults={'description': 'Verres bifocaux'})
    cat_degressif, _ = Categorie.objects.get_or_create(nom='Dégressif', defaults={'description': 'Verres dégressifs'})

    # 3. Marques
    marques = ['Ray-Ban', 'Gucci', 'Oakley', 'Vogue', 'Prada', 'Tom Ford', 'Persol', 'Carrera', 'Sans Marque']
    marques_objs = {}
    for m in marques:
        marques_objs[m], _ = Marque.objects.get_or_create(nom=m)
        
    marques_verres = ['Essilor', 'Zeiss', 'Hoya', 'BBGR', 'Shamir', 'Novacel']
    marques_verres_objs = {}
    for m in marques_verres:
        marques_verres_objs[m], _ = Marque.objects.get_or_create(nom=m)

    # 4. Photos
    # These are the URLs we used in the frontend dummyData
    photos_montures = [
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1483412033650-1015dce1591e?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=400&q=80"
    ]
    photos_verres = [
        "https://images.unsplash.com/photo-1614583225154-5fcdda07019e?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1582143003299-fb8b813b145d?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1605333555547-49d70104fcce?auto=format&fit=crop&w=400&q=80"
    ]

    # 5. Montures (30)
    cats_montures = [cat_solaire, cat_optique, cat_sport, cat_enfant]
    montures_created = 0
    for i in range(30):
        cat = random.choice(cats_montures)
        marque = marques_objs[random.choice(marques)]
        photo = random.choice(photos_montures)
        prix = round(random.uniform(8500, 50000) / 500) * 500
        
        # We try not to duplicate references
        ref = f"REF-{1000 + i}"
        Monture.objects.get_or_create(
            reference=ref,
            defaults={
                'modele': f"Modèle {chr(random.randint(65, 90))}{random.randint(10, 99)}",
                'marque': marque,
                'categorie': cat,
                'prix_achat': prix * 0.4,
                'prix_vente': prix,
                'stock': random.randint(0, 50),
                'stock_minimum': 2,
                'image': photo,
                'code_barres': f"BAR-{1000 + i}"
            }
        )
        montures_created += 1
    print(f"✅ {montures_created} montures seeded.")

    # 6. Verres (30)
    cats_verres = [cat_unifocal, cat_progressif, cat_bifocal, cat_degressif]
    verres_created = 0
    for i in range(30):
        cat = random.choice(cats_verres)
        marque = marques_verres_objs[random.choice(marques_verres)]
        photo = random.choice(photos_verres)
        prix = round(random.uniform(3000, 25000) / 500) * 500
        
        ref = f"VR-{2000 + i}"
        Verre.objects.get_or_create(
            reference=ref,
            defaults={
                'type_verre': random.choice(['unifocal', 'bifocal', 'progressif', 'degressif']),
                'indice': random.choice(['1.50', '1.56', '1.60', '1.67']),
                'traitement': random.choice(['standard', 'ar', 'bluecut', 'photochromique']),
                'categorie': cat,
                'prix_achat': prix * 0.3,
                'prix_vente': prix,
                'stock': random.randint(0, 100),
                'stock_minimum': 5,
            }
        )
        verres_created += 1
    print(f"✅ {verres_created} verres seeded.")
    print(f"✅ {verres_created} verres seeded.")

    # 7. Fournisseurs
    fournisseurs_noms = ['Essilor', 'Zeiss', 'Hoya', 'BBGR', 'Safilo', 'Luxottica', 'Marcolin', 'Bausch & Lomb', 'Alcon', 'CooperVision']
    fournisseurs_objs = []
    for nom in fournisseurs_noms:
        f, _ = Fournisseur.objects.get_or_create(
            nom=nom,
            defaults={
                'email': f"contact@{nom.lower().replace(' ', '')}.com",
                'telephone': f"05{random.randint(10000000, 99999999)}",
                'adresse': "Zone Industrielle Rouiba, Alger",
                'contact_nom': f"Representant {nom}",
                'delai_livraison_jours': random.randint(2, 10)
            }
        )
        fournisseurs_objs.append(f)
    print(f"✅ {len(fournisseurs_objs)} fournisseurs seeded.")

    # 8. Achats Fournisseurs
    statuts_achat = ['brouillon', 'en_attente', 'recu', 'annule']
    achats_created = 0
    for i in range(10):
        fournisseur = random.choice(fournisseurs_objs)
        montant = round(random.uniform(50000, 500000) / 1000) * 1000
        AchatFournisseur.objects.create(
            fournisseur=fournisseur,
            statut=random.choice(statuts_achat),
            montant_total=montant,
            notes="Commande mensuelle de réassort",
            date_commande=date.today() - timedelta(days=random.randint(1, 30))
        )
        achats_created += 1
    print(f"✅ {achats_created} achats fournisseurs seeded.")

    # 9. Charges
    categories_charges = ['Loyer', 'Électricité', 'Eau', 'Internet', 'Fourniture', 'Salaire', 'Maintenance', 'Autre']
    types_charges = ['Fixe', 'Variable']
    statuts_charges = ['Payé', 'En attente']
    
    charges_created = 0
    for i in range(10):
        cat = random.choice(categories_charges)
        montant = round(random.uniform(5000, 150000) / 500) * 500
        Charge.objects.create(
            categorie=cat,
            description=f"Paiement {cat} pour le mois",
            montant=montant,
            type_charge=random.choice(types_charges),
            statut=random.choice(statuts_charges),
            date=date.today() - timedelta(days=random.randint(1, 60))
        )
        charges_created += 1
    print(f"✅ {charges_created} charges seeded.")

    print(f"✅ {charges_created} charges seeded.")

    # 10. Ventes (Commandes)
    ventes_created = 0
    statuts_vente = ['brouillon', 'finalisee']
    patients_list = list(Patient.objects.all())
    montures_list = list(Monture.objects.all())
    verres_list = list(Verre.objects.all())

    for i in range(15):
        patient = random.choice(patients_list) if patients_list else None
        vente = Vente.objects.create(
            patient=patient,
            statut=random.choice(statuts_vente),
            type_document='vente',
            date=date.today() - timedelta(days=random.randint(1, 60))
        )
        # Add 1 or 2 lines
        for j in range(random.randint(1, 2)):
            is_monture = random.choice([True, False])
            if is_monture and montures_list:
                monture = random.choice(montures_list)
                LigneVente.objects.create(
                    vente=vente,
                    type_article='monture',
                    monture=monture,
                    designation=f"{monture.marque.nom} {monture.modele}",
                    quantite=1,
                    prix_unitaire=monture.prix_vente or random.randint(5000, 30000)
                )
            elif verres_list:
                verre = random.choice(verres_list)
                LigneVente.objects.create(
                    vente=vente,
                    type_article=random.choice(['verre_od', 'verre_og']),
                    verre=verre,
                    designation=f"Verre {verre.get_traitement_display()}",
                    quantite=1,
                    prix_unitaire=verre.prix_vente or random.randint(3000, 15000)
                )
        
        vente.calcul_totaux()
        vente.save()
        
        if vente.statut == 'finalisee' and vente.total_ttc > 0:
            Encaissement.objects.create(
                vente=vente,
                mode=random.choice(['especes', 'cib', 'cheque', 'virement']),
                montant=vente.total_ttc,
                date=vente.date
            )
        ventes_created += 1
    print(f"✅ {ventes_created} ventes seeded.")

    print("🎉 All done!")

if __name__ == '__main__':
    seed()
