# Passer en paiements réels (Stripe Live)

## 1. Activer ton compte Stripe (obligatoire)

1. [dashboard.stripe.com](https://dashboard.stripe.com)
2. Clique **Activer les paiements** (ou **Settings → Business**)
3. Remplis :
   - Nom : **Derra Vending** / Ibrahim Derra
   - Adresse : Meyrin, Suisse
   - **IBAN** suisse pour recevoir l'argent
   - Activité : formation / vente de contenu digital
4. Stripe peut demander une pièce d'identité — normal en Suisse

Sans cette étape, le mode Live reste bloqué.

---

## 2. Passer en mode Live

1. En haut à droite : désactive **Environnement de test**
2. Tu es maintenant en **Live** (plus de bandeau orange)

---

## 3. Créer le produit réel (1 CHF pour lancer)

1. **Catalogue de produits** → **Ajouter un produit**
2. Nom : `Le Café en Dépôt Gratuit`
3. Prix : **1.00 CHF** — paiement unique (tu pourras passer à 97 CHF plus tard)
4. Copie le **Price ID** Live → `price_...`

*(Optionnel : produits coaching 150 CHF et 490 CHF)*

---

## 4. Clés API Live

**Developers → API keys** (en mode Live, pas Test)

- **Secret key** → `sk_live_...`
- Ne partage jamais cette clé

---

## 5. Mettre à jour `.env.local` (local) et Vercel (site en ligne)

```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PRICE_EBOOK=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Important :** remplace les clés `sk_test_` par `sk_live_`.

---

## 6. Webhook (site déployé sur derra-vending.ch)

1. Stripe Live → **Developers → Webhooks → Add endpoint**
2. URL : `https://derra-vending.ch/api/stripe/webhook`
3. Événement : `checkout.session.completed`
4. Copie **Signing secret** → `STRIPE_WEBHOOK_SECRET`

Sur Vercel : ajoute toutes les variables d'environnement en mode **Production**.

---

## 7. Supabase (production)

**Authentication → URL Configuration :**
- Site URL : `https://derra-vending.ch`
- Redirect URLs : `https://derra-vending.ch/api/auth/callback`

---

## Où va l'argent en Live ?

```
Client paie 1 CHF
    ↓
Compte Stripe (derra vending)
    ↓ (commission Stripe ~2.9% + 0.30 CHF)
Virement sur ton IBAN suisse (2–7 jours ouvrés)
```

Tu suis tout dans **Stripe → Balances / Payouts**.

---

## Checklist avant de lancer

- [ ] Compte Stripe activé + IBAN renseigné
- [ ] Produit **1 CHF** créé en **Live**
- [ ] `sk_live_...` + `price_...` dans Vercel
- [ ] Webhook configuré sur le domaine public
- [ ] PDF ebook dans `public/formation/ebook.pdf`
- [ ] Test avec **ta propre carte** (petit montant possible d'abord)

---

## Test vs Live

| | Test | Live |
|---|------|------|
| Clé | `sk_test_` | `sk_live_` |
| Carte 4242... | Simulation | Ne marche pas |
| Argent | Aucun | **Vrai — sur ton IBAN** |
