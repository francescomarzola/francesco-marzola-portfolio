# francescomarzola.it

Sito personale di Francesco Marzola. React + Vite, pubblicato su Vercel.

## Dove sono le cose

- `src/data/Scena.json` — tutte le scene: testi, ordine, tema, visibilità, progetti e media
- `src/data/Sito.json` — nome, ruolo, foto, CTA, email, link del footer
- `src/data/StileScena.json` — stili per tipo di scena
- `public/media/` — immagini e video (referenziati come `/media/nome-file`)
- `src/components/portfolio/ContactForm.jsx` — form contatti, inviato via FormSubmit all'email in `Sito.json`
- `api/latest-unlikeness.js` — funzione Vercel che legge l'ultimo articolo di The Unlikeness dal feed Substack

## Sviluppo

```bash
npm install
npm run dev      # sviluppo locale
npm run build    # build di produzione in dist/
```

Ogni push su `main` viene pubblicato automaticamente da Vercel.
