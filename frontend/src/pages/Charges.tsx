import React, { useState } from 'react';
import { DollarSign, Plus, Filter, Search, TrendingDown, CreditCard, Building, X } from 'lucide-react';

export default function Charges() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newCharge, setNewCharge] = useState({ categorie: 'Loyer', description: '', montant: '', type: 'Fixe' });

  const [charges, setCharges] = useState([
    { id: 'CHG-101', date: '28 Juin 2026', categorie: 'Loyer', description: 'Loyer local mois de Juillet', montant: '150,000 DZD', statut: 'Payé', type: 'Fixe' },
    { id: 'CHG-102', date: '25 Juin 2026', categorie: 'Électricité', description: 'Facture Sonelgaz', montant: '12,500 DZD', statut: 'Payé', type: 'Variable' },
    { id: 'CHG-103', date: '20 Juin 2026', categorie: 'Fourniture', description: 'Consommables bureau', montant: '8,000 DZD', statut: 'Payé', type: 'Variable' },
    { id: 'CHG-104', date: '15 Juin 2026', categorie: 'Salaire', description: 'Salaires employés Juin', montant: '180,000 DZD', statut: 'En attente', type: 'Fixe' },
  ]);

  const handleAdd = () => {
    if (!newCharge.description || !newCharge.montant) return;
    const newItem = {
      id: `CHG-10${charges.length + 1}`,
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
      categorie: newCharge.categorie,
      description: newCharge.description,
      montant: `${newCharge.montant} DZD`,
      statut: 'Payé',
      type: newCharge.type
    };
    setCharges([newItem, ...charges]);
    setShowModal(false);
    setNewCharge({ categorie: 'Loyer', description: '', montant: '', type: 'Fixe' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <DollarSign color="var(--accent)" size={32} /> Suivi des Charges
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Gérez vos dépenses, loyers, salaires et autres frais opérationnels.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', background: '#ef4444' }}>
          <Plus size={20} /> Enregistrer une Dépense
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        <div className="premium-card hover-item" style={{ borderLeft: '4px solid #ef4444', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: '#fee2e2', padding: '1rem', borderRadius: '12px' }}>
            <TrendingDown size={28} color="#ef4444" />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>Total Charges ce mois</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>350,500 <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>DZD</span></div>
          </div>
        </div>
        <div className="premium-card hover-item" style={{ borderLeft: '4px solid #3b82f6', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: '12px' }}>
            <Building size={28} color="#3b82f6" />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>Charges Fixes (Loyers, etc.)</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>330,000 <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>DZD</span></div>
          </div>
        </div>
        <div className="premium-card hover-item" style={{ borderLeft: '4px solid #8b5cf6', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: '#f3e8ff', padding: '1rem', borderRadius: '12px' }}>
            <CreditCard size={28} color="#8b5cf6" />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>Charges Variables</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>20,500 <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>DZD</span></div>
          </div>
        </div>
      </div>

      {/* Main Content: Table */}
      <div className="premium-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <input 
              type="text" 
              className="premium-input" 
              placeholder="Rechercher une charge..." 
              style={{ paddingLeft: '2.5rem', height: '40px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, color: 'var(--text-secondary)' }}>
              <Filter size={18} /> Ce mois
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, color: 'var(--text-secondary)' }}>
              <Filter size={18} /> Filtrer
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Réf</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Catégorie</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Description</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Montant</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Statut</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {charges.map((charge, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'white'}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{charge.id}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>{charge.date}</td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>{charge.categorie}</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{charge.description}</td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 'bold', color: '#ef4444' }}>{charge.montant}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '20px', 
                      fontSize: '0.8rem', 
                      fontWeight: 600,
                      background: charge.statut === 'Payé' ? '#dcfce7' : '#fee2e2',
                      color: charge.statut === 'Payé' ? '#15803d' : '#b91c1c'
                    }}>
                      {charge.statut}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <button style={{ background: 'transparent', border: 'none', color: '#3b82f6', cursor: 'pointer', fontWeight: 600 }}>Reçu</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="premium-card" style={{ width: '100%', maxWidth: '400px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Nouvelle Dépense</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={24} color="#64748b" /></button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Catégorie</label>
                <select className="premium-input" value={newCharge.categorie} onChange={e => setNewCharge({...newCharge, categorie: e.target.value})}>
                  <option>Loyer</option>
                  <option>Électricité</option>
                  <option>Eau</option>
                  <option>Internet</option>
                  <option>Fourniture</option>
                  <option>Salaire</option>
                  <option>Autre</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Description</label>
                <input type="text" className="premium-input" placeholder="Ex: Achat de papier" value={newCharge.description} onChange={e => setNewCharge({...newCharge, description: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Montant (DZD)</label>
                <input type="number" className="premium-input" placeholder="Ex: 5000" value={newCharge.montant} onChange={e => setNewCharge({...newCharge, montant: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Type</label>
                <select className="premium-input" value={newCharge.type} onChange={e => setNewCharge({...newCharge, type: e.target.value})}>
                  <option>Fixe</option>
                  <option>Variable</option>
                </select>
              </div>
            </div>

            <button onClick={handleAdd} className="btn-primary" style={{ width: '100%', padding: '1rem', background: '#ef4444' }}>Enregistrer</button>
          </div>
        </div>
      )}
    </div>
  );
}
