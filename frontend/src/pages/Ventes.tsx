import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, ShoppingCart } from 'lucide-react'
import { ventesApi } from '../api/client'

const STATUT_BADGES: Record<string, string> = {
  en_cours: 'badge-warning', attente_labo: 'badge-info',
  prete: 'badge-success', livree: 'badge-success', annulee: 'badge-muted'
}
const STATUT_LABELS: Record<string, string> = {
  en_cours: 'En cours', attente_labo: 'Attente labo',
  prete: 'Prête', livree: 'Livrée', annulee: 'Annulée'
}

export default function Ventes() {
  const [ventes, setVentes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { ventesApi.list().then(r => setVentes(r.data.results ?? r.data)).finally(() => setLoading(false)) }, [])

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Historique des ventes</div><div className="page-subtitle">{ventes.length} ventes chargées</div></div>
        <Link to="/ventes/nouvelle" className="btn btn-primary"><Plus size={16} /> Nouvelle vente</Link>
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr><th>N° Vente</th><th>Client</th><th>Date</th><th>Statut</th><th>Total</th><th>Payé</th><th>Reste</th></tr>
          </thead>
          <tbody>
            {loading && Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}><td colSpan={7}><span className="skeleton" style={{ display: 'block', height: 18 }} /></td></tr>
            ))}
            {!loading && ventes.length === 0 && (
              <tr><td colSpan={7}><div className="empty-state"><div className="empty-state-icon"><ShoppingCart size={40} /></div><p>Aucune vente enregistrée</p></div></td></tr>
            )}
            {ventes.map((v: any) => (
              <tr key={v.id}>
                <td style={{ fontWeight: 600, color: 'var(--gold)' }}>#{v.id}</td>
                <td>{v.patient_nom || <span style={{ color: 'var(--text-muted)' }}>Comptoir</span>}</td>
                <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{new Date(v.date_vente).toLocaleDateString('fr-DZ')}</td>
                <td><span className={`badge ${STATUT_BADGES[v.statut] ?? 'badge-muted'}`}>{STATUT_LABELS[v.statut] ?? v.statut}</span></td>
                <td style={{ fontWeight: 600 }}>{Number(v.total_net).toLocaleString()} DA</td>
                <td style={{ color: 'var(--success)' }}>{Number(v.total_paye).toLocaleString()} DA</td>
                <td>
                  {Number(v.reste_a_payer) > 0
                    ? <span className="badge badge-danger">{Number(v.reste_a_payer).toLocaleString()} DA</span>
                    : <span className="badge badge-success">Soldé</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
