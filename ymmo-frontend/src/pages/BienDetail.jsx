import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bienService } from '../services/api';

const PHOTOS = {
  APPARTEMENT: [
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=80',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80',
  ],
  MAISON: [
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=900&q=80',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=900&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80',
  ],
  BUREAU: [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80',
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&q=80',
  ],
  TERRAIN: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&q=80'],
  COMMERCE: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&q=80'],
};

function getPhoto(type, id) {
  const arr = PHOTOS[type] || PHOTOS.APPARTEMENT;
  return arr[id % arr.length];
}

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

  if (loading) return (
    <div style={{minHeight:'100vh', background:'#f8f8f6', display:'flex', alignItems:'center', justifyContent:'center', color:'#aaa', fontSize:'0.95rem'}}>
      Chargement...
    </div>
  );
  if (!bien) return (
    <div style={{minHeight:'100vh', background:'#f8f8f6', display:'flex', alignItems:'center', justifyContent:'center', color:'#aaa', fontSize:'0.95rem'}}>
      Bien non trouvé.
    </div>
  );

  const statutColor = bien.statut === 'DISPONIBLE' ? '#1a1a1a' : '#dc2626';

  return (
    <div style={{fontFamily:"'Segoe UI', sans-serif", minHeight:'100vh', background:'#f8f8f6', color:'#1a1a1a'}}>

      {/* NAVBAR */}
      <nav style={{background:'#fff', borderBottom:'1px solid #e8e8e4', padding:'0 4rem', height:'72px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100}}>
        <Link to="/" style={{fontWeight:900, fontSize:'1.6rem', color:'#1a1a1a', textDecoration:'none', letterSpacing:'-1.5px'}}>
          YMMO
        </Link>
        <Link to="/" style={{fontSize:'0.875rem', color:'#666', textDecoration:'none', fontWeight:500, display:'flex', alignItems:'center', gap:'6px'}}>
          ← Retour aux annonces
        </Link>
      </nav>

      <main style={{maxWidth:'1000px', margin:'3rem auto', padding:'0 2rem'}}>

        {/* PHOTO */}
        <div style={{borderRadius:'16px', overflow:'hidden', height:'420px', marginBottom:'2rem', border:'1px solid #e8e8e4'}}>
          <img
            src={getPhoto(bien.type, bien.id)}
            alt={bien.titre}
            style={{width:'100%', height:'100%', objectFit:'cover'}}
          />
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 340px', gap:'2rem', alignItems:'start'}}>

          {/* CONTENU PRINCIPAL */}
          <div>
            <div style={{display:'flex', gap:'8px', marginBottom:'1rem'}}>
              <span style={{background: statutColor, color:'#fff', padding:'4px 12px', borderRadius:'6px', fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.5px', textTransform:'uppercase'}}>
                {bien.statut === 'DISPONIBLE' ? 'Disponible' : bien.statut === 'EN_COURS' ? 'En cours' : 'Vendu'}
              </span>
              <span style={{background:'#f0f0ec', color:'#444', padding:'4px 12px', borderRadius:'6px', fontSize:'0.72rem', fontWeight:600, letterSpacing:'0.5px', textTransform:'uppercase'}}>
                {bien.type}
              </span>
            </div>

            <h1 style={{fontSize:'2rem', fontWeight:900, letterSpacing:'-1px', margin:'0 0 0.5rem', color:'#1a1a1a'}}>
              {bien.titre}
            </h1>
            <p style={{color:'#888', fontSize:'0.95rem', margin:'0 0 1.5rem'}}>
              {bien.adresse && `${bien.adresse}, `}{bien.ville} {bien.codePostal}
            </p>

            <div style={{display:'flex', gap:'2rem', padding:'1.5rem 0', borderTop:'1px solid #e8e8e4', borderBottom:'1px solid #e8e8e4', marginBottom:'2rem'}}>
              <div>
                <div style={{fontSize:'0.75rem', color:'#aaa', fontWeight:600, textTransform:'uppercase', letterSpacing:'1px', marginBottom:'4px'}}>Surface</div>
                <div style={{fontSize:'1.2rem', fontWeight:800, color:'#1a1a1a'}}>{bien.surface} m²</div>
              </div>
              <div>
                <div style={{fontSize:'0.75rem', color:'#aaa', fontWeight:600, textTransform:'uppercase', letterSpacing:'1px', marginBottom:'4px'}}>Pièces</div>
                <div style={{fontSize:'1.2rem', fontWeight:800, color:'#1a1a1a'}}>{bien.nbPieces}</div>
              </div>
              <div>
                <div style={{fontSize:'0.75rem', color:'#aaa', fontWeight:600, textTransform:'uppercase', letterSpacing:'1px', marginBottom:'4px'}}>Type</div>
                <div style={{fontSize:'1.2rem', fontWeight:800, color:'#1a1a1a'}}>{bien.type}</div>
              </div>
            </div>

            <div>
              <h3 style={{fontSize:'1rem', fontWeight:700, color:'#1a1a1a', marginBottom:'0.75rem'}}>Description</h3>
              <p style={{color:'#666', lineHeight:1.8, fontSize:'0.95rem'}}>
                {bien.description || 'Aucune description disponible pour ce bien.'}
              </p>
            </div>
          </div>

          {/* SIDEBAR PRIX */}
          <div style={{background:'#fff', borderRadius:'16px', border:'1px solid #e8e8e4', padding:'2rem', position:'sticky', top:'88px'}}>
            <div style={{fontSize:'2rem', fontWeight:900, color:'#1a1a1a', letterSpacing:'-1px', marginBottom:'0.25rem'}}>
              {bien.prix?.toLocaleString()} €
            </div>
            <p style={{color:'#aaa', fontSize:'0.8rem', marginBottom:'1.5rem'}}>
              {bien.surface > 0 ? `${Math.round(bien.prix / bien.surface).toLocaleString()} €/m²` : ''}
            </p>

            {bien.statut === 'DISPONIBLE' ? (
              <Link to="/login" style={{display:'block', textAlign:'center', background:'#1a1a1a', color:'#fff', padding:'0.875rem', borderRadius:'8px', textDecoration:'none', fontWeight:700, fontSize:'0.95rem', letterSpacing:'0.2px'}}>
                Contacter l'agence
              </Link>
            ) : (
              <div style={{textAlign:'center', padding:'0.875rem', borderRadius:'8px', background:'#f0f0ec', color:'#aaa', fontSize:'0.95rem', fontWeight:600}}>
                {bien.statut === 'VENDU' ? 'Ce bien est vendu' : 'Traitement en cours'}
              </div>
            )}

            <div style={{marginTop:'1.5rem', paddingTop:'1.5rem', borderTop:'1px solid #e8e8e4'}}>
              <p style={{fontSize:'0.78rem', color:'#aaa', textAlign:'center', lineHeight:1.6}}>
                Ymmo — Agence immobilière<br />
                04 42 00 00 00 · contact@ymmo.fr
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
