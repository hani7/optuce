import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, 
  FileText, 
  Package, 
  Wrench, 
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
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

export default function Layout() {
  const location = useLocation();
  const isStockActive = location.pathname.startsWith('/stocks');
  const isParamsActive = location.pathname.startsWith('/parametres');

  const [showNotifications, setShowNotifications] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [stockExpanded, setStockExpanded] = useState(false);
  const [paramsExpanded, setParamsExpanded] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false); }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const currentDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const currentTime = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `mobile-nav-item${isActive ? ' active' : ''}`;
  const subLinkClass = ({ isActive }: { isActive: boolean }) =>
    `mobile-nav-sub${isActive ? ' active' : ''}`;

  return (
    <div className="app-container">
      {/* Header */}
      <header className="top-header">
        {/* Hamburger (mobile only) */}
        <button className="hamburger-btn" onClick={() => setDrawerOpen(true)}>
          <Menu size={24} />
        </button>

        <div className="logo">
          <Eye size={28} />
          <span>Optuce</span>
        </div>

        <div className="app-title">Optique &amp; Gestion</div>

        <div className="actions">
          {/* Search - hidden on mobile via CSS */}
          <div className="header-search">
            <Search size={16} color="#94a3b8" />
            <input type="text" placeholder="Recherche rapide..." style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', fontSize: '0.85rem', width: '150px' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.15)', padding: '0.2rem 0.4rem', borderRadius: '6px', fontSize: '0.7rem', color: '#cbd5e1', fontWeight: 'bold', letterSpacing: '0.5px', marginLeft: '0.5rem' }}>
              ⌘K
            </div>
          </div>

          {/* Date - hidden on mobile via CSS */}
          <span className="header-date">{currentDate} • {currentTime}</span>

          {/* Notifications */}
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button className="icon-button" onClick={() => setShowNotifications(!showNotifications)}>
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </button>
            {showNotifications && (
              <div className="premium-card" style={{ position: 'absolute', top: '120%', right: 0, width: '300px', zIndex: 100, padding: 0, overflow: 'hidden', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', fontWeight: 600, color: '#0f172a' }}>Notifications</div>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {[
                    { title: 'Stock faible : Monture Ray-Ban', desc: 'Il ne reste que 2 unités en stock.', time: 'Il y a 10 min' },
                    { title: 'Nouvelle commande atelier', desc: 'La commande CMD-2026-045 est prête.', time: 'Il y a 1 heure' },
                    { title: 'Rendez-vous client', desc: 'M. Benali est attendu pour la livraison.', time: 'Il y a 2 heures' },
                  ].map((n, i) => (
                    <div key={i} style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }} className="hover-item">
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>{n.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{n.desc}</div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.5rem' }}>{n.time}</div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '0.75rem', textAlign: 'center', background: '#f8fafc', borderTop: '1px solid #f1f5f9', fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent)', cursor: 'pointer' }}>
                  Voir toutes les notifications
                </div>
              </div>
            )}
          </div>

          <button className="icon-button"><Settings size={20} /></button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem' }}>
            <div className="user-avatar">A</div>
            <button className="icon-button" title="Déconnexion" onClick={() => { localStorage.removeItem('optuce_auth'); window.location.href = '/'; }}>
              <LogOut size={20} color="#ef4444" />
            </button>
          </div>
        </div>
      </header>

      {/* ─── Desktop Navigation ─── */}
      <div className="nav-wrapper">
        <nav className="main-nav">
          <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
            <BarChart2 /> Tableau de Bord
          </NavLink>
          <NavLink to="/caisse" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <ShoppingCart /> Commande
          </NavLink>
          <NavLink to="/medical" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <FileText /> Clients
          </NavLink>
          <div className="nav-dropdown-container">
            <div className={`nav-item${isStockActive ? ' active' : ''}`}>
              <Package /> Stock
            </div>
            <div className="nav-dropdown">
              <NavLink to="/stocks/montures" className={({ isActive }) => `dropdown-item${isActive ? ' dropdown-active' : ''}`}><Glasses size={16} color="#0f172a" /> Montures</NavLink>
              <NavLink to="/stocks/verres" className={({ isActive }) => `dropdown-item${isActive ? ' dropdown-active' : ''}`}><Circle size={16} color="#0f172a" /> Verres Matrices</NavLink>
              <NavLink to="/stocks/lentilles" className={({ isActive }) => `dropdown-item${isActive ? ' dropdown-active' : ''}`}><Package size={16} color="#0f172a" /> Lentilles &amp; Produits</NavLink>
            </div>
          </div>
          <NavLink to="/atelier" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Wrench /> Atelier
          </NavLink>
          <NavLink to="/achats" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Truck /> Achats
          </NavLink>
          <NavLink to="/crm" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Users /> Fidélisation &amp; CRM
          </NavLink>
          <NavLink to="/stats" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <BarChart2 /> Statistiques
          </NavLink>
          <div className="nav-dropdown-container">
            <div className={`nav-item${isParamsActive ? ' active' : ''}`}>
              <Settings /> Paramètres
            </div>
            <div className="nav-dropdown">
              <NavLink to="/parametres/fournisseurs" className={({ isActive }) => `dropdown-item${isActive ? ' dropdown-active' : ''}`}><Building size={16} color="#0f172a" /> Fournisseurs</NavLink>
              <NavLink to="/parametres/charges" className={({ isActive }) => `dropdown-item${isActive ? ' dropdown-active' : ''}`}><DollarSign size={16} color="#0f172a" /> Charges</NavLink>
              <NavLink to="/parametres/marques" className={({ isActive }) => `dropdown-item${isActive ? ' dropdown-active' : ''}`}><Tag size={16} color="#0f172a" /> Marques</NavLink>
              <NavLink to="/parametres/categories" className={({ isActive }) => `dropdown-item${isActive ? ' dropdown-active' : ''}`}><Layers size={16} color="#0f172a" /> Catégories</NavLink>
            </div>
          </div>
        </nav>
      </div>

      {/* ─── Mobile Overlay ─── */}
      <div className={`mobile-overlay${drawerOpen ? ' open' : ''}`} onClick={() => setDrawerOpen(false)} />

      {/* ─── Mobile Drawer ─── */}
      <div className={`mobile-drawer${drawerOpen ? ' open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="mobile-drawer-logo">
            <Eye size={24} /> Optuce
          </div>
          <button onClick={() => setDrawerOpen(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', padding: '0.5rem', borderRadius: '8px !important', display: 'flex' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
          <NavLink to="/" className={navLinkClass} end><BarChart2 size={18} /> Tableau de Bord</NavLink>
          <NavLink to="/caisse" className={navLinkClass}><ShoppingCart size={18} /> Commande</NavLink>
          <NavLink to="/medical" className={navLinkClass}><FileText size={18} /> Clients</NavLink>

          {/* Stock Section */}
          <div>
            <div className={`mobile-nav-item${isStockActive ? ' active' : ''}`} onClick={() => setStockExpanded(!stockExpanded)} style={{ justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Package size={18} /> Stock</span>
              {stockExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
            {stockExpanded && (
              <div style={{ paddingLeft: '0.5rem' }}>
                <NavLink to="/stocks/montures" className={subLinkClass}><Glasses size={15} /> Montures</NavLink>
                <NavLink to="/stocks/verres" className={subLinkClass}><Circle size={15} /> Verres Matrices</NavLink>
                <NavLink to="/stocks/lentilles" className={subLinkClass}><Package size={15} /> Lentilles &amp; Produits</NavLink>
              </div>
            )}
          </div>

          <NavLink to="/atelier" className={navLinkClass}><Wrench size={18} /> Atelier</NavLink>
          <NavLink to="/achats" className={navLinkClass}><Truck size={18} /> Achats</NavLink>
          <NavLink to="/crm" className={navLinkClass}><Users size={18} /> Fidélisation &amp; CRM</NavLink>
          <NavLink to="/stats" className={navLinkClass}><BarChart2 size={18} /> Statistiques</NavLink>

          {/* Paramètres Section */}
          <div>
            <div className={`mobile-nav-item${isParamsActive ? ' active' : ''}`} onClick={() => setParamsExpanded(!paramsExpanded)} style={{ justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Settings size={18} /> Paramètres</span>
              {paramsExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
            {paramsExpanded && (
              <div style={{ paddingLeft: '0.5rem' }}>
                <NavLink to="/parametres/fournisseurs" className={subLinkClass}><Building size={15} /> Fournisseurs</NavLink>
                <NavLink to="/parametres/charges" className={subLinkClass}><DollarSign size={15} /> Charges</NavLink>
                <NavLink to="/parametres/marques" className={subLinkClass}><Tag size={15} /> Marques</NavLink>
                <NavLink to="/parametres/categories" className={subLinkClass}><Layers size={15} /> Catégories</NavLink>
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', marginTop: '1rem' }}>
          <button
            onClick={() => { localStorage.removeItem('optuce_auth'); window.location.href = '/'; }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.85rem 1rem', background: 'rgba(239,68,68,0.1)', border: 'none', color: '#f87171', fontWeight: 600, cursor: 'pointer', borderRadius: '10px !important', fontSize: '0.95rem' }}
          >
            <LogOut size={18} /> Déconnexion
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
