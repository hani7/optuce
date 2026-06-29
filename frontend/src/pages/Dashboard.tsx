import React from 'react';
import { BarChart2, TrendingUp, DollarSign, Package } from 'lucide-react';

export default function Dashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* Top Widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
        <Widget title="Chiffre d'Affaires du Jour" value="45,000 DZD" icon={<DollarSign color="#10b981" size={32} />} bgColor="#ecfdf5" />
        <Widget title="CA Mensuel" value="1,250,000 DZD" icon={<TrendingUp color="#3b82f6" size={32} />} bgColor="#eff6ff" />
        <Widget title="Marge Nette" value="35%" icon={<BarChart2 color="#8b5cf6" size={32} />} bgColor="#f5f3ff" />
        <Widget title="Ventes (Articles)" value="28" icon={<Package color="#f59e0b" size={32} />} bgColor="#fffbeb" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="premium-card" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
           <h3 style={{ marginBottom: '2.5rem', fontSize: '1.25rem' }}>Évolution du Chiffre d'Affaires (Dernier Mois)</h3>
           
           <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '1.5rem', padding: '0 1rem' }}>
             {/* Beautiful bar chart mockup */}
             <div style={{ flex: 1, backgroundColor: '#e2e8f0', height: '40%', borderRadius: '8px 8px 0 0', position: 'relative', transition: 'height 1s ease-out' }} className="bar-hover">
               <span style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b' }}>400k</span>
             </div>
             <div style={{ flex: 1, backgroundColor: '#cbd5e1', height: '60%', borderRadius: '8px 8px 0 0', position: 'relative' }}>
               <span style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b' }}>600k</span>
             </div>
             <div style={{ flex: 1, backgroundColor: '#94a3b8', height: '50%', borderRadius: '8px 8px 0 0', position: 'relative' }}>
               <span style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.8rem', fontWeight: 'bold', color: '#64748b' }}>500k</span>
             </div>
             <div style={{ flex: 1, background: 'var(--accent-gradient)', height: '90%', borderRadius: '8px 8px 0 0', position: 'relative', boxShadow: '0 0 15px rgba(59,130,246,0.5)' }}>
               <span style={{ position: 'absolute', top: '-28px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--accent)' }}>900k</span>
             </div>
           </div>
           
           <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem 1rem 0', color: 'var(--text-secondary)', fontSize: '0.85rem', borderTop: '1px solid #f1f5f9', marginTop: '1rem' }}>
             <span style={{ flex: 1, textAlign: 'center' }}>Semaine 1</span>
             <span style={{ flex: 1, textAlign: 'center' }}>Semaine 2</span>
             <span style={{ flex: 1, textAlign: 'center' }}>Semaine 3</span>
             <span style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', color: 'var(--text-primary)' }}>Semaine 4</span>
           </div>
        </div>
        
        <div className="premium-card">
           <h3 style={{ marginBottom: '2.5rem', fontSize: '1.25rem' }}>Top Ventes Marques</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
             <div>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '1.05rem' }}>
                 <span style={{ fontWeight: 600 }}>Ray-Ban</span> 
                 <strong style={{ color: 'var(--accent)' }}>35%</strong>
               </div>
               <div style={{ width: '100%', height: '10px', backgroundColor: '#f1f5f9', borderRadius: '5px', overflow: 'hidden' }}>
                 <div style={{ width: '35%', height: '100%', background: 'var(--accent-gradient)', borderRadius: '5px' }}></div>
               </div>
             </div>
             
             <div>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '1.05rem' }}>
                 <span style={{ fontWeight: 600 }}>Guess</span> 
                 <strong style={{ color: '#10b981' }}>20%</strong>
               </div>
               <div style={{ width: '100%', height: '10px', backgroundColor: '#f1f5f9', borderRadius: '5px', overflow: 'hidden' }}>
                 <div style={{ width: '20%', height: '100%', background: 'linear-gradient(to right, #10b981, #059669)', borderRadius: '5px' }}></div>
               </div>
             </div>
             
             <div>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '1.05rem' }}>
                 <span style={{ fontWeight: 600 }}>Dior</span> 
                 <strong style={{ color: '#f59e0b' }}>15%</strong>
               </div>
               <div style={{ width: '100%', height: '10px', backgroundColor: '#f1f5f9', borderRadius: '5px', overflow: 'hidden' }}>
                 <div style={{ width: '15%', height: '100%', background: 'linear-gradient(to right, #f59e0b, #d97706)', borderRadius: '5px' }}></div>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  )
}

function Widget({ title, value, icon, bgColor }: { title: string, value: string, icon: React.ReactNode, bgColor: string }) {
  return (
    <div className="premium-card" style={{ padding: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.5px' }}>{title}</div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>{value}</div>
      </div>
      <div style={{ backgroundColor: bgColor, padding: '1.25rem', borderRadius: '16px' }}>
        {icon}
      </div>
    </div>
  )
}
