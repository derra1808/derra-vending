# Formation Derra Vending — Pack 50 CHF

## Générer les fichiers

```bash
npm run generate:formation
```

Crée dans `private/formation/` :
- `ebook.pdf`
- `contrat-depot-gratuit.pdf`
- `scripts-prospection.pdf`
- `checklist-premiere-machine.pdf`
- `calculateur-marges.pdf`

## Vidéos (à déposer toi-même)

### Teaser public (landing)
`public/formation/presentation.mp4`

### Modules membres (protégés)
`private/formation/videos/` :
- `01-presentation.mp4`
- `02-business-model.mp4`
- `03-prospection.mp4`
- `04-machines.mp4`
- `05-gestion.mp4`
- `06-chiffres.mp4`

## Stripe

Crée un produit **50.00 CHF** en Live et mets le Price ID dans `.env.local` :
```
STRIPE_PRICE_EBOOK=price_...
```

## Accès

Téléchargements : `/api/formation/download?file=...` (auth + has_paid)  
Vidéos : `/api/formation/video/[id]` (auth + has_paid)  
`/formation/ebook.pdf` public est bloqué (redirect pricing).
