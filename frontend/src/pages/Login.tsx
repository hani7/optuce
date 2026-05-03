import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, User } from 'lucide-react'
import axios from 'axios'
import { useAuthStore } from '../store/auth'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await axios.post('/api/auth/login/', { username, password })
      setAuth(res.data.access, res.data.refresh, {
        id: 0, username, first_name: '', last_name: ''
      })
      navigate('/dashboard')
    } catch {
      setError('Identifiants incorrects. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at 30% 20%, rgba(212,175,55,0.08) 0%, transparent 60%), var(--navy)',
      padding: '24px'
    }}>
      {/* Background glow */}
      <div style={{
        position: 'fixed', top: '20%', left: '10%',
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(79,142,247,0.06) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            width: '64px', height: '64px',
            background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
            borderRadius: '18px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '28px', margin: '0 auto 16px',
            boxShadow: '0 8px 32px rgba(212,175,55,0.3)'
          }}>👁️</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Optuce</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '6px', fontSize: '0.9rem' }}>
            Gestion Optique Professionnelle
          </p>
        </div>

        <div className="card" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '24px' }}>Connexion</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nom d'utilisateur</label>
              <div style={{ position: 'relative' }}>
                <User size={15} style={{
                  position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }} />
                <input
                  className="form-control" style={{ paddingLeft: '36px' }}
                  value={username} onChange={e => setUsername(e.target.value)}
                  placeholder="admin" required autoFocus
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{
                  position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }} />
                <input
                  className="form-control" style={{ paddingLeft: '36px', paddingRight: '40px' }}
                  type={show ? 'text' : 'password'}
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required
                />
                <button type="button" onClick={() => setShow(!show)} style={{
                  position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer'
                }}>
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button
              className="btn btn-primary" type="submit"
              style={{ width: '100%', justifyContent: 'center', marginTop: '8px', padding: '11px' }}
              disabled={loading}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Optuce v1.0 — Baitul Tech © 2025
        </p>
      </div>
    </div>
  )
}
