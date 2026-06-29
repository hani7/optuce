import React, { useState } from 'react';
import { Glasses, Plus, Filter, Search, TrendingUp, Package, AlertCircle, X } from 'lucide-react';

export default function Montures() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newMonture, setNewMonture] = useState({ marque: '', modele: '', categorie: 'Optique', prix: '', stock: '' });

  const [montures, setMontures] = useState([
    { id: 'M-001', marque: 'Ray-Ban', modele: 'Aviator Classic', categorie: 'Solaire', prix: '18,500 DZD', stock: 12 },
    { id: 'M-002', marque: 'Oakley', modele: 'Holbrook', categorie: 'Sport', prix: '22,000 DZD', stock: 5 },
    { id: 'M-003', marque: 'Gucci', modele: 'GG0006O', categorie: 'Optique', prix: '45,000 DZD', stock: 2 },
    { id: 'M-004', marque: 'Vogue', modele: 'VO5230', categorie: 'Optique', prix: '14,000 DZD', stock: 0 },
  ]);

  const handleAdd = () => {
    if (!newMonture.marque || !newMonture.modele) return;
    const newItem = {
      id: `M-00${montures.length + 1}`,
      marque: newMonture.marque,
      modele: newMonture.modele,
      categorie: newMonture.categorie,
      prix: newMonture.prix ? `${newMonture.prix} DZD` : '0 DZD',
      stock: parseInt(newMonture.stock || '0', 10)
    };
    setMontures([newItem, ...montures]);
    setShowModal(false);
    setNewMonture({ marque: '', modele: '', categorie: 'Optique', prix: '', stock: '' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Glasses color="var(--accent)" size={32} /> Stock : Montures
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Gérez votre catalogue de montures optiques et solaires.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
          <Plus size={20} /> Ajouter une Monture
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        <div className="premium-card hover-item" style={{ borderLeft: '4px solid #3b82f6', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: '12px' }}>
            <Package size={28} color="#3b82f6" />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>Total Montures en Stock</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>342</div>
          </div>
        </div>
        <div className="premium-card hover-item" style={{ borderLeft: '4px solid #ef4444', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: '#fee2e2', padding: '1rem', borderRadius: '12px' }}>
            <AlertCircle size={28} color="#ef4444" />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>Rupture de stock</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>12 <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>modèles</span></div>
          </div>
        </div>
        <div className="premium-card hover-item" style={{ borderLeft: '4px solid #10b981', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: '#ecfdf5', padding: '1rem', borderRadius: '12px' }}>
            <TrendingUp size={28} color="#10b981" />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>Valeur du stock (Est.)</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>4.2M <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>DZD</span></div>
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
              placeholder="Rechercher une monture..." 
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
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Catégorie</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Prix Vente</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Stock</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {montures.map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'white'}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{item.id}</td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>{item.marque}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>{item.modele}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, background: '#f1f5f9', color: 'var(--text-secondary)' }}>
                      {item.categorie}
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
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Ajouter une Monture</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={24} color="#64748b" /></button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Marque</label>
                <input type="text" className="premium-input" placeholder="Ex: Ray-Ban" value={newMonture.marque} onChange={e => setNewMonture({...newMonture, marque: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Modèle</label>
                <input type="text" className="premium-input" placeholder="Ex: Aviator" value={newMonture.modele} onChange={e => setNewMonture({...newMonture, modele: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Catégorie</label>
                <select className="premium-input" value={newMonture.categorie} onChange={e => setNewMonture({...newMonture, categorie: e.target.value})}>
                  <option>Optique</option>
                  <option>Solaire</option>
                  <option>Sport</option>
                  <option>Enfant</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Prix (DZD)</label>
                  <input type="number" className="premium-input" placeholder="Ex: 15000" value={newMonture.prix} onChange={e => setNewMonture({...newMonture, prix: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Stock</label>
                  <input type="number" className="premium-input" placeholder="Ex: 10" value={newMonture.stock} onChange={e => setNewMonture({...newMonture, stock: e.target.value})} />
                </div>
              </div>
            </div>

            <button onClick={handleAdd} className="btn-primary" style={{ width: '100%', padding: '1rem' }}>Ajouter la monture</button>
          </div>
        </div>
      )}
    </div>
  );
}
