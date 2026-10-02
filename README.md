# WMS Company · TRIO — Outside Catering Services

Site vitrine moderne, clair et animé, généré à partir de la présentation commerciale
**« WMS V4 » — Tunisie 2026**. Il reprend les 7 chapitres du PDF :

| # | Chapitre PDF | Section du site |
|---|---|---|
| 01 | Introduction & Qui sommes-nous | `#about-section` |
| 02 | Proposition de valeur | `#value-section` |
| 03 | Nos 3 piliers (Outside Catering · Événementiel · Plateaux-repas) | `#services-section` |
| 04 | Excellence opérationnelle | `#operations-section` |
| 05 | Références & Cas d'usage | `#references-section` |
| 06 | Pourquoi TRIO | `#why-section` |
| 07 | FAQ, Devis & Contact | `#faq-section`, `#contact-section` |

> ⚠️ **Note sur le contenu** : le PDF (22 Mo) n'a pu être lu que partiellement (couverture, sommaire et début du chapitre « Qui sommes-nous »). Les textes des autres sections, les chiffres clés, les cas d'usage, les témoignages, la FAQ et les coordonnées (`+216 00 000 000`, `contact@wms-company.tn`) sont des **contenus de remplacement cohérents** à remplacer par les vrais textes du PDF.

## ✨ Fonctionnalités réalisées

- Design **light / éditorial** : palette crème, vert forêt et or ; typographies *Cormorant Garamond* + *Inter*.
- **Animations & transitions** : loader d'intro, barre de progression de scroll, header qui se compacte, reveal au scroll (IntersectionObserver), compteurs animés, blobs flottants, cartes flottantes, bandeau marquee, hover states soignés, slider de témoignages auto-play, accordéon FAQ animé.
- **Responsive** complet (desktop / tablette / mobile) avec menu burger plein écran.
- **Accessibilité** : HTML sémantique, labels, `aria-*`, focus visible, `prefers-reduced-motion` respecté.
- **Formulaire de devis** : validation client, enregistrement via l'API Table (`tables/quote_requests`) quand elle existe, sinon **repli automatique vers `mailto:`** (donc fonctionnel sur Vercel sans backend).
- SEO de base : meta description, Open Graph, favicon SVG.

## 📁 Structure

```
index.html          Page unique (toutes les sections)
css/style.css       Styles, animations, responsive
js/main.js          Navigation, reveal, compteurs, slider, FAQ, formulaire
images/             Visuels (licence CC/Domaine public)
favicon.svg
vercel.json         Config Vercel (clean URLs, headers cache & sécurité)
package.json        Scripts de prévisualisation locale
```

## 🔗 Points d'entrée

- `/` ou `/index.html` — page unique ; ancres : `#hero-section`, `#about-section`, `#value-section`, `#services-section`, `#operations-section`, `#references-section`, `#why-section`, `#faq-section`, `#contact-section`.
- `POST tables/quote_requests` — enregistrement d'une demande de devis (environnement Genspark uniquement).

## 🗄️ Données

Table `quote_requests` : `id`, `name`, `company`, `email`, `phone`, `service` (Outside Catering | Événementiel | Plateaux-repas | Autre), `guests` (number), `date`, `message`, `status` (nouveau | en cours | devis envoyé | clos).

## 🚀 Déploiement

### Vercel (recommandé par l'utilisateur)
Le site est 100 % statique — aucun build nécessaire.
1. Pousser le dépôt sur GitHub / GitLab / Bitbucket.
2. Sur Vercel : **Add New Project → Import** → Framework preset **« Other »**, Build Command vide, Output Directory `.` (racine).
3. Deploy. `vercel.json` gère les clean URLs et les headers de cache.
   Ou en CLI : `npx vercel` puis `npx vercel --prod`.

Sur Vercel, l'endpoint `tables/…` n'existe pas : le formulaire bascule automatiquement sur `mailto:`. Pour un vrai envoi d'e-mails, brancher Formspree, Web3Forms, Resend ou une Serverless Function Vercel (`/api/quote.js`).

### Genspark
Onglet **Publish** (quick-share) ou **Hosted Deploy** (le formulaire écrit alors dans la base D1 via l'API Table).

### Local
```bash
npm run dev   # http://localhost:3000
```

## 🧭 Prochaines étapes recommandées

1. Remplacer les textes de remplacement par le contenu exact du PDF (chiffres, références clients, FAQ, coordonnées, réseaux sociaux).
2. Ajouter le logo officiel WMS/TRIO et les photos réelles des prestations.
3. Connecter le formulaire à un service d'e-mail (Formspree / Web3Forms / fonction Vercel).
4. Ajouter une galerie photo / page menus téléchargeable (PDF).
5. Intégrer Google Analytics ou Plausible, et un plan de site XML.
