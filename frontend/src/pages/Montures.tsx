import React, { useState, useEffect } from 'react';
import { Glasses, Plus, Filter, Search, TrendingUp, Package, AlertCircle, X, Edit2, Trash2, ChevronLeft, ChevronRight, Loader2, Save } from 'lucide-react';

export default function Montures() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newMonture, setNewMonture] = useState({ 
    reference: '', code_barres: '', 
    marque: '', modele: '', sexe: 'U', couleur: '', taille: '', materiau: 'mixte', categorie: 'Optique', 
    prix_achat: '', prix_vente: '', stock: '', stock_minimum: '1', 
    image: '', actif: true 
  });

  const [montures, setMontures] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [selectedMonture, setSelectedMonture] = useState<any | null>(null);

  const getImageUrl = (url: string) => {
    if (!url) return null;
    if (url.includes('/@fs/')) return '/@fs/' + url.split('/@fs/')[1];
    return url;
  };

  const fetchMontures = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('https://back.baitul.tech/api/stocks/montures/');
      const data = await res.json();
      setMontures(Array.isArray(data) ? data : (data.results || []));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMontures();
  }, []);

  const handleAdd = async () => {
    if (!newMonture.marque || !newMonture.modele) return;
    
    const payload = {
      reference: newMonture.reference,
      code_barres: newMonture.code_barres,
      marque_name_input: newMonture.marque,
      modele: newMonture.modele,
      sexe: newMonture.sexe,
      couleur: newMonture.couleur,
      taille: newMonture.taille,
      materiau: newMonture.materiau,
      categorie_name_input: newMonture.categorie,
      prix_achat: parseFloat(newMonture.prix_achat.toString() || '0'),
      prix_vente: parseFloat(newMonture.prix_vente.toString().replace(' DZD', '').trim() || '0'),
      stock: parseInt(newMonture.stock.toString() || '0', 10),
      stock_minimum: parseInt(newMonture.stock_minimum.toString() || '1', 10),
      actif: newMonture.actif,
      image: newMonture.image || null
    };

    try {
      if (editingId) {
        await fetch(`https://back.baitul.tech/api/stocks/montures/${editingId}/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch('https://back.baitul.tech/api/stocks/montures/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      setShowModal(false);
      setEditingId(null);
      setNewMonture({ 
        reference: '', code_barres: '', 
        marque: '', modele: '', sexe: 'U', couleur: '', taille: '', materiau: 'mixte', categorie: 'Optique', 
        prix_achat: '', prix_vente: '', stock: '', stock_minimum: '1', 
        image: '', actif: true 
      });
      fetchMontures();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const filteredMontures = montures.filter(m => 
    (m.reference || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    String(m.marque_nom || m.marque || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.modele || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMontures.length / itemsPerPage);
  const paginatedMontures = filteredMontures.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        <div className="premium-card hover-item" style={{ background: '#f1f5f9', borderLeft: '4px solid #1eb6e7', display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
          <div style={{ background: '#1eb6e7', padding: '1rem', borderRadius: '12px' }}>
            <Package size={28} color="white" />
          </div>
          <div>
            <div style={{ color: '#475569', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Montures en Stock</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{montures.length}</div>
          </div>
        </div>
        <div className="premium-card hover-item" style={{ background: '#f1f5f9', borderLeft: '4px solid #1eb6e7', display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
          <div style={{ background: '#1eb6e7', padding: '1rem', borderRadius: '12px' }}>
            <AlertCircle size={28} color="white" />
          </div>
          <div>
            <div style={{ color: '#475569', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Rupture de stock</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{montures.filter(m => m.stock === 0).length} <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500 }}>modèles</span></div>
          </div>
        </div>
        <div className="premium-card hover-item" style={{ background: '#f1f5f9', borderLeft: '4px solid #1eb6e7', display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
          <div style={{ background: '#1eb6e7', padding: '1rem', borderRadius: '12px' }}>
            <TrendingUp size={28} color="white" />
          </div>
          <div>
            <div style={{ color: '#475569', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Valeur du stock</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{(montures.reduce((acc, m) => acc + (parseFloat(m.prix_vente) || 0) * (parseInt(m.stock) || 0), 0)).toLocaleString('fr-FR')} <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500 }}>DZD</span></div>
          </div>
        </div>
        <div className="premium-card hover-item" style={{ background: '#f1f5f9', borderLeft: '4px solid #1eb6e7', display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
          <div style={{ background: '#1eb6e7', padding: '1rem', borderRadius: '12px' }}>
            <Glasses size={28} color="white" />
          </div>
          <div>
            <div style={{ color: '#475569', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Marques Différentes</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{new Set(montures.map(m => m.marque_nom || m.marque)).size} <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500 }}>marques</span></div>
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
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Photo</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Ajouté le</th>
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
              {paginatedMontures.map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'white'}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ width: '40px', height: '40px', background: '#e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {getImageUrl(item.image) && !getImageUrl(item.image)?.includes('unsplash') ? (
                        <img src={getImageUrl(item.image) as string} alt={item.modele} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <img src="/default-monture.svg" alt="Monture par défaut" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {item.date_creation ? new Date(item.date_creation).toLocaleString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit'}) : '-'}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{item.reference || item.id}</td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>{item.marque_nom || item.marque}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>{item.modele}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, background: '#f1f5f9', color: 'var(--text-secondary)' }}>
                      {item.categorie_nom || item.categorie}
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
                    <button onClick={(e) => { e.stopPropagation(); setEditingId(item.id); setNewMonture({ ...item, prix_vente: (item.prix_vente || item.prix || '').toString().replace(' DZD', ''), prix_achat: item.prix_achat || '', categorie: item.categorie_nom || item.categorie, marque: item.marque_nom || item.marque?.nom || item.marque || '' } as any); setShowModal(true); }} title="Modifier" style={{ background: '#f1f5f9', border: 'none', color: '#475569', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex' }}><Edit2 size={16} /></button>
                    <button onClick={async (e) => { 
                      e.stopPropagation(); 
                      if (window.confirm('Êtes-vous sûr de vouloir supprimer cette monture ?')) {
                        try {
                          await fetch(`https://back.baitul.tech/api/stocks/montures/${item.id}/`, { method: 'DELETE' });
                          fetchMontures();
                        } catch(err) {
                          alert('Erreur lors de la suppression');
                        }
                      }
                    }} title="Supprimer" style={{ background: '#fef2f2', border: 'none', color: '#ef4444', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex' }}><Trash2 size={16} /></button>
                    <button onClick={(e) => { e.stopPropagation(); setSelectedMonture(item); }} style={{ background: 'transparent', border: 'none', color: '#3b82f6', cursor: 'pointer', fontWeight: 600, padding: '0.5rem' }}>Détails</button>
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
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="premium-card" style={{ width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>{editingId ? 'Modifier la Monture' : 'Ajouter une Monture'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={24} color="#64748b" /></button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {/* Section 1 : Informations Générales */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Référence *</label>
                  <input type="text" className="premium-input" placeholder="Ex: REF-123" value={newMonture.reference} onChange={e => setNewMonture({...newMonture, reference: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Code barres</label>
                  <input type="text" className="premium-input" placeholder="Scanner ou taper..." value={newMonture.code_barres} onChange={e => setNewMonture({...newMonture, code_barres: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Marque *</label>
                  <input type="text" className="premium-input" placeholder="Ex: Ray-Ban" value={newMonture.marque} onChange={e => setNewMonture({...newMonture, marque: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Modèle *</label>
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
              </div>

              {/* Section 2 : Spécifications et Stock */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Sexe</label>
                    <select className="premium-input" value={newMonture.sexe} onChange={e => setNewMonture({...newMonture, sexe: e.target.value})}>
                      <option value="H">Homme</option>
                      <option value="F">Femme</option>
                      <option value="E">Enfant</option>
                      <option value="U">Unisexe</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Couleur</label>
                    <input type="text" className="premium-input" placeholder="Ex: Noir" value={newMonture.couleur} onChange={e => setNewMonture({...newMonture, couleur: e.target.value})} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Taille</label>
                    <input type="text" className="premium-input" placeholder="52-18-140" value={newMonture.taille} onChange={e => setNewMonture({...newMonture, taille: e.target.value})} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Matériau</label>
                    <select className="premium-input" value={newMonture.materiau} onChange={e => setNewMonture({...newMonture, materiau: e.target.value})}>
                      <option value="acetate">Acétate</option>
                      <option value="metal">Métal</option>
                      <option value="titane">Titane</option>
                      <option value="plastique">Plastique</option>
                      <option value="mixte">Mixte</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Prix d'achat (DZD)</label>
                    <input type="number" className="premium-input" placeholder="0" value={newMonture.prix_achat} onChange={e => setNewMonture({...newMonture, prix_achat: e.target.value})} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Prix de vente *</label>
                    <input type="number" className="premium-input" placeholder="Ex: 15000" value={newMonture.prix_vente} onChange={e => setNewMonture({...newMonture, prix_vente: e.target.value})} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Stock</label>
                    <input type="number" className="premium-input" placeholder="Ex: 10" value={newMonture.stock} onChange={e => setNewMonture({...newMonture, stock: e.target.value})} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Stock min.</label>
                    <input type="number" className="premium-input" placeholder="1" value={newMonture.stock_minimum} onChange={e => setNewMonture({...newMonture, stock_minimum: e.target.value})} />
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <input type="checkbox" id="actifCheck" checked={newMonture.actif} onChange={e => setNewMonture({...newMonture, actif: e.target.checked})} />
                  <label htmlFor="actifCheck" style={{ fontWeight: 600, cursor: 'pointer' }}>Monture active (Visible)</label>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
              <button onClick={handleAdd} className="btn-primary" style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                <Save size={20} /> {editingId ? 'Enregistrer les modifications' : 'Ajouter la monture'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedMonture && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="premium-card" style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Package color="var(--accent)" /> Détails du Produit
              </h3>
              <button onClick={() => setSelectedMonture(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={24} color="#64748b" /></button>
            </div>

            <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
              <div style={{ flex: '0 0 200px', height: '200px', background: '#f8fafc', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {getImageUrl(selectedMonture.image) && !getImageUrl(selectedMonture.image)?.includes('unsplash') ? (
                  <img src={getImageUrl(selectedMonture.image) as string} alt={selectedMonture.modele} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <img src="/default-monture.svg" alt="Monture par défaut" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>Réf: {selectedMonture.reference}</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{selectedMonture.marque_nom || selectedMonture.marque} - {selectedMonture.modele}</div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <span style={{ padding: '0.25rem 0.75rem', background: '#eff6ff', color: '#3b82f6', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>{selectedMonture.categorie_nom || selectedMonture.categorie}</span>
                    <span style={{ padding: '0.25rem 0.75rem', background: '#f1f5f9', color: '#64748b', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>Sexe: {selectedMonture.sexe}</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                  <div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Couleur</div>
                    <div style={{ fontWeight: 600 }}>{selectedMonture.couleur || '-'}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Taille</div>
                    <div style={{ fontWeight: 600 }}>{selectedMonture.taille || '-'}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Matériau</div>
                    <div style={{ fontWeight: 600 }}>{selectedMonture.materiau || '-'}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Stock</div>
                    <div style={{ fontWeight: 600, color: selectedMonture.stock > 0 ? '#10b981' : '#ef4444' }}>{selectedMonture.stock} unités</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>{parseFloat(selectedMonture.prix_vente || 0).toLocaleString('fr-FR')} DZD</div>
                  <button onClick={() => { setEditingId(selectedMonture.id); setNewMonture({ ...selectedMonture, prix_vente: (selectedMonture.prix_vente || '').toString().replace(' DZD', ''), categorie: selectedMonture.categorie_nom || selectedMonture.categorie, marque: selectedMonture.marque_nom || selectedMonture.marque } as any); setSelectedMonture(null); setShowModal(true); }} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Edit2 size={16} /> Modifier
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
