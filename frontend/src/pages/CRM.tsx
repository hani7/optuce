import React from 'react';
import { Users, MessageCircle, Calendar, Send, CheckCircle2 } from 'lucide-react';

export default function CRM() {
  return (
    <div className="premium-card" style={{ minHeight: 'calc(100vh - 160px)' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', fontSize: '1.5rem' }}>
        <Users size={28} color="#ec4899" /> Fidélisation & CRM
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem' }}>
             <MessageCircle size={22} color="#10b981" /> Campagnes & Envoi Automatisé
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: 1.5 }}>Communiquez avec vos clients par SMS ou WhatsApp. Informez-les de la disponibilité de leurs lunettes ou envoyez des vœux.</p>
          
          <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Message (Personnalisé avec {`{Nom}`})</label>
            <textarea 
              className="premium-input"
              defaultValue="Bonjour {Nom}, vos lunettes sont prêtes et vous attendent chez Optuce !" 
              style={{ height: '120px', resize: 'none', marginBottom: '1.5rem' }}
            ></textarea>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <button style={{ padding: '1rem', backgroundColor: '#25D366', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1rem', transition: 'transform 0.2s', boxShadow: 'var(--shadow-sm)' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <Send size={18} /> WhatsApp
              </button>
              <button style={{ padding: '1rem', backgroundColor: 'var(--accent)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1rem', transition: 'transform 0.2s', boxShadow: 'var(--shadow-sm)' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <MessageCircle size={18} /> SMS
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem' }}>
             <Calendar size={22} color="#f59e0b" /> Rappels de Contrôle (2 ans)
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: 1.5 }}>Ces clients n'ont pas renouvelé leurs lunettes depuis plus de 2 ans. Il est temps de les inviter à un contrôle.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             <div style={{ padding: '1.25rem', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                 <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--accent)' }}>SM</div>
                 <div>
                   <strong style={{ display: 'block', fontSize: '1.05rem', color: '#0f172a' }}>Sarah M.</strong>
                   <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Dernier contrôle: 12/04/2024</div>
                 </div>
               </div>
               <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Rappeler</button>
             </div>
             
             <div style={{ padding: '1.25rem', backgroundColor: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                 <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#166534' }}>KB</div>
                 <div>
                   <strong style={{ display: 'block', fontSize: '1.05rem', color: '#166534' }}>Karim B.</strong>
                   <div style={{ fontSize: '0.85rem', color: '#15803d', marginTop: '0.25rem' }}>Dernier contrôle: 05/01/2024</div>
                 </div>
               </div>
               <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#166534', fontWeight: 'bold', fontSize: '0.9rem' }}><CheckCircle2 size={18} /> Rappelé hier</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
