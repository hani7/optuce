import { useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { lentillesApi } from '../api/client'

export default function Lentilles() {
  const [lentilles, setLentilles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { lentillesApi.list().then(r => setLentilles(r.data.results ?? r.data)).finally(() => setLoading(false)) }, [])

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Lentilles de contact</div><div className="page-subtitle">Stock et dates de péremption</div></div>
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr><th>Marque / Modèle</th><th>Type port</th><th>BC / DIA</th><th>Puissance</th><th>Qté</th><th>Péremption</th><th>Prix vente</th></tr>
          </thead>
          <tbody>
            {loading && Array.from({ length: 4 }).map((_, i) => (
              <tr key={i}><td colSpan={7}><span className="skeleton" style={{ display: 'block', height: 18 }} /></td></tr>
            ))}
            {!loading && lentilles.length === 0 && (
              <tr><td colSpan={7}><div className="empty-state"><div className="empty-state-icon">👁️</div><p>Aucune lentille</p></div></td></tr>
            )}
            {lentilles.map((l: any) => (
              <tr key={l.id}>
                <td><div style={{ fontWeight: 500 }}>{l.marque}</div><div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{l.modele}</div></td>
                <td><span className="badge badge-info">{l.type_port}</span></td>
                <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{l.rayon_courbure_bc} / {l.diametre_dia}</td>
                <td style={{ fontSize: '0.85rem' }}>{l.sphere}{l.cylindre ? ` / ${l.cylindre}` : ''}</td>
                <td><span className={`badge ${l.quantite > 5 ? 'badge-success' : 'badge-warning'}`}>{l.quantite}</span></td>
                <td>
                  {l.date_peremption ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      {l.alerte_peremption && <AlertTriangle size={13} style={{ color: 'var(--warning)' }} />}
                      <span className={l.est_perimage ? 'badge badge-danger' : l.alerte_peremption ? 'badge badge-warning' : ''} style={{ fontSize: '0.8rem' }}>
                        {new Date(l.date_peremption).toLocaleDateString('fr-DZ')}
                      </span>
                    </div>
                  ) : '—'}
                </td>
                <td style={{ fontWeight: 600, color: 'var(--gold)' }}>{Number(l.prix_vente).toLocaleString()} DA</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
