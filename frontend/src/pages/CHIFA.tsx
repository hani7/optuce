import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { chifaApi } from '../api/client'

const STATUT_BADGES: Record<string, string> = { en_attente: 'badge-warning', soumis: 'badge-info', rembourse: 'badge-success', rejete: 'badge-danger' }

export default function CHIFA() {
  const [pecs, setPecs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { chifaApi.list().then(r => setPecs(r.data.results ?? r.data)).finally(() => setLoading(false)) }, [])

  const handleCalculer = async (id: number) => {
    const res = await chifaApi.calculer(id)
    alert(`Ticket modérateur: ${res.data.ticket_moderateur} DA\nMontant remboursé: ${res.data.montant_rembourse} DA`)
  }

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">CHIFA / Sécurité Sociale</div><div className="page-subtitle">CNAS · CASNOS · Bordereaux</div></div>
        <button className="btn btn-primary"><Plus size={16} /> Nouvelle prise en charge</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'En attente', value: pecs.filter(p => p.statut === 'en_attente').length, cls: 'badge-warning' },
          { label: 'Soumis', value: pecs.filter(p => p.statut === 'soumis').length, cls: 'badge-info' },
          { label: 'Remboursés', value: pecs.filter(p => p.statut === 'rembourse').length, cls: 'badge-success' },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{s.value}</div>
            <span className={`badge ${s.cls}`}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr><th>Patient</th><th>Type</th><th>Taux</th><th>Montant total</th><th>Remboursé</th><th>Ticket modérateur</th><th>Statut</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={8}><span className="skeleton" style={{ display: 'block', height: 18 }} /></td></tr>}
            {!loading && pecs.length === 0 && (
              <tr><td colSpan={8}><div className="empty-state"><div className="empty-state-icon">🏥</div><p>Aucune prise en charge</p></div></td></tr>
            )}
            {pecs.map((p: any) => (
              <tr key={p.id}>
                <td style={{ fontWeight: 500 }}>{p.patient}</td>
                <td><span className="badge badge-gold">{p.type_assurance}</span></td>
                <td>{p.taux_remboursement}%</td>
                <td>{Number(p.montant_total).toLocaleString()} DA</td>
                <td style={{ color: 'var(--success)' }}>{Number(p.montant_rembourse).toLocaleString()} DA</td>
                <td style={{ fontWeight: 600, color: 'var(--warning)' }}>{Number(p.ticket_moderateur).toLocaleString()} DA</td>
                <td><span className={`badge ${STATUT_BADGES[p.statut] ?? 'badge-muted'}`}>{p.statut}</span></td>
                <td>
                  <button className="btn btn-secondary btn-sm" onClick={() => handleCalculer(p.id)}>Calculer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
