import React from 'react';
import { User, Activity, CheckCircle, Smartphone, MapPin } from 'lucide-react';

export default function Medical() {
  return (
    <div style={{ display: 'flex', gap: '2rem' }}>
      {/* Patient Info */}
      <div className="premium-card" style={{ flex: 1 }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', fontSize: '1.4rem' }}>
          <User size={26} color="var(--accent)" /> Fiche Patient
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={labelStyle}>Nom et Prénom</label>
            <input type="text" className="premium-input" placeholder="Ex: Karim Dubois" />
          </div>
          
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}><Smartphone size={14} style={{ display: 'inline', marginRight: '4px' }} /> Téléphone</label>
              <input type="tel" className="premium-input" placeholder="05..." />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Âge</label>
              <input type="number" className="premium-input" placeholder="Ex: 34" />
            </div>
          </div>
          
          <div>
            <label style={labelStyle}><MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} /> Adresse (Optionnel)</label>
            <input type="text" className="premium-input" placeholder="Adresse complète" />
          </div>
          
          <div>
            <label style={labelStyle}>Profession</label>
            <input type="text" className="premium-input" placeholder="Ex: Enseignant" />
          </div>
          
          <button className="btn-primary" style={{ marginTop: '1.5rem', width: '100%' }}>
            <CheckCircle size={20} /> Sauvegarder le Patient
          </button>
        </div>
      </div>

      {/* Refraction */}
      <div className="premium-card" style={{ flex: 2 }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', fontSize: '1.4rem' }}>
          <Activity size={26} color="#f59e0b" /> Mesures de Réfraction & Ordonnance
        </h2>
        
        <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: '#0f172a' }}>Dernière Prescription (Aujourd'hui)</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
              <thead>
                <tr>
                  <th style={thStyle}>Oeil</th>
                  <th style={thStyle}>Sphère</th>
                  <th style={thStyle}>Cylindre</th>
                  <th style={thStyle}>Axe</th>
                  <th style={thStyle}>Prisme</th>
                  <th style={thStyle}>Base</th>
                  <th style={thStyle}>Add</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={tdStyle}><span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '0.25rem 0.75rem', borderRadius: '999px', fontWeight: 'bold' }}>OD Droit</span></td>
                  <td style={tdStyle}><input type="text" className="premium-input" style={smallInput} placeholder="-1.50" /></td>
                  <td style={tdStyle}><input type="text" className="premium-input" style={smallInput} placeholder="+0.50" /></td>
                  <td style={tdStyle}><input type="text" className="premium-input" style={smallInput} placeholder="90" /></td>
                  <td style={tdStyle}><input type="text" className="premium-input" style={smallInput} /></td>
                  <td style={tdStyle}><input type="text" className="premium-input" style={smallInput} /></td>
                  <td style={tdStyle}><input type="text" className="premium-input" style={smallInput} /></td>
                </tr>
                <tr>
                  <td style={tdStyle}><span style={{ backgroundColor: '#fce7f3', color: '#be185d', padding: '0.25rem 0.75rem', borderRadius: '999px', fontWeight: 'bold' }}>OG Gauche</span></td>
                  <td style={tdStyle}><input type="text" className="premium-input" style={smallInput} placeholder="-1.25" /></td>
                  <td style={tdStyle}><input type="text" className="premium-input" style={smallInput} placeholder="+0.25" /></td>
                  <td style={tdStyle}><input type="text" className="premium-input" style={smallInput} placeholder="85" /></td>
                  <td style={tdStyle}><input type="text" className="premium-input" style={smallInput} /></td>
                  <td style={tdStyle}><input type="text" className="premium-input" style={smallInput} /></td>
                  <td style={tdStyle}><input type="text" className="premium-input" style={smallInput} /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '1.5rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 700, color: '#166534', fontSize: '1.1rem' }}>Écarts Pupillaires (Demi-EP)</label>
              <span style={{ fontSize: '0.85rem', color: '#15803d' }}>Nécessaire pour le centrage des verres.</span>
            </div>
            <div style={{ flex: 1, display: 'flex', gap: '1rem' }}>
              <input type="text" className="premium-input" placeholder="OD: 31.5" style={{ backgroundColor: 'white', borderColor: '#bbf7d0', textAlign: 'center', fontSize: '1.1rem', fontWeight: 'bold' }} />
              <input type="text" className="premium-input" placeholder="OG: 32.0" style={{ backgroundColor: 'white', borderColor: '#bbf7d0', textAlign: 'center', fontSize: '1.1rem', fontWeight: 'bold' }} />
            </div>
        </div>
      </div>
    </div>
  )
}

const labelStyle = { display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' };
const smallInput = { width: '80px', padding: '0.5rem', textAlign: 'center' as const, fontSize: '0.95rem' };
const thStyle = { padding: '1rem', textAlign: 'center' as const, color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' as const, letterSpacing: '0.5px' };
const tdStyle = { padding: '1.25rem 0.5rem', textAlign: 'center' as const };
