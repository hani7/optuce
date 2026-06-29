import React, { useState } from 'react';
import { Package, Plus, Filter, Search, TrendingUp, AlertCircle, Eye, X } from 'lucide-react';

export default function Lentilles() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newLentille, setNewLentille] = useState({ marque: '', modele: '', type: 'Journalière', prix: '', stock: '' });

  const [lentilles, setLentilles] = useState([
    { id: 'L-001', marque: 'Bausch & Lomb', modele: 'Biotrue ONEday', type: 'Journalière', prix: '4,500 DZD', stock: 80 },
    { id: 'L-002', marque: 'Alcon', modele: 'Air Optix plus HydraGlyde', type: 'Mensuelle', prix: '6,200 DZD', stock: 45 },
    { id: 'L-003', marque: 'CooperVision', modele: 'Biofinity', type: 'Mensuelle', prix: '5,800 DZD', stock: 12 },
    { id: 'L-004', marque: 'Johnson & Johnson', modele: 'Acuvue Oasys', type: 'Bimensuelle', prix: '7,100 DZD', stock: 0 },
  ]);

  const handleAdd = () => {
    if (!newLentille.marque || !newLentille.modele) return;
    const newItem = {
      id: `L-00${lentilles.length + 1}`,
      marque: newLentille.marque,
      modele: newLentille.modele,
      type: newLentille.type,
      prix: newLentille.prix ? `${newLentille.prix} DZD` : '0 DZD',
      stock: parseInt(newLentille.stock || '0', 10)
    };
    setLentilles([newItem, ...lentilles]);
    setShowModal(false);
    setNewLentille({ marque: '', modele: '', type: 'Journalière', prix: '', stock: '' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Package color="var(--accent)" size={32} /> Stock : Lentilles & Produits
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Gérez votre stock de lentilles de contact et produits d'entretien.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
          <Plus size={20} /> Ajouter un Article
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        <div className="premium-card hover-item" style={{ borderLeft: '4px solid #3b82f6', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: '12px' }}>
            <Eye size={28} color="#3b82f6" />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>Total Lentilles en Stock</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>840 <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>boîtes</span></div>
          </div>
        </div>
        <div className="premium-card hover-item" style={{ borderLeft: '4px solid #ef4444', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: '#fee2e2', padding: '1rem', borderRadius: '12px' }}>
            <AlertCircle size={28} color="#ef4444" />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>Stock Critique</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>5 <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>références</span></div>
          </div>
        </div>
        <div className="premium-card hover-item" style={{ borderLeft: '4px solid #10b981', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: '#ecfdf5', padding: '1rem', borderRadius: '12px' }}>
            <TrendingUp size={28} color="#10b981" />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>Ventes ce mois</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>+65 <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>boîtes</span></div>
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
              placeholder="Rechercher une lentille..." 
              style={{ paddingLeft: '2.5rem', height: '40px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, color: 'var(--text-secondary)' }}>
            <Filter size={18} /> Filtrer
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Réf</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Marque</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Modèle</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Type</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Prix Vente</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Stock</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {lentilles.map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'white'}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{item.id}</td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>{item.marque}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>{item.modele}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, background: '#f1f5f9', color: 'var(--text-secondary)' }}>
                      {item.type}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 'bold' }}>{item.prix}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '20px', 
                      fontSize: '0.8rem', 
                      fontWeight: 600,
                      background: item.stock > 0 ? '#dcfce7' : '#fee2e2',
                      color: item.stock > 0 ? '#15803d' : '#b91c1c'
                    }}>
                      {item.stock > 0 ? item.stock : 'Rupture'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <button style={{ background: 'transparent', border: 'none', color: '#3b82f6', cursor: 'pointer', fontWeight: 600 }}>Détails</button>
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
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Ajouter une Lentille / Produit</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={24} color="#64748b" /></button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Marque</label>
                <input type="text" className="premium-input" placeholder="Ex: Alcon" value={newLentille.marque} onChange={e => setNewLentille({...newLentille, marque: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Modèle</label>
                <input type="text" className="premium-input" placeholder="Ex: Air Optix" value={newLentille.modele} onChange={e => setNewLentille({...newLentille, modele: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Type</label>
                <select className="premium-input" value={newLentille.type} onChange={e => setNewLentille({...newLentille, type: e.target.value})}>
                  <option>Journalière</option>
                  <option>Bimensuelle</option>
                  <option>Mensuelle</option>
                  <option>Annuelle</option>
                  <option>Produit d'entretien</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Prix (DZD)</label>
                  <input type="number" className="premium-input" placeholder="Ex: 6000" value={newLentille.prix} onChange={e => setNewLentille({...newLentille, prix: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Stock</label>
                  <input type="number" className="premium-input" placeholder="Ex: 25" value={newLentille.stock} onChange={e => setNewLentille({...newLentille, stock: e.target.value})} />
                </div>
              </div>
            </div>

            <button onClick={handleAdd} className="btn-primary" style={{ width: '100%', padding: '1rem' }}>Ajouter l'article</button>
          </div>
        </div>
      )}
    </div>
  );
}
