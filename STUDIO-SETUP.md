# Studio vidéo auto — guide des comptes

Tu n’as **rien à faire** au quotidien sauf choisir un thème dans `/studio`.  
Le système génère le script (Claude), la voix (ElevenLabs), le montage (Shotstack), puis publie (Ayrshare) sur YouTube, TikTok, Instagram et Facebook.

## 0. Prérequis déjà en place

- Projet Supabase (même que la formation)
- Compte Vercel pour le déploiement + Blob
- Connexion Supabase avec l’email admin : `derra_vending@hotmail.com` (ou `STUDIO_ADMIN_EMAILS`)

### SQL à exécuter une fois

Dans Supabase → **SQL Editor**, colle et exécute le fichier [`supabase/studio.sql`](supabase/studio.sql).

---

## Ordre recommandé (crée les comptes au fur et à mesure)

### 1. Anthropic (Claude) — scripts

1. Va sur [console.anthropic.com](https://console.anthropic.com)
2. Crée un compte / projet
3. **API Keys** → Create Key
4. Colle dans `.env.local` :

```env
ANTHROPIC_API_KEY=sk-ant-...
```

### 2. Pexels — clips vidéo gratuits

1. [pexels.com/api](https://www.pexels.com/api/)
2. Demande une API key (gratuit)
3. Colle :

```env
PEXELS_API_KEY=...
```

### 3. ElevenLabs — voix FR

1. [elevenlabs.io](https://elevenlabs.io)
2. Profile → API Key
3. (Optionnel) choisis une voix FR dans Voice Library, copie l’ID
4. Colle :

```env
ELEVENLABS_API_KEY=...
# ELEVENLABS_VOICE_ID=...
```

### 4. Shotstack — montage cloud

1. [shotstack.io](https://shotstack.io) → signup
2. Dashboard → API Keys (**v1** / production pour la clé prod)
3. Colle :

```env
SHOTSTACK_API_KEY=...
SHOTSTACK_ENV=v1
# Optionnel — rendu via template Studio (sinon fallback edit JSON 9:16)
SHOTSTACK_TEMPLATE_ID=ebfd5599-2d4f-465e-a5d8-1c62d95a67a1
```

Si `SHOTSTACK_TEMPLATE_ID` est défini, le pipeline appelle `POST /templates/render` avec des merge fields. En cas d’échec, fallback automatique sur l’edit JSON généré dans `lib/studio/render.ts` (voix ElevenLabs + clips Pexels + captions, 9:16).

#### Template actuel (`ebfd5599-…`)

C’est le template Shotstack **« Real Estate Slideshow with Overlays »** (paysage 1024×576, musique intégrée — **pas** la voix TTS). Champs merge utilisés :

| Champ | Mapping Derra |
|-------|----------------|
| `ADDRESS` | titre du script |
| `SUBURB` / `STATE` / `POSTCODE` | Meyrin / GE / 1217 |
| `TYPE` | hook |
| `BEDROOMS` / `BATHROOMS` / `CARPORTS` | stats décoratives (40 / 24 / 7) |
| `IMAGE_1` … `IMAGE_5` | previews Pexels (+ logo en secours) |
| `AGENT_NAME` / `AGENT_EMAIL` | fondateur / email Derra |
| `AGENT_PICTURE` / `AGENCY_LOGO` | `/brand/logo.png` |

Alias aussi envoyés (ignorés tant qu’absents du template) pour un futur template Derra 9:16 : `TITLE`, `HOOK`, `SCRIPT`, `CAPTION`, `AUDIO_URL`, `DURATION`.

**Recommandé** : dans Shotstack Studio, dupliquer / créer un template vertical 9:16 avec placeholders `{{ TITLE }}`, `{{ HOOK }}`, `{{ SCRIPT }}`, `{{ CAPTION }}`, `{{ AUDIO_URL }}`, `{{ IMAGE_1 }}`… et remplacer `SHOTSTACK_TEMPLATE_ID`.

CLI local (optionnel) : `npx shotstack` via la dep `@shotstack/cli`.

### 5. Vercel Blob — stockage audio

1. Vercel → ton projet → **Storage** → Create → **Blob**
2. Copie le `BLOB_READ_WRITE_TOKEN`
3. Colle :

```env
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
```

### 6. Metricool — publication auto

1. [app.metricool.com](https://app.metricool.com) → Account Settings → **API** → copie le token
2. Connecte **YouTube**, **TikTok**, **Instagram**, **Facebook** dans Metricool
   - TikTok : compte Business/Creator, et dans Metricool choisis la confidentialité **Public** (sinon la pub TikTok échoue souvent)
3. Ouvre ta marque : l’URL ressemble à  
   `https://app.metricool.com/...?blogId=123456&userId=789012`
4. Colle dans `.env.local` :

```env
METRICOOL_API_TOKEN=...
METRICOOL_USER_ID=789012
METRICOOL_BLOG_ID=123456
METRICOOL_TIMEZONE=Europe/Zurich
# Optionnel — logo pour watermark / miniature
# STUDIO_LOGO_URL=https://derra-vending.ch/brand/logo.png
```

(Ayrshare n’est plus utilisé.)

### 7. Cron secret

Dans `.env.local` **et** Vercel → Environment Variables :

```env
CRON_SECRET=une-longue-chaine-secrete
STUDIO_ADMIN_EMAILS=derra_vending@hotmail.com
NEXT_PUBLIC_SITE_URL=https://derra-vending.ch
```

Vercel envoie automatiquement `Authorization: Bearer <CRON_SECRET>` aux crons.

---

## Utilisation

1. Connecte-toi avec l’email admin
2. Ouvre `/studio`
3. Choisis un thème (ou écris un thème libre)
4. Clique **Générer & publier maintenant**

Pipeline : Claude → ElevenLabs → Pexels → Shotstack → Metricool → 4 réseaux.

Le cron (`vercel.json`, **1×/jour** à 07:00 UTC — limite Hobby) :
1. finalise les montages → publie Metricool  
2. génère **1 histoire** café / vending / machines (quota max **5/jour**)

Pour **5 vidéos/jour** sur le plan Hobby : crée 5 tâches sur [cron-job.org](https://cron-job.org) qui appellent  
`GET https://derra-vending.vercel.app/api/studio/cron`  
avec header `Authorization: Bearer TON_CRON_SECRET`  
(ex. 8h, 11h, 14h, 17h, 20h heure Genève).

Thèmes : histoire du vending, origines du café, machines, anecdotes — style conteur jusqu’à la chute.

---

## Checklist rapide

| Service | Variable | Rôle |
|---------|----------|------|
| Anthropic | `ANTHROPIC_API_KEY` | Script |
| ElevenLabs | `ELEVENLABS_API_KEY` | Voix |
| Pexels | `PEXELS_API_KEY` | Images/clips |
| Shotstack | `SHOTSTACK_API_KEY` (+ `SHOTSTACK_ENV`, `SHOTSTACK_TEMPLATE_ID`) | Montage |
| Vercel Blob | `BLOB_READ_WRITE_TOKEN` | Audio |
| Metricool | `METRICOOL_API_TOKEN` + `USER_ID` + `BLOG_ID` | Publication |
| Supabase | déjà configuré + `studio.sql` | Jobs |
| Cron | `CRON_SECRET` | Auto toutes les 10 min |

---

## Mode carousel TikTok (photos + musique)

Style **Photo TikTok** 9:16 : photos réelles (`public/gallery/`) + bulles texte blanches FR + **musique de fond royalty-free** (Unminus / CDN Shotstack — pas de hits TikTok copyrightés). TTS optionnel (désactivé sur l’exemple test).

### Bouton exemple

Dans `/studio` → **« Générer exemple TikTok »** (ou `POST /api/studio/test-example` avec session admin / `Authorization: Bearer $CRON_SECRET`) :
- thème hardcodé `installer-premier-distributeur`
- 5 slides éducatifs (hook → produits → camion → réassort / CTA)
- images `public/gallery/` via URL publique (`STUDIO_PUBLIC_ASSET_BASE` ou `https://derra-vending.vercel.app`)
- fallback Pexels si une photo gallery n’est pas joignable
- musique : `STUDIO_BG_MUSIC_URL` ou Unminus `ambition.mp3` (Shotstack)
- **pas besoin** de Claude / ElevenLabs pour ce test

Prérequis : `SHOTSTACK_API_KEY` + tables [`supabase/studio.sql`](supabase/studio.sql) + login admin (ou CRON_SECRET).  
Si les tables manquent → exécute ce SQL dans le SQL Editor Supabase.

En local, Shotstack ne peut pas rappeler `localhost` : utilise **« Rafraîchir statut (Shotstack) »** après 1–3 min.

