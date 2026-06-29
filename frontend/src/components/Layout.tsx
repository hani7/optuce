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
  Search
} from 'lucide-react';

export default function Layout() {
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
          <button className="icon-button">
            <Bell size={20} />
            <span className="notification-badge">3</span>
          </button>
          <button className="icon-button">
            <Settings size={20} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem' }}>
            <div className="user-avatar">
              A
            </div>
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
            Vente & Caisse
          </NavLink>
          <NavLink to="/medical" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <FileText />
            Dossier Médical
          </NavLink>
          <NavLink to="/stocks" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Package />
            Stocks & Inventaire
          </NavLink>
          <NavLink to="/atelier" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Wrench />
            Atelier
          </NavLink>
          <NavLink to="/mutuelles" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <ShieldCheck />
            Mutuelles
          </NavLink>
          <NavLink to="/crm" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Users />
            Fidélisation & CRM
          </NavLink>
          <NavLink to="/stats" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <BarChart2 />
            Statistiques
          </NavLink>
        </nav>
      </div>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
