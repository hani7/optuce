from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import (
    Sum, Count, Avg, F, Q, ExpressionWrapper,
    DecimalField, FloatField
)
from django.db.models.functions import TruncMonth, TruncDay, TruncWeek, ExtractYear
from django.utils import timezone
from datetime import date, timedelta
from ventes.models import Vente, LigneVente, Encaissement
from stocks.models import Monture, Marque, Verre
from atelier.models import CommandeFournisseur, Fournisseur


class StatistiquesCAView(APIView):
    """Chiffre d'affaires journalier / mensuel — encaissé vs facturé"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        periode = request.query_params.get('periode', 'mois')  # jour|semaine|mois|annee
        annee = int(request.query_params.get('annee', timezone.now().year))
        mois = int(request.query_params.get('mois', timezone.now().month))

        today = date.today()

        # --- CA journalier (30 derniers jours) ---
        debut_30j = today - timedelta(days=29)
        ca_journalier = (
            Vente.objects.filter(statut='finalisee', date__date__gte=debut_30j)
            .annotate(jour=TruncDay('date'))
            .values('jour')
            .annotate(
                ca_facture=Sum('total_ttc'),
                ca_encaisse=Sum('total_paye'),
                nb_ventes=Count('id'),
            )
            .order_by('jour')
        )

        # --- CA mensuel (12 derniers mois) ---
        debut_12m = today.replace(day=1) - timedelta(days=365)
        ca_mensuel = (
            Vente.objects.filter(statut='finalisee', date__date__gte=debut_12m)
            .annotate(mois=TruncMonth('date'))
            .values('mois')
            .annotate(
                ca_facture=Sum('total_ttc'),
                ca_encaisse=Sum('total_paye'),
                nb_ventes=Count('id'),
            )
            .order_by('mois')
        )

        # --- KPIs globaux ---
        debut_mois = today.replace(day=1)
        debut_semaine = today - timedelta(days=today.weekday())

        ventes_finalisees = Vente.objects.filter(statut='finalisee')

        return Response({
            'kpis': {
                'ca_aujourd_hui': _val(ventes_finalisees.filter(date__date=today).aggregate(s=Sum('total_ttc'))['s']),
                'encaisse_aujourd_hui': _val(Encaissement.objects.filter(date__date=today).aggregate(s=Sum('montant'))['s']),
                'ca_semaine': _val(ventes_finalisees.filter(date__date__gte=debut_semaine).aggregate(s=Sum('total_ttc'))['s']),
                'ca_mois': _val(ventes_finalisees.filter(date__date__gte=debut_mois).aggregate(s=Sum('total_ttc'))['s']),
                'encaisse_mois': _val(Encaissement.objects.filter(date__date__gte=debut_mois).aggregate(s=Sum('montant'))['s']),
                'ca_annee': _val(ventes_finalisees.filter(date__year=annee).aggregate(s=Sum('total_ttc'))['s']),
                'nb_ventes_mois': ventes_finalisees.filter(date__date__gte=debut_mois).count(),
                'panier_moyen_mois': _val(ventes_finalisees.filter(date__date__gte=debut_mois).aggregate(avg=Avg('total_ttc'))['avg']),
                'total_creances_clients': _val(
                    ventes_finalisees.filter(total_paye__lt=F('total_ttc'))
                    .aggregate(s=Sum(F('total_ttc') - F('total_paye')))['s']
                ),
            },
            'ca_journalier': list(ca_journalier),
            'ca_mensuel': list(ca_mensuel),
        })


class StatistiquesTopVentesView(APIView):
    """Top des ventes par marque de monture et par fournisseur de verres"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        nb = int(request.query_params.get('top', 10))
        debut = request.query_params.get('debut')
        fin = request.query_params.get('fin')
        today = date.today()

        qs_base = LigneVente.objects.filter(vente__statut='finalisee')
        if debut:
            qs_base = qs_base.filter(vente__date__date__gte=debut)
        if fin:
            qs_base = qs_base.filter(vente__date__date__lte=fin)

        # Top marques montures
        top_montures = (
            qs_base.filter(type_article='monture', monture__isnull=False)
            .values(marque_nom=F('monture__marque__nom'))
            .annotate(
                nb_vendus=Sum('quantite'),
                ca_total=Sum(
                    ExpressionWrapper(
                        F('quantite') * F('prix_unitaire') * (1 - F('remise') / 100),
                        output_field=DecimalField()
                    )
                ),
            )
            .order_by('-ca_total')[:nb]
        )

        # Top modèles montures
        top_modeles = (
            qs_base.filter(type_article='monture', monture__isnull=False)
            .values(
                marque_nom=F('monture__marque__nom'),
                modele=F('monture__modele'),
            )
            .annotate(
                nb_vendus=Sum('quantite'),
                ca_total=Sum(
                    ExpressionWrapper(
                        F('quantite') * F('prix_unitaire') * (1 - F('remise') / 100),
                        output_field=DecimalField()
                    )
                ),
            )
            .order_by('-nb_vendus')[:nb]
        )

        # Top fournisseurs verres
        top_fournisseurs_verres = (
            qs_base.filter(
                type_article__in=['verre_od', 'verre_og'],
                verre__isnull=False,
                verre__fournisseur__isnull=False
            )
            .values(fournisseur_nom=F('verre__fournisseur__nom'))
            .annotate(
                nb_verres=Sum('quantite'),
                ca_total=Sum(
                    ExpressionWrapper(
                        F('quantite') * F('prix_unitaire') * (1 - F('remise') / 100),
                        output_field=DecimalField()
                    )
                ),
            )
            .order_by('-ca_total')[:nb]
        )

        # Top types de verre (indice + traitement)
        top_verres = (
            qs_base.filter(type_article__in=['verre_od', 'verre_og'], verre__isnull=False)
            .values(
                indice=F('verre__indice'),
                traitement=F('verre__traitement'),
            )
            .annotate(nb_vendus=Sum('quantite'))
            .order_by('-nb_vendus')[:nb]
        )

        return Response({
            'top_marques_montures': list(top_montures),
            'top_modeles_montures': list(top_modeles),
            'top_fournisseurs_verres': list(top_fournisseurs_verres),
            'top_verres': list(top_verres),
        })


class StatistiquesMargesView(APIView):
    """Calcul des marges commerciales nettes (PV - PA)"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        debut = request.query_params.get('debut', date.today().replace(day=1).isoformat())
        fin = request.query_params.get('fin', date.today().isoformat())

        qs = LigneVente.objects.filter(
            vente__statut='finalisee',
            vente__date__date__gte=debut,
            vente__date__date__lte=fin,
        )

        # Marges par type d'article
        def marge_type(type_article, prix_achat_field):
            return qs.filter(type_article=type_article).filter(
                **{f'{prix_achat_field}__isnull': False}
            ).aggregate(
                ca=Sum(ExpressionWrapper(
                    F('quantite') * F('prix_unitaire') * (1 - F('remise') / 100),
                    output_field=DecimalField()
                )),
                cout=Sum(ExpressionWrapper(
                    F('quantite') * F(prix_achat_field),
                    output_field=DecimalField()
                )),
            )

        marges_montures = marge_type('monture', 'monture__prix_achat')
        marges_verres_od = marge_type('verre_od', 'verre__prix_achat')
        marges_verres_og = marge_type('verre_og', 'verre__prix_achat')
        marges_lentilles = marge_type('lentille', 'lentille__prix_achat')

        def calc_marge(agg):
            ca = float(agg['ca'] or 0)
            cout = float(agg['cout'] or 0)
            marge = ca - cout
            pct = (marge / ca * 100) if ca > 0 else 0
            return {'ca': round(ca, 2), 'cout': round(cout, 2), 'marge': round(marge, 2), 'taux_marge': round(pct, 1)}

        # Marge globale
        ca_total_q = qs.aggregate(
            ca=Sum(ExpressionWrapper(
                F('quantite') * F('prix_unitaire') * (1 - F('remise') / 100),
                output_field=DecimalField()
            ))
        )
        ca_total = float(ca_total_q['ca'] or 0)

        m_montures = calc_marge(marges_montures)
        m_verres = calc_marge({
            'ca': (marges_verres_od['ca'] or 0) + (marges_verres_og['ca'] or 0),
            'cout': (marges_verres_od['cout'] or 0) + (marges_verres_og['cout'] or 0),
        })
        m_lentilles = calc_marge(marges_lentilles)

        cout_total = m_montures['cout'] + m_verres['cout'] + m_lentilles['cout']
        marge_nette = ca_total - cout_total

        return Response({
            'periode': {'debut': debut, 'fin': fin},
            'ca_total': round(ca_total, 2),
            'cout_total': round(cout_total, 2),
            'marge_nette': round(marge_nette, 2),
            'taux_marge_global': round((marge_nette / ca_total * 100) if ca_total > 0 else 0, 1),
            'detail': {
                'montures': m_montures,
                'verres': m_verres,
                'lentilles': m_lentilles,
            },
            # Par marque de monture
            'marges_par_marque': list(
                qs.filter(type_article='monture', monture__isnull=False)
                .values(marque=F('monture__marque__nom'))
                .annotate(
                    ca=Sum(ExpressionWrapper(F('quantite') * F('prix_unitaire') * (1 - F('remise') / 100), output_field=DecimalField())),
                    cout=Sum(ExpressionWrapper(F('quantite') * F('monture__prix_achat'), output_field=DecimalField())),
                )
                .annotate(marge=ExpressionWrapper(F('ca') - F('cout'), output_field=DecimalField()))
                .order_by('-marge')[:10]
            ),
        })


def _val(v):
    """Retourne 0 si None"""
    return float(v or 0)
