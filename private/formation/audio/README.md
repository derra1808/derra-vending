# Audio formation — Derra Vending

Généré avec la voix HeyGen (`HEYGEN_VOICE_ID`) — même voix que les vidéos avatar.

```bash
npm run generate:audio
npm run generate:audio -- --force
```

Fichiers servis via /api/formation/audio/[id] (membres uniquement).
En prod : upload Blob avec `node scripts/upload-formation-audio.mjs`.
