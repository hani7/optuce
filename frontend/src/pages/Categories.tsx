import React, { useState } from 'react';
import { Layers, Plus, Search, Filter, X } from 'lucide-react';

export default function Categories() {
  const [activeTab, setActiveTab] = useState<'Montures' | 'Verres' | 'Lentilles'>('Montures');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ nom: '', type: 'Montures' });

  const [categories, setCategories] = useState([
    { id: 'CAT-01', nom: 'Solaire', type: 'Montures', articlesCount: 120 },
    { id: 'CAT-02', nom: 'Optique', type: 'Montures', articlesCount: 200 },
    { id: 'CAT-03', nom: 'Sport', type: 'Montures', articlesCount: 15 },
    { id: 'CAT-04', nom: 'Unifocal', type: 'Verres', articlesCount: 500 },
    { id: 'CAT-05', nom: 'Progressif', type: 'Verres', articlesCount: 340 },
    { id: 'CAT-06', nom: 'Journalière', type: 'Lentilles', articlesCount: 80 },
    { id: 'CAT-07', nom: 'Mensuelle', type: 'Lentilles', articlesCount: 140 },
  ]);

  const filteredCategories = categories.filter(c => c.type === activeTab && c.nom.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleAdd = () => {
    if (!newCategory.nom) return;
    const newItem = {
      id: `CAT-${Math.floor(Math.random() * 1000)}`,
      nom: newCategory.nom,
      type: newCategory.type,
      articlesCount: 0
    };
    setCategories([...categories, newItem]);
    setShowModal(false);
    setNewCategory({ nom: '', type: activeTab });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Layers color="var(--accent)" size={32} /> Gestion des Catégories
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Organisez vos produits avec des catégories spécifiques pour un meilleur filtrage.</p>
        </div>
        <button onClick={() => { setNewCategory({ nom: '', type: activeTab }); setShowModal(true); }} className="btn-primary" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
          <Plus size={20} /> Nouvelle Catégorie
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
              placeholder={`Rechercher une catégorie de ${activeTab.toLowerCase()}...`} 
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
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Nom de la Catégorie</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Module</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Articles Liés</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length > 0 ? filteredCategories.map((cat, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'white'}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 800, color: '#0f172a' }}>{cat.nom}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, background: '#f1f5f9', color: 'var(--text-secondary)' }}>
                      {cat.type}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{cat.articlesCount} articles</td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <button style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 600 }}>Supprimer</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Aucune catégorie trouvée pour ce type.</td>
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
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Ajouter une Catégorie</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={24} color="#64748b" /></button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Pour (Type de produit)</label>
                <select className="premium-input" value={newCategory.type} onChange={e => setNewCategory({...newCategory, type: e.target.value})}>
                  <option value="Montures">Montures</option>
                  <option value="Verres">Verres</option>
                  <option value="Lentilles">Lentilles</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Nom de la Catégorie</label>
                <input type="text" className="premium-input" placeholder="Ex: Solaire, Progressif, Journalière..." value={newCategory.nom} onChange={e => setNewCategory({...newCategory, nom: e.target.value})} />
              </div>
            </div>

            <button onClick={handleAdd} className="btn-primary" style={{ width: '100%', padding: '1rem' }}>Créer la Catégorie</button>
          </div>
        </div>
      )}
    </div>
  );
}
