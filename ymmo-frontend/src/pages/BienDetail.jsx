import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bienService } from '../services/api';

export default function BienDetail() {
  const { id } = useParams();
  const [bien, setBien] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bienService.getById(id)
      .then(res => setBien(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={styles.center}>Chargement...</div>;
  if (!bien) return <div style={styles.center}>Bien non trouvé.</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <Link to="/" style={styles.logo}>🏠 Ymmo</Link>
        <Link to="/" style={styles.back}>← Retour aux annonces</Link>
      </header>

      <main style={styles.main}>
        <div style={styles.imageBox}>🏡</div>

        <div style={styles.content}>
          <div style={styles.topRow}>
            <span style={{...styles.badge, background: bien.statut === 'DISPONIBLE' ? '#16a34a' : '#dc2626'}}>
              {bien.statut}
            </span>
            <span style={styles.type}>{bien.type}</span>
          </div>

          <h1 style={styles.title}>{bien.titre}</h1>
          <p style={styles.ville}>📍 {bien.adresse}, {bien.ville} {bien.codePostal}</p>
          <p style={styles.prix}>{bien.prix?.toLocaleString()} €</p>

          <div style={styles.infoGrid}>
            <div style={styles.infoBox}>
              <span style={styles.infoLabel}>Surface</span>
              <span style={styles.infoValue}>{bien.surface} m²</span>
            </div>
            <div style={styles.infoBox}>
              <span style={styles.infoLabel}>Pièces</span>
              <span style={styles.infoValue}>{bien.nbPieces}</span>
            </div>
            <div style={styles.infoBox}>
              <span style={styles.infoLabel}>Type</span>
              <span style={styles.infoValue}>{bien.type}</span>
            </div>
          </div>

          <div style={styles.descBox}>
            <h3 style={styles.descTitle}>Description</h3>
            <p style={styles.desc}>{bien.description || 'Aucune description disponible.'}</p>
          </div>

          {bien.statut === 'DISPONIBLE' && (
            <Link to="/login" style={styles.ctaBtn}>
              Contacter l'agence
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: { fontFamily: 'sans-serif', minHeight: '100vh', background: '#f8fafc' },
  center: { textAlign: 'center', padding: '4rem', color: '#64748b' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' },
  logo: { fontSize: '1.5rem', color: '#1d4ed8', textDecoration: 'none', fontWeight: 700 },
  back: { color: '#1d4ed8', textDecoration: 'none', fontWeight: 500 },
  main: { maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' },
  imageBox: { background: '#dbeafe', borderRadius: '16px', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6rem', marginBottom: '2rem' },
  content: { background: '#fff', borderRadius: '16px', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  topRow: { display: 'flex', gap: '0.75rem', marginBottom: '1rem' },
  badge: { color: '#fff', padding: '4px 12px', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 600 },
  type: { background: '#e0e7ff', color: '#3730a3', padding: '4px 12px', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 600 },
  title: { margin: '0 0 0.5rem', fontSize: '1.75rem', color: '#1e293b' },
  ville: { color: '#64748b', margin: '0 0 1rem' },
  prix: { fontSize: '2rem', fontWeight: 700, color: '#1d4ed8', margin: '0 0 1.5rem' },
  infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' },
  infoBox: { background: '#f8fafc', borderRadius: '12px', padding: '1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.25rem' },
  infoLabel: { fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 },
  infoValue: { fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' },
  descBox: { borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', marginBottom: '1.5rem' },
  descTitle: { margin: '0 0 0.75rem', color: '#1e293b' },
  desc: { color: '#475569', lineHeight: 1.7 },
  ctaBtn: { display: 'block', textAlign: 'center', background: '#1d4ed8', color: '#fff', padding: '1rem', borderRadius: '12px', textDecoration: 'none', fontWeight: 600, fontSize: '1.1rem' },
};