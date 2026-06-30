import React, { useState, useEffect } from 'react';
import { Circle, Plus, Filter, Search, TrendingUp, Package, AlertCircle, X, Eye, Edit2, Trash2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export default function Verres() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newVerre, setNewVerre] = useState({ marque: '', modele: '', matiere: 'Organique', prix: '', stock: '' });

  const [verres, setVerres] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchVerres = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('https://back.baitul.tech/api/stocks/verres/');
      const data = await res.json();
      setVerres(Array.isArray(data) ? data : (data.results || []));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVerres();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showModal) {
        setShowModal(false);
        setEditingId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal]);

  const handleAdd = () => {
    if (!newVerre.marque || !newVerre.modele) return;
    
    if (editingId) {
      setVerres(verres.map(v => v.id === editingId ? { ...newVerre, id: editingId, prix: newVerre.prix.toString().includes('DZD') ? newVerre.prix : `${newVerre.prix} DZD`, stock: parseInt(newVerre.stock.toString() || '0', 10) } as any : v));
    } else {
      const newItem = {
        ...newVerre,
        id: `V-00${verres.length + 1}`,
        prix: newVerre.prix.toString().includes('DZD') ? newVerre.prix : `${newVerre.prix} DZD`,
        stock: parseInt(newVerre.stock.toString() || '0', 10)
      };
      setVerres([newItem, ...verres]);
    }
    setShowModal(false);
    setEditingId(null);
    setNewVerre({ marque: '', modele: '', matiere: 'Organique', prix: '', stock: '' } as any);
  };

  const filteredVerres = verres.filter(v => 
    (v.reference || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (v.marque || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (v.modele || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredVerres.length / itemsPerPage);
  const paginatedVerres = filteredVerres.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Photo</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Réf</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Marque</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Modèle / Traitement</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Catégorie</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Prix Vente</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Stock</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedVerres.map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'white'}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ width: '40px', height: '40px', background: '#e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {item.image ? (
                        <img src={item.image.includes('/@fs/') ? '/@fs/' + item.image.split('/@fs/')[1] : item.image} alt={item.modele || item.reference} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Eye size={20} color="#94a3b8" />
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{item.reference || item.id}</td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>{item.marque_nom || item.marque?.nom || item.marque || 'Sans marque'}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>{item.modele}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, background: '#f1f5f9', color: 'var(--text-secondary)' }}>
                      {item.categorie_nom || item.categorie || item.matiere}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 'bold' }}>
                    {item.prix_vente ? `${parseFloat(item.prix_vente).toLocaleString('fr-FR')} DZD` : (item.prix || '-')}
                  </td>
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
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <button onClick={(e) => { e.stopPropagation(); setEditingId(item.id); setNewVerre({ ...item, prix: (item.prix_vente || item.prix || '').toString().replace(' DZD', ''), marque: item.marque_nom || item.marque || '', categorie: item.categorie_nom || item.categorie || '' } as any); setShowModal(true); }} title="Modifier" style={{ background: '#f1f5f9', border: 'none', color: '#475569', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex' }}><Edit2 size={16} /></button>
                    <button onClick={async (e) => { 
                      e.stopPropagation(); 
                      if (window.confirm('Êtes-vous sûr de vouloir supprimer ce verre ?')) {
                        try {
                          await fetch(`https://back.baitul.tech/api/stocks/verres/${item.id}/`, { method: 'DELETE' });
                          fetchVerres();
                        } catch(err) {
                          alert('Erreur lors de la suppression');
                        }
                      }
                    }} title="Supprimer" style={{ background: '#fef2f2', border: 'none', color: '#ef4444', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex' }}><Trash2 size={16} /></button>
                    <button style={{ background: 'transparent', border: 'none', color: '#3b82f6', cursor: 'pointer', fontWeight: 600, padding: '0.5rem' }}>Détails</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <span>Afficher</span>
            <select className="premium-input" style={{ width: 'auto', padding: '0.25rem 2rem 0.25rem 0.5rem', height: '32px' }} value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>par page</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{ padding: '0.5rem', background: currentPage === 1 ? '#f1f5f9' : 'white', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', color: currentPage === 1 ? '#94a3b8' : 'var(--text-primary)' }}
            >
              <ChevronLeft size={18} />
            </button>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Page {currentPage} sur {totalPages || 1}
            </span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              style={{ padding: '0.5rem', background: currentPage === totalPages || totalPages === 0 ? '#f1f5f9' : 'white', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: currentPage === totalPages || totalPages === 0 ? 'not-allowed' : 'pointer', color: currentPage === totalPages || totalPages === 0 ? '#94a3b8' : 'var(--text-primary)' }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
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
