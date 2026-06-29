import React, { useState } from 'react';
import { ShoppingCart, Plus, Filter, Search, FileText, TrendingUp, TrendingDown, Clock, X } from 'lucide-react';

export default function Achats() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newAchat, setNewAchat] = useState({ fournisseur: '', montant: '', nbArticles: '' });

  const [achats, setAchats] = useState([
    { id: 'ACH-2026-001', date: '28 Juin 2026', fournisseur: 'Essilor', montant: '145,000 DZD', statut: 'Reçu', nbArticles: 45 },
    { id: 'ACH-2026-002', date: '25 Juin 2026', fournisseur: 'Safilo', montant: '320,000 DZD', statut: 'En attente', nbArticles: 120 },
    { id: 'ACH-2026-003', date: '20 Juin 2026', fournisseur: 'Bausch & Lomb', montant: '85,000 DZD', statut: 'Reçu', nbArticles: 50 },
    { id: 'ACH-2026-004', date: '15 Juin 2026', fournisseur: 'Zeiss', montant: '210,000 DZD', statut: 'Payé', nbArticles: 80 },
  ]);

  const handleAdd = () => {
    if (!newAchat.fournisseur || !newAchat.montant) return;
    const newItem = {
      id: `ACH-2026-00${achats.length + 1}`,
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
      fournisseur: newAchat.fournisseur,
      montant: `${newAchat.montant} DZD`,
      statut: 'En attente',
      nbArticles: parseInt(newAchat.nbArticles || '1', 10)
    };
    setAchats([newItem, ...achats]);
    setShowModal(false);
    setNewAchat({ fournisseur: '', montant: '', nbArticles: '' });
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
                <input type="text" className="premium-input" placeholder="Ex: Essilor" value={newAchat.fournisseur} onChange={e => setNewAchat({...newAchat, fournisseur: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Montant Estimé (DZD)</label>
                <input type="number" className="premium-input" placeholder="Ex: 150000" value={newAchat.montant} onChange={e => setNewAchat({...newAchat, montant: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Nombre d'articles</label>
                <input type="number" className="premium-input" placeholder="Ex: 50" value={newAchat.nbArticles} onChange={e => setNewAchat({...newAchat, nbArticles: e.target.value})} />
              </div>
            </div>

            <button onClick={handleAdd} className="btn-primary" style={{ width: '100%', padding: '1rem' }}>Valider la commande</button>
          </div>
        </div>
      )}
    </div>
  );
}
