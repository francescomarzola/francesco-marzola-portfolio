# AGENTS.md

Sito personale statico (React + Vite) pubblicato su Vercel; nessun backend se non la funzione `api/latest-unlikeness.js`.

- I contenuti si modificano in `src/data/*.json`; i media stanno in `public/media/`.
- Mantieni identico l'aspetto del sito salvo richiesta esplicita.
- Ogni push su `main` va online: prima di pushare, `npm run build` deve passare.
