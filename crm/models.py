from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User


# ─── Programme de fidélité ───────────────────────────────────────────────────

class ProgrammeFidelite(models.Model):
    """Configuration du programme de fidélité"""
    nom = models.CharField(max_length=100, default='Programme Fidélité Optuce')
    points_par_dinar = models.DecimalField(
        max_digits=5, decimal_places=3, default=0.01,
        verbose_name="Points par dinar dépensé"
    )
    valeur_point_da = models.DecimalField(
        max_digits=5, decimal_places=2, default=1,
        verbose_name="Valeur d'un point (DA)"
    )
    seuil_remise_familiale = models.IntegerField(
        default=3, verbose_name="Nb membres famille pour remise"
    )
    taux_remise_familiale = models.DecimalField(
        max_digits=4, decimal_places=1, default=5,
        verbose_name="Taux remise familiale (%)"
    )
    actif = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Programme de fidélité"

    def __str__(self):
        return self.nom


class CompteFidelite(models.Model):
    """Compte de points fidélité d'un patient"""
    patient = models.OneToOneField(
        'patients.Patient', on_delete=models.CASCADE,
        related_name='compte_fidelite'
    )
    points_cumules = models.IntegerField(default=0)
    points_utilises = models.IntegerField(default=0)
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Compte fidélité"

    def __str__(self):
        return f"Fidélité {self.patient} — {self.points_disponibles} pts"

    @property
    def points_disponibles(self):
        return self.points_cumules - self.points_utilises


class TransactionFidelite(models.Model):
    """Historique des gains/utilisation de points"""
    TYPE_CHOICES = [
        ('gain', '+ Gain suite à achat'),
        ('utilisation', '- Utilisation'),
        ('bonus', '+ Bonus offert'),
        ('expiration', '- Expiration'),
        ('correction', '± Correction manuelle'),
    ]
    compte = models.ForeignKey(CompteFidelite, on_delete=models.CASCADE, related_name='transactions')
    type_transaction = models.CharField(max_length=20, choices=TYPE_CHOICES)
    points = models.IntegerField()  # Peut être négatif
    vente = models.ForeignKey(
        'ventes.Vente', on_delete=models.SET_NULL,
        null=True, blank=True
    )
    description = models.CharField(max_length=200, blank=True)
    date = models.DateTimeField(auto_now_add=True)
    cree_par = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        verbose_name = "Transaction fidélité"
        ordering = ['-date']

    def __str__(self):
        signe = '+' if self.points > 0 else ''
        return f"{signe}{self.points} pts — {self.compte.patient}"


class GroupeFamilial(models.Model):
    """Regroupe les membres d'une même famille pour les remises familiales"""
    nom = models.CharField(max_length=100, verbose_name="Nom de famille / Groupe")
    membres = models.ManyToManyField('patients.Patient', related_name='groupes_familiaux', blank=True)
    taux_remise = models.DecimalField(
        max_digits=4, decimal_places=1, default=0,
        verbose_name="Remise familiale (%)"
    )
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Groupe familial"
        verbose_name_plural = "Groupes familiaux"

    def __str__(self):
        return f"Famille {self.nom}"

    def calculer_remise(self):
        """Calcule automatiquement la remise selon le nb de membres"""
        prog = ProgrammeFidelite.objects.filter(actif=True).first()
        if prog and self.membres.count() >= prog.seuil_remise_familiale:
            self.taux_remise = prog.taux_remise_familiale
            self.save()
        return self.taux_remise


# ─── CRM & Communications ────────────────────────────────────────────────────

class ModeleMessage(models.Model):
    """Modèles de messages SMS / WhatsApp réutilisables"""
    TYPE_CHOICES = [
        ('sms', 'SMS'),
        ('whatsapp', 'WhatsApp'),
        ('email', 'Email'),
    ]
    CATEGORIE_CHOICES = [
        ('rappel_visite', 'Rappel de visite'),
        ('promo', 'Promotion / Offre'),
        ('anniversaire', 'Anniversaire'),
        ('pret_commande', 'Commande prête'),
        ('fidelite', 'Programme fidélité'),
        ('autre', 'Autre'),
    ]

    nom = models.CharField(max_length=100)
    type_canal = models.CharField(max_length=10, choices=TYPE_CHOICES, default='sms')
    categorie = models.CharField(max_length=20, choices=CATEGORIE_CHOICES, default='autre')
    # Variables: {{patient_nom}}, {{date_rappel}}, {{points}}, {{opticien_nom}}
    contenu = models.TextField(verbose_name="Contenu du message (variables: {{patient_nom}}, {{date_rappel}}, {{points}})")
    actif = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Modèle de message"
        verbose_name_plural = "Modèles de messages"

    def __str__(self):
        return f"{self.nom} ({self.get_type_canal_display()})"

    def render(self, context: dict) -> str:
        """Rend le template avec les variables du contexte"""
        contenu = self.contenu
        for key, value in context.items():
            contenu = contenu.replace(f'{{{{{key}}}}}', str(value))
        return contenu


class MessageEnvoye(models.Model):
    """Historique des messages envoyés"""
    STATUT_CHOICES = [
        ('en_attente', 'En attente'),
        ('envoye', 'Envoyé'),
        ('livre', 'Livré'),
        ('echec', 'Échec d\'envoi'),
    ]

    patient = models.ForeignKey(
        'patients.Patient', on_delete=models.CASCADE, related_name='messages_recus'
    )
    modele = models.ForeignKey(
        ModeleMessage, on_delete=models.SET_NULL, null=True, blank=True
    )
    canal = models.CharField(max_length=10)
    numero_destinataire = models.CharField(max_length=20)
    contenu = models.TextField()
    statut = models.CharField(max_length=15, choices=STATUT_CHOICES, default='en_attente')
    date_envoi = models.DateTimeField(null=True, blank=True)
    date_creation = models.DateTimeField(auto_now_add=True)
    reponse_api = models.TextField(blank=True, verbose_name="Réponse API")
    cree_par = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        verbose_name = "Message envoyé"
        verbose_name_plural = "Messages envoyés"
        ordering = ['-date_creation']

    def __str__(self):
        return f"{self.canal} → {self.patient} [{self.statut}]"


class Rappel(models.Model):
    """Rappels automatiques programmés"""
    TYPE_CHOICES = [
        ('controle_vue', '👁 Contrôle de vue (2 ans)'),
        ('renouvellement_lentilles', '🔵 Renouvellement lentilles'),
        ('expiration_chifa', '🏥 Expiration carte Chifa'),
        ('anniversaire', '🎂 Anniversaire'),
        ('personnalise', '📋 Rappel personnalisé'),
    ]
    STATUT_CHOICES = [
        ('programme', 'Programmé'),
        ('envoye', 'Envoyé'),
        ('annule', 'Annulé'),
        ('reporte', 'Reporté'),
    ]

    patient = models.ForeignKey(
        'patients.Patient', on_delete=models.CASCADE, related_name='rappels'
    )
    type_rappel = models.CharField(max_length=30, choices=TYPE_CHOICES)
    statut = models.CharField(max_length=15, choices=STATUT_CHOICES, default='programme')
    date_prevue = models.DateField()
    canal = models.CharField(max_length=10, default='sms',
                             choices=[('sms', 'SMS'), ('whatsapp', 'WhatsApp'), ('email', 'Email')])
    modele = models.ForeignKey(
        ModeleMessage, on_delete=models.SET_NULL, null=True, blank=True
    )
    message_envoye = models.ForeignKey(
        MessageEnvoye, on_delete=models.SET_NULL, null=True, blank=True
    )
    note = models.TextField(blank=True)
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Rappel"
        verbose_name_plural = "Rappels"
        ordering = ['date_prevue']

    def __str__(self):
        return f"{self.get_type_rappel_display()} — {self.patient} le {self.date_prevue}"

    @property
    def est_en_retard(self):
        return self.statut == 'programme' and self.date_prevue < timezone.now().date()
