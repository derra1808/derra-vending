# Derra Vending — Site vitrine premium

Site internet professionnel pour **Derra Vending**, distributeurs automatiques à Genève.

## Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion**
- **Lucide Icons**

## Prérequis

Installez [Node.js](https://nodejs.org/) (version 18 ou supérieure).

## Installation

```bash
cd C:\Users\Derra\Projects\derra-vending
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

## Build production

```bash
npm run build
npm start
```

## Structure

```
app/              → Pages et layout
components/       → Sections du site
lib/data.ts       → Données entreprise & contenu
public/gallery/   → 54 photos réelles d'installations
public/brand/     → Logo Derra Vending
```

## Déploiement

Recommandé : [Vercel](https://vercel.com) ou [Netlify](https://netlify.com)

1. Poussez le projet sur GitHub
2. Connectez le repo à Vercel
3. Domaine suggéré : `derra-vending.ch`

## Personnalisation

- **Logos clients** : remplacez les logos fictifs dans `components/Clients.tsx`
- **Réseaux sociaux** : mettez vos vrais liens dans `components/Footer.tsx`
- **Email formulaire** : actuellement via `mailto:` — pour un envoi automatique, connectez Formspree, Resend ou un API route

## Contact entreprise

- **Tél** : +41 79 757 08 97
- **Email** : derra_vending@hotmail.com
- **Adresse** : Rue de la Golette 15G, 1217 Meyrin
- **UID** : CHE-322.659.692
