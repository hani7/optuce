import React from 'react';
import { Package, Search, Plus, Filter } from 'lucide-react';

export default function Stocks() {
  return (
    <div className="premium-card" style={{ minHeight: 'calc(100vh - 160px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem' }}>
          <Package size={28} color="var(--accent)" /> Base de Données & Stocks
        </h2>
        <button className="btn-accent">
          <Plus size={20} /> Ajouter Article
        </button>
      </div>

      {/* Premium Tab Selector */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem', backgroundColor: '#f1f5f9', padding: '0.5rem', borderRadius: '12px', width: 'fit-content' }}>
        <button style={activeTabStyle}>Montures (240)</button>
        <button style={tabStyle}>Verres Matrices (1,204)</button>
        <button style={tabStyle}>Lentilles & Produits (56)</button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#f8fafc', padding: '0.85rem 1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)', width: '400px', transition: 'all 0.2s', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
          <Search size={20} color="var(--text-secondary)" />
          <input type="text" placeholder="Rechercher par marque, modèle ou code-barres..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.95rem' }} />
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 1.25rem', backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, color: 'var(--text-secondary)' }}>
          <Filter size={18} /> Filtres
        </button>
      </div>

      <div style={{ borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid var(--border-color)' }}>
              <th style={thStyle}>Réf / Marque</th>
              <th style={thStyle}>Modèle</th>
              <th style={thStyle}>Spécifications</th>
              <th style={thStyle}>Stock</th>
              <th style={thStyle}>Prix de Vente</th>
              <th style={thStyle}>Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr className="table-row">
              <td style={tdStyle}>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem' }}>Ray-Ban</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>#RB-WAY-001</div>
              </td>
              <td style={tdStyle}>Wayfarer Classic</td>
              <td style={tdStyle}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={badgeGray}>Unisexe</span>
                  <span style={badgeGray}>Noir</span>
                  <span style={badgeGray}>50-22</span>
                </div>
              </td>
              <td style={tdStyle}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>12</span>
              </td>
              <td style={tdStyle}>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>15,000 DZD</span>
              </td>
              <td style={tdStyle}>
                <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 700 }}>En Stock</span>
              </td>
            </tr>
            <tr className="table-row">
              <td style={tdStyle}>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem' }}>Dior</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>#DR-STE-042</div>
              </td>
              <td style={tdStyle}>Stellaire 1</td>
              <td style={tdStyle}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={badgeGray}>Femme</span>
                  <span style={badgeGray}>Or</span>
                  <span style={badgeGray}>59-18</span>
                </div>
              </td>
              <td style={tdStyle}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ef4444' }}>2</span>
              </td>
              <td style={tdStyle}>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>32,000 DZD</span>
              </td>
              <td style={tdStyle}>
                <span style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 700 }}>Stock Critique</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

const tabStyle = { padding: '0.75rem 1.5rem', border: 'none', background: 'transparent', color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem', borderRadius: '8px', transition: 'all 0.2s' };
const activeTabStyle = { ...tabStyle, color: '#0f172a', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' };
const thStyle = { padding: '1.25rem 1.5rem', textAlign: 'left' as const, color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' as const, letterSpacing: '0.5px' };
const tdStyle = { padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', verticalAlign: 'middle' as const };
const badgeGray = { backgroundColor: '#f1f5f9', color: '#475569', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 };
