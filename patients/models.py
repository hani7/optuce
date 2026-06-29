from django.db import models
from django.utils import timezone


class Patient(models.Model):
    """Fiche patient complète"""
    SEXE_CHOICES = [('M', 'Masculin'), ('F', 'Féminin')]

    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    telephone = models.CharField(max_length=20, blank=True)
    telephone2 = models.CharField(max_length=20, blank=True, verbose_name="Téléphone 2")
    date_naissance = models.DateField(null=True, blank=True)
    sexe = models.CharField(max_length=1, choices=SEXE_CHOICES, blank=True)
    profession = models.CharField(max_length=100, blank=True)
    adresse = models.TextField(blank=True)
    email = models.EmailField(blank=True)
    notes = models.TextField(blank=True, verbose_name="Notes internes")
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Patient"
        verbose_name_plural = "Patients"
        ordering = ['-date_creation']

    def __str__(self):
        return f"{self.prenom} {self.nom}"

    @property
    def age(self):
        if self.date_naissance:
            today = timezone.now().date()
            return today.year - self.date_naissance.year - (
                (today.month, today.day) < (self.date_naissance.month, self.date_naissance.day)
            )
        return None

    @property
    def nom_complet(self):
        return f"{self.prenom} {self.nom}"


class Ordonnance(models.Model):
    """Ordonnance médicale liée à un patient"""
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='ordonnances')
    date = models.DateField(default=timezone.now)
    medecin = models.CharField(max_length=150, verbose_name="Médecin prescripteur")
    specialite = models.CharField(max_length=100, blank=True, verbose_name="Spécialité")
    notes = models.TextField(blank=True)
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Ordonnance"
        verbose_name_plural = "Ordonnances"
        ordering = ['-date']

    def __str__(self):
        return f"Ord. {self.patient.nom_complet} — {self.date}"


class Correction(models.Model):
    """Mesures de correction optique associées à une ordonnance"""
    ordonnance = models.OneToOneField(
        Ordonnance, on_delete=models.CASCADE, related_name='correction'
    )

    # Vision de Loin — Œil Droit
    vl_od_sphere = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, verbose_name="VL OD Sphère")
    vl_od_cylindre = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, verbose_name="VL OD Cylindre")
    vl_od_axe = models.IntegerField(null=True, blank=True, verbose_name="VL OD Axe (°)")
    vl_od_prisme = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, verbose_name="VL OD Prisme")
    vl_od_base = models.CharField(max_length=10, blank=True, verbose_name="VL OD Base")

    # Vision de Loin — Œil Gauche
    vl_og_sphere = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, verbose_name="VL OG Sphère")
    vl_og_cylindre = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, verbose_name="VL OG Cylindre")
    vl_og_axe = models.IntegerField(null=True, blank=True, verbose_name="VL OG Axe (°)")
    vl_og_prisme = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, verbose_name="VL OG Prisme")
    vl_og_base = models.CharField(max_length=10, blank=True, verbose_name="VL OG Base")

    # Vision de Près — Œil Droit
    vp_od_sphere = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, verbose_name="VP OD Sphère")
    vp_od_cylindre = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, verbose_name="VP OD Cylindre")
    vp_od_axe = models.IntegerField(null=True, blank=True, verbose_name="VP OD Axe (°)")

    # Vision de Près — Œil Gauche
    vp_og_sphere = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, verbose_name="VP OG Sphère")
    vp_og_cylindre = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, verbose_name="VP OG Cylindre")
    vp_og_axe = models.IntegerField(null=True, blank=True, verbose_name="VP OG Axe (°)")

    # Addition & Écarts Pupillaires
    addition = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True, verbose_name="Addition")
    ep_vl = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True, verbose_name="EP VL (mm)")
    demi_ep_vl_od = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True, verbose_name="½EP VL OD (mm)")
    demi_ep_vl_og = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True, verbose_name="½EP VL OG (mm)")
    ep_vp = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True, verbose_name="EP VP (mm)")
    demi_ep_vp_od = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True, verbose_name="½EP VP OD (mm)")
    demi_ep_vp_og = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True, verbose_name="½EP VP OG (mm)")

    class Meta:
        verbose_name = "Correction"
        verbose_name_plural = "Corrections"

    def __str__(self):
        return f"Correction — {self.ordonnance}"
