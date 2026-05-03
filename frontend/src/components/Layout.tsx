import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, Eye, Package, Glasses, Droplets,
  ShoppingCart, FileText, Wallet, Shield, Truck, Wrench,
  Settings, LogOut, Bell, Search, Wifi, WifiOff
} from 'lucide-react'
import { useAuthStore } from '../store/auth'
import { useState, useEffect } from 'react'

const navSections = [
  {
    label: 'Principal',
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
      { to: '/patients', icon: Users, label: 'Patients & CRM' },
    ]
  },
  {
    label: 'Stock',
    items: [
      { to: '/stock/montures', icon: Glasses, label: 'Montures' },
      { to: '/stock/verres', icon: Eye, label: 'Verres' },
      { to: '/stock/lentilles', icon: Droplets, label: 'Lentilles' },
    ]
  },
  {
    label: 'Ventes & Caisse',
    items: [
      { to: '/ventes/nouvelle', icon: ShoppingCart, label: 'Caisse / POS' },
      { to: '/ventes', icon: Wallet, label: 'Historique ventes' },
      { to: '/devis', icon: FileText, label: 'Devis proforma' },
      { to: '/caisse/cloture', icon: Package, label: 'Clôture caisse' },
    ]
  },
  {
    label: 'Spécifique DZ',
    items: [
      { to: '/chifa', icon: Shield, label: 'CHIFA / Séc. Sociale' },
    ]
  },
  {
    label: 'Logistique',
    items: [
      { to: '/commandes', icon: Truck, label: 'Commandes verriers' },
      { to: '/sav', icon: Wrench, label: 'SAV & Réparations' },
    ]
  },
]

export default function Layout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [online, setOnline] = useState(navigator.onLine)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [])

  const initials = user
    ? `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? user.username[0]}`.toUpperCase()
    : 'A'

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">👁️</div>
          <div>
            <div className="logo-text">Optuce</div>
            <div className="logo-sub">Gestion Optique</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navSections.map(sec => (
            <div key={sec.label}>
              <div className="nav-section-label">{sec.label}</div>
              {sec.items.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                  end={item.to === '/dashboard'}
                >
                  <item.icon className="nav-icon" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-pill">
            <div className="user-avatar">{initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="user-name">{user?.first_name || user?.username}</div>
              <div className="user-role">{user?.role ?? 'Admin'}</div>
            </div>
            <button
              onClick={() => { logout(); navigate('/login') }}
              className="btn btn-icon"
              style={{ color: 'var(--text-muted)', background: 'none', border: 'none' }}
              title="Déconnexion"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="main-area">
        {!online && (
          <div className="offline-banner">
            <WifiOff size={14} /> Mode Hors-Ligne — Les données seront synchronisées à la reconnexion
          </div>
        )}
        <header className="topbar">
          <div className="topbar-title">
            {/* Title injected by pages */}
          </div>
          <div className="topbar-search">
            <Search size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <input
              placeholder="Rechercher patient, monture..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="topbar-btn" title="Notifications">
            <Bell size={16} />
            <span className="notif-dot" />
          </button>
          {online
            ? <Wifi size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
            : <WifiOff size={16} style={{ color: 'var(--warning)', flexShrink: 0 }} />
          }
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
