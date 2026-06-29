from django.db import models
from django.utils import timezone
from django.db.models import Q


# ─── Montures ────────────────────────────────────────────────────────────────

class Marque(models.Model):
    nom = models.CharField(max_length=100, unique=True)
    logo = models.ImageField(upload_to='marques/', null=True, blank=True)

    class Meta:
        verbose_name = "Marque"
        ordering = ['nom']

    def __str__(self):
        return self.nom


class Monture(models.Model):
    """Gestion des montures par matrice Marque > Modèle > Sexe > Couleur > Taille"""
    SEXE_CHOICES = [
        ('H', 'Homme'),
        ('F', 'Femme'),
        ('U', 'Unisexe'),
        ('E', 'Enfant'),
    ]
    MATERIAU_CHOICES = [
        ('acetate', 'Acétate'),
        ('metal', 'Métal'),
        ('titane', 'Titane'),
        ('plastique', 'Plastique'),
        ('mixte', 'Mixte'),
    ]

    marque = models.ForeignKey(Marque, on_delete=models.PROTECT, related_name='montures')
    modele = models.CharField(max_length=100, verbose_name="Modèle")
    sexe = models.CharField(max_length=1, choices=SEXE_CHOICES, default='U')
    couleur = models.CharField(max_length=50)
    taille = models.CharField(max_length=20, blank=True, verbose_name="Taille (ex: 52-18-140)")
    materiau = models.CharField(max_length=20, choices=MATERIAU_CHOICES, blank=True)
    code_barres = models.CharField(max_length=50, unique=True, blank=True)
    reference = models.CharField(max_length=100, blank=True)
    prix_achat = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    prix_vente = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    stock = models.IntegerField(default=0)
    stock_minimum = models.IntegerField(default=1, verbose_name="Stock minimum")
    image = models.ImageField(upload_to='montures/', null=True, blank=True)
    actif = models.BooleanField(default=True)
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Monture"
        verbose_name_plural = "Montures"
        ordering = ['marque', 'modele', 'couleur']
        unique_together = ['marque', 'modele', 'couleur', 'taille', 'sexe']

    def __str__(self):
        return f"{self.marque} — {self.modele} ({self.couleur} / {self.get_sexe_display()})"

    @property
    def alerte_stock(self):
        return self.stock <= self.stock_minimum


# ─── Verres ──────────────────────────────────────────────────────────────────

class Verre(models.Model):
    """Grille de verres par indice et traitement"""
    INDICE_CHOICES = [
        ('1.50', 'Minéral 1.50'),
        ('1.56', 'Organique 1.56'),
        ('1.60', 'Organique 1.60'),
        ('1.67', 'Organique 1.67'),
        ('1.74', 'Organique 1.74'),
    ]
    TRAITEMENT_CHOICES = [
        ('standard', 'Standard'),
        ('ar', 'Anti-reflet'),
        ('bluecut', 'BlueCut / Anti-lumière bleue'),
        ('photochromique', 'Photochromique'),
        ('ar_bluecut', 'Anti-reflet + BlueCut'),
        ('ar_photo', 'Anti-reflet + Photochromique'),
        ('polarise', 'Polarisé'),
    ]
    TYPE_CHOICES = [
        ('unifocal', 'Unifocal'),
        ('bifocal', 'Bifocal'),
        ('progressif', 'Progressif'),
        ('degressif', 'Dégressif'),
    ]

    fournisseur = models.ForeignKey(
        'atelier.Fournisseur', on_delete=models.SET_NULL,
        null=True, blank=True, related_name='verres'
    )
    reference = models.CharField(max_length=100, unique=True)
    type_verre = models.CharField(max_length=20, choices=TYPE_CHOICES, default='unifocal')
    indice = models.CharField(max_length=10, choices=INDICE_CHOICES, default='1.50')
    traitement = models.CharField(max_length=20, choices=TRAITEMENT_CHOICES, default='standard')
    # Plages de correction disponibles
    sphere_min = models.DecimalField(max_digits=5, decimal_places=2, default=-10)
    sphere_max = models.DecimalField(max_digits=5, decimal_places=2, default=10)
    cylindre_max = models.DecimalField(max_digits=4, decimal_places=2, default=4)
    prix_achat = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    prix_vente = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    stock = models.IntegerField(default=0)
    stock_minimum = models.IntegerField(default=2)
    actif = models.BooleanField(default=True)
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Verre"
        verbose_name_plural = "Verres"
        ordering = ['indice', 'type_verre', 'traitement']

    def __str__(self):
        return f"{self.get_indice_display()} — {self.get_type_verre_display()} {self.get_traitement_display()}"

    @property
    def alerte_stock(self):
        return self.stock <= self.stock_minimum


# ─── Lentilles ───────────────────────────────────────────────────────────────

class Lentille(models.Model):
    """Lentilles de contact avec gestion DLC et lots"""
    TYPE_CHOICES = [
        ('journaliere', 'Journalière'),
        ('bi_hebdo', 'Bi-hebdomadaire'),
        ('mensuelle', 'Mensuelle'),
        ('trimestrielle', 'Trimestrielle'),
        ('annuelle', 'Annuelle'),
        ('rigide', 'Rigide / Torique'),
    ]

    marque = models.CharField(max_length=100)
    reference = models.CharField(max_length=100, unique=True)
    type_port = models.CharField(max_length=20, choices=TYPE_CHOICES, default='mensuelle')
    puissance = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    cylindre = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    axe = models.IntegerField(null=True, blank=True)
    addition = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    rayon_courbure = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    diametre = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True)
    # Stock & traçabilité
    numero_lot = models.CharField(max_length=100, blank=True, verbose_name="N° de lot")
    date_limite_consommation = models.DateField(null=True, blank=True, verbose_name="DLC")
    stock = models.IntegerField(default=0)
    stock_minimum = models.IntegerField(default=5)
    prix_achat = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    prix_vente = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    actif = models.BooleanField(default=True)
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Lentille"
        verbose_name_plural = "Lentilles"
        ordering = ['marque', 'reference']

    def __str__(self):
        return f"{self.marque} — {self.reference}"

    @property
    def alerte_stock(self):
        return self.stock <= self.stock_minimum

    @property
    def alerte_dlc(self):
        if self.date_limite_consommation:
            jours_restants = (self.date_limite_consommation - timezone.now().date()).days
            return jours_restants <= 90  # Alerte 3 mois avant expiration
        return False

    @property
    def jours_avant_dlc(self):
        if self.date_limite_consommation:
            return (self.date_limite_consommation - timezone.now().date()).days
        return None


# ─── Accessoires ─────────────────────────────────────────────────────────────

class Accessoire(models.Model):
    """Accessoires divers (étuis, lingettes, solutions, etc.)"""
    CATEGORIE_CHOICES = [
        ('etui', 'Étui'),
        ('chaine', 'Chaîne / Cordon'),
        ('solution', 'Solution entretien'),
        ('lingette', 'Lingette'),
        ('tournevis', 'Tournevis / Outils'),
        ('autre', 'Autre'),
    ]

    nom = models.CharField(max_length=200)
    reference = models.CharField(max_length=100, unique=True)
    categorie = models.CharField(max_length=20, choices=CATEGORIE_CHOICES, default='autre')
    code_barres = models.CharField(max_length=50, blank=True)
    prix_achat = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    prix_vente = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    stock = models.IntegerField(default=0)
    stock_minimum = models.IntegerField(default=5)
    actif = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Accessoire"
        verbose_name_plural = "Accessoires"
        ordering = ['categorie', 'nom']

    def __str__(self):
        return f"{self.nom} ({self.reference})"

    @property
    def alerte_stock(self):
        return self.stock <= self.stock_minimum
