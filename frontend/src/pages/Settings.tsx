import { Settings as SettingsIcon, User, Bell, Shield, Database, Download } from 'lucide-react'
import { ventesApi } from '../api/client'

export default function Settings() {
  const handleG50 = async () => {
    const res = await ventesApi.exportG50()
    const url = URL.createObjectURL(res.data)
    const a = document.createElement('a'); a.href = url; a.download = 'g50_export.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Paramètres</div><div className="page-subtitle">Configuration du logiciel</div></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {[
          { icon: User, title: 'Profil & Utilisateurs', desc: 'Gérer les comptes vendeurs et gérants', badge: null },
          { icon: Bell, title: 'Notifications SMS', desc: 'Configurer les rappels automatiques', badge: null },
          { icon: Shield, title: 'CHIFA — Taux', desc: 'Configurer les taux CNAS/CASNOS', badge: null },
          { icon: Database, title: 'Sauvegarde', desc: 'Backup automatique quotidien', badge: '✅ Actif' },
        ].map(s => (
          <div key={s.title} className="card" style={{ cursor: 'pointer', transition: 'var(--transition)' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-hover)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(212,175,55,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
                <s.icon size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.title}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.desc}</div>
              </div>
              {s.badge && <span className="badge badge-success">{s.badge}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div style={{ fontWeight: 600, marginBottom: 12 }}>🧾 Export comptable</div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
          Exporter les ventes au format G50 pour votre comptable (CSV compatible DGI).
        </p>
        <button className="btn btn-secondary" onClick={handleG50}>
          <Download size={15} /> Exporter G50 (CSV)
        </button>
      </div>
    </div>
  )
}
