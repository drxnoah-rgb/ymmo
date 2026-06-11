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
    <div style={{fontFamily:"'Segoe UI', sans-serif", minHeight:'100vh', background:'#f8f8f6', color:'#1a1a1a'}}>

      {/* NAVBAR */}
      <nav style={{background:'#fff', borderBottom:'1px solid #e8e8e4', padding:'0 4rem', height:'72px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100}}>
        <Link to="/" style={{textDecoration:'none'}}>
          <span style={{fontWeight:900, fontSize:'1.6rem', color:'#1a1a1a', letterSpacing:'-1.5px'}}>YMMO</span>
        </Link>
        <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
          {user ? (
            <>
              <span style={{color:'#4a4a4a', fontWeight:500, fontSize:'0.9rem', marginRight:'8px'}}>Bonjour, {user.email}</span>
              <button onClick={handleLogout} style={{padding:'10px 24px', borderRadius:'8px', background:'#1a1a1a', color:'#fff', fontWeight:500, fontSize:'0.9rem', border:'none', cursor:'pointer'}}>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{padding:'10px 24px', borderRadius:'8px', color:'#4a4a4a', fontWeight:500, fontSize:'0.9rem', textDecoration:'none'}}>
                Connexion
              </Link>
              <Link to="/register" style={{padding:'10px 24px', borderRadius:'8px', background:'#1a1a1a', color:'#fff', fontWeight:500, fontSize:'0.9rem', textDecoration:'none'}}>
                Inscription
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <div style={{position:'relative', height:'580px', overflow:'hidden'}}>
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80"
          alt="hero"
          style={{width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.5)'}}
        />
        <div style={{position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', color:'#fff', padding:'2rem'}}>
          <p style={{fontSize:'0.8rem', fontWeight:600, letterSpacing:'4px', opacity:0.75, marginBottom:'1.5rem', textTransform:'uppercase'}}>
            Groupe Immobilier — France
          </p>
          <h1 style={{fontSize:'4rem', fontWeight:900, marginBottom:'1.5rem', lineHeight:1.05, color:'#fff', letterSpacing:'-2px', maxWidth:'700px'}}>
            L'immobilier autrement
          </h1>
          <p style={{fontSize:'1.1rem', opacity:0.8, marginBottom:'3rem', maxWidth:'460px', lineHeight:1.6}}>
            12 agences, des milliers de biens. Trouvez votre prochain chez-vous en toute sérénité.
          </p>
          <div style={{background:'#fff', borderRadius:'12px', padding:'0.75rem', maxWidth:'680px', width:'100%', display:'flex', gap:'8px', flexWrap:'wrap'}}>
            <input
              style={{flex:1, minWidth:'200px', padding:'12px 16px', borderRadius:'8px', border:'1px solid #e8e8e4', fontSize:'0.95rem', outline:'none', color:'#1a1a1a', background:'#f8f8f6'}}
              placeholder="Ville, quartier, référence..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              style={{padding:'12px 16px', borderRadius:'8px', border:'1px solid #e8e8e4', fontSize:'0.95rem', color:'#1a1a1a', background:'#f8f8f6', cursor:'pointer'}}
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
            <button style={{padding:'12px 28px', background:'#1a1a1a', color:'#fff', border:'none', borderRadius:'8px', fontWeight:600, fontSize:'0.95rem', cursor:'pointer', whiteSpace:'nowrap'}}>
              Rechercher
            </button>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div style={{background:'#fff', borderBottom:'1px solid #e8e8e4', padding:'2rem 4rem', display:'flex', justifyContent:'center', gap:'6rem', flexWrap:'wrap'}}>
        {[['12', 'Agences'], ['500+', 'Biens disponibles'], ['2 000+', 'Clients accompagnés'], ['15 ans', "D'expertise"]].map(([val, label]) => (
          <div key={label} style={{textAlign:'center'}}>
            <div style={{fontSize:'1.75rem', fontWeight:900, color:'#1a1a1a', letterSpacing:'-1px'}}>{val}</div>
            <div style={{fontSize:'0.8rem', color:'#888', fontWeight:500, marginTop:'4px', textTransform:'uppercase', letterSpacing:'1px'}}>{label}</div>
          </div>
        ))}
      </div>

      {/* LISTINGS */}
      <main style={{maxWidth:'1320px', margin:'0 auto', padding:'4rem 2rem'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'2.5rem'}}>
          <div>
            <h2 style={{fontSize:'1.75rem', fontWeight:900, color:'#1a1a1a', letterSpacing:'-1px'}}>Nos annonces</h2>
            <p style={{color:'#888', marginTop:'6px', fontSize:'0.9rem'}}>{filtered.length} bien{filtered.length !== 1 ? 's' : ''} disponible{filtered.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {loading ? (
          <div style={{textAlign:'center', padding:'5rem', color:'#aaa'}}>Chargement des annonces...</div>
        ) : filtered.length === 0 ? (
          <div style={{textAlign:'center', padding:'5rem', background:'#fff', borderRadius:'16px', border:'1px solid #e8e8e4'}}>
            <p style={{color:'#aaa', fontSize:'1.1rem'}}>Aucun bien ne correspond à votre recherche.</p>
          </div>
        ) : (
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))', gap:'1.5rem'}}>
            {filtered.map(bien => (
              <Link to={`/biens/${bien.id}`} key={bien.id}
                style={{background:'#fff', borderRadius:'16px', overflow:'hidden', border:'1px solid #e8e8e4', display:'block', textDecoration:'none', color:'inherit', transition:'all 0.2s'}}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 16px 40px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
              >
                <div style={{position:'relative', height:'210px', overflow:'hidden'}}>
                  <img
                    src={getPhoto(bien.type, bien.id)}
                    alt={bien.titre}
                    style={{width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.4s'}}
                    onMouseEnter={e => e.target.style.transform='scale(1.06)'}
                    onMouseLeave={e => e.target.style.transform='scale(1)'}
                  />
                  <div style={{position:'absolute', top:'12px', left:'12px'}}>
                    <span style={{background: bien.statut === 'DISPONIBLE' ? '#1a1a1a' : '#dc2626', color:'#fff', padding:'4px 12px', borderRadius:'6px', fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.5px', textTransform:'uppercase'}}>
                      {bien.statut === 'DISPONIBLE' ? 'Disponible' : bien.statut === 'EN_COURS' ? 'En cours' : 'Vendu'}
                    </span>
                  </div>
                  <div style={{position:'absolute', top:'12px', right:'12px'}}>
                    <span style={{background:'rgba(255,255,255,0.92)', color:'#1a1a1a', padding:'4px 12px', borderRadius:'6px', fontSize:'0.72rem', fontWeight:600, letterSpacing:'0.5px', textTransform:'uppercase'}}>
                      {bien.type}
                    </span>
                  </div>
                </div>
                <div style={{padding:'1.25rem 1.5rem'}}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.5rem'}}>
                    <h3 style={{fontWeight:700, fontSize:'1rem', color:'#1a1a1a', flex:1, marginRight:'8px', letterSpacing:'-0.3px'}}>{bien.titre}</h3>
                    <span style={{fontWeight:900, fontSize:'1.1rem', color:'#1a1a1a', whiteSpace:'nowrap'}}>{bien.prix?.toLocaleString()} €</span>
                  </div>
                  <p style={{color:'#888', fontSize:'0.875rem', marginBottom:'1rem'}}>{bien.ville}</p>
                  <div style={{display:'flex', gap:'1.5rem', borderTop:'1px solid #f0f0ec', paddingTop:'1rem'}}>
                    <span style={{fontSize:'0.82rem', color:'#666'}}>{bien.surface} m²</span>
                    <span style={{fontSize:'0.82rem', color:'#666'}}>{bien.nbPieces} pièces</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer style={{background:'#1a1a1a', color:'#666', padding:'4rem', marginTop:'2rem'}}>
        <div style={{maxWidth:'1320px', margin:'0 auto', display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'3rem'}}>
          <div>
            <div style={{fontWeight:900, fontSize:'1.4rem', color:'#fff', letterSpacing:'-1px', marginBottom:'1rem'}}>YMMO</div>
            <p style={{fontSize:'0.875rem', maxWidth:'260px', lineHeight:1.7}}>La référence de l'immobilier résidentiel et professionnel en France depuis 2009.</p>
          </div>
          <div style={{fontSize:'0.875rem', lineHeight:2}}>
            <p style={{color:'#fff', fontWeight:600, marginBottom:'0.5rem', textTransform:'uppercase', letterSpacing:'1px', fontSize:'0.75rem'}}>Contact</p>
            <p>Siège social — Aix-en-Provence</p>
            <p>04 42 00 00 00</p>
            <p>contact@ymmo.fr</p>
          </div>
        </div>
        <div style={{maxWidth:'1320px', margin:'3rem auto 0', borderTop:'1px solid #2a2a2a', paddingTop:'2rem', display:'flex', justifyContent:'space-between', fontSize:'0.78rem'}}>
          <span>© 2024 Ymmo — Tous droits réservés</span>
          <span>12 agences en France</span>
        </div>
      </footer>
    </div>
  );
}