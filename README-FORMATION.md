# Formation Vending — Guide de configuration

Site de vente de l'ebook **« Le Café en Dépôt Gratuit »** avec paywall Stripe + espace membre Supabase.

**URL locale :** http://localhost:3000/formation

---

## 1. Prérequis

- Node.js 18+
- Compte [Supabase](https://supabase.com) (gratuit)
- Compte [Stripe](https://stripe.com) (gratuit en mode test)
- Compte [Vercel](https://vercel.com) pour le déploiement

---

## 2. Installation locale

```bash
npm install
cp .env.local.example .env.local
# Remplissez .env.local (voir section 3 et 4)
npm run dev
```

Ouvrez http://localhost:3000/formation

---

## 3. Configurer Supabase

### Créer le projet
1. [supabase.com](https://supabase.com) → New project
2. Notez l'URL et les clés API

### Créer la table profiles
1. Dashboard → **SQL Editor**
2. Collez le contenu de `supabase/schema.sql` et exécutez

### Activer l'authentification email
1. Authentication → Providers → Email → activé
2. Authentication → URL Configuration :
   - Site URL : `http://localhost:3000` (puis votre domaine en prod)
   - Redirect URLs : `http://localhost:3000/api/auth/callback`

### Variables à copier dans `.env.local`
| Variable | Où la trouver |
|----------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Settings → API → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Settings → API → service_role (secret) |

---

## 4. Configurer Stripe

### Créer les produits
1. Stripe Dashboard → **Products** → Add product
2. Créez 3 produits **one-time** :
   - Ebook — 97 CHF
   - Appel Q&R — 150 CHF
   - Accompagnement complet — 490 CHF
3. Copiez chaque **Price ID** (`price_...`) dans `.env.local`

### Webhook (local avec Stripe CLI)
```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```
Copiez le `whsec_...` affiché dans `STRIPE_WEBHOOK_SECRET`.

### Webhook (production Vercel)
1. Developers → Webhooks → Add endpoint
2. URL : `https://derra-vending.ch/api/stripe/webhook`
3. Événement : `checkout.session.completed`
4. Copiez le signing secret dans les variables Vercel

### Variables Stripe
| Variable | Où la trouver |
|----------|---------------|
| `STRIPE_SECRET_KEY` | Developers → API keys → Secret key |
| `STRIPE_WEBHOOK_SECRET` | Webhooks → Signing secret |
| `STRIPE_PRICE_EBOOK` | Product → Price ID |
| `STRIPE_PRICE_COACHING_CALL` | Product → Price ID |
| `STRIPE_PRICE_COACHING_FULL` | Product → Price ID |

---

## 5. Contenu à personnaliser

| Fichier | Action |
|---------|--------|
| `lib/formation/content.ts` | Votre histoire, prix, modules, témoignages |
| `lib/formation/content.ts` → `EBOOK_PARTS` | Coller le texte des 5 parties du PDF |
| `public/formation/presentation.mp4` | Votre vidéo de présentation |
| `public/formation/ebook.pdf` | Votre ebook PDF téléchargeable |

---

## 6. Flux utilisateur

1. Visiteur arrive sur `/formation`
2. Clique « Accéder à la formation » → `/formation/pricing`
3. S'inscrit → `/formation/signup`
4. Paie via Stripe Checkout
5. Webhook active `has_paid = true` dans Supabase
6. Accès à `/formation/membre` + téléchargement PDF

---

## 7. Déployer sur Vercel

```bash
git add .
git commit -m "Add formation ebook site"
git push
```

1. [vercel.com](https://vercel.com) → Import project
2. Ajoutez toutes les variables de `.env.local`
3. `NEXT_PUBLIC_SITE_URL` = `https://derra-vending.ch`
4. Mettez à jour les Redirect URLs Supabase avec votre domaine
5. Configurez le webhook Stripe en production

---

## 8. Structure des pages

| Route | Accès |
|-------|-------|
| `/formation` | Public — landing avec votre histoire |
| `/formation/pricing` | Public — tarifs + Stripe |
| `/formation/login` | Public |
| `/formation/signup` | Public |
| `/formation/membre` | Connecté + payé |
| `/formation/success` | Retour Stripe OK |
| `/formation/cancel` | Retour Stripe annulé |

---

## 9. Test rapide (mode Stripe test)

Carte test : `4242 4242 4242 4242` — date future — CVC quelconque.

1. Créez un compte sur `/formation/signup`
2. Achetez l'ebook sur `/formation/pricing`
3. Vérifiez l'accès sur `/formation/membre`
