import { useEffect, useState } from 'react'
import { Truck, AlertTriangle } from 'lucide-react'
import { commandesApi } from '../api/client'

const STATUT_BADGES: Record<string, string> = {
  brouillon: 'badge-muted', envoyee: 'badge-info', en_fabrication: 'badge-warning',
  expediee: 'badge-gold', recue: 'badge-success', retard: 'badge-danger', annulee: 'badge-muted'
}

export default function CommandesVerres() {
  const [commandes, setCommandes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { commandesApi.list().then(r => setCommandes(r.data.results ?? r.data)).finally(() => setLoading(false)) }, [])

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Commandes Verriers</div><div className="page-subtitle">Suivi des commandes en labo</div></div>
      </div>

      {/* En retard alert */}
      {commandes.filter(c => c.est_en_retard).length > 0 && (
        <div className="alert alert-warning">
          <AlertTriangle size={15} />
          {commandes.filter(c => c.est_en_retard).length} commande(s) en retard — Vérifiez avec vos fournisseurs
        </div>
      )}

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr><th>N°</th><th>Fournisseur</th><th>Client</th><th>Date commande</th><th>Livraison prévue</th><th>Statut</th></tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6}><span className="skeleton" style={{ display: 'block', height: 18 }} /></td></tr>}
            {!loading && commandes.length === 0 && (
              <tr><td colSpan={6}><div className="empty-state"><div className="empty-state-icon"><Truck size={36} /></div><p>Aucune commande</p></div></td></tr>
            )}
            {commandes.map((c: any) => (
              <tr key={c.id}>
                <td style={{ fontWeight: 600, color: 'var(--gold)' }}>#{c.id}</td>
                <td>{c.fournisseur_nom}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{c.vente ?? '—'}</td>
                <td style={{ fontSize: '0.85rem' }}>{new Date(c.date_commande).toLocaleDateString('fr-DZ')}</td>
                <td style={{ fontSize: '0.85rem' }}>
                  {c.date_livraison_prevue
                    ? <span style={{ color: c.est_en_retard ? 'var(--danger)' : 'var(--text-secondary)' }}>
                        {c.est_en_retard && <AlertTriangle size={12} style={{ marginRight: 4 }} />}
                        {new Date(c.date_livraison_prevue).toLocaleDateString('fr-DZ')}
                      </span>
                    : '—'}
                </td>
                <td><span className={`badge ${STATUT_BADGES[c.statut] ?? 'badge-muted'}`}>{c.statut}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
