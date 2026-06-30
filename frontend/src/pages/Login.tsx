import React, { useState } from 'react';
import { Eye, Lock, User, ArrowRight, Loader2 } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Simulation d'une requête réseau (effet wahou)
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        localStorage.setItem('optuce_auth', 'true');
        window.location.href = '/'; // Recharge l'App pour passer le state global
      } else {
        setError('Identifiants incorrects. Utilisez admin / admin');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decorations */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)' }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)' }}></div>
      
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '3rem',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
          <div style={{ background: 'var(--accent-gradient)', padding: '0.75rem', borderRadius: '12px', display: 'flex' }}>
            <Eye color="white" size={32} />
          </div>
          <h1 style={{ color: 'white', fontSize: '2rem', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>Optuce</h1>
        </div>
        
        <p style={{ color: '#94a3b8', marginBottom: '2rem', textAlign: 'center', fontSize: '0.95rem' }}>
          Connectez-vous pour accéder à votre espace de gestion optique.
        </p>
        
        <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
                <User size={20} />
              </div>
              <input 
                type="text" 
                placeholder="Nom d'utilisateur (admin)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '1rem 1rem 1rem 3rem', 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)', 
                  borderRadius: '12px', 
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
              />
            </div>
          </div>
          
          <div>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
                <Lock size={20} />
              </div>
              <input 
                type="password" 
                placeholder="Mot de passe (admin)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '1rem 1rem 1rem 3rem', 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)', 
                  borderRadius: '12px', 
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
              />
            </div>
          </div>
          
          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', textAlign: 'center' }}>
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              width: '100%', 
              padding: '1rem', 
              background: 'var(--accent-gradient)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '12px', 
              fontSize: '1rem', 
              fontWeight: 700, 
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '0.5rem',
              transition: 'transform 0.2s',
              boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)'
            }}
            onMouseOver={(e) => { if(!isLoading) e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseOut={(e) => { if(!isLoading) e.currentTarget.style.transform = 'translateY(0)' }}
          >
            {isLoading ? <Loader2 className="spin" size={20} /> : (
              <>
                Se connecter <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>
        
        <div style={{ marginTop: '2.5rem', fontSize: '0.85rem', color: '#64748b' }}>
          &copy; 2026 Optuce Solutions. Tous droits réservés.
        </div>
      </div>
    </div>
  );
}
