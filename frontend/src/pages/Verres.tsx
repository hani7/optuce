import { useState } from 'react'
import { Search } from 'lucide-react'
import { verresApi } from '../api/client'

export default function Verres() {
  const [verres, setVerres] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  useState(() => { verresApi.list().then(r => setVerres(r.data.results ?? r.data)).finally(() => setLoading(false)) })

  const types: Record<string, string> = { unifocal: 'badge-info', bifocal: 'badge-warning', progressif: 'badge-gold', degressif: 'badge-muted' }

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Base de données Verres</div><div className="page-subtitle">Unifocaux, Bifocaux, Progressifs</div></div>
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr><th>Type</th><th>Matière / Indice</th><th>Traitements</th><th>Gamme Sphère</th><th>Gamme Cyl</th><th>Prix paire</th></tr>
          </thead>
          <tbody>
            {loading && Array.from({ length: 4 }).map((_, i) => (
              <tr key={i}><td colSpan={6}><span className="skeleton" style={{ display: 'block', height: 18 }} /></td></tr>
            ))}
            {!loading && verres.length === 0 && (
              <tr><td colSpan={6}><div className="empty-state"><div className="empty-state-icon">🔬</div><p>Aucun verre configuré</p></div></td></tr>
            )}
            {verres.map((v: any) => (
              <tr key={v.id}>
                <td><span className={`badge ${types[v.type_verre_detail?.code] ?? 'badge-muted'}`}>{v.type_verre_detail?.nom ?? v.type_verre}</span></td>
                <td><span style={{ fontWeight: 500 }}>{v.matiere_detail?.nom}</span> <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>({v.matiere_detail?.indice})</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {v.traitements_detail?.map((t: any) => <span key={t.id} className="badge badge-muted" style={{ fontSize: '0.65rem' }}>{t.nom}</span>)}
                  </div>
                </td>
                <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{v.sph_min} / {v.sph_max}</td>
                <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{v.cyl_min} / {v.cyl_max}</td>
                <td style={{ fontWeight: 600, color: 'var(--gold)' }}>{Number(v.prix_paire).toLocaleString()} DA</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
