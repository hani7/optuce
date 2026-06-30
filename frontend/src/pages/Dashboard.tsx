import React, { useState, useEffect } from 'react';
import { BarChart2, TrendingUp, DollarSign, Package, Calendar, Filter, Loader2, AlertCircle, Receipt } from 'lucide-react';

export default function Dashboard() {
  const [filterType, setFilterType] = useState('mois');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [statsCA, setStatsCA] = useState<any>(null);
  const [statsMarges, setStatsMarges] = useState<any>(null);
  const [statsTop, setStatsTop] = useState<any>(null);

  const fetchData = () => {
    setIsLoading(true);
    let params = `?periode=${filterType}`;
    if (filterType === 'periode' && dateDebut && dateFin) {
      params = `?debut=${dateDebut}&fin=${dateFin}`;
    }

    Promise.all([
      fetch(`http://127.0.0.1:8000/api/statistiques/ca/${params}`).then(res => res.json()),
      fetch(`http://127.0.0.1:8000/api/statistiques/marges/${params}`).then(res => res.json()),
      fetch(`http://127.0.0.1:8000/api/statistiques/top-ventes/${params}`).then(res => res.json())
    ])
    .then(([caData, margesData, topData]) => {
      setStatsCA(caData);
      setStatsMarges(margesData);
      setStatsTop(topData);
    })
    .catch(console.error)
    .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType]);

  const formatMoney = (val: number) => {
    return (val || 0).toLocaleString('fr-FR') + ' DZD';
  };

  if (isLoading || !statsCA) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Loader2 size={48} color="var(--accent)" className="spin" />
      </div>
    );
  }

  // Calcul pour le graphique
  const journalier = statsCA.ca_journalier || [];
  // Ne garder que les 14 derniers jours pour l'affichage barres pour que ça ne soit pas trop compressé
  const recentDays = journalier.slice(-14);
  const maxCa = Math.max(...recentDays.map((d: any) => parseFloat(d.ca_facture)), 1); // Eviter div par 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* Top Widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        <Widget title="Chiffre d'Affaires du Jour" value={formatMoney(statsCA.kpis.ca_aujourd_hui)} icon={<DollarSign color="white" size={32} />} bgColor="#ecfdf5" />
        <Widget title={filterType === 'annee' ? "CA Annuel" : "CA Mensuel"} value={formatMoney(filterType === 'annee' ? statsCA.kpis.ca_annee : statsCA.kpis.ca_mois)} icon={<TrendingUp color="white" size={32} />} bgColor="#eff6ff" />
        <Widget title="Marge Nette Globale" value={`${statsMarges.taux_marge_global}%`} icon={<BarChart2 color="white" size={32} />} bgColor="#f5f3ff" />
        <Widget title="Ventes Finalisées (Mois)" value={statsCA.kpis.nb_ventes_mois.toString()} icon={<Package color="white" size={32} />} bgColor="#fffbeb" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Evolution Chart */}
        <div className="premium-card" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
           <h3 style={{ marginBottom: '2.5rem', fontSize: '1.25rem' }}>Évolution du Chiffre d'Affaires (14 derniers jours facturés)</h3>
           
           <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '0.5rem', padding: '0 1rem', overflowX: 'hidden' }}>
             {recentDays.map((d: any, idx: number) => {
               const heightPct = Math.max((parseFloat(d.ca_facture) / maxCa) * 100, 5);
               const isMax = parseFloat(d.ca_facture) === maxCa;
               return (
                 <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', height: '100%', justifyContent: 'flex-end', group: 'true' }}>
                   <span style={{ fontSize: '0.7rem', fontWeight: 700, color: isMax ? 'var(--accent)' : '#94a3b8', transform: 'rotate(-45deg)', transformOrigin: 'left bottom', marginBottom: '10px' }}>
                     {parseFloat(d.ca_facture).toLocaleString('fr-FR')}
                   </span>
                   <div 
                    title={`${d.jour} : ${d.ca_facture} DZD`}
                    style={{ 
                      width: '100%', 
                      backgroundColor: isMax ? 'var(--accent)' : '#cbd5e1', 
                      height: `${heightPct}%`, 
                      borderRadius: '4px 4px 0 0', 
                      transition: 'height 0.5s ease-out, background 0.3s',
                      boxShadow: isMax ? '0 0 15px rgba(59,130,246,0.3)' : 'none',
                      cursor: 'pointer'
                    }} 
                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--accent-hover)' }}
                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = isMax ? 'var(--accent)' : '#cbd5e1' }}
                   />
                 </div>
               )
             })}
           </div>
           
           <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem 1rem 0', color: 'var(--text-secondary)', fontSize: '0.8rem', borderTop: '1px solid #f1f5f9', marginTop: '1rem' }}>
             <span>{recentDays.length > 0 ? new Date(recentDays[0].jour).toLocaleDateString('fr-FR') : ''}</span>
             <span>Aujourd'hui</span>
           </div>
        </div>
        
        {/* Top Marques */}
        <div className="premium-card">
           <h3 style={{ marginBottom: '2.5rem', fontSize: '1.25rem' }}>Top Ventes Montures</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             {statsTop.top_marques_montures?.length === 0 && (
               <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>Aucune donnée</div>
             )}
             {statsTop.top_marques_montures?.map((marque: any, idx: number) => {
               const maxCaMarque = parseFloat(statsTop.top_marques_montures[0].ca_total);
               const pct = (parseFloat(marque.ca_total) / maxCaMarque) * 100;
               return (
                 <div key={idx}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                     <span style={{ fontWeight: 600 }}>{marque.marque_nom}</span> 
                     <strong style={{ color: idx === 0 ? 'var(--accent)' : 'var(--text-secondary)' }}>
                       {parseFloat(marque.ca_total).toLocaleString('fr-FR')} DZD
                     </strong>
                   </div>
                   <div style={{ width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                     <div style={{ width: `${pct}%`, height: '100%', background: idx === 0 ? 'var(--accent-gradient)' : '#94a3b8', borderRadius: '4px' }}></div>
                   </div>
                 </div>
               )
             })}
           </div>
        </div>
      </div>

      {/* Third row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        <div className="premium-card">
          <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle color="#ef4444" size={20} /> Santé Financière
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Total Créances Clients</span>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#ef4444' }}>{formatMoney(statsCA.kpis.total_creances_clients)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Panier Moyen (Mois)</span>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#10b981' }}>{formatMoney(statsCA.kpis.panier_moyen_mois)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Marge Nette Absolue</span>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#8b5cf6' }}>{formatMoney(statsMarges.marge_nette)}</span>
            </div>
          </div>
        </div>

        <div className="premium-card" style={{ gridColumn: 'span 2' }}>
           <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <Receipt color="var(--accent)" size={20} /> Types de Verres les plus vendus
           </h3>
           <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.75rem', fontWeight: 600 }}>Indice</th>
                <th style={{ padding: '0.75rem', fontWeight: 600 }}>Traitement</th>
                <th style={{ padding: '0.75rem', fontWeight: 600, textAlign: 'right' }}>Quantité Vendue</th>
              </tr>
            </thead>
            <tbody>
              {statsTop.top_verres?.length === 0 && (
                <tr><td colSpan={3} style={{ padding: '1rem', textAlign: 'center', color: '#94a3b8' }}>Aucune donnée</td></tr>
              )}
              {statsTop.top_verres?.map((tv: any, idx: number) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem 0.75rem', fontWeight: 600 }}>{tv.indice || '-'}</td>
                  <td style={{ padding: '1rem 0.75rem', color: 'var(--text-secondary)' }}>{tv.traitement || 'Standard'}</td>
                  <td style={{ padding: '1rem 0.75rem', textAlign: 'right', fontWeight: 800, color: 'var(--accent)' }}>{tv.nb_vendus}</td>
                </tr>
              ))}
            </tbody>
           </table>
        </div>
      </div>
    </div>
  );
}

function Widget({ title, value, icon, bgColor }: { title: string, value: string, icon: React.ReactNode, bgColor: string }) {
  // Les couleurs demandées par l'utilisateur (fond: #f1f5f9, icone: #1eb6e7)
  return (
    <div className="premium-card hover-item" style={{ background: '#f1f5f9', borderLeft: '4px solid #1eb6e7', display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
      <div style={{ background: '#1eb6e7', padding: '1rem', borderRadius: '12px' }}>
        {icon}
      </div>
      <div>
        <div style={{ color: '#475569', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{value}</div>
      </div>
    </div>
  )
}
