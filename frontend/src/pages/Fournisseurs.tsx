import React, { useState } from 'react';
import { Truck, Plus, Filter, Search, Phone, Mail, MapPin, X } from 'lucide-react';

export default function Fournisseurs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newFournisseur, setNewFournisseur] = useState({ nom: '', type: 'Général', contact: '', email: '', ville: '' });

  const [fournisseurs, setFournisseurs] = useState([
    { id: 'F-001', nom: 'Essilor Algérie', type: 'Verres', contact: '0550 12 34 56', email: 'contact@essilor.dz', ville: 'Alger' },
    { id: 'F-002', nom: 'Safilo Group', type: 'Montures', contact: '0555 98 76 54', email: 'sales@safilo.com', ville: 'Oran' },
    { id: 'F-003', nom: 'Bausch & Lomb', type: 'Lentilles', contact: '0770 11 22 33', email: 'info@bausch.dz', ville: 'Alger' },
    { id: 'F-004', nom: 'Zeiss Vision', type: 'Verres', contact: '0661 44 55 66', email: 'algeria@zeiss.com', ville: 'Constantine' },
  ]);

  const handleAdd = () => {
    if (!newFournisseur.nom) return;
    const newItem = {
      id: `F-00${fournisseurs.length + 1}`,
      ...newFournisseur
    };
    setFournisseurs([newItem, ...fournisseurs]);
    setShowModal(false);
    setNewFournisseur({ nom: '', type: 'Général', contact: '', email: '', ville: '' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Truck color="var(--accent)" size={32} /> Annuaire des Fournisseurs
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Gérez vos partenaires, distributeurs et laboratoires.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
          <Plus size={20} /> Ajouter un Fournisseur
        </button>
      </div>

      {/* Main Content: Table */}
      <div className="premium-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <input 
              type="text" 
              className="premium-input" 
              placeholder="Rechercher un fournisseur..." 
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
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Fournisseur</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Type principal</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Téléphone</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Email</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Localisation</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fournisseurs.map((fournisseur, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'white'}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#0f172a' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        {fournisseur.nom.charAt(0)}
                      </div>
                      {fournisseur.nom}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '20px', 
                      fontSize: '0.8rem', 
                      fontWeight: 600,
                      background: '#f1f5f9',
                      color: 'var(--text-secondary)'
                    }}>
                      {fournisseur.type}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                      <Phone size={14} /> {fournisseur.contact}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                      <Mail size={14} /> {fournisseur.email}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                      <MapPin size={14} /> {fournisseur.ville}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <button style={{ background: 'transparent', border: 'none', color: '#3b82f6', cursor: 'pointer', fontWeight: 600 }}>Modifier</button>
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
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Nouveau Fournisseur</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={24} color="#64748b" /></button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Raison Sociale / Nom</label>
                <input type="text" className="premium-input" placeholder="Ex: MegaOptic" value={newFournisseur.nom} onChange={e => setNewFournisseur({...newFournisseur, nom: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Type Principal</label>
                <select className="premium-input" value={newFournisseur.type} onChange={e => setNewFournisseur({...newFournisseur, type: e.target.value})}>
                  <option>Verres</option>
                  <option>Montures</option>
                  <option>Lentilles</option>
                  <option>Général</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Téléphone</label>
                <input type="text" className="premium-input" placeholder="Ex: 05..." value={newFournisseur.contact} onChange={e => setNewFournisseur({...newFournisseur, contact: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Ville</label>
                <input type="text" className="premium-input" placeholder="Ex: Alger" value={newFournisseur.ville} onChange={e => setNewFournisseur({...newFournisseur, ville: e.target.value})} />
              </div>
            </div>

            <button onClick={handleAdd} className="btn-primary" style={{ width: '100%', padding: '1rem' }}>Ajouter le fournisseur</button>
          </div>
        </div>
      )}
    </div>
  );
}
