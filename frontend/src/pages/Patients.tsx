import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Eye, Phone, Calendar } from 'lucide-react'
import { patientsApi } from '../api/client'

interface Patient {
  id: number; nom: string; prenom: string; telephone: string
  date_naissance: string; age: number | null; genre: string
  numero_chifa: string; dernier_examen: string | null
  is_presbyte_risk: boolean
}

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ nom: '', prenom: '', telephone: '', date_naissance: '', genre: '', numero_chifa: '', adresse: '' })
  const [saving, setSaving] = useState(false)

  const load = (q?: string) => {
    setLoading(true)
    patientsApi.list(q ? { search: q } : undefined)
      .then(r => setPatients(r.data.results ?? r.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    clearTimeout((window as any)._st)
    ;(window as any)._st = setTimeout(() => load(e.target.value), 350)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      await patientsApi.create(form)
      setShowModal(false)
      setForm({ nom: '', prenom: '', telephone: '', date_naissance: '', genre: '', numero_chifa: '', adresse: '' })
      load()
    } finally { setSaving(false) }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Patients & CRM</div>
          <div className="page-subtitle">{patients.length} patients enregistrés</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Nouveau patient
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-input">
          <Search size={14} style={{ color: 'var(--text-muted)' }} />
          <input placeholder="Nom, téléphone, N° CHIFA..." value={search} onChange={handleSearch} />
        </div>
        <select className="filter-select">
          <option value="">Tous genres</option>
          <option value="M">Homme</option>
          <option value="F">Femme</option>
        </select>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Patient</th><th>Téléphone</th><th>Âge</th>
              <th>N° CHIFA</th><th>Dernier examen</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && Array.from({ length: 6 }).map((_, i) => (
              <tr key={i}><td colSpan={6}><span className="skeleton" style={{ display: 'block', height: 18, borderRadius: 6 }} /></td></tr>
            ))}
            {!loading && patients.length === 0 && (
              <tr><td colSpan={6}>
                <div className="empty-state">
                  <div className="empty-state-icon">👥</div>
                  <p>Aucun patient trouvé</p>
                </div>
              </td></tr>
            )}
            {patients.map(p => (
              <tr key={p.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="avatar" style={{ background: 'rgba(79,142,247,0.15)', color: '#4F8EF7', fontSize: '0.75rem' }}>
                      {p.nom[0]}{p.prenom[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 500 }}>{p.nom} {p.prenom}</div>
                      {p.is_presbyte_risk && (
                        <span className="badge badge-warning" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>Presbytie</span>
                      )}
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-secondary)' }}>
                    <Phone size={13} />{p.telephone}
                  </div>
                </td>
                <td>{p.age != null ? `${p.age} ans` : '—'}</td>
                <td>
                  {p.numero_chifa
                    ? <span className="badge badge-gold">{p.numero_chifa}</span>
                    : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                </td>
                <td>
                  {p.dernier_examen
                    ? <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                        <Calendar size={13} />{new Date(p.dernier_examen).toLocaleDateString('fr-DZ')}
                      </div>
                    : <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Aucun examen</span>}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Link to={`/patients/${p.id}`} className="btn btn-secondary btn-sm">
                      <Eye size={13} /> Dossier
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New patient modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Nouveau patient</div>
              <button className="btn btn-icon btn-secondary" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Nom *</label>
                    <input className="form-control" value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Prénom *</label>
                    <input className="form-control" value={form.prenom} onChange={e => setForm(f => ({ ...f, prenom: e.target.value }))} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Téléphone *</label>
                    <input className="form-control" value={form.telephone} onChange={e => setForm(f => ({ ...f, telephone: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Genre</label>
                    <select className="form-control" value={form.genre} onChange={e => setForm(f => ({ ...f, genre: e.target.value }))}>
                      <option value="">—</option><option value="M">Masculin</option><option value="F">Féminin</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Date de naissance</label>
                    <input type="date" className="form-control" value={form.date_naissance} onChange={e => setForm(f => ({ ...f, date_naissance: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">N° Carte CHIFA</label>
                    <input className="form-control" value={form.numero_chifa} onChange={e => setForm(f => ({ ...f, numero_chifa: e.target.value }))} placeholder="XXXXXXXXXX" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Adresse</label>
                  <input className="form-control" value={form.adresse} onChange={e => setForm(f => ({ ...f, adresse: e.target.value }))} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Enregistrement...' : 'Créer le patient'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
