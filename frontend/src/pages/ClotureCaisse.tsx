import { useEffect, useState } from 'react'
import { clotureCaisseApi } from '../api/client'

export default function ClotureCaisse() {
  const [clotures, setClotures] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { clotureCaisseApi.list().then(r => setClotures(r.data.results ?? r.data)).finally(() => setLoading(false)) }, [])

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Clôture de caisse</div><div className="page-subtitle">Rapport journalier</div></div>
        <button className="btn btn-primary">Clôturer aujourd'hui</button>
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr><th>Date</th><th>Espèces</th><th>CIB</th><th>Dahabia</th><th>CHIFA</th><th>Droit timbre</th><th>Total journée</th><th>Ventes</th></tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={8}><span className="skeleton" style={{ display: 'block', height: 18 }} /></td></tr>}
            {!loading && clotures.length === 0 && (
              <tr><td colSpan={8}><div className="empty-state"><div className="empty-state-icon">💰</div><p>Aucune clôture</p></div></td></tr>
            )}
            {clotures.map((c: any) => (
              <tr key={c.id}>
                <td style={{ fontWeight: 600 }}>{new Date(c.date_cloture).toLocaleDateString('fr-DZ')}</td>
                <td>{Number(c.total_especes).toLocaleString()} DA</td>
                <td>{Number(c.total_cib).toLocaleString()} DA</td>
                <td>{Number(c.total_dahabia).toLocaleString()} DA</td>
                <td>{Number(c.total_chifa).toLocaleString()} DA</td>
                <td style={{ color: 'var(--warning)' }}>{Number(c.total_droit_timbre).toLocaleString()} DA</td>
                <td style={{ fontWeight: 700, color: 'var(--gold)' }}>{Number(c.total_journee).toLocaleString()} DA</td>
                <td><span className="badge badge-info">{c.nombre_ventes} ventes</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
