import React, { useState } from 'react';
import { User, Activity, CheckCircle, Smartphone, MapPin, Search, Plus, Filter, ArrowLeft, Users } from 'lucide-react';

export default function Medical() {
  const [view, setView] = useState<'table' | 'form'>('table');

  if (view === 'table') {
    return (
      <div className="premium-card" style={{ minHeight: 'calc(100vh - 160px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', color: '#0f172a' }}>
            <Users size={28} color="var(--accent)" /> Base de Données Patients
          </h2>
          <button className="btn-accent" onClick={() => setView('form')}>
            <Plus size={20} /> Ajouter Patient
          </button>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#f8fafc', padding: '0.85rem 1.25rem', borderRadius: '50px', border: '1px solid var(--border-color)', width: '450px', transition: 'all 0.2s', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
            <Search size={20} color="var(--text-secondary)" />
            <input type="text" placeholder="Rechercher un patient (Nom, Prénom, Téléphone)..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.95rem' }} />
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 1.5rem', backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: '50px', cursor: 'pointer', fontWeight: 600, color: 'var(--text-secondary)' }}>
            <Filter size={18} /> Filtres
          </button>
        </div>

        <div style={{ borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid var(--border-color)' }}>
                <th style={thStyle}>Nom & Prénom</th>
                <th style={thStyle}>Téléphone</th>
                <th style={thStyle}>Dernière Visite</th>
                <th style={thStyle}>Prochaine Visite</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="table-row">
                <td style={tdStyle}>
                  <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem' }}>Karim Dubois</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>34 ans - Enseignant</div>
                </td>
                <td style={tdStyle}>
                  <span style={{ fontWeight: 600, color: '#334155' }}>05 55 12 34 56</span>
                </td>
                <td style={tdStyle}>
                  <span style={badgeGray}>12/04/2024</span>
                </td>
                <td style={tdStyle}>
                  <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 700 }}>Aujourd'hui</span>
                </td>
                <td style={tdStyle}>
                   <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', backgroundColor: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1', boxShadow: 'none' }} onClick={() => setView('form')}>Ouvrir Dossier</button>
                </td>
              </tr>
              <tr className="table-row">
                <td style={tdStyle}>
                  <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem' }}>Sarah Martin</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>28 ans - Ingénieure</div>
                </td>
                <td style={tdStyle}>
                  <span style={{ fontWeight: 600, color: '#334155' }}>06 66 98 76 54</span>
                </td>
                <td style={tdStyle}>
                  <span style={badgeGray}>05/01/2023</span>
                </td>
                <td style={tdStyle}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>-</span>
                </td>
                <td style={tdStyle}>
                   <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', backgroundColor: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1', boxShadow: 'none' }} onClick={() => setView('form')}>Ouvrir Dossier</button>
                </td>
              </tr>
              <tr className="table-row">
                <td style={tdStyle}>
                  <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem' }}>Amine B.</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>42 ans - Commerçant</div>
                </td>
                <td style={tdStyle}>
                  <span style={{ fontWeight: 600, color: '#334155' }}>07 77 11 22 33</span>
                </td>
                <td style={tdStyle}>
                  <span style={badgeGray}>18/11/2023</span>
                </td>
                <td style={tdStyle}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>-</span>
                </td>
                <td style={tdStyle}>
                   <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', backgroundColor: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1', boxShadow: 'none' }} onClick={() => setView('form')}>Ouvrir Dossier</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <button 
        onClick={() => setView('table')}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: '#64748b', fontWeight: 600, cursor: 'pointer', width: 'fit-content', padding: '0.5rem 1rem', borderRadius: '50px', transition: 'all 0.2s' }}
        onMouseOver={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
        onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <ArrowLeft size={18} /> Retour à la liste des patients
      </button>

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
    </div>
  )
}

const labelStyle = { display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' };
const smallInput = { width: '80px', padding: '0.5rem', textAlign: 'center' as const, fontSize: '0.95rem' };
const thStyle = { padding: '1.25rem 1.5rem', textAlign: 'left' as const, color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' as const, letterSpacing: '0.5px' };
const tdStyle = { padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', verticalAlign: 'middle' as const };
const badgeGray = { backgroundColor: '#f1f5f9', color: '#475569', padding: '0.35rem 0.75rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600 };
