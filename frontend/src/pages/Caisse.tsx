import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, CreditCard, Banknote, Receipt, X, Loader2, Plus, Minus, ArrowRight, Glasses, Eye, Briefcase, List, ArrowLeft, User, Phone, Edit2, Trash2, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';

interface Article {
  id: number;
  designation: string;
  prix_vente: number;
  type: string;
  categorie_nom?: string;
  stock?: number;
  photo?: string;
  marque?: string;
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
  const navigate = useNavigate();

  // View State
  const [viewMode, setViewMode] = useState<'list' | 'wizard'>('list');
  const [ventes, setVentes] = useState<any[]>([]);
  const [isLoadingVentes, setIsLoadingVentes] = useState(false);
  
  const [currentVentesPage, setCurrentVentesPage] = useState(1);
  const [ventesPerPage, setVentesPerPage] = useState(10);
  const totalVentesPages = Math.ceil(ventes.length / ventesPerPage);
  const paginatedVentes = ventes.slice((currentVentesPage - 1) * ventesPerPage, currentVentesPage * ventesPerPage);

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
  const [editingVente, setEditingVente] = useState<any>(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/stocks/categories/')
      .then(res => res.json())
      .then(data => {
        const fetchedCats = Array.isArray(data) ? data : (data.results || []);
        if (fetchedCats.length === 0) {
          setCategories([
            { id: 1, nom: 'Solaire', type: 'monture' },
            { id: 2, nom: 'Optique', type: 'monture' },
            { id: 3, nom: 'Enfant', type: 'monture' },
            { id: 4, nom: 'Unifocal', type: 'verre' },
            { id: 5, nom: 'Progressif', type: 'verre' }
          ]);
        } else {
          setCategories(fetchedCats);
        }
      })
      .catch(err => {
        console.error(err);
        setCategories([
          { id: 1, nom: 'Solaire', type: 'monture' },
          { id: 2, nom: 'Optique', type: 'monture' },
          { id: 3, nom: 'Enfant', type: 'monture' },
          { id: 4, nom: 'Unifocal', type: 'verre' },
          { id: 5, nom: 'Progressif', type: 'verre' }
        ]);
      });
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

  const fetchPatients = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/patients/?search=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      let results = Array.isArray(data) ? data : (data.results || []);
      setPatients(results);
    } catch (error) {
      console.error(error);
      setPatients([]);
    }
  };

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      if (currentStep === 3) {
        await fetchPatients();
      } else {
        // Fetch Stocks
        const endpoint = currentStep === 1 ? 'montures' : 'verres';
        let url = `http://127.0.0.1:8000/api/stocks/${endpoint}/?`;
        if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;
        if (activeCategoryId) url += `categorie=${activeCategoryId}&`;

        const res = await fetch(url);
        const data = await res.json();
        const results = Array.isArray(data) ? data : (data.results || []);
        
        let formatted = results.map((item: any) => ({
          id: item.id,
          designation: (item.modele ? item.modele : item.designation) || `${item.marque_nom || item.marque?.nom || ''} ${item.reference || ''}`.trim() || 'Article Inconnu',
          prix_vente: parseFloat(item.prix_vente || item.prix || 0),
          type: currentStep === 1 ? 'monture' : 'verre_od',
          categorie_nom: item.categorie_nom,
          stock: item.stock,
          photo: item.image || item.photo || null,
          marque: item.marque_nom || item.marque?.nom || item.marque || ''
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
      if (!res.ok) {
        let errMsg = 'Erreur lors de la création du client';
        try {
          const errData = await res.json();
          errMsg = JSON.stringify(errData);
        } catch (e) {}
        throw new Error(errMsg);
      }
      const data = await res.json();
      setSelectedPatient(data);
      setShowNewClientModal(false);
      setNewClient({ nom: '', prenom: '', telephone: '', date_naissance: '' });
      fetchItems(); // refresh list just in case
    } catch (error: any) {
      alert(`Une erreur est survenue lors de la création : ${error.message}`);
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
        const isDummy = item.id > 900;
        if (!isDummy) {
          if (item.type === 'monture' && item.id !== 0) payload.monture = item.id;
          if (item.type.startsWith('verre')) payload.verre = item.id;
          if (item.type === 'lentille') payload.lentille = item.id;
          if (item.type === 'accessoire') payload.accessoire = item.id;
        }
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
        let errStr = await venteRes.text();
        try {
          const jsonErr = JSON.parse(errStr);
          errStr = JSON.stringify(jsonErr);
        } catch (e) {}
        throw new Error(errStr);
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
           const encErr = await encRes.text();
           alert(`Vente créée (Ticket ${venteData.numero}) mais l'encaissement a échoué: ${encErr}`);
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
      
    } catch (error: any) {
      console.error(error);
      alert(`Erreur de validation : ${error.message}`);
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
                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Sexe</th>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Âge</th>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Statut</th>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Montant Total</th>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedVentes.map((vente, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'white'}>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--accent)' }}>{vente.numero}</td>
                      <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>
                        {new Date(vente.date).toLocaleString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit'})}
                      </td>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {vente.patient_sexe === 'M' ? 'Homme' : vente.patient_sexe === 'F' ? 'Femme' : '-'}
                      </td>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {vente.patient_age ? `${vente.patient_age} ans` : '-'}
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, background: '#dcfce7', color: '#15803d' }}>
                          {vente.statut}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: 'bold' }}>{parseFloat(vente.total_ttc || '0').toLocaleString('fr-FR')} DZD</td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <button title="Envoyer SMS" style={{ background: '#f0f9ff', border: 'none', color: '#0284c7', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex' }}><MessageSquare size={16} /></button>
                        <button onClick={(e) => { e.stopPropagation(); navigate(`/caisse/edit/${vente.id}`); }} title="Modifier" style={{ background: '#f1f5f9', border: 'none', color: '#475569', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex' }}><Edit2 size={16} /></button>
                        <button onClick={(e) => { e.stopPropagation(); if (window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) setVentes(ventes.filter(v => v.numero !== vente.numero)); }} title="Supprimer" style={{ background: '#fef2f2', border: 'none', color: '#ef4444', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex' }}><Trash2 size={16} /></button>
                        <button onClick={(e) => { e.stopPropagation(); navigate(`/caisse/details/${vente.id}`); }} style={{ background: 'transparent', border: 'none', color: '#3b82f6', cursor: 'pointer', fontWeight: 600, padding: '0.5rem' }}>
                          Détails
                        </button>
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
          
          {!isLoadingVentes && ventes.length > 0 && (
            <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <span>Afficher</span>
                <select className="premium-input" style={{ width: 'auto', padding: '0.25rem 2rem 0.25rem 0.5rem', height: '32px' }} value={ventesPerPage} onChange={(e) => { setVentesPerPage(Number(e.target.value)); setCurrentVentesPage(1); }}>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span>par page</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button 
                  onClick={() => setCurrentVentesPage(p => Math.max(1, p - 1))}
                  disabled={currentVentesPage === 1}
                  style={{ padding: '0.5rem', background: currentVentesPage === 1 ? '#f1f5f9' : 'white', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: currentVentesPage === 1 ? 'not-allowed' : 'pointer', color: currentVentesPage === 1 ? '#94a3b8' : 'var(--text-primary)' }}
                >
                  <ChevronLeft size={18} />
                </button>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Page {currentVentesPage} sur {totalVentesPages || 1}
                </span>
                <button 
                  onClick={() => setCurrentVentesPage(p => Math.min(totalVentesPages, p + 1))}
                  disabled={currentVentesPage === totalVentesPages || totalVentesPages === 0}
                  style={{ padding: '0.5rem', background: currentVentesPage === totalVentesPages || totalVentesPages === 0 ? '#f1f5f9' : 'white', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: currentVentesPage === totalVentesPages || totalVentesPages === 0 ? 'not-allowed' : 'pointer', color: currentVentesPage === totalVentesPages || totalVentesPages === 0 ? '#94a3b8' : 'var(--text-primary)' }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
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
              {categories
                .filter(cat => (currentStep === 1 ? (cat as any).type === 'monture' : (cat as any).type === 'verre') || !(cat as any).type)
                .map(cat => (
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
                    <div style={{ position: 'relative', height: '140px', background: '#f8fafc', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', overflow: 'hidden' }}>
                      {(item as any).photo ? (
                        <img src={(item as any).photo} alt={item.designation} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        currentStep === 1 ? <Glasses size={40} /> : <Eye size={40} />
                      )}
                      {item.marque && (
                        <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(15, 23, 42, 0.75)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, backdropFilter: 'blur(4px)' }}>
                          {item.marque}
                        </div>
                      )}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', lineHeight: '1.2', marginTop: '0.5rem' }}>{item.designation}</div>
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
                {newClient.date_naissance && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span>
                      <strong>Âge:</strong> {Math.floor((new Date().getTime() - new Date(newClient.date_naissance).getTime()) / 31557600000)} ans
                    </span>
                    <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', background: Math.floor((new Date().getTime() - new Date(newClient.date_naissance).getTime()) / 31557600000) >= 18 ? '#dcfce7' : '#fef08a', color: Math.floor((new Date().getTime() - new Date(newClient.date_naissance).getTime()) / 31557600000) >= 18 ? '#15803d' : '#a16207', fontWeight: 600 }}>
                      {Math.floor((new Date().getTime() - new Date(newClient.date_naissance).getTime()) / 31557600000) >= 18 ? 'Adulte' : 'Enfant'}
                    </span>
                  </div>
                )}
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

      {/* Edit Vente Modal */}
      {editingVente && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="premium-card" style={{ width: '100%', maxWidth: '400px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Modifier Commande {editingVente.numero}</h3>
              <button onClick={() => setEditingVente(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={24} color="#64748b" /></button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Statut de la commande</label>
                <select 
                  className="premium-input"
                  value={editingVente.statut}
                  onChange={e => setEditingVente({...editingVente, statut: e.target.value})}
                >
                  <option value="en_cours">En cours</option>
                  <option value="finalisee">Finalisée</option>
                  <option value="annulee">Annulée</option>
                </select>
              </div>
              <button 
                className="btn-primary" 
                style={{ width: '100%', padding: '0.75rem', marginTop: '1rem' }}
                onClick={() => {
                  setVentes(ventes.map(v => v.numero === editingVente.numero ? editingVente : v));
                  setEditingVente(null);
                }}
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
