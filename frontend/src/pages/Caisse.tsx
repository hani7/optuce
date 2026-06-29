import React, { useState, useEffect } from 'react';
import { Search, CreditCard, Banknote, Receipt, X, Loader2, Plus, Minus, ArrowRight, Glasses, Eye, Briefcase, List, ArrowLeft, User, Phone } from 'lucide-react';

interface Article {
  id: number;
  designation: string;
  prix_vente: number;
  type: string;
  categorie_nom?: string;
  stock?: number;
}

interface CartItem extends Article {
  quantite: number;
  remise: number;
}

interface Categorie {
  id: number;
  nom: string;
}

interface Patient {
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
}

export default function Caisse() {
  // View State
  const [viewMode, setViewMode] = useState<'list' | 'wizard'>('list');
  const [ventes, setVentes] = useState<any[]>([]);
  const [isLoadingVentes, setIsLoadingVentes] = useState(false);

  // Wizard State
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  
  // Data State
  const [items, setItems] = useState<Article[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Client State
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [newClient, setNewClient] = useState({ nom: '', prenom: '', telephone: '', date_naissance: '' });
  const [isSubmittingClient, setIsSubmittingClient] = useState(false);

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'especes' | 'cib' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/stocks/categories/')
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : data.results || []))
      .catch(console.error);
  }, []);

  // Fetch Ventes when in list mode
  useEffect(() => {
    if (viewMode === 'list') {
      setIsLoadingVentes(true);
      fetch('http://127.0.0.1:8000/api/ventes/')
        .then(res => res.json())
        .then(data => setVentes(Array.isArray(data) ? data : data.results || []))
        .catch(console.error)
        .finally(() => setIsLoadingVentes(false));
    }
  }, [viewMode]);

  // Fetch items when step, category, or search changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchItems();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [currentStep, activeCategoryId, searchQuery]);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      if (currentStep === 3) {
        // Fetch Patients
        let url = `http://127.0.0.1:8000/api/patients/?`;
        if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;
        const res = await fetch(url);
        const data = await res.json();
        setPatients(Array.isArray(data) ? data : (data.results || []));
      } else {
        // Fetch Stocks
        const endpoint = currentStep === 1 ? 'montures' : 'verres';
        let url = `http://127.0.0.1:8000/api/stocks/${endpoint}/?`;
        if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;
        if (activeCategoryId) url += `categorie=${activeCategoryId}&`;

        const res = await fetch(url);
        const data = await res.json();
        const results = Array.isArray(data) ? data : (data.results || []);
        
        const formatted = results.map((item: any) => ({
          id: item.id,
          designation: (item.modele ? item.modele : item.designation) || `${item.marque_nom || item.marque?.nom || ''} ${item.reference || ''}`.trim() || 'Article Inconnu',
          prix_vente: parseFloat(item.prix_vente || item.prix || 0),
          type: currentStep === 1 ? 'monture' : 'verre_od',
          categorie_nom: item.categorie_nom,
          stock: item.stock
        }));
        setItems(formatted);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClientFourniMonture = () => {
    addToCart({
      id: 0,
      designation: "Monture fournie par le client",
      prix_vente: 0,
      type: "monture"
    });
    goToStep(2);
  };

  const handleItemSelect = (item: Article) => {
    addToCart(item);
    if (currentStep === 1) {
      goToStep(2);
    } else if (currentStep === 2) {
      goToStep(3);
    }
  };

  const goToStep = (step: 1 | 2 | 3) => {
    setCurrentStep(step);
    setActiveCategoryId(null);
    setSearchQuery('');
  };

  const handleCreatePatient = async () => {
    if (!newClient.nom || !newClient.prenom) {
      alert("Le nom et le prénom sont obligatoires.");
      return;
    }
    setIsSubmittingClient(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/patients/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: newClient.nom,
          prenom: newClient.prenom,
          telephone: newClient.telephone,
          date_naissance: newClient.date_naissance || null
        })
      });
      if (!res.ok) throw new Error('Erreur lors de la création du client');
      const data = await res.json();
      setSelectedPatient(data);
      setShowNewClientModal(false);
      setNewClient({ nom: '', prenom: '', telephone: '', date_naissance: '' });
      fetchItems(); // refresh list just in case
    } catch (error) {
      alert("Une erreur est survenue lors de la création.");
    } finally {
      setIsSubmittingClient(false);
    }
  };

  const addToCart = (article: Article) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === article.id && item.type === article.type);
      if (existing) {
        return prev.map(item => 
          item.id === article.id && item.type === article.type 
            ? { ...item, quantite: item.quantite + 1 } 
            : item
        );
      }
      return [...prev, { ...article, quantite: 1, remise: 0 }];
    });
  };

  const updateQuantity = (id: number, type: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id && item.type === type) {
        const newQ = Math.max(1, item.quantite + delta);
        return { ...item, quantite: newQ };
      }
      return item;
    }));
  };

  const removeFromCart = (id: number, type: string) => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.type === type)));
  };

  const sousTotal = cartItems.reduce((acc, item) => acc + (item.prix_vente * item.quantite), 0);
  const netAPayer = Math.max(0, sousTotal - discount);

  const validerTicket = async () => {
    if (cartItems.length === 0) {
      alert("Le panier est vide.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const lignes = cartItems.map(item => {
        const payload: any = {
          type_article: item.type,
          designation: item.designation,
          quantite: item.quantite,
          prix_unitaire: item.prix_vente,
          remise: item.remise
        };
        if (item.type === 'monture' && item.id !== 0) payload.monture = item.id;
        if (item.type.startsWith('verre')) payload.verre = item.id;
        if (item.type === 'lentille') payload.lentille = item.id;
        if (item.type === 'accessoire') payload.accessoire = item.id;
        return payload;
      });

      const ventePayload: any = {
        type_document: 'vente',
        statut: 'finalisee',
        remise_montant: discount,
        lignes: lignes
      };

      if (selectedPatient) {
        ventePayload.patient = selectedPatient.id;
      }

      const venteRes = await fetch('http://127.0.0.1:8000/api/ventes/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ventePayload)
      });

      if (!venteRes.ok) {
        const errData = await venteRes.text();
        throw new Error(`Erreur vente: ${errData}`);
      }
      
      const venteData = await venteRes.json();

      if (paymentMethod && netAPayer > 0) {
        const encRes = await fetch('http://127.0.0.1:8000/api/ventes/encaissements/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            vente: venteData.id,
            mode: paymentMethod,
            montant: netAPayer,
            est_acompte: false
          })
        });
        if (!encRes.ok) {
           alert(`Vente créée (Ticket ${venteData.numero}) mais l'encaissement a échoué.`);
           return;
        }
      }

      alert(`Ticket validé avec succès ! Numéro: ${venteData.numero}`);
      setCartItems([]);
      setDiscount(0);
      setPaymentMethod(null);
      setSelectedPatient(null);
      setCurrentStep(1);
      setViewMode('list');
      
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue lors de la validation du ticket.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (viewMode === 'list') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <List color="var(--accent)" size={32} /> Commandes & Ventes
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>Historique des commandes et gestion de la caisse.</p>
          </div>
          <button onClick={() => setViewMode('wizard')} className="btn-primary" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
            <Plus size={20} /> Nouvelle Commande
          </button>
        </div>

        <div className="premium-card" style={{ padding: 0, overflow: 'hidden' }}>
          {isLoadingVentes ? (
            <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}><Loader2 className="spin" size={32} color="var(--accent)" /></div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>N° Ticket</th>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Date</th>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Statut</th>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Montant Total</th>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ventes.map((vente, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'white'}>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--accent)' }}>{vente.numero}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>{new Date(vente.date_creation).toLocaleString('fr-FR')}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, background: '#dcfce7', color: '#15803d' }}>
                          {vente.statut}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: 'bold' }}>{parseFloat(vente.total_ttc || '0').toLocaleString('fr-FR')} DZD</td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                        <button style={{ background: 'transparent', border: 'none', color: '#3b82f6', cursor: 'pointer', fontWeight: 600 }}>Détails</button>
                      </td>
                    </tr>
                  ))}
                  {ventes.length === 0 && (
                     <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Aucune commande trouvée.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: 'calc(100vh - 120px)' }}>
        <button 
          onClick={() => setViewMode('list')} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 'bold' }}
        >
          <ArrowLeft size={18} /> Retour à la liste
        </button>
        <div style={{ display: 'flex', gap: '2rem', flex: 1, overflow: 'hidden' }}>
        
        {/* Left side: Wizard (80%) */}
        <div className="premium-card" style={{ flex: 4, display: 'flex', flexDirection: 'column', gap: '1.5rem', overflow: 'hidden' }}>
          
          {/* Wizard Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <div 
                onClick={() => goToStep(1)} 
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', opacity: currentStep === 1 ? 1 : 0.5, fontWeight: currentStep === 1 ? 'bold' : 'normal', color: currentStep === 1 ? 'var(--accent)' : 'inherit' }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: currentStep === 1 ? 'var(--accent)' : '#e2e8f0', color: currentStep === 1 ? 'white' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>1</div>
                <span style={{ fontSize: '1.2rem' }}>Montures</span>
              </div>
              <ArrowRight color="#cbd5e1" />
              <div 
                onClick={() => goToStep(2)} 
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', opacity: currentStep === 2 ? 1 : 0.5, fontWeight: currentStep === 2 ? 'bold' : 'normal', color: currentStep === 2 ? 'var(--accent)' : 'inherit' }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: currentStep === 2 ? 'var(--accent)' : '#e2e8f0', color: currentStep === 2 ? 'white' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>2</div>
                <span style={{ fontSize: '1.2rem' }}>Verres</span>
              </div>
              <ArrowRight color="#cbd5e1" />
              <div 
                onClick={() => goToStep(3)} 
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', opacity: currentStep === 3 ? 1 : 0.5, fontWeight: currentStep === 3 ? 'bold' : 'normal', color: currentStep === 3 ? 'var(--accent)' : 'inherit' }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: currentStep === 3 ? 'var(--accent)' : '#e2e8f0', color: currentStep === 3 ? 'white' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>3</div>
                <span style={{ fontSize: '1.2rem' }}>Client</span>
              </div>
            </div>
            
            {currentStep === 1 && (
              <button 
                onClick={handleClientFourniMonture}
                className="btn-accent" 
                style={{ background: '#f59e0b', fontSize: '0.95rem', padding: '0.6rem 1.25rem' }}
              >
                <Briefcase size={18} /> Client fourni sa monture
              </button>
            )}
          </div>

          {/* Categories Tabs (only for Montures and Verres) */}
          {currentStep !== 3 && (
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              <button 
                onClick={() => setActiveCategoryId(null)}
                style={{ padding: '0.5rem 1.25rem', borderRadius: '20px', border: '1px solid', borderColor: activeCategoryId === null ? 'var(--accent)' : 'var(--border-color)', background: activeCategoryId === null ? 'rgba(59, 130, 246, 0.1)' : 'transparent', color: activeCategoryId === null ? 'var(--accent)' : 'var(--text-secondary)', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                Toutes
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setActiveCategoryId(cat.id)}
                  style={{ padding: '0.5rem 1.25rem', borderRadius: '20px', border: '1px solid', borderColor: activeCategoryId === cat.id ? 'var(--accent)' : 'var(--border-color)', background: activeCategoryId === cat.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent', color: activeCategoryId === cat.id ? 'var(--accent)' : 'var(--text-secondary)', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  {cat.nom}
                </button>
              ))}
            </div>
          )}

          {/* Search Bar */}
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              className="premium-input"
              placeholder={`Rechercher parmi les ${currentStep === 1 ? 'montures' : currentStep === 2 ? 'verres' : 'clients'}...`} 
              style={{ paddingLeft: '3rem' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={20} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          {/* Grid of Items or Patients */}
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
            {isLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--accent)' }}>
                <Loader2 size={40} className="spin" />
              </div>
            ) : currentStep === 3 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button 
                  onClick={() => setShowNewClientModal(true)} 
                  className="btn-primary" 
                  style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', marginBottom: '1rem' }}
                >
                  <Plus size={20} /> Nouveau Client
                </button>
                {patients.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '2rem' }}>
                    Aucun client trouvé.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                    {patients.map(p => (
                      <div 
                        key={p.id} 
                        onClick={() => setSelectedPatient(p)} 
                        style={{ border: selectedPatient?.id === p.id ? '2px solid var(--accent)' : '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem', cursor: 'pointer', background: selectedPatient?.id === p.id ? '#eff6ff' : 'white', transition: 'all 0.2s', boxShadow: selectedPatient?.id === p.id ? 'var(--shadow-md)' : 'none' }}
                      >
                        <div style={{ fontWeight: 600, fontSize: '1.1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <User size={18} color={selectedPatient?.id === p.id ? 'var(--accent)' : '#94a3b8'} />
                          {p.prenom} {p.nom}
                        </div>
                        {p.telephone && (
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Phone size={14} /> {p.telephone}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : items.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '2rem' }}>
                Aucun résultat trouvé.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {items.map(item => (
                  <div 
                    key={item.id} 
                    onClick={() => handleItemSelect(item)}
                    style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1rem', cursor: 'pointer', transition: 'all 0.2s', background: 'white', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{ height: '100px', background: '#f8fafc', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
                      {currentStep === 1 ? <Glasses size={40} /> : <Eye size={40} />}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', lineHeight: '1.2' }}>{item.designation}</div>
                    {item.categorie_nom && <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px', alignSelf: 'flex-start' }}>{item.categorie_nom}</div>}
                    <div style={{ marginTop: 'auto', fontWeight: 'bold', color: 'var(--accent)', fontSize: '1.1rem' }}>
                      {item.prix_vente.toLocaleString('fr-FR')} DZD
                    </div>
                    <div style={{ fontSize: '0.75rem', color: (item.stock && item.stock > 0) ? '#10b981' : '#ef4444' }}>
                      Stock: {item.stock || 0}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right side: Cart & Checkout (20%) */}
        <div className="premium-card" style={{ flex: 1.5, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', minWidth: '350px' }}>
          <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderBottom: '2px dashed var(--border-color)' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '1.25rem' }}>
              <span>Ticket Actuel</span>
              {selectedPatient && (
                <span style={{ fontSize: '0.9rem', background: '#dbeafe', color: '#1e40af', padding: '0.4rem 0.75rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                  <User size={14} /> {selectedPatient.prenom} {selectedPatient.nom}
                  <button onClick={(e) => { e.stopPropagation(); setSelectedPatient(null); }} style={{ background: 'transparent', border: 'none', marginLeft: '0.25rem', cursor: 'pointer', color: '#1e40af', display: 'flex' }}><X size={14} /></button>
                </span>
              )}
            </h2>
          </div>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.25rem', overflowY: 'auto' }}>
            {cartItems.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#94a3b8', margin: 'auto 0' }}>
                Le ticket est vide.
              </div>
            ) : (
              cartItems.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ flex: 1, paddingRight: '0.5rem' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.designation}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>{item.prix_vente.toLocaleString('fr-FR')} DA</span>
                      <span>x</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: '#f1f5f9', padding: '0.1rem', borderRadius: '6px' }}>
                        <button onClick={() => updateQuantity(item.id, item.type, -1)} style={{ border: 'none', background: 'white', borderRadius: '4px', cursor: 'pointer' }}><Minus size={10} /></button>
                        <span style={{ fontWeight: 'bold', fontSize: '0.8rem', padding: '0 0.2rem' }}>{item.quantite}</span>
                        <button onClick={() => updateQuantity(item.id, item.type, 1)} style={{ border: 'none', background: 'white', borderRadius: '4px', cursor: 'pointer' }}><Plus size={10} /></button>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <strong style={{ fontSize: '0.95rem' }}>{(item.prix_vente * item.quantite).toLocaleString('fr-FR')}</strong>
                    <button onClick={() => removeFromCart(item.id, item.type)} style={{ background: '#fee2e2', border: 'none', color: '#ef4444', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <X size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}
            
            <div style={{ flex: 1 }}></div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', marginTop: '1rem' }}>
              <span>Sous-total</span>
              <span>{sousTotal.toLocaleString('fr-FR')} DZD</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              <span>Remise (DA)</span>
              <input 
                type="number"
                min="0"
                value={discount || ''}
                onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                style={{ width: '80px', textAlign: 'right', padding: '0.3rem', borderRadius: '6px', border: '1px solid #e2e8f0', color: '#ef4444', fontWeight: 'bold' }}
                placeholder="0"
              />
            </div>
          </div>

          <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', color: '#0f172a' }}>
              <span>Net à Payer:</span>
              <span style={{ color: 'var(--accent)' }}>{netAPayer.toLocaleString('fr-FR')} DZD</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
              <button 
                onClick={() => setPaymentMethod('especes')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', padding: '0.75rem', backgroundColor: paymentMethod === 'especes' ? '#ecfdf5' : 'white', border: '2px solid', borderColor: paymentMethod === 'especes' ? '#10b981' : '#e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', transition: 'all 0.2s' }} 
              >
                <Banknote size={16} color="#10b981" /> Espèces
              </button>
              <button 
                onClick={() => setPaymentMethod('cib')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', padding: '0.75rem', backgroundColor: paymentMethod === 'cib' ? '#eff6ff' : 'white', border: '2px solid', borderColor: paymentMethod === 'cib' ? '#3b82f6' : '#e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', transition: 'all 0.2s' }}
              >
                <CreditCard size={16} color="#3b82f6" /> CIB
              </button>
            </div>
            
            <button 
              onClick={validerTicket}
              disabled={isSubmitting || cartItems.length === 0}
              className="btn-primary" 
              style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', borderRadius: '8px', opacity: (isSubmitting || cartItems.length === 0) ? 0.7 : 1 }}
            >
              {isSubmitting ? <Loader2 size={20} className="spin" /> : <Receipt size={20} />}
              {isSubmitting ? 'Validation...' : 'Valider Ticket'}
            </button>
          </div>
          </div>
        </div>
      </div>

      {/* New Client Modal */}
      {showNewClientModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="premium-card" style={{ width: '100%', maxWidth: '400px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Nouveau Client</h3>
              <button onClick={() => setShowNewClientModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={24} color="#64748b" /></button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Nom <span style={{color:'red'}}>*</span></label>
                <input 
                  type="text" 
                  className="premium-input" 
                  placeholder="Nom"
                  value={newClient.nom}
                  onChange={e => setNewClient({...newClient, nom: e.target.value})}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Prénom <span style={{color:'red'}}>*</span></label>
                <input 
                  type="text" 
                  className="premium-input" 
                  placeholder="Prénom"
                  value={newClient.prenom}
                  onChange={e => setNewClient({...newClient, prenom: e.target.value})}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Date de naissance</label>
                <input 
                  type="date" 
                  className="premium-input" 
                  value={newClient.date_naissance}
                  onChange={e => setNewClient({...newClient, date_naissance: e.target.value})}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Téléphone</label>
                <input 
                  type="text" 
                  className="premium-input" 
                  placeholder="05..."
                  value={newClient.telephone}
                  onChange={e => setNewClient({...newClient, telephone: e.target.value})}
                />
              </div>
            </div>

            <button 
              onClick={handleCreatePatient} 
              disabled={isSubmittingClient || !newClient.nom || !newClient.prenom} 
              className="btn-primary" 
              style={{ width: '100%', padding: '1rem', opacity: (!newClient.nom || !newClient.prenom || isSubmittingClient) ? 0.7 : 1 }}
            >
              {isSubmittingClient ? <Loader2 size={20} className="spin" /> : 'Créer le client'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
