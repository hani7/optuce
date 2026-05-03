import { useEffect, useState } from 'react'
import { Plus, Search, AlertTriangle, Barcode } from 'lucide-react'
import { monturesApi, marqueApi } from '../api/client'

export default function Montures() {
  const [montures, setMontures] = useState<any[]>([])
  const [marques, setMarques] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<any>({ genre: 'U', matiere: 'metal', quantite: 1, seuil_alerte: 2 })
  const [saving, setSaving] = useState(false)

  const load = (q?: string, g?: string) => {
    setLoading(true)
    monturesApi.list({ search: q || undefined, genre: g || undefined })
      .then(r => setMontures(r.data.results ?? r.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    marqueApi.list().then(r => setMarques(r.data.results ?? r.data))
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try { await monturesApi.create(form); setShowModal(false); load() }
    finally { setSaving(false) }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Montures</div>
          <div className="page-subtitle">{montures.length} références en stock</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary btn-sm">Alertes stock</button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Nouvelle monture
          </button>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-input">
          <Search size={14} style={{ color: 'var(--text-muted)' }} />
          <input placeholder="Marque, modèle, ref, code-barres..." value={search}
            onChange={e => { setSearch(e.target.value); load(e.target.value, genre) }} />
        </div>
        <select className="filter-select" value={genre} onChange={e => { setGenre(e.target.value); load(search, e.target.value) }}>
          <option value="">Tous genres</option>
          <option value="H">Homme</option><option value="F">Femme</option>
          <option value="E">Enfant</option><option value="U">Unisexe</option>
        </select>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr><th>Monture</th><th>Genre / Matière</th><th>Taille</th><th>Stock</th><th>Prix achat</th><th>Prix vente</th><th>Étiquette</th></tr>
          </thead>
          <tbody>
            {loading && Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}><td colSpan={7}><span className="skeleton" style={{ display: 'block', height: 18 }} /></td></tr>
            ))}
            {!loading && montures.length === 0 && (
              <tr><td colSpan={7}><div className="empty-state"><div className="empty-state-icon">🕶️</div><p>Aucune monture</p></div></td></tr>
            )}
            {montures.map((m: any) => (
              <tr key={m.id}>
                <td>
                  <div style={{ fontWeight: 500 }}>{m.marque_nom} {m.modele}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.reference} · {m.couleur}</div>
                </td>
                <td>
                  <span className="badge badge-muted">{m.genre}</span>{' '}
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{m.matiere}</span>
                </td>
                <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {m.calibre && m.pont ? `${m.calibre}-${m.pont}-${m.branche}` : '—'}
                </td>
                <td>
                  <span className={`badge ${m.stock_faible ? 'badge-danger' : m.quantite > 5 ? 'badge-success' : 'badge-warning'}`}>
                    {m.stock_faible && <AlertTriangle size={10} style={{ marginRight: 3 }} />}
                    {m.quantite} unités
                  </span>
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{Number(m.prix_achat).toLocaleString()} DA</td>
                <td style={{ fontWeight: 600, color: 'var(--gold)' }}>{Number(m.prix_vente).toLocaleString()} DA</td>
                <td>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    {m.label_etiquette}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Nouvelle monture</div>
              <button className="btn btn-icon btn-secondary" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Marque *</label>
                    <select className="form-control" required value={form.marque ?? ''} onChange={e => setForm((f: any) => ({ ...f, marque: e.target.value }))}>
                      <option value="">— Choisir —</option>
                      {marques.map((m: any) => <option key={m.id} value={m.id}>{m.nom}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Modèle *</label>
                    <input className="form-control" required onChange={e => setForm((f: any) => ({ ...f, modele: e.target.value }))} />
                  </div>
                </div>
                <div className="form-row-3">
                  <div className="form-group">
                    <label className="form-label">Référence</label>
                    <input className="form-control" onChange={e => setForm((f: any) => ({ ...f, reference: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Couleur</label>
                    <input className="form-control" onChange={e => setForm((f: any) => ({ ...f, couleur: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Code couleur</label>
                    <input className="form-control" placeholder="ex: C01" onChange={e => setForm((f: any) => ({ ...f, code_couleur: e.target.value }))} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Genre</label>
                    <select className="form-control" value={form.genre} onChange={e => setForm((f: any) => ({ ...f, genre: e.target.value }))}>
                      <option value="H">Homme</option><option value="F">Femme</option>
                      <option value="E">Enfant</option><option value="U">Unisexe</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Matière</label>
                    <select className="form-control" value={form.matiere} onChange={e => setForm((f: any) => ({ ...f, matiere: e.target.value }))}>
                      <option value="acetate">Acétate</option><option value="metal">Métal</option>
                      <option value="titane">Titane</option><option value="tr90">TR-90</option>
                    </select>
                  </div>
                </div>
                <div className="form-row-3">
                  <div className="form-group">
                    <label className="form-label">Calibre (mm)</label>
                    <input type="number" className="form-control" onChange={e => setForm((f: any) => ({ ...f, calibre: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pont (mm)</label>
                    <input type="number" className="form-control" onChange={e => setForm((f: any) => ({ ...f, pont: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Branche (mm)</label>
                    <input type="number" className="form-control" onChange={e => setForm((f: any) => ({ ...f, branche: e.target.value }))} />
                  </div>
                </div>
                <div className="form-row-3">
                  <div className="form-group">
                    <label className="form-label">Quantité</label>
                    <input type="number" className="form-control" value={form.quantite} onChange={e => setForm((f: any) => ({ ...f, quantite: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Prix achat (DA) *</label>
                    <input type="number" className="form-control" required onChange={e => setForm((f: any) => ({ ...f, prix_achat: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Prix vente (DA) *</label>
                    <input type="number" className="form-control" required onChange={e => setForm((f: any) => ({ ...f, prix_vente: e.target.value }))} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Enregistrement...' : 'Ajouter la monture'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
