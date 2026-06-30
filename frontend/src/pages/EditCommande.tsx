import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Package, User, CheckCircle, Clock, XCircle, CreditCard, Receipt, MessageCircle } from 'lucide-react';

export default function EditCommande() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [commande, setCommande] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [statut, setStatut] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchCommande();
  }, [id]);

  const fetchCommande = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`https://api.optuce.baitul.tech/api/ventes/${id}/`);
      if (res.ok) {
        const data = await res.json();
        setCommande(data);
        setStatut(data.statut);
        setNotes(data.notes || '');
      } else {
        alert("Commande introuvable");
        navigate('/caisse');
      }
    } catch (err) {
      console.error(err);
      alert("Erreur de connexion au serveur");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`https://api.optuce.baitul.tech/api/ventes/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          statut,
          notes
        })
      });

      if (res.ok) {
        alert("Commande mise à jour avec succès !");
        navigate('/caisse');
      } else {
        const err = await res.json();
        alert("Erreur lors de la sauvegarde : " + JSON.stringify(err));
      }
    } catch (err) {
      console.error(err);
      alert("Erreur de connexion au serveur");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Loader2 className="spin" size={40} color="var(--accent)" />
      </div>
    );
  }

  if (!commande) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem' }}>
        <XCircle size={48} color="#ef4444" />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>Commande introuvable</h2>
        <p style={{ color: 'var(--text-secondary)' }}>La commande demandée n'existe pas ou le serveur est inaccessible.</p>
        <button onClick={() => navigate('/caisse')} className="btn-primary" style={{ padding: '0.75rem 1.5rem', marginTop: '1rem' }}>
          Retour à la caisse
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate('/caisse')} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.5rem', cursor: 'pointer', display: 'flex' }}>
            <ArrowLeft size={20} color="#475569" />
          </button>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Commande {commande.numero}
            </h1>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Créée le {new Date(commande.date).toLocaleString('fr-FR')}
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', opacity: isSaving ? 0.7 : 1 }}
        >
          {isSaving ? <Loader2 size={18} className="spin" /> : <Save size={18} />}
          Enregistrer les modifications
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Lignes de commande */}
          <div className="premium-card">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Package size={20} color="var(--accent)" /> Articles de la commande
            </h3>
            
            {commande.lignes && commande.lignes.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {commande.lignes.map((ligne: any, idx: number) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: idx < commande.lignes.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '1rem' }}>{ligne.designation}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                        {ligne.type_article} • Réf: {ligne.reference || '-'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                        {(ligne.prix_unitaire * ligne.quantite).toLocaleString('fr-FR')} DZD
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        {ligne.quantite} x {ligne.prix_unitaire} DZD
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                Aucun article dans cette commande
              </div>
            )}
          </div>
          
          {/* Notes */}
          <div className="premium-card">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Notes / Remarques</h3>
            <textarea 
              className="premium-input"
              style={{ minHeight: '120px', resize: 'vertical' }}
              placeholder="Ajouter une note..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Status & Client */}
          <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Statut de la commande</label>
              <select 
                className="premium-input"
                style={{ fontWeight: 600, color: statut === 'finalisee' ? '#10b981' : statut === 'annulee' ? '#ef4444' : '#f59e0b' }}
                value={statut}
                onChange={(e) => setStatut(e.target.value)}
              >
                <option value="brouillon">En cours (Brouillon)</option>
                <option value="finalisee">Finalisée</option>
                <option value="annulee">Annulée</option>
              </select>
            </div>
            
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
                <User size={18} color="#64748b" /> Informations Client
              </h4>
              {commande.patient ? (
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0f172a' }}>
                    {commande.patient_nom || 'Client sans nom'}
                  </div>
                  {commande.patient_telephone && (
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                      📞 {commande.patient_telephone}
                    </div>
                  )}
                  <button 
                    style={{ 
                      marginTop: '1rem', 
                      width: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '0.5rem', 
                      padding: '0.75rem', 
                      background: '#10b981', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '8px', 
                      cursor: 'pointer', 
                      fontWeight: 600 
                    }}
                    onClick={() => {
                      if(commande.patient_telephone) {
                        alert(`Notification (SMS/WhatsApp) prête à être envoyée à ${commande.patient_telephone}`);
                      } else {
                        alert("Ce client n'a pas de numéro de téléphone.");
                      }
                    }}
                  >
                    <MessageCircle size={18} />
                    Envoyer Notification
                  </button>
                </div>
              ) : (
                <div style={{ background: '#fffbeb', color: '#d97706', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600 }}>
                  Client anonyme (Passager)
                </div>
              )}
            </div>
          </div>
          
          {/* Totals */}
          <div className="premium-card" style={{ background: 'linear-gradient(to bottom right, #0f172a, #1e293b)', color: 'white' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e2e8f0' }}>
              <Receipt size={20} /> Récapitulatif
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                <span>Sous-total</span>
                <span>{parseFloat(commande.sous_total).toLocaleString('fr-FR')} DZD</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                <span>Remise</span>
                <span style={{ color: '#f87171' }}>-{parseFloat(commande.remise_montant).toLocaleString('fr-FR')} DZD</span>
              </div>
              
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '0.5rem 0' }}></div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800 }}>
                <span>Total TTC</span>
                <span style={{ color: '#38bdf8' }}>{parseFloat(commande.total_ttc).toLocaleString('fr-FR')} DZD</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', marginTop: '0.5rem' }}>
                <span>Déjà payé</span>
                <span style={{ color: '#34d399' }}>{parseFloat(commande.total_paye).toLocaleString('fr-FR')} DZD</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 700, color: parseFloat(commande.reste_a_payer) > 0 ? '#fbbf24' : '#34d399' }}>
                <span>Reste à payer</span>
                <span>{parseFloat(commande.reste_a_payer).toLocaleString('fr-FR')} DZD</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
