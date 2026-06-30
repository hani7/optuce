import React, { useState } from 'react';
import { Tag, Plus, Search, Filter, X } from 'lucide-react';

export default function Marques() {
  const [activeTab, setActiveTab] = useState<'Montures' | 'Verres' | 'Lentilles'>('Montures');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newMarque, setNewMarque] = useState({ nom: '', type: 'Montures' });

  const [marques, setMarques] = useState([
    { id: 'MRQ-01', nom: 'Ray-Ban', type: 'Montures', articlesCount: 145 },
    { id: 'MRQ-02', nom: 'Gucci', type: 'Montures', articlesCount: 42 },
    { id: 'MRQ-03', nom: 'Essilor', type: 'Verres', articlesCount: 890 },
    { id: 'MRQ-04', nom: 'Zeiss', type: 'Verres', articlesCount: 420 },
    { id: 'MRQ-05', nom: 'Alcon', type: 'Lentilles', articlesCount: 150 },
    { id: 'MRQ-06', nom: 'Bausch & Lomb', type: 'Lentilles', articlesCount: 200 },
  ]);

  const filteredMarques = marques.filter(m => m.type === activeTab && m.nom.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleAdd = () => {
    if (!newMarque.nom) return;
    const newItem = {
      id: `MRQ-${Math.floor(Math.random() * 1000)}`,
      nom: newMarque.nom,
      type: newMarque.type,
      articlesCount: 0
    };
    setMarques([...marques, newItem]);
    setShowModal(false);
    setNewMarque({ nom: '', type: activeTab });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Tag color="var(--accent)" size={32} /> Gestion des Marques
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Configurez les marques pour vos montures, verres et lentilles.</p>
        </div>
        <button onClick={() => { setNewMarque({ nom: '', type: activeTab }); setShowModal(true); }} className="btn-primary" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
          <Plus size={20} /> Ajouter une Marque
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        {['Montures', 'Verres', 'Lentilles'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '1.1rem', 
              fontWeight: activeTab === tab ? 800 : 600, 
              color: activeTab === tab ? 'var(--accent)' : 'var(--text-secondary)',
              cursor: 'pointer',
              paddingBottom: '0.5rem',
              borderBottom: activeTab === tab ? '3px solid var(--accent)' : '3px solid transparent',
              transition: 'all 0.2s'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Content: Table */}
      <div className="premium-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <input 
              type="text" 
              className="premium-input" 
              placeholder={`Rechercher une marque de ${activeTab.toLowerCase()}...`} 
              style={{ paddingLeft: '2.5rem', height: '40px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Nom de la Marque</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Module</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Articles Liés</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMarques.length > 0 ? filteredMarques.map((marque, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'white'}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 800, color: '#0f172a' }}>{marque.nom}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, background: '#f1f5f9', color: 'var(--text-secondary)' }}>
                      {marque.type}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{marque.articlesCount} articles</td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <button style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 600 }}>Supprimer</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Aucune marque trouvée pour cette catégorie.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="premium-card" style={{ width: '100%', maxWidth: '400px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Ajouter une Marque</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={24} color="#64748b" /></button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Pour (Type de produit)</label>
                <select className="premium-input" value={newMarque.type} onChange={e => setNewMarque({...newMarque, type: e.target.value})}>
                  <option value="Montures">Montures</option>
                  <option value="Verres">Verres</option>
                  <option value="Lentilles">Lentilles</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Nom de la Marque</label>
                <input type="text" className="premium-input" placeholder="Ex: Ray-Ban, Essilor..." value={newMarque.nom} onChange={e => setNewMarque({...newMarque, nom: e.target.value})} />
              </div>
            </div>

            <button onClick={handleAdd} className="btn-primary" style={{ width: '100%', padding: '1rem' }}>Ajouter</button>
          </div>
        </div>
      )}
    </div>
  );
}
