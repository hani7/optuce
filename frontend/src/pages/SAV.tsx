import { useEffect, useState } from 'react'
import { Plus, Wrench } from 'lucide-react'
import { reparationsApi } from '../api/client'

const STATUT_BADGES: Record<string, string> = { en_attente: 'badge-warning', en_cours: 'badge-info', prete: 'badge-success', livree: 'badge-muted' }

export default function SAV() {
  const [reps, setReps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { reparationsApi.list().then(r => setReps(r.data.results ?? r.data)).finally(() => setLoading(false)) }, [])

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">SAV & Réparations</div><div className="page-subtitle">Vis, rhabillage, soudure...</div></div>
        <button className="btn btn-primary"><Plus size={16} /> Nouvelle réparation</button>
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr><th>N°</th><th>Client</th><th>Type</th><th>Description</th><th>Reçu le</th><th>Coût</th><th>Statut</th></tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={7}><span className="skeleton" style={{ display: 'block', height: 18 }} /></td></tr>}
            {!loading && reps.length === 0 && (
              <tr><td colSpan={7}><div className="empty-state"><div className="empty-state-icon"><Wrench size={36} /></div><p>Aucune réparation</p></div></td></tr>
            )}
            {reps.map((r: any) => (
              <tr key={r.id}>
                <td style={{ fontWeight: 600, color: 'var(--gold)' }}>#{r.id}</td>
                <td>{r.patient ?? <span style={{ color: 'var(--text-muted)' }}>Non renseigné</span>}</td>
                <td><span className="badge badge-muted">{r.type_reparation}</span></td>
                <td style={{ color: 'var(--text-secondary)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.description}</td>
                <td style={{ fontSize: '0.85rem' }}>{new Date(r.date_reception).toLocaleDateString('fr-DZ')}</td>
                <td style={{ fontWeight: 600 }}>{Number(r.cout).toLocaleString()} DA</td>
                <td><span className={`badge ${STATUT_BADGES[r.statut] ?? 'badge-muted'}`}>{r.statut}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
