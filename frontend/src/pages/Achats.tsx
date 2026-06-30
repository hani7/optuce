import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Plus, Filter, Search, FileText, TrendingUp, TrendingDown, Clock, X, Loader2, Check } from 'lucide-react';

export default function Achats() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newAchat, setNewAchat] = useState({ fournisseur: '', prixAchat: '', quantite: '1' });
  
  const [fournisseurs, setFournisseurs] = useState<any[]>([]);
  const [typeArticle, setTypeArticle] = useState('monture');
  const [productSearch, setProductSearch] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('https://back.baitul.tech/api/parametres/fournisseurs/')
      .then(res => res.json())
      .then(data => setFournisseurs(Array.isArray(data) ? data : (data.results || [])))
      .catch(console.error);

    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowProductDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!productSearch.trim()) {
      setProducts([]);
      return;
    }
    const delay = setTimeout(() => {
      setIsSearching(true);
      fetch(`https://back.baitul.tech/api/stocks/${typeArticle}s/?search=${encodeURIComponent(productSearch)}`)
        .then(res => res.json())
        .then(data => {
          setProducts(Array.isArray(data) ? data : (data.results || []));
          setShowProductDropdown(true);
        })
        .catch(console.error)
        .finally(() => setIsSearching(false));
    }, 300);
    return () => clearTimeout(delay);
  }, [productSearch, typeArticle]);

  const [achats, setAchats] = useState([
    { id: 'ACH-2026-001', date: '28 Juin 2026', fournisseur: 'Essilor', montant: '145,000 DZD', statut: 'Reçu', nbArticles: 45 },
    { id: 'ACH-2026-002', date: '25 Juin 2026', fournisseur: 'Safilo', montant: '320,000 DZD', statut: 'En attente', nbArticles: 120 },
    { id: 'ACH-2026-003', date: '20 Juin 2026', fournisseur: 'Bausch & Lomb', montant: '85,000 DZD', statut: 'Reçu', nbArticles: 50 },
    { id: 'ACH-2026-004', date: '15 Juin 2026', fournisseur: 'Zeiss', montant: '210,000 DZD', statut: 'Payé', nbArticles: 80 },
  ]);

  const handleAdd = () => {
    if (!newAchat.fournisseur || !selectedProduct || !newAchat.prixAchat) return;
    const prix = parseFloat(newAchat.prixAchat);
    const qte = parseInt(newAchat.quantite || '1', 10);
    const total = prix * qte;
    
    const newItem = {
      id: `ACH-2026-00${achats.length + 1}`,
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
      fournisseur: newAchat.fournisseur,
      montant: `${total.toLocaleString('fr-FR')} DZD`,
      statut: 'En attente',
      nbArticles: qte
    };
    setAchats([newItem, ...achats]);
    setShowModal(false);
    setNewAchat({ fournisseur: '', prixAchat: '', quantite: '1' });
    setSelectedProduct(null);
    setProductSearch('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShoppingCart color="var(--accent)" size={32} /> Gestion des Achats
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Suivez vos commandes d'approvisionnement et vos stocks entrants.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
          <Plus size={20} /> Nouvelle Commande d'Achat
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        <div className="premium-card hover-item" style={{ borderLeft: '4px solid #3b82f6', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: '12px' }}>
            <TrendingUp size={28} color="#3b82f6" />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>Achats ce mois</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>760,000 <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>DZD</span></div>
          </div>
        </div>
        <div className="premium-card hover-item" style={{ borderLeft: '4px solid #f59e0b', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: '#fffbeb', padding: '1rem', borderRadius: '12px' }}>
            <Clock size={28} color="#f59e0b" />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>Commandes en attente</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>3</div>
          </div>
        </div>
        <div className="premium-card hover-item" style={{ borderLeft: '4px solid #10b981', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: '#ecfdf5', padding: '1rem', borderRadius: '12px' }}>
            <FileText size={28} color="#10b981" />
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>Articles réceptionnés</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>245</div>
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
              placeholder="Rechercher un achat..." 
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
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>N° Bon d'achat</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Fournisseur</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Articles</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Montant Total</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Statut</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {achats.map((achat, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'white'}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--accent)' }}>{achat.id}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>{achat.date}</td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{achat.fournisseur}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>{achat.nbArticles}</td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 'bold' }}>{achat.montant}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '20px', 
                      fontSize: '0.8rem', 
                      fontWeight: 600,
                      background: achat.statut === 'Reçu' || achat.statut === 'Payé' ? '#dcfce7' : '#fef3c7',
                      color: achat.statut === 'Reçu' || achat.statut === 'Payé' ? '#15803d' : '#b45309'
                    }}>
                      {achat.statut}
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
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Nouvelle Commande</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={24} color="#64748b" /></button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Fournisseur</label>
                <select className="premium-input" value={newAchat.fournisseur} onChange={e => setNewAchat({...newAchat, fournisseur: e.target.value})}>
                  <option value="">Sélectionner un fournisseur</option>
                  {fournisseurs.map((f: any) => (
                    <option key={f.id} value={f.nom}>{f.nom}</option>
                  ))}
                  {fournisseurs.length === 0 && <option value="Fournisseur Inconnu">Fournisseur Inconnu (Saisir manuellement via params)</option>}
                </select>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button 
                  onClick={() => { setTypeArticle('monture'); setSelectedProduct(null); setProductSearch(''); }}
                  style={{ padding: '0.75rem', borderRadius: '8px', border: '2px solid', borderColor: typeArticle === 'monture' ? 'var(--accent)' : 'var(--border-color)', background: typeArticle === 'monture' ? '#eff6ff' : 'white', cursor: 'pointer', fontWeight: 600, color: typeArticle === 'monture' ? 'var(--accent)' : 'var(--text-secondary)' }}
                >
                  Monture
                </button>
                <button 
                  onClick={() => { setTypeArticle('verre'); setSelectedProduct(null); setProductSearch(''); }}
                  style={{ padding: '0.75rem', borderRadius: '8px', border: '2px solid', borderColor: typeArticle === 'verre' ? 'var(--accent)' : 'var(--border-color)', background: typeArticle === 'verre' ? '#eff6ff' : 'white', cursor: 'pointer', fontWeight: 600, color: typeArticle === 'verre' ? 'var(--accent)' : 'var(--text-secondary)' }}
                >
                  Verre
                </button>
              </div>

              <div ref={searchRef} style={{ position: 'relative' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Produit</label>
                {selectedProduct ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                    <div style={{ fontWeight: 600 }}>{selectedProduct.designation || selectedProduct.modele || selectedProduct.reference}</div>
                    <button onClick={() => setSelectedProduct(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><X size={16} /></button>
                  </div>
                ) : (
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      className="premium-input" 
                      placeholder="Rechercher un produit..." 
                      value={productSearch}
                      onChange={e => setProductSearch(e.target.value)}
                      onFocus={() => { if(products.length > 0) setShowProductDropdown(true); }}
                    />
                    {isSearching && <Loader2 size={16} className="spin" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />}
                    
                    {showProductDropdown && products.length > 0 && (
                      <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', marginTop: '0.25rem', maxHeight: '200px', overflowY: 'auto', zIndex: 10 }}>
                        {products.map(p => (
                          <div 
                            key={p.id}
                            onClick={() => { setSelectedProduct(p); setShowProductDropdown(false); }}
                            style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 0.2s', fontWeight: 500 }}
                            onMouseOver={e => e.currentTarget.style.background = '#f8fafc'}
                            onMouseOut={e => e.currentTarget.style.background = 'white'}
                          >
                            {p.designation || p.modele || p.reference} <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginLeft: '0.5rem' }}>{p.reference}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Prix d'achat Unitaire</label>
                  <input type="number" className="premium-input" placeholder="DZD" value={newAchat.prixAchat} onChange={e => setNewAchat({...newAchat, prixAchat: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Quantité</label>
                  <input type="number" className="premium-input" placeholder="Ex: 10" value={newAchat.quantite} onChange={e => setNewAchat({...newAchat, quantite: e.target.value})} />
                </div>
              </div>
            </div>

            <button onClick={handleAdd} disabled={!newAchat.fournisseur || !selectedProduct || !newAchat.prixAchat} className="btn-primary" style={{ width: '100%', padding: '1rem', opacity: (!newAchat.fournisseur || !selectedProduct || !newAchat.prixAchat) ? 0.7 : 1 }}>Valider la commande</button>
          </div>
        </div>
      )}
    </div>
  );
}
