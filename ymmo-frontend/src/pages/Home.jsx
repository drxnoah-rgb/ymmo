import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bienService } from '../services/api';

const PHOTOS = {
  APPARTEMENT: [
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80',
  ],
  MAISON: [
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80',
  ],
  BUREAU: [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80',
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&q=80',
  ],
  TERRAIN: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80'],
  COMMERCE: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80'],
};

function getPhoto(type, id) {
  const arr = PHOTOS[type] || PHOTOS.APPARTEMENT;
  return arr[id % arr.length];
}

const SERVICES = [
  {
    icon: '🔑',
    titre: 'Achat immobilier',
    desc: 'Trouvez le bien idéal parmi nos milliers d\'annonces. Nos conseillers vous accompagnent de la recherche à la signature.',
  },
  {
    icon: '📋',
    titre: 'Vente de bien',
    desc: 'Estimez et vendez votre bien au meilleur prix. Nous gérons les visites, la négociation et les démarches administratives.',
  },
  {
    icon: '🏘️',
    titre: 'Location',
    desc: 'Accédez à notre catalogue de locations résidentielles et professionnelles partout en France.',
  },
  {
    icon: '⚙️',
    titre: 'Gestion locative',
    desc: 'Confiez-nous la gestion de votre patrimoine. Loyers, entretien, relations locataires — on s\'occupe de tout.',
  },
];

const ETAPES = [
  {
    num: '01',
    titre: 'Décrivez votre projet',
    desc: 'Utilisez notre moteur de recherche pour filtrer par ville, type de bien, surface ou budget. En quelques secondes.',
  },
  {
    num: '02',
    titre: 'Visitez et comparez',
    desc: 'Consultez les fiches détaillées, les photos et les caractéristiques. Contactez l\'agence directement depuis l\'annonce.',
  },
  {
    num: '03',
    titre: 'Signez en confiance',
    desc: 'Nos conseillers vous accompagnent jusqu\'à la signature. Compromis, notaire, financement — rien ne vous échappe.',
  },
];

const ARGUMENTS = [
  { val: '15 ans', label: "D'expertise immobilière", desc: 'Fondée en 2009, Ymmo est aujourd\'hui l\'une des agences indépendantes les plus reconnues en région PACA.' },
  { val: '12', label: 'Agences en France', desc: 'De Marseille à Paris, nos équipes locales connaissent chaque quartier, chaque rue, chaque opportunité.' },
  { val: '2 000+', label: 'Clients accompagnés', desc: 'Des milliers de familles et d\'entreprises nous ont fait confiance pour leurs projets immobiliers.' },
  { val: '98%', label: 'De satisfaction client', desc: 'Notre engagement : une relation transparente, des délais respectés, un suivi personnalisé jusqu\'à la remise des clés.' },
];

const VILLES = [
  { nom: 'Aix-en-Provence', img: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=400&q=80', nb: 84 },
  { nom: 'Marseille', img: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400&q=80', nb: 132 },
  { nom: 'Lyon', img: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400&q=80', nb: 67 },
  { nom: 'Paris', img: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&q=80', nb: 210 },
];

export default function Home() {
  const [biens, setBiens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  useEffect(() => {
    bienService.getAll()
      .then(res => setBiens(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = biens.filter(b => {
    const matchSearch = b.titre?.toLowerCase().includes(search.toLowerCase()) ||
                        b.ville?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter ? b.type === typeFilter : true;
    return matchSearch && matchType;
  });

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", minHeight: '100vh', background: '#f8f8f6', color: '#1a1a1a' }}>

      {/* ── NAVBAR ── */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #e8e8e4', padding: '0 4rem', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontWeight: 900, fontSize: '1.6rem', color: '#1a1a1a', letterSpacing: '-1.5px' }}>YMMO</span>
        </Link>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="#annonces" style={{ color: '#666', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none' }}>Annonces</a>
          <a href="#services" style={{ color: '#666', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none' }}>Services</a>
          <a href="#agences" style={{ color: '#666', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none' }}>Agences</a>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {user ? (
            <>
              <span style={{ color: '#4a4a4a', fontWeight: 500, fontSize: '0.875rem', marginRight: '8px' }}>Bonjour, {user.email}</span>
              <button onClick={handleLogout} style={{ padding: '10px 24px', borderRadius: '8px', background: '#1a1a1a', color: '#fff', fontWeight: 600, fontSize: '0.875rem', border: 'none', cursor: 'pointer' }}>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ padding: '10px 24px', borderRadius: '8px', color: '#4a4a4a', fontWeight: 500, fontSize: '0.875rem', textDecoration: 'none' }}>
                Connexion
              </Link>
              <Link to="/register" style={{ padding: '10px 24px', borderRadius: '8px', background: '#1a1a1a', color: '#fff', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>
                Inscription
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{ position: 'relative', height: '620px', overflow: 'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80"
          alt="hero"
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.45)' }}
        />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#fff', padding: '2rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '4px', opacity: 0.6, marginBottom: '1.25rem', textTransform: 'uppercase' }}>
            Groupe Immobilier — France
          </p>
          <h1 style={{ fontSize: '4.5rem', fontWeight: 900, marginBottom: '1rem', lineHeight: 1.0, color: '#fff', letterSpacing: '-3px', maxWidth: '760px' }}>
            L'immobilier autrement
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.75, marginBottom: '2.5rem', maxWidth: '480px', lineHeight: 1.7 }}>
            12 agences, des milliers de biens. Trouvez votre prochain chez-vous en toute sérénité.
          </p>
          <div style={{ background: '#fff', borderRadius: '14px', padding: '0.875rem', maxWidth: '720px', width: '100%', display: 'flex', gap: '8px', flexWrap: 'wrap', boxShadow: '0 24px 60px rgba(0,0,0,0.3)' }}>
            <input
              style={{ flex: 1, minWidth: '200px', padding: '14px 18px', borderRadius: '8px', border: '1px solid #e8e8e4', fontSize: '0.95rem', outline: 'none', color: '#1a1a1a', background: '#f8f8f6' }}
              placeholder="Ville, quartier, référence..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              style={{ padding: '14px 16px', borderRadius: '8px', border: '1px solid #e8e8e4', fontSize: '0.95rem', color: '#1a1a1a', background: '#f8f8f6', cursor: 'pointer' }}
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
            >
              <option value="">Tous les types</option>
              <option value="APPARTEMENT">Appartement</option>
              <option value="MAISON">Maison</option>
              <option value="BUREAU">Bureau</option>
              <option value="TERRAIN">Terrain</option>
              <option value="COMMERCE">Commerce</option>
            </select>
            <button
              style={{ padding: '14px 32px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
              onClick={() => document.getElementById('annonces')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Rechercher
            </button>
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div style={{ background: '#1a1a1a', padding: '2rem 4rem', display: 'flex', justifyContent: 'center', gap: '6rem', flexWrap: 'wrap' }}>
        {[['12', 'Agences'], ['500+', 'Biens disponibles'], ['2 000+', 'Clients accompagnés'], ['15 ans', "D'expertise"]].map(([val, label]) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>{val}</div>
            <div style={{ fontSize: '0.75rem', color: '#888', fontWeight: 600, marginTop: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* ── SERVICES ── */}
      <section id="services" style={{ background: '#fff', padding: '6rem 4rem', borderBottom: '1px solid #e8e8e4' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '3px', color: '#aaa', textTransform: 'uppercase', marginBottom: '0.75rem', textAlign: 'center' }}>Ce que nous faisons</p>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1.5px', color: '#1a1a1a', textAlign: 'center', marginBottom: '0.75rem' }}>Nos services</h2>
          <p style={{ textAlign: 'center', color: '#888', fontSize: '1rem', maxWidth: '480px', margin: '0 auto 3.5rem', lineHeight: 1.7 }}>
            De la recherche à la gestion, nous couvrons tous les aspects de votre projet immobilier.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {SERVICES.map((s, i) => (
              <div key={i} style={{ padding: '2rem', borderRadius: '16px', border: '1px solid #e8e8e4', background: '#f8f8f6', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#1a1a1a'; e.currentTarget.style.color = '#fff'; e.currentTarget.querySelectorAll('p').forEach(p => p.style.color = '#aaa'); }}
                onMouseLeave={e => { e.currentTarget.style.background = '#f8f8f6'; e.currentTarget.style.color = '#1a1a1a'; e.currentTarget.querySelectorAll('p').forEach(p => p.style.color = '#666'); }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '1.25rem' }}>{s.icon}</div>
                <h3 style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.75rem', letterSpacing: '-0.3px' }}>{s.titre}</h3>
                <p style={{ color: '#666', fontSize: '0.875rem', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ANNONCES ── */}
      <section id="annonces" style={{ maxWidth: '1320px', margin: '0 auto', padding: '6rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '3px', color: '#aaa', textTransform: 'uppercase', marginBottom: '0.5rem' }}>En ce moment</p>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1a1a1a', letterSpacing: '-1.5px', margin: 0 }}>Nos annonces</h2>
          </div>
          <p style={{ color: '#888', fontSize: '0.875rem' }}>{filtered.length} bien{filtered.length !== 1 ? 's' : ''} disponible{filtered.length !== 1 ? 's' : ''}</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: '#aaa' }}>Chargement des annonces...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem', background: '#fff', borderRadius: '16px', border: '1px solid #e8e8e4' }}>
            <p style={{ color: '#aaa', fontSize: '1.1rem' }}>Aucun bien ne correspond à votre recherche.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {filtered.map(bien => (
              <Link to={`/biens/${bien.id}`} key={bien.id}
                style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e8e8e4', display: 'block', textDecoration: 'none', color: 'inherit', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ position: 'relative', height: '210px', overflow: 'hidden' }}>
                  <img
                    src={getPhoto(bien.type, bien.id)}
                    alt={bien.titre}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                  />
                  <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                    <span style={{ background: bien.statut === 'DISPONIBLE' ? '#1a1a1a' : '#dc2626', color: '#fff', padding: '4px 12px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                      {bien.statut === 'DISPONIBLE' ? 'Disponible' : bien.statut === 'EN_COURS' ? 'En cours' : 'Vendu'}
                    </span>
                  </div>
                  <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                    <span style={{ background: 'rgba(255,255,255,0.92)', color: '#1a1a1a', padding: '4px 12px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                      {bien.type}
                    </span>
                  </div>
                </div>
                <div style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a1a', flex: 1, marginRight: '8px', letterSpacing: '-0.3px' }}>{bien.titre}</h3>
                    <span style={{ fontWeight: 900, fontSize: '1.1rem', color: '#1a1a1a', whiteSpace: 'nowrap' }}>{bien.prix?.toLocaleString()} €</span>
                  </div>
                  <p style={{ color: '#888', fontSize: '0.875rem', marginBottom: '1rem' }}>{bien.ville}</p>
                  <div style={{ display: 'flex', gap: '1.5rem', borderTop: '1px solid #f0f0ec', paddingTop: '1rem' }}>
                    <span style={{ fontSize: '0.82rem', color: '#666' }}>{bien.surface} m²</span>
                    <span style={{ fontSize: '0.82rem', color: '#666' }}>{bien.nbPieces} pièces</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── VILLES ── */}
      <section id="agences" style={{ background: '#fff', padding: '6rem 4rem', borderTop: '1px solid #e8e8e4', borderBottom: '1px solid #e8e8e4' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '3px', color: '#aaa', textTransform: 'uppercase', marginBottom: '0.75rem', textAlign: 'center' }}>Où nous sommes</p>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1.5px', color: '#1a1a1a', textAlign: 'center', marginBottom: '0.75rem' }}>Nos villes</h2>
          <p style={{ textAlign: 'center', color: '#888', fontSize: '1rem', maxWidth: '460px', margin: '0 auto 3.5rem', lineHeight: 1.7 }}>
            Présents dans les principales métropoles françaises, nos experts locaux vous guident au plus près du terrain.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {VILLES.map((v, i) => (
              <div key={i}
                style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', height: '200px', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.querySelector('img').style.transform = 'scale(1.07)'}
                onMouseLeave={e => e.currentTarget.querySelector('img').style.transform = 'scale(1)'}
              >
                <img src={v.img} alt={v.nom} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.55)', transition: 'transform 0.4s' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1.5rem' }}>
                  <div style={{ color: '#fff', fontWeight: 900, fontSize: '1.2rem', letterSpacing: '-0.5px' }}>{v.nom}</div>
                  <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.8rem', fontWeight: 500, marginTop: '2px' }}>{v.nb} biens disponibles</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ── */}
      <section style={{ padding: '6rem 4rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '3px', color: '#aaa', textTransform: 'uppercase', marginBottom: '0.75rem', textAlign: 'center' }}>Simple et rapide</p>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1.5px', color: '#1a1a1a', textAlign: 'center', marginBottom: '4rem' }}>Comment ça marche ?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3rem', position: 'relative' }}>
            {ETAPES.map((e, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', fontWeight: 900, color: '#e8e8e4', letterSpacing: '-2px', marginBottom: '1rem', lineHeight: 1 }}>{e.num}</div>
                <h3 style={{ fontWeight: 800, fontSize: '1.05rem', color: '#1a1a1a', marginBottom: '0.75rem', letterSpacing: '-0.3px' }}>{e.titre}</h3>
                <p style={{ color: '#888', fontSize: '0.875rem', lineHeight: 1.7 }}>{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POURQUOI YMMO ── */}
      <section style={{ background: '#1a1a1a', padding: '6rem 4rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '3px', color: '#555', textTransform: 'uppercase', marginBottom: '0.75rem', textAlign: 'center' }}>Notre différence</p>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1.5px', color: '#fff', textAlign: 'center', marginBottom: '4rem' }}>Pourquoi choisir Ymmo ?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2rem' }}>
            {ARGUMENTS.map((a, i) => (
              <div key={i} style={{ borderTop: '1px solid #2a2a2a', paddingTop: '2rem' }}>
                <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#fff', letterSpacing: '-1.5px', marginBottom: '0.25rem' }}>{a.val}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>{a.label}</div>
                <p style={{ color: '#555', fontSize: '0.875rem', lineHeight: 1.7 }}>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: '#f8f8f6', padding: '6rem 4rem', borderTop: '1px solid #e8e8e4' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.75rem', fontWeight: 900, letterSpacing: '-2px', color: '#1a1a1a', marginBottom: '1rem', lineHeight: 1.1 }}>
            Prêt à concrétiser votre projet ?
          </h2>
          <p style={{ color: '#888', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>
            Créez votre compte gratuitement et accédez à toutes nos annonces, nos alertes personnalisées et nos conseillers dédiés.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{ padding: '14px 36px', background: '#1a1a1a', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '0.2px' }}>
              Créer un compte
            </Link>
            <a href="#annonces" style={{ padding: '14px 36px', background: '#fff', color: '#1a1a1a', border: '1px solid #e8e8e4', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>
              Voir les annonces
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#1a1a1a', color: '#555', padding: '5rem 4rem 3rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '4rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontWeight: 900, fontSize: '1.5rem', color: '#fff', letterSpacing: '-1.5px', marginBottom: '1rem' }}>YMMO</div>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.8, maxWidth: '280px', color: '#555' }}>
                La référence de l'immobilier résidentiel et professionnel en France depuis 2009. 12 agences, des milliers de projets accompagnés.
              </p>
            </div>
            <div>
              <p style={{ color: '#fff', fontWeight: 700, marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem' }}>Services</p>
              {['Achat immobilier', 'Vente de bien', 'Location', 'Gestion locative', 'Estimation gratuite'].map(s => (
                <p key={s} style={{ fontSize: '0.875rem', lineHeight: 2, cursor: 'pointer' }}>{s}</p>
              ))}
            </div>
            <div>
              <p style={{ color: '#fff', fontWeight: 700, marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem' }}>Villes</p>
              {['Aix-en-Provence', 'Marseille', 'Lyon', 'Paris', 'Bordeaux'].map(v => (
                <p key={v} style={{ fontSize: '0.875rem', lineHeight: 2, cursor: 'pointer' }}>{v}</p>
              ))}
            </div>
            <div>
              <p style={{ color: '#fff', fontWeight: 700, marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem' }}>Contact</p>
              <p style={{ fontSize: '0.875rem', lineHeight: 2 }}>Siège — Aix-en-Provence</p>
              <p style={{ fontSize: '0.875rem', lineHeight: 2 }}>04 42 00 00 00</p>
              <p style={{ fontSize: '0.875rem', lineHeight: 2 }}>contact@ymmo.fr</p>
              <p style={{ color: '#fff', fontWeight: 700, marginBottom: '1rem', marginTop: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem' }}>Légal</p>
              {['Mentions légales', 'Politique de confidentialité', 'CGU'].map(l => (
                <p key={l} style={{ fontSize: '0.875rem', lineHeight: 2, cursor: 'pointer' }}>{l}</p>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', flexWrap: 'wrap', gap: '1rem' }}>
            <span>© 2024 Ymmo — Tous droits réservés</span>
            <span>12 agences en France · SIRET 000 000 000 00000</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
