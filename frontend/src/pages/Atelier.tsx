import React from 'react';
import { Wrench, Clock, AlertCircle, GripVertical } from 'lucide-react';

export default function Atelier() {
  return (
    <div style={{ minHeight: 'calc(100vh - 160px)', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', fontSize: '1.5rem', color: '#0f172a' }}>
        <Wrench size={28} color="#8b5cf6" /> Suivi de l'Atelier (Kanban)
      </h2>

      <div style={{ display: 'flex', gap: '1.5rem', flex: 1, overflowX: 'auto', paddingBottom: '1rem' }}>
        <KanbanColumn title="À Commander" color="#f59e0b" count={3} />
        <KanbanColumn title="Commandé" color="#3b82f6" count={1} />
        <KanbanColumn title="En cours de montage" color="#8b5cf6" count={2} />
        <KanbanColumn title="Prêt pour livraison" color="#10b981" count={5} />
      </div>
    </div>
  )
}

function KanbanColumn({ title, color, count }: { title: string, color: string, count: number }) {
  return (
    <div style={{ backgroundColor: '#f1f5f9', borderRadius: '14px', minWidth: '320px', flex: 1, display: 'flex', flexDirection: 'column', border: '1px solid var(--border-color)' }}>
      <div style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid transparent', borderImage: `linear-gradient(to right, ${color} 0%, transparent 100%) 1` }}>
        <h3 style={{ fontSize: '1.05rem', margin: 0, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: color }}></div>
          {title}
        </h3>
        <span style={{ backgroundColor: 'white', color: '#64748b', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 'bold', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>{count}</span>
      </div>
      
      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Placeholder Cards based on column */}
        {(title === 'À Commander' || title === 'En cours de montage') && (
          <div className="premium-card" style={{ padding: '1.25rem', cursor: 'grab', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1' }}>
              <GripVertical size={16} />
            </div>
            <div style={{ paddingLeft: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <strong style={{ fontSize: '1.05rem' }}>Cmd #1024</strong>
                {title === 'À Commander' && <span style={{ fontSize: '0.75rem', backgroundColor: '#fee2e2', color: '#ef4444', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><AlertCircle size={12} /> Urgent</span>}
              </div>
              <p style={{ fontSize: '0.9rem', color: '#334155', fontWeight: 500 }}>Verres Essilor Orma AR</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Client: Ahmed B.</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={12} /> 2h</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
