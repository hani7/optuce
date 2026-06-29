import React from 'react';
import { ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

export default function Mutuelles() {
  return (
    <div className="premium-card" style={{ minHeight: 'calc(100vh - 160px)' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', fontSize: '1.5rem' }}>
        <ShieldCheck size={28} color="#06b6d4" /> Tiers-Payant & Mutuelles
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2.5rem' }}>
        <div style={{ backgroundColor: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '2rem' }}>
          <h3 style={{ marginBottom: '2rem', fontSize: '1.2rem', color: '#0f172a' }}>Paramétrage Carte Chifa</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
               <label style={labelStyle}>Taux de remboursement par défaut (%)</label>
               <input type="number" defaultValue="80" className="premium-input" style={{ fontSize: '1.1rem', fontWeight: 'bold' }} />
            </div>
            <div>
               <label style={labelStyle}>Plafond Monture (DZD)</label>
               <div style={{ position: 'relative' }}>
                 <input type="number" defaultValue="3000" className="premium-input" style={{ fontSize: '1.1rem', fontWeight: 'bold' }} />
                 <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontWeight: 'bold' }}>DZD</span>
               </div>
            </div>
            <button className="btn-primary" style={{ marginTop: '1rem' }}>
              <CheckCircle2 size={20} /> Enregistrer Paramètres
            </button>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
           <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.2rem', color: '#0f172a' }}>
             <FileText size={22} color="#06b6d4" /> Suivi des Créances
           </h3>
           <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid var(--border-color)' }}>
                <th style={thStyle}>Organisme</th>
                <th style={thStyle}>Dossiers en attente</th>
                <th style={thStyle}>Montant Dû</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', backgroundColor: '#e0f2fe', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#0369a1' }}>CN</div>
                    <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>CNAS</strong>
                  </div>
                </td>
                <td style={tdStyle}><span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '0.25rem 0.75rem', borderRadius: '999px', fontWeight: 'bold' }}>14 Dossiers</span></td>
                <td style={tdStyle}><strong style={{ color: '#ef4444', fontSize: '1.1rem' }}>125,000 DZD</strong></td>
                <td style={tdStyle}>
                  <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', backgroundColor: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1' }}>Détails</button>
                </td>
              </tr>
              <tr>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', backgroundColor: '#dcfce7', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#15803d' }}>CA</div>
                    <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>CASNOS</strong>
                  </div>
                </td>
                <td style={tdStyle}><span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '0.25rem 0.75rem', borderRadius: '999px', fontWeight: 'bold' }}>3 Dossiers</span></td>
                <td style={tdStyle}><strong style={{ color: '#ef4444', fontSize: '1.1rem' }}>32,000 DZD</strong></td>
                <td style={tdStyle}>
                  <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', backgroundColor: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1' }}>Détails</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const labelStyle = { display: 'block', fontSize: '0.95rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' };
const thStyle = { padding: '1.25rem', textAlign: 'left' as const, color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' as const, letterSpacing: '0.5px' };
const tdStyle = { padding: '1.25rem', borderBottom: '1px solid var(--border-color)', verticalAlign: 'middle' as const };
