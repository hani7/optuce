import { useState } from 'react'
import { Search, Plus, Trash2, CreditCard, Banknote, Smartphone, Shield } from 'lucide-react'
import { patientsApi, ventesApi, paiementsApi } from '../api/client'

interface CartLine { id: string; description: string; qty: number; prix: number; remise: number }

export default function POS() {
  const [patient, setPatient] = useState<any>(null)
  const [patientSearch, setPatientSearch] = useState('')
  const [patientResults, setPatientResults] = useState<any[]>([])
  const [cart, setCart] = useState<CartLine[]>([])
  const [desc, setDesc] = useState(''); const [prix, setPrix] = useState(''); const [qty, setQty] = useState('1')
  const [remise, setRemise] = useState(0)
  const [paiements, setPaiements] = useState<{ mode: string; montant: string }[]>([{ mode: 'especes', montant: '' }])
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const searchPatient = async (q: string) => {
    setPatientSearch(q)
    if (q.length < 2) { setPatientResults([]); return }
    const r = await patientsApi.list({ search: q })
    setPatientResults(r.data.results ?? r.data)
  }

  const addLine = () => {
    if (!desc || !prix) return
    setCart(c => [...c, { id: Math.random().toString(), description: desc, qty: Number(qty), prix: Number(prix), remise: 0 }])
    setDesc(''); setPrix(''); setQty('1')
  }

  const totalBrut = cart.reduce((s, l) => s + l.qty * l.prix * (1 - l.remise / 100), 0)
  const totalNet = totalBrut * (1 - remise / 100)
  const totalPaiements = paiements.reduce((s, p) => s + (Number(p.montant) || 0), 0)
  const resteAPayer = totalNet - totalPaiements
  const droitTimbre = paiements.filter(p => p.mode === 'especes').reduce((s, p) => s + (Number(p.montant) || 0) * 0.01, 0)

  const handleVendre = async () => {
    if (cart.length === 0) return
    setSaving(true)
    try {
      const venteRes = await ventesApi.create({
        patient: patient?.id ?? null,
        statut: 'en_cours',
        remise_globale: remise,
      })
      const venteId = venteRes.data.id
      for (const line of cart) {
        await fetch('/api/lignes-vente/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('optuce-auth') ? JSON.parse(localStorage.getItem('optuce-auth')!).state.token : ''}` },
          body: JSON.stringify({ vente: venteId, item_type: 'service', description: line.description, quantite: line.qty, prix_unitaire: line.prix, remise: line.remise })
        })
      }
      for (const p of paiements) {
        if (Number(p.montant) > 0) await paiementsApi.create({ vente: venteId, mode: p.mode, montant: p.montant })
      }
      setSuccess(true)
      setCart([]); setPatient(null); setPaiements([{ mode: 'especes', montant: '' }])
      setTimeout(() => setSuccess(false), 3000)
    } finally { setSaving(false) }
  }

  const MODES = [
    { value: 'especes', label: 'Espèces', icon: Banknote },
    { value: 'cib', label: 'CIB', icon: CreditCard },
    { value: 'dahabia', label: 'Dahabia', icon: Smartphone },
    { value: 'chifa', label: 'CHIFA', icon: Shield },
  ]

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Caisse / Point de vente</div></div>
      </div>
      {success && <div className="alert alert-success">✅ Vente enregistrée avec succès !</div>}

      <div className="pos-layout">
        {/* Left — Items */}
        <div className="pos-items">
          {/* Patient search */}
          <div className="card" style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 600, marginBottom: 10, fontSize: '0.875rem' }}>Client</div>
            {patient ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="avatar" style={{ background: 'rgba(79,142,247,0.15)', color: '#4F8EF7' }}>{patient.nom[0]}</div>
                <div style={{ flex: 1 }}><div style={{ fontWeight: 500 }}>{patient.nom} {patient.prenom}</div><div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{patient.telephone}</div></div>
                <button className="btn btn-danger btn-sm" onClick={() => setPatient(null)}>Retirer</button>
              </div>
            ) : (
              <div style={{ position: 'relative' }}>
                <div className="search-input">
                  <Search size={14} style={{ color: 'var(--text-muted)' }} />
                  <input placeholder="Rechercher un patient (ou vente comptoir)..." value={patientSearch} onChange={e => searchPatient(e.target.value)} />
                </div>
                {patientResults.length > 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--navy-2)', border: '1px solid var(--border)', borderRadius: 8, zIndex: 10, overflow: 'hidden' }}>
                    {patientResults.map(p => (
                      <div key={p.id} onClick={() => { setPatient(p); setPatientResults([]); setPatientSearch('') }}
                        style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid var(--border)', fontSize: '0.875rem' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--glass-hover)')}
                        onMouseLeave={e => (e.currentTarget.style.background = '')}>
                        {p.nom} {p.prenom} — {p.telephone}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Add line */}
          <div className="card" style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 600, marginBottom: 10, fontSize: '0.875rem' }}>Ajouter un article</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="form-control" style={{ flex: 3 }} placeholder="Description..." value={desc} onChange={e => setDesc(e.target.value)} />
              <input type="number" className="form-control" style={{ width: 70 }} placeholder="Qté" value={qty} onChange={e => setQty(e.target.value)} />
              <input type="number" className="form-control" style={{ width: 120 }} placeholder="Prix DA" value={prix} onChange={e => setPrix(e.target.value)} />
              <button className="btn btn-primary" onClick={addLine}><Plus size={15} /></button>
            </div>
          </div>

          {/* Cart items */}
          {cart.length > 0 && (
            <div className="card">
              <div style={{ fontWeight: 600, marginBottom: 10, fontSize: '0.875rem' }}>Articles ({cart.length})</div>
              {cart.map(line => (
                <div key={line.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{line.description}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>x{line.qty} × {line.prix.toLocaleString()} DA</div>
                  </div>
                  <div style={{ fontWeight: 600, color: 'var(--gold)', minWidth: 80, textAlign: 'right' }}>{(line.qty * line.prix).toLocaleString()} DA</div>
                  <button className="btn btn-icon" style={{ color: 'var(--danger)', background: 'none', border: 'none' }} onClick={() => setCart(c => c.filter(l => l.id !== line.id))}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Remise globale %</span>
                <input type="number" className="form-control" style={{ width: 80 }} min={0} max={100} value={remise} onChange={e => setRemise(Number(e.target.value))} />
              </div>
            </div>
          )}
        </div>

        {/* Right — Cart summary */}
        <div className="pos-cart">
          <div className="pos-cart-header">🛒 Récapitulatif</div>
          <div className="pos-cart-items" style={{ padding: '16px' }}>
            <div className="pos-total-row"><span>Sous-total</span><span>{totalBrut.toLocaleString()} DA</span></div>
            {remise > 0 && <div className="pos-total-row" style={{ color: 'var(--success)' }}><span>Remise ({remise}%)</span><span>-{(totalBrut * remise / 100).toLocaleString()} DA</span></div>}

            <div className="divider" />

            {/* Paiements */}
            <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 10 }}>Modes de paiement</div>
            {paiements.map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 8, alignItems: 'center' }}>
                <select className="filter-select" style={{ flex: 1, padding: '6px 10px', fontSize: '0.82rem' }} value={p.mode}
                  onChange={e => setPaiements(ps => ps.map((x, j) => j === i ? { ...x, mode: e.target.value } : x))}>
                  {MODES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
                <input type="number" className="form-control" style={{ width: 100, fontSize: '0.85rem' }} placeholder="Montant" value={p.montant}
                  onChange={e => setPaiements(ps => ps.map((x, j) => j === i ? { ...x, montant: e.target.value } : x))} />
              </div>
            ))}
            <button className="btn btn-secondary btn-sm" style={{ marginBottom: 12 }} onClick={() => setPaiements(ps => [...ps, { mode: 'especes', montant: '' }])}>
              <Plus size={12} /> Ajouter un mode
            </button>

            {droitTimbre > 0 && (
              <div className="pos-total-row" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>Droit de timbre (1%)</span><span>{droitTimbre.toFixed(2)} DA</span>
              </div>
            )}
          </div>

          <div className="pos-cart-footer">
            <div className="pos-grand-total"><span>Total net</span><span>{totalNet.toLocaleString()} DA</span></div>
            {resteAPayer > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginTop: 6, color: 'var(--warning)' }}>
                <span>Reste à payer</span><span>{resteAPayer.toLocaleString()} DA</span>
              </div>
            )}
            <button
              className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 14, padding: '12px' }}
              onClick={handleVendre} disabled={saving || cart.length === 0}
            >
              {saving ? 'Enregistrement...' : '✅ Valider la vente'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
