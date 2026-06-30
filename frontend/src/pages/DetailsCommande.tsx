import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Receipt, CreditCard, User, Clock, FileText } from 'lucide-react';

export default function DetailsCommande() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vente, setVente] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/ventes/${id}/`)
      .then(res => res.json())
      .then(data => setVente(data))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Chargement des détails...</div>;
  }

  if (!vente) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ color: '#ef4444' }}>Commande introuvable</h2>
        <button onClick={() => navigate('/caisse')} className="btn-primary" style={{ marginTop: '1rem' }}>Retour</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <button onClick={() => navigate('/caisse')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '1rem', fontWeight: 600 }}>
            <ArrowLeft size={18} /> Retour à la liste
          </button>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
            <Receipt color="var(--accent)" size={32} /> Commande {vente.numero}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span style={{ padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center' }}>
            {vente.statut_display || vente.statut}
          </span>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={18} /> Imprimer Facture
          </button>
        </div>
      </div>

      {/* Info Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div className="premium-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ background: '#f1f5f9', padding: '0.75rem', borderRadius: '12px' }}>
              <User size={24} color="#3b82f6" />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Informations Client</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#475569' }}>
            <p style={{ margin: 0 }}><strong>Nom :</strong> {vente.patient_nom || 'Client anonyme'}</p>
            <p style={{ margin: 0 }}><strong>Téléphone :</strong> {vente.patient_telephone || '-'}</p>
          </div>
        </div>

        <div className="premium-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ background: '#f1f5f9', padding: '0.75rem', borderRadius: '12px' }}>
              <Clock size={24} color="#8b5cf6" />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Détails de la Commande</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#475569' }}>
            <p style={{ margin: 0 }}><strong>Date :</strong> {new Date(vente.date).toLocaleString('fr-FR')}</p>
            <p style={{ margin: 0 }}><strong>Type :</strong> {vente.type_document === 'devis' ? 'Devis' : 'Vente Directe'}</p>
          </div>
        </div>
      </div>

      {/* Articles */}
      <div className="premium-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Articles Commandés</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Désignation</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Quantité</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Prix Unitaire</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, textAlign: 'right' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {(vente.lignes || []).map((ligne: any) => (
              <tr key={ligne.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{ligne.designation}</td>
                <td style={{ padding: '1rem 1.5rem' }}>{ligne.quantite}</td>
                <td style={{ padding: '1rem 1.5rem' }}>{parseFloat(ligne.prix_unitaire).toLocaleString('fr-FR')} DZD</td>
                <td style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 700 }}>{parseFloat(ligne.total_ligne).toLocaleString('fr-FR')} DZD</td>
              </tr>
            ))}
            {(!vente.lignes || vente.lignes.length === 0) && (
              <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Aucun article</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Financement */}
      <div className="premium-card" style={{ maxWidth: '500px', alignSelf: 'flex-end', width: '100%' }}>
        <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <CreditCard color="#10b981" size={24} /> Résumé Financier
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '1.05rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span>Sous-total</span>
            <span>{parseFloat(vente.sous_total || '0').toLocaleString('fr-FR')} DZD</span>
          </div>
          {parseFloat(vente.remise_montant) > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ef4444' }}>
              <span>Remise</span>
              <span>-{parseFloat(vente.remise_montant).toLocaleString('fr-FR')} DZD</span>
            </div>
          )}
          
          <div style={{ borderTop: '2px solid #f1f5f9', margin: '0.5rem 0' }}></div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
            <span>Total TTC</span>
            <span>{parseFloat(vente.total_ttc || '0').toLocaleString('fr-FR')} DZD</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontWeight: 600, marginTop: '1rem' }}>
            <span>Montant Payé</span>
            <span>{parseFloat(vente.total_paye || '0').toLocaleString('fr-FR')} DZD</span>
          </div>
          
          {parseFloat(vente.reste_a_payer) > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ef4444', fontWeight: 700, marginTop: '0.5rem', background: '#fee2e2', padding: '0.75rem', borderRadius: '8px' }}>
              <span>Reste à Payer</span>
              <span>{parseFloat(vente.reste_a_payer).toLocaleString('fr-FR')} DZD</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
