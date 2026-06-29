from django.db import models
from django.utils import timezone
from django.db.models.signals import post_save
from django.dispatch import receiver


class Fournisseur(models.Model):
    """Fournisseur de verres / montures"""
    nom = models.CharField(max_length=200)
    email = models.EmailField(blank=True)
    telephone = models.CharField(max_length=20, blank=True)
    adresse = models.TextField(blank=True)
    contact_nom = models.CharField(max_length=150, blank=True, verbose_name="Nom du contact")
    delai_livraison_jours = models.IntegerField(default=5, verbose_name="Délai livraison (jours)")
    actif = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Fournisseur"
        verbose_name_plural = "Fournisseurs"
        ordering = ['nom']

    def __str__(self):
        return self.nom


class CommandeFournisseur(models.Model):
    """Commande atelier — tableau Kanban de l'atelier"""
    STATUT_CHOICES = [
        ('a_commander', '📋 À préparer'),
        ('commande', '📤 En cours'),
        ('en_montage', '🔧 En cours de montage'),
        ('pret', '✅ Prêt pour livraison'),
        ('livre', '📦 Livré'),
        ('annule', '❌ Annulé'),
    ]
    PRIORITE_CHOICES = [
        ('normale', 'Normale'),
        ('urgente', 'Urgente'),
        ('tres_urgente', 'Très urgente'),
    ]

    # Numéro de commande automatique
    numero = models.CharField(max_length=20, unique=True, blank=True)
    fournisseur = models.ForeignKey(Fournisseur, on_delete=models.SET_NULL, null=True, blank=True, related_name='commandes_atelier')
    patient = models.ForeignKey(
        'patients.Patient', on_delete=models.SET_NULL,
        null=True, blank=True, related_name='commandes_atelier'
    )
    vente = models.ForeignKey(
        'ventes.Vente', on_delete=models.SET_NULL,
        null=True, blank=True, related_name='commandes_atelier'
    )
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='a_commander')
    priorite = models.CharField(max_length=20, choices=PRIORITE_CHOICES, default='normale')

    # Détails verre sur mesure
    description = models.TextField(blank=True, verbose_name="Description / Détails du verre")
    notes_atelier = models.TextField(blank=True)

    # Dates
    date_commande = models.DateField(null=True, blank=True, verbose_name="Date de commande")
    date_livraison_prevue = models.DateField(null=True, blank=True, verbose_name="Date livraison prévue")
    date_livraison_reelle = models.DateField(null=True, blank=True, verbose_name="Date livraison réelle")
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Commande Atelier"
        verbose_name_plural = "Commandes Atelier"
        ordering = ['-date_creation']

    def __str__(self):
        return f"Atelier {self.numero} — {self.patient or 'Sans patient'}"

    def save(self, *args, **kwargs):
        if not self.numero:
            from django.db.models import Max
            annee_mois = timezone.now().strftime('%Y%m')
            dernier = CommandeFournisseur.objects.filter(
                numero__startswith=f'CMD-{annee_mois}-'
            ).aggregate(Max('numero'))['numero__max']
            seq = int(dernier.split('-')[-1]) + 1 if dernier else 1
            self.numero = f'CMD-{annee_mois}-{seq:04d}'
        super().save(*args, **kwargs)

    @property
    def est_en_retard(self):
        if self.date_livraison_prevue and self.statut not in ['pret', 'livre', 'annule']:
            return timezone.now().date() > self.date_livraison_prevue
        return False

    @property
    def jours_retard(self):
        if self.est_en_retard:
            return (timezone.now().date() - self.date_livraison_prevue).days
        return 0


class AchatFournisseur(models.Model):
    """Achat de stock auprès d'un fournisseur"""
    STATUT_CHOICES = [
        ('brouillon', '📝 Brouillon'),
        ('en_attente', '⏳ En attente de réception'),
        ('recu', '✅ Reçu'),
        ('annule', '❌ Annulé'),
    ]

    numero = models.CharField(max_length=20, unique=True, blank=True)
    fournisseur = models.ForeignKey(Fournisseur, on_delete=models.PROTECT, related_name='achats')
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='brouillon')
    
    montant_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    notes = models.TextField(blank=True)
    
    date_commande = models.DateField(default=timezone.now)
    date_reception = models.DateField(null=True, blank=True)
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Achat Fournisseur"
        verbose_name_plural = "Achats Fournisseurs"
        ordering = ['-date_creation']

    def __str__(self):
        return f"Achat {self.numero} — {self.fournisseur}"

    def save(self, *args, **kwargs):
        if not self.numero:
            from django.db.models import Max
            annee_mois = timezone.now().strftime('%Y%m')
            dernier = AchatFournisseur.objects.filter(
                numero__startswith=f'ACH-{annee_mois}-'
            ).aggregate(Max('numero'))['numero__max']
            seq = int(dernier.split('-')[-1]) + 1 if dernier else 1
            self.numero = f'ACH-{annee_mois}-{seq:04d}'
        super().save(*args, **kwargs)



class BonCommande(models.Model):
    """Bon de commande généré (PDF) pour un fournisseur"""
    commande = models.ForeignKey(
        CommandeFournisseur, on_delete=models.CASCADE, related_name='bons'
    )
    numero_bon = models.CharField(max_length=30, unique=True)
    date_emission = models.DateTimeField(auto_now_add=True)
    pdf = models.FileField(upload_to='bons_commande/', null=True, blank=True)
    envoye_par_email = models.BooleanField(default=False)
    date_envoi_email = models.DateTimeField(null=True, blank=True)
    note = models.TextField(blank=True)

    class Meta:
        verbose_name = "Bon de commande"
        verbose_name_plural = "Bons de commande"
        ordering = ['-date_emission']

    def __str__(self):
        return f"BC {self.numero_bon}"
