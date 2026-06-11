import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

export default function Register() {
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', password: '', telephone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authService.register(form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <Link to="/" style={styles.logo}>YMMO</Link>
        <h2 style={styles.title}>Créer un compte</h2>
        <p style={styles.subtitle}>Rejoignez la plateforme Ymmo</p>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Nom</label>
              <input style={styles.input} placeholder="Dupont" value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Prénom</label>
              <input style={styles.input} placeholder="Jean" value={form.prenom} onChange={e => setForm({...form, prenom: e.target.value})} required />
            </div>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input style={styles.input} type="email" placeholder="votre@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Mot de passe</label>
            <input style={styles.input} type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Téléphone <span style={{color:'#aaa', fontWeight:400}}>(optionnel)</span></label>
            <input style={styles.input} placeholder="06 00 00 00 00" value={form.telephone} onChange={e => setForm({...form, telephone: e.target.value})} />
          </div>
          <button
            style={{...styles.btn, opacity: loading ? 0.7 : 1}}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Inscription...' : "S'inscrire"}
          </button>
        </form>
        <p style={styles.footer}>
          Déjà un compte ?{' '}
          <Link to="/login" style={styles.link}>Se connecter</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f8f8f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  card: {
    background: '#fff',
    padding: '2.5rem',
    borderRadius: '16px',
    border: '1px solid #e8e8e4',
    width: '100%',
    maxWidth: '460px',
  },
  logo: {
    display: 'block',
    textAlign: 'center',
    fontSize: '1.6rem',
    fontWeight: 900,
    letterSpacing: '-1.5px',
    color: '#1a1a1a',
    textDecoration: 'none',
    marginBottom: '1.75rem',
  },
  title: {
    textAlign: 'center',
    fontSize: '1.4rem',
    fontWeight: 800,
    color: '#1a1a1a',
    letterSpacing: '-0.5px',
    margin: '0 0 0.25rem',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: '0.875rem',
    color: '#888',
    margin: '0 0 1.75rem',
  },
  error: {
    background: '#fef2f2',
    color: '#dc2626',
    border: '1px solid #fecaca',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    fontSize: '0.875rem',
    textAlign: 'center',
  },
  row: { display: 'flex', gap: '1rem' },
  field: { marginBottom: '1rem', flex: 1 },
  label: {
    display: 'block',
    marginBottom: '0.4rem',
    fontWeight: 600,
    fontSize: '0.85rem',
    color: '#1a1a1a',
    letterSpacing: '0.2px',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid #e8e8e4',
    fontSize: '0.95rem',
    boxSizing: 'border-box',
    background: '#f8f8f6',
    color: '#1a1a1a',
    outline: 'none',
  },
  btn: {
    width: '100%',
    padding: '0.875rem',
    background: '#1a1a1a',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: '0.5rem',
    letterSpacing: '0.2px',
  },
  footer: {
    textAlign: 'center',
    marginTop: '1.25rem',
    color: '#888',
    fontSize: '0.875rem',
  },
  link: { color: '#1a1a1a', fontWeight: 700, textDecoration: 'underline' },
};
