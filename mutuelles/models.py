from django.db import models
from django.utils import timezone


class OrganismePayeur(models.Model):
    """CNAS, entreprise, assurance privée, etc."""
    TYPE_CHOICES = [
        ('cnas', 'CNAS'),
        ('casnos', 'CASNOS'),
        ('mutuelle', 'Mutuelle / Complémentaire'),
        ('entreprise', 'Entreprise / Employeur'),
        ('autre', 'Autre'),
    ]

    nom = models.CharField(max_length=200)
    type_organisme = models.CharField(max_length=20, choices=TYPE_CHOICES, default='cnas')
    code = models.CharField(max_length=50, blank=True, verbose_name="Code organisme")
    adresse = models.TextField(blank=True)
    telephone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    contact_nom = models.CharField(max_length=150, blank=True)
    # Taux de remboursement par défaut (%)
    taux_remboursement_montures = models.DecimalField(
        max_digits=5, decimal_places=2, default=0,
        verbose_name="Taux remb. montures (%)"
    )
    taux_remboursement_verres = models.DecimalField(
        max_digits=5, decimal_places=2, default=0,
        verbose_name="Taux remb. verres (%)"
    )
    plafond_montures = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True,
        verbose_name="Plafond montures (DA)"
    )
    plafond_verres = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True,
        verbose_name="Plafond verres (DA)"
    )
    delai_remboursement_jours = models.IntegerField(
        default=30, verbose_name="Délai remboursement (jours)"
    )
    actif = models.BooleanField(default=True)
    notes = models.TextField(blank=True)

    class Meta:
        verbose_name = "Organisme payeur"
        verbose_name_plural = "Organismes payeurs"
        ordering = ['type_organisme', 'nom']

    def __str__(self):
        return f"{self.nom} ({self.get_type_organisme_display()})"


class CarteChifa(models.Model):
    """Carte CHIFA associée à un patient"""
    patient = models.OneToOneField(
        'patients.Patient', on_delete=models.CASCADE,
        related_name='carte_chifa'
    )
    numero_carte = models.CharField(max_length=50, unique=True, verbose_name="N° carte Chifa")
    organisme = models.ForeignKey(
        OrganismePayeur, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='cartes_chifa'
    )
    date_expiration = models.DateField(null=True, blank=True)
    taux_remboursement_personnalise = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True,
        verbose_name="Taux personnalisé (%)"
    )
    actif = models.BooleanField(default=True)
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Carte Chifa"
        verbose_name_plural = "Cartes Chifa"

    def __str__(self):
        return f"Chifa {self.numero_carte} — {self.patient}"

    @property
    def est_expiree(self):
        if self.date_expiration:
            return self.date_expiration < timezone.now().date()
        return False

    @property
    def taux_effectif_verres(self):
        """Retourne le taux réel (personnalisé ou de l'organisme)"""
        if self.taux_remboursement_personnalise is not None:
            return self.taux_remboursement_personnalise
        if self.organisme:
            return self.organisme.taux_remboursement_verres
        return 0

    @property
    def taux_effectif_montures(self):
        if self.taux_remboursement_personnalise is not None:
            return self.taux_remboursement_personnalise
        if self.organisme:
            return self.organisme.taux_remboursement_montures
        return 0


class TiersPayant(models.Model):
    """Prise en charge tiers-payant liée à une vente"""
    STATUT_CHOICES = [
        ('en_attente', '⏳ En attente de soumission'),
        ('soumis', '📤 Soumis à l\'organisme'),
        ('partiellement_rembourse', '💰 Partiellement remboursé'),
        ('rembourse', '✅ Remboursé'),
        ('rejete', '❌ Rejeté'),
        ('litige', '⚠ En litige'),
    ]

    vente = models.OneToOneField(
        'ventes.Vente', on_delete=models.CASCADE,
        related_name='tiers_payant'
    )
    organisme = models.ForeignKey(
        OrganismePayeur, on_delete=models.PROTECT,
        related_name='prises_en_charge'
    )
    carte_chifa = models.ForeignKey(
        CarteChifa, on_delete=models.SET_NULL,
        null=True, blank=True
    )
    statut = models.CharField(max_length=30, choices=STATUT_CHOICES, default='en_attente')

    # Montants calculés
    montant_total_vente = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    montant_pris_en_charge = models.DecimalField(
        max_digits=12, decimal_places=2, default=0,
        verbose_name="Montant pris en charge (DA)"
    )
    ticket_moderateur = models.DecimalField(
        max_digits=12, decimal_places=2, default=0,
        verbose_name="Ticket modérateur (reste à charge patient)"
    )
    montant_rembourse_reel = models.DecimalField(
        max_digits=12, decimal_places=2, default=0,
        verbose_name="Montant réellement remboursé"
    )

    # Suivi administratif
    numero_bon_prise_en_charge = models.CharField(max_length=100, blank=True)
    date_soumission = models.DateField(null=True, blank=True)
    date_remboursement_prevu = models.DateField(null=True, blank=True)
    date_remboursement_reel = models.DateField(null=True, blank=True)
    motif_rejet = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Tiers-Payant"
        verbose_name_plural = "Tiers-Payants"
        ordering = ['-date_creation']

    def __str__(self):
        return f"TP {self.vente.numero} — {self.organisme}"

    @property
    def solde_restant(self):
        """Montant non encore remboursé par l'organisme"""
        return self.montant_pris_en_charge - self.montant_rembourse_reel


class CreanceOrganisme(models.Model):
    """Vue consolidée des créances par organisme (ce que l'organisme doit à l'opticien)"""

    class Meta:
        verbose_name = "Créance organisme"
        managed = False  # Vue virtuelle — calculée via annotations

    def __str__(self):
        return "Créance"
