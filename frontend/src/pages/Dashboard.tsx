import { useEffect, useState } from 'react'
import { TrendingUp, Users, ShoppingCart, Wallet, AlertTriangle, Package } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { ventesApi, monturesApi, lentillesApi } from '../api/client'

const GOLD = '#D4AF37'; const BLUE = '#4F8EF7'; const GREEN = '#10B981'; const PURPLE = '#7B5CF0'

const mockWeekly = [
  { jour: 'Lun', ca: 45000 }, { jour: 'Mar', ca: 62000 }, { jour: 'Mer', ca: 38000 },
  { jour: 'Jeu', ca: 71000 }, { jour: 'Ven', ca: 89000 }, { jour: 'Sam', ca: 103000 },
  { jour: 'Dim', ca: 22000 },
]
const mockModes = [
  { name: 'Espèces', value: 55 }, { name: 'CIB', value: 25 },
  { name: 'Dahabia', value: 12 }, { name: 'CHIFA', value: 8 },
]
const PIE_COLORS = [GOLD, BLUE, GREEN, PURPLE]

interface Stats { ca_total: number; nb_ventes: number; panier_moyen: number; encaissements_par_mode: Record<string, number> }

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [alertes, setAlertes] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      ventesApi.stats(),
      monturesApi.stockFaible(),
      lentillesApi.alertes(),
    ]).then(([s, mf, la]) => {
      setStats(s.data)
      setAlertes(mf.data.length + la.data.length)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const kpis = [
    {
      icon: '💰', label: 'CA (30 jours)', color: GOLD,
      bg: 'rgba(212,175,55,0.1)',
      value: stats ? `${(stats.ca_total / 1000).toFixed(0)} k DA` : '— DA',
      change: '+12%', up: true,
    },
    {
      icon: '🛍️', label: 'Ventes (30j)', color: BLUE,
      bg: 'rgba(79,142,247,0.1)',
      value: stats ? `${stats.nb_ventes}` : '—',
      change: '+5%', up: true,
    },
    {
      icon: '📊', label: 'Panier moyen', color: GREEN,
      bg: 'rgba(16,185,129,0.1)',
      value: stats ? `${Math.round(stats.panier_moyen).toLocaleString()} DA` : '— DA',
      change: '+3%', up: true,
    },
    {
      icon: '⚠️', label: 'Alertes stock', color: alertes > 0 ? '#EF4444' : GREEN,
      bg: alertes > 0 ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
      value: `${alertes}`,
      change: alertes > 0 ? 'Action requise' : 'Stock OK', up: alertes === 0,
    },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Tableau de bord</div>
          <div className="page-subtitle">Vue d'ensemble — 30 derniers jours</div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary btn-sm">
            <Package size={14} /> Rapport mensuel
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-grid">
        {kpis.map(k => (
          <div className="kpi-card" key={k.label}>
            <div className="kpi-icon" style={{ background: k.bg, color: k.color }}>
              {k.icon}
            </div>
            <div className="kpi-value" style={{ color: k.color }}>{loading ? <span className="skeleton" style={{ display: 'block', height: 32, width: 120 }} /> : k.value}</div>
            <div className="kpi-label">{k.label}</div>
            <div className={`kpi-change ${k.up ? 'up' : 'down'}`}>
              <TrendingUp size={12} /> {k.change}
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '16px', marginBottom: '20px' }}>
        <div className="chart-card">
          <div className="chart-title">Chiffre d'affaires hebdomadaire</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mockWeekly} barSize={28}>
              <XAxis dataKey="jour" axisLine={false} tickLine={false} tick={{ fill: '#8DA3C0', fontSize: 12 }} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: 'var(--navy-2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13 }}
                formatter={(v: number) => [`${v.toLocaleString()} DA`, 'CA']}
              />
              <Bar dataKey="ca" fill={GOLD} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <div className="chart-title">Modes de paiement</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={mockModes} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                {mockModes.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--navy-2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
            {mockModes.map((m, i) => (
              <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: PIE_COLORS[i], display: 'inline-block' }} />
                {m.name} {m.value}%
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Top marques placeholder */}
        <div className="chart-card">
          <div className="chart-title">Top marques vendues</div>
          {['Ray-Ban', 'Oakley', 'Silhouette', 'Essilor', 'Cartier'].map((m, i) => (
            <div key={m} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', width: 16 }}>{i + 1}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.85rem' }}>
                  <span>{m}</span><span style={{ color: 'var(--text-muted)' }}>{(5 - i) * 12} ventes</span>
                </div>
                <div style={{ height: 4, borderRadius: 99, background: 'var(--glass)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(5 - i) * 18}%`, background: GOLD, borderRadius: 99 }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent ventes */}
        <div className="chart-card">
          <div className="chart-title">Commandes verriers en attente</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { client: 'Ahmed Benali', labo: 'BBGR', jours: 3, statut: 'En fabrication' },
              { client: 'Fatima Kaci', labo: 'Essilor', jours: 5, statut: 'En retard' },
              { client: 'Omar Meziani', labo: 'BBGR', jours: 1, statut: 'Envoyée' },
            ].map(c => (
              <div key={c.client} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px', background: 'var(--glass)', borderRadius: 8 }}>
                <div className="avatar" style={{ background: 'rgba(79,142,247,0.15)', color: BLUE }}>
                  {c.client[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{c.client}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.labo} · J+{c.jours}</div>
                </div>
                <span className={`badge ${c.statut === 'En retard' ? 'badge-danger' : c.statut === 'Envoyée' ? 'badge-info' : 'badge-warning'}`}>
                  {c.statut}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
