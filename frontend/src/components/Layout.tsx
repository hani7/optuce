import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  ShoppingCart, 
  FileText, 
  Package, 
  Wrench, 
  ShieldCheck, 
  Users, 
  BarChart2,
  Bell,
  Settings,
  Eye,
  Search,
  Truck,
  Glasses,
  Circle,
  Building,
  DollarSign,
  Tag,
  Layers,
  LogOut
} from 'lucide-react';

export default function Layout() {
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const currentTime = new Date().toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="app-container">
      {/* Red Header */}
      <header className="top-header">
        <div className="logo">
          <Eye size={28} />
          <span>Optuce</span>
        </div>
        
        <div className="app-title">
          Optique & Gestion
        </div>

        <div className="actions">
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.4rem 0.8rem', borderRadius: '20px', gap: '0.5rem', marginRight: '1rem' }}>
            <Search size={16} color="#94a3b8" />
            <input type="text" placeholder="Recherche rapide..." style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', fontSize: '0.85rem', width: '150px' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.15)', padding: '0.2rem 0.4rem', borderRadius: '6px', fontSize: '0.7rem', color: '#cbd5e1', fontWeight: 'bold', letterSpacing: '0.5px', marginLeft: '0.5rem' }}>
              ⌘K
            </div>
          </div>
          
          <span style={{ fontSize: '0.85rem', opacity: 0.8, fontWeight: 500 }}>
            {currentDate} • {currentTime}
          </span>
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button className="icon-button" onClick={() => setShowNotifications(!showNotifications)}>
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </button>
            
            {showNotifications && (
              <div className="premium-card" style={{ position: 'absolute', top: '120%', right: 0, width: '300px', zIndex: 100, padding: 0, overflow: 'hidden', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', fontWeight: 600, color: '#0f172a' }}>
                  Notifications
                </div>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  <div style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }} className="hover-item">
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>Stock faible : Monture Ray-Ban</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Il ne reste que 2 unités en stock.</div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.5rem' }}>Il y a 10 min</div>
                  </div>
                  <div style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }} className="hover-item">
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>Nouvelle commande atelier</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>La commande CMD-2026-045 est prête.</div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.5rem' }}>Il y a 1 heure</div>
                  </div>
                  <div style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }} className="hover-item">
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>Rendez-vous client</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>M. Benali est attendu pour la livraison de ses lunettes.</div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.5rem' }}>Il y a 2 heures</div>
                  </div>
                </div>
                <div style={{ padding: '0.75rem', textAlign: 'center', background: '#f8fafc', borderTop: '1px solid #f1f5f9', fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent)', cursor: 'pointer' }}>
                  Voir toutes les notifications
                </div>
              </div>
            )}
          </div>
          <button className="icon-button">
            <Settings size={20} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem' }}>
            <div className="user-avatar">
              A
            </div>
            <button className="icon-button" title="Déconnexion" onClick={() => { localStorage.removeItem('optuce_auth'); window.location.href = '/'; }}>
              <LogOut size={20} color="#ef4444" />
            </button>
          </div>
        </div>
      </header>

      {/* Floating Navigation */}
      <div className="nav-wrapper">
        <nav className="main-nav">
          <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
            <BarChart2 />
            Tableau de Bord
          </NavLink>
          <NavLink to="/caisse" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <ShoppingCart />
            Commande
          </NavLink>
          <NavLink to="/medical" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <FileText />
            Clients
          </NavLink>
          <div className="nav-dropdown-container">
            <NavLink to="#" className="nav-item">
              <Package />
              Stock
            </NavLink>
            <div className="nav-dropdown">
              <NavLink to="/stocks/montures" className="dropdown-item"><Glasses size={16} color="#0f172a" /> Montures</NavLink>
              <NavLink to="/stocks/verres" className="dropdown-item"><Circle size={16} color="#0f172a" /> Verres Matrices</NavLink>
              <NavLink to="/stocks/lentilles" className="dropdown-item"><Package size={16} color="#0f172a" /> Lentilles & Produits</NavLink>
            </div>
          </div>
          <NavLink to="/atelier" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Wrench />
            Atelier
          </NavLink>
          <NavLink to="/achats" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Truck />
            Achats
          </NavLink>
          <NavLink to="/crm" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Users />
            Fidélisation & CRM
          </NavLink>
          <NavLink to="/stats" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <BarChart2 />
            Statistiques
          </NavLink>
          <div className="nav-dropdown-container">
            <NavLink to="#" className="nav-item">
              <Settings />
              Paramètres
            </NavLink>
            <div className="nav-dropdown">
              <NavLink to="/parametres/fournisseurs" className="dropdown-item"><Building size={16} color="#0f172a" /> Fournisseurs</NavLink>
              <NavLink to="/parametres/charges" className="dropdown-item"><DollarSign size={16} color="#0f172a" /> Charges</NavLink>
              <NavLink to="/parametres/marques" className="dropdown-item"><Tag size={16} color="#0f172a" /> Marques</NavLink>
              <NavLink to="/parametres/categories" className="dropdown-item"><Layers size={16} color="#0f172a" /> Catégories</NavLink>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
