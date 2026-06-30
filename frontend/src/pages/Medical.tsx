import React, { useState, useEffect } from 'react';
import { User, Activity, CheckCircle, Smartphone, MapPin, Search, Plus, Filter, ArrowLeft, Users, Edit2, Trash2 } from 'lucide-react';

export default function Medical() {
  const [view, setView] = useState<'table' | 'form'>('table');
  const [patients, setPatients] = useState<any[]>([]);
  
  // Form State
  const [nomPrenom, setNomPrenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [age, setAge] = useState('');
  const [adresse, setAdresse] = useState('');
  const [profession, setProfession] = useState('');

  const fetchPatients = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/patients/`);
      if (res.ok) {
        const data = await res.json();
        const results = Array.isArray(data) ? data : (data.results || []);
        setPatients(results);
      } else {
        setPatients([]);
      }
    } catch (error) {
      console.error("Erreur de chargement", error);
      setPatients([]);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSavePatient = async () => {
    try {
      const parts = nomPrenom.trim().split(' ');
      const nom = parts.length > 1 ? parts.pop() : nomPrenom;
      const prenom = parts.length > 0 ? parts.join(' ') : 'Inconnu';
      
      let payload = {
        nom: nom || 'Inconnu',
        prenom: prenom,
        telephone,
        profession,
        adresse
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/patients/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setNomPrenom('');
        setTelephone('');
        setAge('');
        setAdresse('');
        setProfession('');
        fetchPatients();
        setView('table');
      }
    } catch (error) {
      console.error("Erreur de sauvegarde", error);
    }
  };

  if (view === 'table') {
    return (
      <div className="premium-card" style={{ minHeight: 'calc(100vh - 160px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', color: '#0f172a' }}>
            <Users size={28} color="var(--accent)" /> Base de Données Patients
          </h2>
          <button className="btn-accent" onClick={() => {
            setNomPrenom('');
            setTelephone('');
            setAge('');
            setAdresse('');
            setProfession('');
            setView('form');
          }}>
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
              {patients.length > 0 ? patients.map(p => (
                <tr className="table-row" key={p.id}>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem' }}>{p.prenom} {p.nom}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{p.profession || 'Sans profession'}</div>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ fontWeight: 600, color: '#334155' }}>{p.telephone || '-'}</span>
                  </td>
                  <td style={tdStyle}>
                    <span style={badgeGray}>{p.date_creation ? new Date(p.date_creation).toLocaleDateString('fr-FR') : 'Non renseignée'}</span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>-</span>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', backgroundColor: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1', boxShadow: 'none' }} onClick={() => {
                        setNomPrenom((p.prenom + ' ' + p.nom).trim());
                        setTelephone(p.telephone || '');
                        setAdresse(p.adresse || '');
                        setProfession(p.profession || '');
                        setView('form');
                      }}>Ouvrir Dossier</button>
                      <button onClick={() => {
                        setNomPrenom((p.prenom + ' ' + p.nom).trim());
                        setTelephone(p.telephone || '');
                        setAdresse(p.adresse || '');
                        setProfession(p.profession || '');
                        setView('form');
                      }} title="Modifier" style={{ background: '#f1f5f9', border: 'none', color: '#475569', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex' }}><Edit2 size={16} /></button>
                      <button onClick={() => { if (window.confirm('Êtes-vous sûr de vouloir supprimer ce patient ?')) setPatients(patients.filter(pat => pat.id !== p.id)); }} title="Supprimer" style={{ background: '#fef2f2', border: 'none', color: '#ef4444', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex' }}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Aucun patient trouvé.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <button 
        onClick={() => {
          setNomPrenom('');
          setTelephone('');
          setAge('');
          setAdresse('');
          setProfession('');
          setView('table');
        }}
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
              <input type="text" className="premium-input" placeholder="Ex: Karim Dubois" value={nomPrenom} onChange={e => setNomPrenom(e.target.value)} />
            </div>
            
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}><Smartphone size={14} style={{ display: 'inline', marginRight: '4px' }} /> Téléphone</label>
                <input type="tel" className="premium-input" placeholder="05..." value={telephone} onChange={e => setTelephone(e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Âge</label>
                <input type="number" className="premium-input" placeholder="Ex: 34" value={age} onChange={e => setAge(e.target.value)} />
              </div>
            </div>
            
            <div>
              <label style={labelStyle}><MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} /> Adresse (Optionnel)</label>
              <input type="text" className="premium-input" placeholder="Adresse complète" value={adresse} onChange={e => setAdresse(e.target.value)} />
            </div>
            
            <div>
              <label style={labelStyle}>Profession</label>
              <input type="text" className="premium-input" placeholder="Ex: Enseignant" value={profession} onChange={e => setProfession(e.target.value)} />
            </div>
            
            <button className="btn-primary" style={{ marginTop: '1.5rem', width: '100%' }} onClick={handleSavePatient}>
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
