import React from 'react';
import { Search, CreditCard, Banknote, Receipt, Tag, X } from 'lucide-react';

export default function Caisse() {
  return (
    <div style={{ display: 'flex', gap: '2rem', minHeight: 'calc(100vh - 160px)' }}>
      
      {/* Left side: Search & Products */}
      <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="premium-card">
          <h2 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.4rem' }}>
            <Search size={22} color="var(--accent)" /> Recherche Article
          </h2>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              className="premium-input"
              placeholder="Scannez un code-barres ou tapez une référence..." 
              style={{ paddingLeft: '3rem', fontSize: '1.1rem' }}
            />
            <Search size={20} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
        </div>
        
        <div className="premium-card" style={{ flex: 1 }}>
           <h3 style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <Tag size={18} /> Raccourcis Articles Rapides
           </h3>
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1.25rem' }}>
             {/* Beautiful vibrant product cards */}
             <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', border: '1px solid #bae6fd', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: 'var(--shadow-sm)' }} className="hover-item" onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
               <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🕶️</div>
               <div style={{ fontWeight: 600, color: '#0369a1' }}>Monture Ray-Ban</div>
             </div>
             <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', border: '1px solid #bbf7d0', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: 'var(--shadow-sm)' }} className="hover-item" onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
               <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>👓</div>
               <div style={{ fontWeight: 600, color: '#15803d' }}>Verre Essilor</div>
             </div>
             <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', border: '1px solid #fde68a', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: 'var(--shadow-sm)' }} className="hover-item" onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
               <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🧴</div>
               <div style={{ fontWeight: 600, color: '#b45309' }}>Produit Lentilles</div>
             </div>
           </div>
        </div>
      </div>

      {/* Right side: Cart & Checkout (Receipt Style) */}
      <div className="premium-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '2rem', backgroundColor: '#f8fafc', borderBottom: '2px dashed var(--border-color)' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Ticket Actuel</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Ticket #8042</span>
          </h2>
        </div>
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
          {/* Example Cart Item */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Monture Ray-Ban RX5154</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>1 x 15,000 DZD</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <strong style={{ fontSize: '1.1rem' }}>15,000</strong>
              <button style={{ background: '#fee2e2', border: 'none', color: '#ef4444', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={14} />
              </button>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Verres Essilor Orma AR</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>2 x 4,000 DZD</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <strong style={{ fontSize: '1.1rem' }}>8,000</strong>
              <button style={{ background: '#fee2e2', border: 'none', color: '#ef4444', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={14} />
              </button>
            </div>
          </div>
          
          <div style={{ flex: 1 }}></div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            <span>Sous-total</span>
            <span>23,000 DZD</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            <span>Remise (Tiers-Payant)</span>
            <span style={{ color: '#ef4444' }}>- 3,000 DZD</span>
          </div>
        </div>

        <div style={{ padding: '2rem', backgroundColor: '#f8fafc', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '2rem', fontWeight: 800, marginBottom: '2rem', color: '#0f172a' }}>
            <span>Net à Payer:</span>
            <span style={{ color: 'var(--accent)' }}>20,000 DZD</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', backgroundColor: 'white', border: '2px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }} onMouseOver={e => e.currentTarget.style.borderColor = '#10b981'} onMouseOut={e => e.currentTarget.style.borderColor = '#e2e8f0'}>
              <Banknote size={20} color="#10b981" /> Espèces
            </button>
            <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', backgroundColor: 'white', border: '2px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }} onMouseOver={e => e.currentTarget.style.borderColor = '#3b82f6'} onMouseOut={e => e.currentTarget.style.borderColor = '#e2e8f0'}>
              <CreditCard size={20} color="#3b82f6" /> CIB
            </button>
          </div>
          
          <button className="btn-primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1.2rem', borderRadius: '12px' }}>
            <Receipt size={24} /> Valider & Imprimer Ticket
          </button>
        </div>
      </div>
    </div>
  )
}
