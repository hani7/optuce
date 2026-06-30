from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User


class Vente(models.Model):
    """Vente principale (Point de Vente)"""
    STATUT_CHOICES = [
        ('brouillon', '📝 Brouillon'),
        ('finalisee', '✅ Finalisée'),
        ('annulee', '❌ Annulée'),
    ]
    TYPE_CHOICES = [
        ('vente', 'Vente directe'),
        ('devis', 'Devis / Proforma'),
        ('bon_livraison', 'Bon de livraison'),
    ]

    # Numéro automatique
    numero = models.CharField(max_length=25, unique=True, blank=True)
    type_document = models.CharField(max_length=20, choices=TYPE_CHOICES, default='vente')
    statut = models.CharField(max_length=15, choices=STATUT_CHOICES, default='brouillon')
    patient = models.ForeignKey(
        'patients.Patient', on_delete=models.SET_NULL,
        null=True, blank=True, related_name='ventes'
    )
    vendeur = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name='ventes'
    )
    date = models.DateTimeField(default=timezone.now)
    notes = models.TextField(blank=True)

    # Totaux
    sous_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    remise_pourcentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    remise_montant = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_ttc = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_paye = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Vente"
        verbose_name_plural = "Ventes"
        ordering = ['-date']

    def __str__(self):
        return f"{self.numero} — {self.patient or 'Client anonyme'}"

    def save(self, *args, **kwargs):
        if not self.numero:
            annee_mois = timezone.now().strftime('%Y%m')
            from django.db.models import Max
            prefix_map = {'vente': 'VTE', 'devis': 'DEV', 'bon_livraison': 'BDL'}
            prefix = prefix_map.get(self.type_document, 'VTE')
            dernier = Vente.objects.filter(
                numero__startswith=f'{prefix}-{annee_mois}-'
            ).aggregate(Max('numero'))['numero__max']
            seq = int(dernier.split('-')[-1]) + 1 if dernier else 1
            self.numero = f'{prefix}-{annee_mois}-{seq:04d}'
        self.calcul_totaux()
        super().save(*args, **kwargs)

    def calcul_totaux(self):
        """Recalcule les totaux à partir des lignes"""
        lignes = self.lignes.all() if self.pk else []
        self.sous_total = sum(l.total_ligne for l in lignes)
        if self.remise_pourcentage > 0:
            self.remise_montant = self.sous_total * self.remise_pourcentage / 100
        self.total_ttc = self.sous_total - self.remise_montant
        self.total_paye = sum(e.montant for e in self.encaissements.all()) if self.pk else 0

    @property
    def reste_a_payer(self):
        return self.total_ttc - self.total_paye

    @property
    def est_solde(self):
        return self.reste_a_payer <= 0


class LigneVente(models.Model):
    """Ligne d'article dans une vente"""
    TYPE_ARTICLE_CHOICES = [
        ('monture', 'Monture'),
        ('verre_od', 'Verre OD'),
        ('verre_og', 'Verre OG'),
        ('lentille', 'Lentille'),
        ('accessoire', 'Accessoire'),
        ('service', 'Prestation / Service'),
        ('autre', 'Autre'),
    ]

    vente = models.ForeignKey(Vente, on_delete=models.CASCADE, related_name='lignes')
    type_article = models.CharField(max_length=15, choices=TYPE_ARTICLE_CHOICES)
    designation = models.CharField(max_length=300)
    reference = models.CharField(max_length=100, blank=True)
    # Clés optionnelles vers les articles
    monture = models.ForeignKey(
        'stocks.Monture', on_delete=models.SET_NULL, null=True, blank=True
    )
    verre = models.ForeignKey(
        'stocks.Verre', on_delete=models.SET_NULL, null=True, blank=True
    )
    lentille = models.ForeignKey(
        'stocks.Lentille', on_delete=models.SET_NULL, null=True, blank=True
    )
    accessoire = models.ForeignKey(
        'stocks.Accessoire', on_delete=models.SET_NULL, null=True, blank=True
    )
    quantite = models.IntegerField(default=1)
    prix_unitaire = models.DecimalField(max_digits=10, decimal_places=2)
    remise = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    class Meta:
        verbose_name = "Ligne de vente"
        verbose_name_plural = "Lignes de vente"

    def __str__(self):
        return f"{self.designation} x{self.quantite}"

    @property
    def total_ligne(self):
        return self.quantite * self.prix_unitaire * (1 - self.remise / 100)


class Encaissement(models.Model):
    """Paiement / encaissement lié à une vente"""
    MODE_CHOICES = [
        ('especes', '💵 Espèces'),
        ('cib', '💳 CIB / Edahabia'),
        ('cheque', '📄 Chèque'),
        ('virement', '🏦 Virement'),
        ('autre', 'Autre'),
    ]

    vente = models.ForeignKey(Vente, on_delete=models.CASCADE, related_name='encaissements')
    mode = models.CharField(max_length=15, choices=MODE_CHOICES)
    montant = models.DecimalField(max_digits=12, decimal_places=2)
    date = models.DateTimeField(default=timezone.now)
    reference = models.CharField(max_length=100, blank=True, verbose_name="N° chèque / référence")
    est_acompte = models.BooleanField(default=False, verbose_name="Acompte")
    notes = models.CharField(max_length=200, blank=True)

    class Meta:
        verbose_name = "Encaissement"
        verbose_name_plural = "Encaissements"

    def __str__(self):
        return f"{self.get_mode_display()} — {self.montant} DA"

class Charge(models.Model):
    """Suivi des charges / dépenses opérationnelles"""
    CATEGORIE_CHOICES = [
        ('Loyer', 'Loyer'),
        ('Électricité', 'Électricité / Gaz'),
        ('Eau', 'Eau'),
        ('Internet', 'Internet / Téléphone'),
        ('Fourniture', 'Fourniture de bureau'),
        ('Salaire', 'Salaires'),
        ('Maintenance', 'Entretien / Maintenance'),
        ('Autre', 'Autre'),
    ]
    TYPE_CHOICES = [
        ('Fixe', 'Fixe'),
        ('Variable', 'Variable'),
    ]
    STATUT_CHOICES = [
        ('Payé', 'Payé'),
        ('En attente', 'En attente'),
    ]

    date = models.DateField(default=timezone.now)
    categorie = models.CharField(max_length=50, choices=CATEGORIE_CHOICES, default='Autre')
    description = models.CharField(max_length=300)
    montant = models.DecimalField(max_digits=12, decimal_places=2)
    type_charge = models.CharField(max_length=20, choices=TYPE_CHOICES, default='Variable')
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='Payé')

    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Charge / Dépense"
        verbose_name_plural = "Charges / Dépenses"
        ordering = ['-date']

    def __str__(self):
        return f"{self.categorie} — {self.montant} DZD ({self.date})"
