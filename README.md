# Francesco Marzola — Portfolio (versione standalone, senza Base44)

Sito personale di Francesco Marzola: React 18 + Vite + Tailwind, **completamente statico**.
Non dipende più da Base44: niente SDK, niente database remoto, niente login.
Pubblicabile gratis su GitHub Pages.

## Dove sono i contenuti

| Cosa | File |
|---|---|
| Scene, testi, progetti | `src/api/local-Scena.json` |
| Header, footer, email, modale contatto | `src/api/local-Sito.json` |
| Stili delle scene | `src/api/local-StileScena.json` |
| Immagini e video | `public/media/` (si richiamano come `/media/nome-file`) |
| Titolo, descrizione SEO, testo `<noscript>` | `index.html` |

Per cambiare un testo basta modificare il JSON e ripubblicare (push su `main`).
`src/api/base44Client.js` è solo un adattatore che legge questi JSON: il nome è rimasto per non toccare i componenti.

## Build in locale

Requisiti: Node.js 20.19+ (consigliato 22).

```bash
npm install
npm run dev       # sviluppo: http://localhost:5173
npm run build     # build di produzione in dist/
npm run preview   # anteprima della build: http://localhost:4173
```

`npm run build` esegue prima `scripts/fetch-newsletter.mjs`, che legge il feed RSS di
The Unlikeness (Substack) e genera `public/newsletter.json` per il widget newsletter.
Se il feed non risponde il widget semplicemente non compare; la build non fallisce.
Dopo la build, `dist/index.html` viene copiato in `dist/404.html` (necessario per una single-page app su GitHub Pages).

## Pubblicazione (GitHub Pages, gratis)

Il workflow `.github/workflows/deploy-pages.yml` è già pronto ma **non pubblica nulla finché Pages non è attivato**.

1. Il repository deve essere **pubblico** (GitHub Pages gratuito funziona solo su repo pubblici).
2. Repository → **Settings → Pages → Build and deployment → Source: "GitHub Actions"**.
3. Fare merge di questa PR su `main` (o lanciare il workflow a mano da *Actions → Deploy su GitHub Pages → Run workflow*).
4. Il sito sarà online su `https://francescomarzola.github.io/francesco-marzola-portfolio/`… ma attenzione: il progetto è configurato per stare alla **radice di un dominio** (`base: '/'`), quindi va usato con il dominio personalizzato (vedi sotto). Il file `public/CNAME` contiene già `francescomarzola.it`.
5. Settings → Pages → **Custom domain**: `francescomarzola.it`, poi spuntare **Enforce HTTPS** quando disponibile.

Il workflow ricostruisce il sito anche ogni giorno (06:17 UTC) per aggiornare l'anteprima dell'ultima newsletter.

## DNS da cambiare (DA FARE A MANO — non applicati)

Presso il provider del dominio `francescomarzola.it`, **togliere i record che oggi puntano a Base44** e impostare i record di GitHub Pages
(valori da riverificare su https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site prima di applicarli):

| Tipo | Nome | Valore |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA (facoltativo) | `@` | `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` |
| CNAME | `www` | `francescomarzola.github.io` |

Consigliato: verificare il dominio nelle impostazioni GitHub del proprio account (Settings → Pages → Verified domains) per evitare takeover.
La propagazione DNS può richiedere fino a 24-48 ore; nel frattempo il sito Base44 resta online.

## Cosa è cambiato rispetto a Base44

- Rimossi `@base44/sdk` e `@base44/vite-plugin` (e analytics/editor visuale Base44 che il plugin iniettava).
- Contenuti letti da JSON locali; media serviti da `public/media/`.
- Rimosse le pagine admin/login di Base44 (non funzionerebbero senza backend): i contenuti si modificano nei JSON.
- Funzione backend `latestUnlikeness` → script di build `scripts/fetch-newsletter.mjs`.
- Favicon: ora `public/media/Profile.png` (prima era un file ospitato su Base44).
- URL canonico nei dati strutturati (`index.html`): `https://francescomarzola.it`.

## Form "Sentiamoci" (FormSubmit, gratuito)

Le risposte del form arrivano via email tramite **FormSubmit** (formsubmit.co): gratuito, nessun account.
Destinatario: il campo `email` di `src/api/local-Sito.json` (oggi `marzola.fra@gmail.com`).

**Attivazione una tantum:** dopo la messa online, compilare il form una volta dal sito.
FormSubmit manda all'indirizzo destinatario una mail "Activate Form": cliccare il link.
Da quel momento ogni invio arriva come email (con "Rispondi" diretto al visitatore).
Se l'invio fallisce, il visitatore vede un messaggio con un link a un'email già compilata: nessun contatto si perde.

## Note

- **Video da ~56 MB** (`public/media/841965…mp4`): funziona, ma è pesante da caricare su mobile; conviene comprimerlo.
- Il progetto "Antico Forno Roscioli" non ha immagini nei dati esportati (è così anche su Base44).
