import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { examensApi, patientsApi } from '../api/client'

const EyeField = ({ label, prefix, form, setForm }: any) => (
  <div className="exam-eye">
    <div className={`exam-eye-label ${prefix === 'od' ? 'eye-od' : 'eye-og'}`}>
      {prefix === 'od' ? '👁 Œil Droit (OD)' : '👁 Œil Gauche (OG)'}
    </div>
    <div className="form-row">
      {['sphere','cylindre','axe','addition','prisme'].map(field => (
        <div className="form-group" key={field} style={{ gridColumn: field === 'prisme' ? 'span 1' : undefined }}>
          <label className="form-label" style={{ textTransform: 'capitalize' }}>{field}</label>
          <input
            type="number" step="0.25" className="form-control"
            value={form[`${prefix}_${field}`] ?? ''}
            onChange={e => setForm((f: any) => ({ ...f, [`${prefix}_${field}`]: e.target.value }))}
            placeholder={field === 'axe' ? '0–180' : ''}
          />
        </div>
      ))}
    </div>
    <div className="form-row" style={{ marginTop: 4 }}>
      <div className="form-group">
        <label className="form-label">Acuité Loin (10è)</label>
        <input type="number" step="1" className="form-control"
          value={form[`${prefix}_acuite_loin`] ?? ''}
          onChange={e => setForm((f: any) => ({ ...f, [`${prefix}_acuite_loin`]: e.target.value }))} />
      </div>
      <div className="form-group">
        <label className="form-label">Acuité Près</label>
        <input type="number" step="1" className="form-control"
          value={form[`${prefix}_acuite_pres`] ?? ''}
          onChange={e => setForm((f: any) => ({ ...f, [`${prefix}_acuite_pres`]: e.target.value }))} />
      </div>
    </div>
  </div>
)

export default function ExamenForm() {
  const [sp] = useSearchParams()
  const navigate = useNavigate()
  const patientId = sp.get('patient')
  const [patient, setPatient] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<any>({
    patient: patientId, date_examen: new Date().toISOString().slice(0, 10)
  })

  useEffect(() => {
    if (patientId) patientsApi.get(Number(patientId)).then(r => setPatient(r.data))
  }, [patientId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      const payload = Object.fromEntries(Object.entries(form).filter(([, v]) => v !== '' && v !== null))
      await examensApi.create(payload)
      navigate(`/patients/${patientId}`)
    } finally { setSaving(false) }
  }

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn btn-secondary btn-icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="page-title">Nouvel examen d'optométrie</div>
            {patient && <div className="page-subtitle">{patient.nom} {patient.prenom}</div>}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-row" style={{ marginBottom: 20 }}>
          <div className="form-group">
            <label className="form-label">Date d'examen</label>
            <input type="date" className="form-control" value={form.date_examen}
              onChange={e => setForm((f: any) => ({ ...f, date_examen: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Examiné par</label>
            <input className="form-control" placeholder="Nom de l'opticien..."
              onChange={e => setForm((f: any) => ({ ...f, examinator: e.target.value }))} />
          </div>
        </div>

        {/* OD / OG */}
        <div className="exam-grid" style={{ marginBottom: 20 }}>
          <EyeField prefix="od" form={form} setForm={setForm} />
          <EyeField prefix="og" form={form} setForm={setForm} />
        </div>

        {/* Mesures de montage */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-title" style={{ marginBottom: 16 }}>📐 Mesures de montage</div>
          <div className="form-row-3">
            {[
              { key: 'ep_mono_droit', label: 'EP Mono Droit (mm)' },
              { key: 'ep_mono_gauche', label: 'EP Mono Gauche (mm)' },
              { key: 'ep_total', label: 'EP Total (mm)' },
              { key: 'hauteur_montage', label: 'Hauteur montage (mm)' },
              { key: 'vertex', label: 'Vertex / dist. verre-œil (mm)' },
              { key: 'angle_pantoscopique', label: 'Angle pantoscopique (°)' },
            ].map(f => (
              <div className="form-group" key={f.key}>
                <label className="form-label">{f.label}</label>
                <input type="number" step="0.1" className="form-control"
                  onChange={e => setForm((fm: any) => ({ ...fm, [f.key]: e.target.value }))} />
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea className="form-control" rows={3}
            onChange={e => setForm((f: any) => ({ ...f, notes: e.target.value }))} />
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Annuler</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            <Save size={15} />{saving ? 'Enregistrement...' : 'Enregistrer l\'examen'}
          </button>
        </div>
      </form>
    </div>
  )
}
