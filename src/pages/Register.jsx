import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Rocket, UserPlus, User, Mail, Lock, AlertCircle, Shield } from 'lucide-react';

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('backer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register(name, email, password, role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Try a different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 160px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.75rem' }}>
            <Rocket size={28} color="#6366f1" />
            <span>Fund<span className="gradient-text">Pulse</span></span>
          </Link>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '0.3rem' }}>Create an Account</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Join thousands of creators and backers global community</p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fca5a5',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            marginBottom: '1.5rem',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Enter full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.6rem' }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.6rem' }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.6rem' }}
                required
              />
            </div>
          </div>

          {/* Account Role Selector */}
          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label">Primary Account Goal</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setRole('backer')}
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: role === 'backer' ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  background: role === 'backer' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                  color: role === 'backer' ? '#fff' : '#94a3b8',
                  fontSize: '0.88rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Back Projects
              </button>

              <button
                type="button"
                onClick={() => setRole('creator')}
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: role === 'creator' ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  background: role === 'creator' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                  color: role === 'creator' ? '#fff' : '#94a3b8',
                  fontSize: '0.88rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Create Campaigns
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
            <UserPlus size={18} />
            {loading ? 'Creating Account...' : 'Create Free Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: '#94a3b8' }}>
          Already registered?{' '}
          <Link to="/login" style={{ color: '#818cf8', fontWeight: '600' }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
