import React, { useState } from 'react';
import { Circle, Plus, Filter, Search, TrendingUp, Package, AlertCircle, X } from 'lucide-react';

export default function Verres() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newVerre, setNewVerre] = useState({ marque: '', modele: '', matiere: 'Organique', prix: '', stock: '' });

  const [verres, setVerres] = useState([
    { id: 'V-001', marque: 'Essilor', modele: 'Crizal Alizé UV', matiere: 'Organique', prix: '8,500 DZD', stock: 45 },
    { id: 'V-002', marque: 'Zeiss', modele: 'DuraVision Platinum', matiere: 'Polycarbonate', prix: '12,000 DZD', stock: 20 },
    { id: 'V-003', marque: 'Hoya', modele: 'Hi-Vision LongLife', matiere: 'Minéral', prix: '6,500 DZD', stock: 150 },
    { id: 'V-004', marque: 'BBGR', modele: 'Neva Max UV', matiere: 'Organique', prix: '7,000 DZD', stock: 0 },
  ]);

  const handleAdd = () => {
    if (!newVerre.marque || !newVerre.modele) return;
    const newItem = {
      id: `V-00${verres.length + 1}`,
      marque: newVerre.marque,
      modele: newVerre.modele,
      matiere: newVerre.matiere,
      prix: newVerre.prix ? `${newVerre.prix} DZD` : '0 DZD',
      stock: parseInt(newVerre.stock || '0', 10)
    };
    setVerres([newItem, ...verres]);
    setShowModal(false);
    setNewVerre({ marque: '', modele: '', matiere: 'Organique', prix: '', stock: '' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Circle color="var(--accent)" size={32} /> Stock : Verres
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Gérez votre stock de verres matrices et verres de prescription.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
          <Plus size={20} /> Ajouter un Verre
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        <div className="premium-card hover-item" style={{ borderLeft: '4px solid #3b82f6', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: '12px' }}>
            <Package size={28} color="#3b82f6" />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>Total Verres en Stock</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>1,245</div>
          </div>
        </div>
        <div className="premium-card hover-item" style={{ borderLeft: '4px solid #ef4444', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: '#fee2e2', padding: '1rem', borderRadius: '12px' }}>
            <AlertCircle size={28} color="#ef4444" />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>Rupture de stock</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>24 <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>références</span></div>
          </div>
        </div>
        <div className="premium-card hover-item" style={{ borderLeft: '4px solid #10b981', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: '#ecfdf5', padding: '1rem', borderRadius: '12px' }}>
            <TrendingUp size={28} color="#10b981" />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>Mouvement (30 jours)</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>+120 <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>sorties</span></div>
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
              placeholder="Rechercher un verre..." 
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
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Modèle / Traitement</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Matière</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Prix Vente</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Stock</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {verres.map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'white'}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{item.id}</td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>{item.marque}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>{item.modele}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, background: '#f1f5f9', color: 'var(--text-secondary)' }}>
                      {item.matiere}
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
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Ajouter un Verre</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={24} color="#64748b" /></button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Marque</label>
                <input type="text" className="premium-input" placeholder="Ex: Essilor" value={newVerre.marque} onChange={e => setNewVerre({...newVerre, marque: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Modèle / Traitement</label>
                <input type="text" className="premium-input" placeholder="Ex: Crizal Alizé UV" value={newVerre.modele} onChange={e => setNewVerre({...newVerre, modele: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Matière</label>
                <select className="premium-input" value={newVerre.matiere} onChange={e => setNewVerre({...newVerre, matiere: e.target.value})}>
                  <option>Organique</option>
                  <option>Minéral</option>
                  <option>Polycarbonate</option>
                  <option>Trivex</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Prix (DZD)</label>
                  <input type="number" className="premium-input" placeholder="Ex: 8500" value={newVerre.prix} onChange={e => setNewVerre({...newVerre, prix: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Stock</label>
                  <input type="number" className="premium-input" placeholder="Ex: 45" value={newVerre.stock} onChange={e => setNewVerre({...newVerre, stock: e.target.value})} />
                </div>
              </div>
            </div>

            <button onClick={handleAdd} className="btn-primary" style={{ width: '100%', padding: '1rem' }}>Ajouter le verre</button>
          </div>
        </div>
      )}
    </div>
  );
}
