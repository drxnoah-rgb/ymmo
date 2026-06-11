import os
import psycopg2
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

# Connexion PostgreSQL
conn = psycopg2.connect(
    host=os.environ.get("DB_HOST", "localhost"),
    port=int(os.environ.get("DB_PORT", "5432")),
    database=os.environ.get("DB_NAME", "ymmo"),
    user=os.environ.get("DB_USER", "postgres"),
    password=os.environ.get("DB_PASSWORD", "root")
)

print("Connexion PostgreSQL OK")

# Chargement des données
query = """
    SELECT b.id, b.titre, b.prix, b.surface, b.nb_pieces, b.type, b.statut, b.ville, b.code_postal,
           a.nom as agence_nom, a.ville as agence_ville
    FROM biens b
    LEFT JOIN agences a ON b.agence_id = a.id
"""
df = pd.read_sql(query, conn)
conn.close()

print(f"\nNombre total de biens : {len(df)}")
print(f"Colonnes : {list(df.columns)}\n")

# ============================================================
# 1. STATISTIQUES GÉNÉRALES
# ============================================================
print("=" * 50)
print("STATISTIQUES GÉNÉRALES")
print("=" * 50)
print(f"Prix moyen global     : {df['prix'].mean():,.0f} €")
print(f"Prix médian global    : {df['prix'].median():,.0f} €")
print(f"Prix minimum          : {df['prix'].min():,.0f} €")
print(f"Prix maximum          : {df['prix'].max():,.0f} €")
print(f"Surface moyenne       : {df['surface'].mean():.1f} m²")
print(f"Nb pièces moyen       : {df['nb_pieces'].mean():.1f}")

# ============================================================
# 2. ANALYSE PAR VILLE
# ============================================================
print("\n" + "=" * 50)
print("ANALYSE PAR VILLE")
print("=" * 50)
ville_stats = df.groupby('ville').agg(
    nb_biens=('id', 'count'),
    prix_moyen=('prix', 'mean'),
    prix_min=('prix', 'min'),
    prix_max=('prix', 'max'),
    surface_moyenne=('surface', 'mean')
).round(0).sort_values('prix_moyen', ascending=False)
print(ville_stats.to_string())

# ============================================================
# 3. ANALYSE PAR TYPE DE BIEN
# ============================================================
print("\n" + "=" * 50)
print("ANALYSE PAR TYPE DE BIEN")
print("=" * 50)
type_stats = df.groupby('type').agg(
    nb_biens=('id', 'count'),
    prix_moyen=('prix', 'mean'),
    surface_moyenne=('surface', 'mean')
).round(0).sort_values('nb_biens', ascending=False)
print(type_stats.to_string())

# ============================================================
# 4. PRIX AU M²
# ============================================================
print("\n" + "=" * 50)
print("PRIX AU M² PAR VILLE")
print("=" * 50)
df_surface = df[df['surface'] > 0].copy()
df_surface['prix_m2'] = df_surface['prix'] / df_surface['surface']
prix_m2_ville = df_surface.groupby('ville')['prix_m2'].mean().round(0).sort_values(ascending=False)
for ville, prix in prix_m2_ville.items():
    print(f"  {ville:<20} : {prix:,.0f} €/m²")

# ============================================================
# 5. STATUTS DES BIENS
# ============================================================
print("\n" + "=" * 50)
print("RÉPARTITION DES STATUTS")
print("=" * 50)
statut_counts = df['statut'].value_counts()
for statut, count in statut_counts.items():
    pct = count / len(df) * 100
    print(f"  {statut:<15} : {count} biens ({pct:.1f}%)")

# ============================================================
# 6. GRAPHIQUES
# ============================================================
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.suptitle('Analyse du marché immobilier — Ymmo', fontsize=16, fontweight='bold', y=1.02)

colors = ['#1a1a1a', '#4a4a4a', '#888888', '#b0b0b0', '#d0d0d0']

# Graphique 1 — Prix moyen par ville
ax1 = axes[0, 0]
villes = ville_stats.index.tolist()
prix = ville_stats['prix_moyen'].tolist()
bars = ax1.bar(villes, prix, color=colors[:len(villes)], edgecolor='white', linewidth=0.5)
ax1.set_title('Prix moyen par ville (€)', fontweight='bold', pad=10)
ax1.set_ylabel('Prix (€)')
ax1.tick_params(axis='x', rotation=20)
for bar, val in zip(bars, prix):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 5000,
             f'{val:,.0f}€', ha='center', va='bottom', fontsize=8, fontweight='bold')
ax1.spines['top'].set_visible(False)
ax1.spines['right'].set_visible(False)

# Graphique 2 — Répartition par type
ax2 = axes[0, 1]
type_counts = df['type'].value_counts()
wedges, texts, autotexts = ax2.pie(type_counts.values, labels=type_counts.index,
                                    autopct='%1.1f%%', colors=colors[:len(type_counts)],
                                    startangle=90, pctdistance=0.85)
for text in autotexts:
    text.set_fontsize(9)
ax2.set_title('Répartition par type de bien', fontweight='bold', pad=10)

# Graphique 3 — Prix au m² par ville
ax3 = axes[1, 0]
villes_m2 = prix_m2_ville.index.tolist()
prix_m2 = prix_m2_ville.values.tolist()
bars3 = ax3.barh(villes_m2, prix_m2, color=colors[:len(villes_m2)], edgecolor='white')
ax3.set_title('Prix au m² par ville (€/m²)', fontweight='bold', pad=10)
ax3.set_xlabel('€/m²')
for bar, val in zip(bars3, prix_m2):
    ax3.text(val + 50, bar.get_y() + bar.get_height()/2,
             f'{val:,.0f} €/m²', va='center', fontsize=8, fontweight='bold')
ax3.spines['top'].set_visible(False)
ax3.spines['right'].set_visible(False)

# Graphique 4 — Statuts
ax4 = axes[1, 1]
statut_labels = statut_counts.index.tolist()
statut_vals = statut_counts.values.tolist()
bars4 = ax4.bar(statut_labels, statut_vals, color=colors[:len(statut_labels)], edgecolor='white')
ax4.set_title('Répartition des statuts', fontweight='bold', pad=10)
ax4.set_ylabel('Nombre de biens')
for bar, val in zip(bars4, statut_vals):
    ax4.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.05,
             str(val), ha='center', va='bottom', fontweight='bold')
ax4.spines['top'].set_visible(False)
ax4.spines['right'].set_visible(False)

plt.tight_layout()
plt.savefig('rapport_ymmo.png', dpi=150, bbox_inches='tight')
plt.show()
print("\nGraphiques sauvegardés dans rapport_ymmo.png")

# ============================================================
# 7. PRÉVISIONS SIMPLES
# ============================================================
print("\n" + "=" * 50)
print("PRÉVISIONS & RECOMMANDATIONS")
print("=" * 50)
ville_top = ville_stats['prix_moyen'].idxmax()
ville_abordable = ville_stats['prix_moyen'].idxmin()
type_top = type_stats['nb_biens'].idxmax()

print(f"Ville la plus valorisee  : {ville_top} ({ville_stats.loc[ville_top, 'prix_moyen']:,.0f} €/bien en moyenne)")
print(f"Ville la plus abordable  : {ville_abordable} ({ville_stats.loc[ville_abordable, 'prix_moyen']:,.0f} €/bien en moyenne)")
print(f"Type de bien le + demande: {type_top} ({type_stats.loc[type_top, 'nb_biens']} annonces)")
print(f"Taux de disponibilite    : {(df['statut']=='DISPONIBLE').sum() / len(df) * 100:.1f}%")
print(f"\nRapport genere le : {datetime.now().strftime('%d/%m/%Y %H:%M')}")