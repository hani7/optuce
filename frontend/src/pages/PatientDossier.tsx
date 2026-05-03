import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Plus, Eye, FileText, ShoppingCart, Wrench } from 'lucide-react'
import { patientsApi } from '../api/client'

export default function PatientDossier() {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<any>(null)
  const [tab, setTab] = useState('examens')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    patientsApi.dossier(Number(id)).then(r => setData(r.data)).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div style={{ padding: 40, color: 'var(--text-muted)' }}>Chargement...</div>
  if (!data) return <div style={{ padding: 40, color: 'var(--danger)' }}>Patient introuvable</div>

  const { patient, examens, ordonnances } = data

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/patients" className="btn btn-secondary btn-icon">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="page-title">{patient.nom} {patient.prenom}</div>
            <div className="page-subtitle">
              {patient.age ? `${patient.age} ans · ` : ''}
              {patient.telephone}
              {patient.numero_chifa ? ` · CHIFA: ${patient.numero_chifa}` : ''}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to={`/examens/nouveau?patient=${id}`} className="btn btn-primary">
            <Plus size={15} /> Nouvel examen
          </Link>
        </div>
      </div>

      {/* Patient summary card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Genre', value: patient.genre === 'M' ? 'Masculin' : patient.genre === 'F' ? 'Féminin' : '—' },
          { label: 'Date naissance', value: patient.date_naissance ? new Date(patient.date_naissance).toLocaleDateString('fr-DZ') : '—' },
          { label: 'N° CHIFA', value: patient.numero_chifa || '—' },
          { label: 'Risque presbytie', value: patient.is_presbyte_risk ? '⚠️ Oui' : 'Non' },
        ].map(item => (
          <div key={item.label} className="card" style={{ padding: '14px 16px' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>{item.label}</div>
            <div style={{ fontWeight: 600 }}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tabs">
        {[
          { key: 'examens', label: `Examens (${examens.length})`, icon: Eye },
          { key: 'ordonnances', label: `Ordonnances (${ordonnances.length})`, icon: FileText },
          { key: 'ventes', label: 'Ventes', icon: ShoppingCart },
          { key: 'sav', label: 'SAV', icon: Wrench },
        ].map(t => (
          <button key={t.key} className={`tab${tab === t.key ? ' active' : ''}`} onClick={() => setTab(t.key)}>
            <t.icon size={13} style={{ marginRight: 5 }} />{t.label}
          </button>
        ))}
      </div>

      {tab === 'examens' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {examens.length === 0 && <div className="empty-state"><div className="empty-state-icon">🔍</div><p>Aucun examen enregistré</p></div>}
          {examens.map((ex: any) => (
            <div key={ex.id} className="card">
              <div className="card-header">
                <div style={{ fontWeight: 600 }}>Examen du {new Date(ex.date_examen).toLocaleDateString('fr-DZ')}</div>
                {ex.ophtalmologue && <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Dr. {ex.ophtalmologue}</span>}
              </div>
              <div className="exam-grid">
                <div className="exam-eye">
                  <div className="exam-eye-label eye-od"><Eye size={14} /> Œil Droit (OD)</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {[
                      ['Sphère', ex.od_sphere], ['Cylindre', ex.od_cylindre],
                      ['Axe', ex.od_axe ? `${ex.od_axe}°` : null], ['Addition', ex.od_addition],
                      ['Acuité', ex.od_acuite_loin], ['Prisme', ex.od_prisme],
                    ].map(([k, v]) => (
                      <div key={k as string}>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{k}</div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{v ?? '—'}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="exam-eye">
                  <div className="exam-eye-label eye-og"><Eye size={14} /> Œil Gauche (OG)</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {[
                      ['Sphère', ex.og_sphere], ['Cylindre', ex.og_cylindre],
                      ['Axe', ex.og_axe ? `${ex.og_axe}°` : null], ['Addition', ex.og_addition],
                      ['Acuité', ex.og_acuite_loin], ['Prisme', ex.og_prisme],
                    ].map(([k, v]) => (
                      <div key={k as string}>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{k}</div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{v ?? '—'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {(ex.ep_mono_droit || ex.hauteur_montage) && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Mesures de montage</div>
                  <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                    {[
                      ['EP Droit', ex.ep_mono_droit, 'mm'], ['EP Gauche', ex.ep_mono_gauche, 'mm'],
                      ['Hauteur', ex.hauteur_montage, 'mm'], ['Vertex', ex.vertex, 'mm'],
                      ['Panto', ex.angle_pantoscopique, '°'],
                    ].map(([k, v, u]) => v != null && (
                      <div key={k as string}>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{k}</div>
                        <div style={{ fontWeight: 600 }}>{v}{u}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'ordonnances' && (
        <div>
          {ordonnances.length === 0 && <div className="empty-state"><div className="empty-state-icon">📋</div><p>Aucune ordonnance</p></div>}
          {ordonnances.map((o: any) => (
            <div key={o.id} className="card" style={{ marginBottom: 12, padding: '14px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 500 }}>Ordonnance du {new Date(o.date_ordonnance).toLocaleDateString('fr-DZ')}</div>
                  {o.ophtalmologue && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Dr. {o.ophtalmologue}</div>}
                </div>
                <span className={`badge ${o.est_expiree ? 'badge-danger' : 'badge-success'}`}>
                  {o.est_expiree ? 'Expirée' : 'Valide'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {(tab === 'ventes' || tab === 'sav') && (
        <div className="empty-state"><div className="empty-state-icon">🔧</div><p>Données disponibles via l'historique des ventes</p></div>
      )}
    </div>
  )
}
