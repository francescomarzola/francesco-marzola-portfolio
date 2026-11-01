# Francesco Marzola — Portfolio narrativo · Documento di consegna

Documento esaustivo per la ricostruzione del sito. Contiene: stack, design system, struttura, tutti i testi, colori, tipografia, animazioni, comportamenti responsive e lista dei file multimediali da caricare. Lo sviluppatore deve solo fornire le immagini/video indicati nella sezione "Media da caricare".

---

## 1. Stack tecnologico

- **Framework**: React 18 + Vite (single page app)
- **Styling**: Tailwind CSS (config con token HSL + classi mappate)
- **Animazioni**: GSAP + ScrollTrigger (reveal titoli riga per riga, fade-in testi); framer-motion (fisarmonica progetti e transizioni)
- **Font**: di sistema nativi (`ui-sans-serif, system-ui, sans-serif`) — niente Google Fonts
- **Routing**: react-router-dom (una sola rotta `/`)
- **Backend**: Base44 (entità `Scena`, `Sito`, `Risposta`); l'admin è protetto da auth
- **Pacchetti chiave**: gsap, framer-motion, lucide-react, @tanstack/react-query

> NOTA: il sito è un'app React compilata, NON un singolo HTML. Non esiste un file "index.html con dentro tutto". Va ricostruito come progetto React+Vite.

---

## 2. Design System

### 2.1 Colori

| Token | Valore | Uso |
|---|---|---|
| Sfondo base | `#F4F2EE` (avorio) | fondo pagina, header |
| Testo principale | `#111111` (quasi nero) | titoli, corpo |
| Testo secondario | `#6F6C66` (grigio caldo) | sottotitoli scene chiare |
| Accento primario | `#F26522` (arancione) | CTA, scene arancioni, hover, badge progetto |
| Accento CTA header | `#DE7340` | variante hover CTA |
| Scuro | `#111111` | scene scure (sfondo) |
| Avorio su scuro/arancione | `#F4F2EE` | testo su sfondi scuri/arancioni |
| Badge ruolo (pillola) | `#1A1E29` | pillola ruolo nell'header, fallback foto |

**Temi delle scene** (campo `tema`):
- `chiaro` → sfondo `#F4F2EE`, testo `#111111`, sottotitolo `#6F6C66`
- `arancione` → sfondo `#F26522`, testo `#F4F2EE`, sottotitolo `#F4F2EE/80`
- `scuro` → sfondo `#111111`, testo `#F4F2EE`, sottotitolo `#F4F2EE/80`

### 2.2 Tipografia

- **Font**: system-ui nativo, niente font personalizzati
- **Titoli scene / hero**: `font-semibold`, `tracking-[-0.035em]`, `leading-[1.0]`, `text-[clamp(3.4rem,12vw,7rem)]`, `max-w-[16ch]`, allineamento sinistro
- **Titoli progetti (head fisarmonica)**: `font-semibold`, `tracking-[-0.03em]`, `leading-[1.05]`, `text-[clamp(2rem,6vw,2.4rem)]`, `max-w-[24ch]`
- **Sottotitoli**: `text-[clamp(1.4rem,2.6vw,1.6rem)]`, `leading-[1.45]`, `font-semibold`, `mt-10`, `max-w-[52ch]`
- **Marquee parole**: `font-semibold`, `tracking-[-0.03em]`, `leading-none`, `text-[clamp(3.2rem,11vw,9rem)]`
- **Etichette liste narrazione**: `text-[13px]`, `uppercase`, `tracking-[0.1em]`
- **Label progetto**: box arancio pieno (`bg-[#F26522] text-white`), `text-[11px]`, `uppercase`, `tracking-[0.14em]`, `px-2.5 py-1`
- **Mobile**: titoli più grandi e bold (clamp con valori alti) per riempire lo schermo

### 2.3 Regole di layout

- Container: `px-6 sm:px-10 lg:px-16` (padding orizzontale responsivo)
- Sezioni: `min-h-[100svh]` desktop, **`min-h-[50svh]` da mobile** (eccetto la hero che resta `100svh`)
- Scene sticky (pinnate): wrapper `h-[160svh]` desktop / `h-[100svh]` mobile, contenuto `sticky top-0`
- `overflow-x: hidden` globale su body (no scroll orizzontale mobile)
- Scroll nativo con CSS scroll-snap: `scroll-snap-type: y proximity`; ogni `[data-scene]` ha `scroll-snap-align: start; scroll-snap-stop: always`
- Scene marquee (parole): `scroll-snap-align: center` (via `data-marquee`)
- `prefers-reduced-motion: reduce` → scroll-snap disattivato, animazioni marquee fermate

### 2.4 Animazioni

- **RevealTitle**: il titolo è diviso per ` / ` in righe; ogni riga entra con maschera dal basso (GSAP ScrollTrigger) quando entra in viewport
- **RevealText**: fade-in del sottotitolo; supporta link Markdown `[testo](url)` — link `#parliamone` apre la modale di contatto, gli altri link sono esterni (`target=_blank`)
- **CTA pulsante**: keyframe `ctaPulse` che alterna colore del testo tra `#111111` e `#F26522`
- **Marquee**: keyframe `marqueeRTL` da `translateX(-50%)` a `translateX(0)` (scorrimento continuo, duplicato del contenuto)
- **SubtleBackground (hero)**: due blob sfocati (arancio + nero) a bassissima opacità con animazione di drift/scaling lenta
- **Fisarmonica progetti**: framer-motion `layout` per espansione/contrazione pannelli; `AnimatePresence` per cambio head

---

## 3. Struttura pagina (flusso visibile)

Ordine di rendering effettivo (scene nascoste escluse):

1. **Hero** (intro, ordine 1)
2. **Narrazione arancione** sticky (ordine 2)
3. **Marquee parole** arancione (ordine 3)
4. **Fisarmonica Progetti** (inserita alla posizione del primo progetto, ordine 4 — contiene tutti i 4 progetti)
5. **Narrazione chiara** sticky (ordine 11)
6. **Marquee CheckYourBrand** chiaro (ordine 12)
7. **Narrazione arancione** sticky (ordine 13)

> Le scene narrazione ordine 5, 7, 9 sono **nascoste** (`visibile: false`). La scena contatto ordine 14 è nascosta: il contatto avviene tramite **modale** (pulsante header + link `#parliamone` nei sottotitoli).

### Componenti fissi (sempre presenti)
- **Header** fisso in cima
- **HUD**: barra di progresso scroll (lato sinistro) + contatore scena attiva (in basso a destra, formato `01 / N`)
- **Footer**

---

## 4. Header (fisso)

Layout: badge a sinistra, CTA a destra. Sfondo `#F4F2EE/90` + `backdrop-blur-sm`, padding `py-3 sm:py-4 px-4 sm:px-10 lg:px-16`, ombra sottile.

**Badge profilo** (sinistra): container bianco `rounded-full` con ombra, contiene:
- Foto profilo tonda `w-8 h-8 sm:w-9 sm:h-9` (fallback: box `#1A1E29` con iniziali "FM")
- Nome in `font-semibold text-[13px] sm:text-[14px]`
- Pillola ruolo `bg-[#1A1E29] text-white text-[12px] rounded-full px-2.5 py-1` (nascosta da mobile, visibile `sm:`)

**CTA** (destra): pulsante `rounded-full bg-[#F26522]` testo bianco `text-[13px] sm:text-[14px] font-semibold`, con cerchio bianco interno che contiene una freccia `ArrowRight` arancione. Hover: `bg-[#d9571a]`, freccia si trasla a destra. Apre la **modale di contatto**.

### Contenuti Header (entità Sito):
- `nome`: "Francesco Marzola"
- `firma`: "Strategic Design & Direction"
- `ruolo`: "Strategic Design & Direction" (pillola)
- `foto_url`: vedi Media
- `cta_label`: "Contattami"
- `email`: "marzola.fra@gmail.com"
- `modal_titolo`: "Ciao 👋."

---

## 5. Modale di contatto

- Trigger: CTA header + link `#parliamone` nei sottotitoli delle scene
- Titolo modale: "Ciao 👋." (configurabile)
- Sfondo chiaro
- Contiene il **ContactForm**

### ContactForm (entità Risposta)
Tre campi:
1. **Chi ti ha parlato di me?** (referente) — obbligatorio
2. **Di cosa hai bisogno?** (bisogno) — obbligatorio, textarea auto-crescente
3. **Email** — obbligatorio

Pulsante di invio. Dopo l'invio: messaggio di conferma. Presente anche link diretto `mailto:marzola.fra@gmail.com`.
I dati vengono salvati nell'entità `Risposta` (referente, bisogno, email, data).

---

## 6. Scene — contenuti completi

### Scena 1 — Hero (intro) · tema chiaro
- **Titolo**: `Qualcuno / ti ha parlato / di me.`
  (le righe si separano su ` / ` per il reveal riga-per-riga)
- **Sottotitolo**: `Probabilmente ti ha detto che mi occupo di creatività. Giuro che lo faccio per lavoro.`
- Altezza: `min-h-[100svh]` (sempre, anche mobile)
- Sfondo: `SubtleBackground` (blob animati sottili)
- Allineamento: sinistro, verticale centrato

### Scena 2 — Narrazione arancione · sticky · tema arancione
- **Titolo**: `Probabilmente / ti ha detto / che sono bravo.`
- **Sottotitolo**: `Qui trovi le prove.`
- Sticky: sì
- Sfondo `#F26522`, testo `#F4F2EE`

### Scena 3 — Marquee parole · tema arancione
- Tipo: `parole`
- **Parole** (lista, marquee orizzontale continuo): `Positioning` · `Naming` · `Visual identity` · `Verbal identity` · `Ads` · `Creative content`
- Opacità: `10%`
- Altezza: dinamica `py-[7vh]`
- Separatore tra parole: `·`

### Scena 4 → Fisarmonica Progetti
Inserto unico contenente i 4 progetti (vedi sezione 7). Label iniziale: box arancio "Progetti".

### Scena 11 — Narrazione chiara · sticky · tema chiaro
- **Titolo**: `Lo faccio / da quasi vent'anni.`
- **Sottotitolo**: `Oggi sono CEO di Able Creative Studio™, a Roma, e partner di NextAdv. Nonché autore di [The Unlikeness™](https://unlikeness.substack.com/profile/posts)`
  (il link `[The Unlikeness™]` è esterno, apre in nuova scheda)

### Scena 12 — Marquee CheckYourBrand · tema chiaro
- Tipo: `parole` ma funge da scena "check"
- **Parole** (marquee): `Exequia` · `ComparaSemplice` · `McFit` · `Campus Bio-Medico` · `Eurobet.Live` · `Treccani`
- **Sottotitolo**: `Un check-up gratuito su come il mercato percepisce il tuo brand.`
- **Cliente/brand mostrato**: `CheckYourBrand™`
- **Link esterno**: `https://checkyourbrand.it` — etichetta: `Fai il check-up →`
- Opacità marquee: `10%`

### Scena 13 — Narrazione arancione · sticky · tema arancione
- **Titolo**: `Chi ti ha parlato / di me forse / sapeva già tutto.`
- **Sottotitolo**: `E pensava ne valesse la pena. [Scopriamo se aveva ragione](#parliamone).`
  (il link `#parliamone` apre la **modale di contatto**)
- `parliamone_cta`: true

### Scene nascoste (NON renderizzare)
- 5: `Faccio domande / finché una risposta / non mi sorprende.` · sottotitolo `Di solito l'idea è lì.` (arancione sticky)
- 7: `Un'idea bella / che nessuno ricorda / non è un'idea.` · sottotitolo `È una spesa.` (scuro sticky)
- 9: `Dal logo al post, / ogni pezzo / dice la stessa cosa.` · sottotitolo `Altrimenti non è un brand. È un collage.` (chiaro sticky)
- 14: contatto `Parliamone.` (gestito via modale)

---

## 7. Fisarmonica Progetti (4 progetti)

Un unico blocco alla posizione del primo progetto. Contiene 4 progetti come schede selezionabili:

**Header del blocco**: box arancio "Progetti" + head dinamico (titolo del progetto attivo, cambia con animazione).

### Desktop: fisarmonica orizzontale
- 4 colonne `h-[440px]`, gap `gap-2`
- Colonna attiva: `flex-1` con sfondo bianco; colonne inattive: larghezza `w-14`
- Barra laterale stretta (`w-14`) per ogni colonna: nome cliente verticale + numero progetto
- Colonna attiva: barra arancio `#F26522` testo `#F4F2EE` + freccia triangolare verso il pannello
- Contenuto colonna attiva: contesto (paragrafo) + media (video/immagini)

### Mobile: accordion verticale impilato
- Tab/pulsanti orizzontali scorrevoli con `numero · cliente`
- Card bianca con contesto + media del progetto attivo

### Progetti (in ordine):

#### Progetto 01 — Exequia
- **Numero**: `01`
- **Titolo**: `Più unica che bara.`
- **Cliente**: Exequia
- **Contesto**: "Exequia aveva bisogno di una posizione riconoscibile in un settore nel quale tutti i brand parla(va)no allo stesso modo. Un'identità verbale non è una semplice esecuzione creativa, è una scelta che riscrive i limiti di una categoria e permette ad un brand di entrare davvero nella mente delle persone."
- **Media**: 4 immagini (slider automatico, pausa on hover, lightbox al click)
- Sticky: sì

#### Progetto 02 — ComparaSemplice
- **Numero**: `02`
- **Titolo**: `Lo zio Gerry sta Qua!`
- **Cliente**: ComparaSemplice
- **Contesto**: "Campagna per il comparatore di tariffe luce, gas e telefonia. L'obiettivo: rendere semplice una scelta complicata. La mossa: Gerry Scotti, la rassicurazione italiana, a interrogare una papera viola."
- **Media**: 1 video MP4 (player nativo)
- Extra class: `pb-28`

#### Progetto 03 — McFit
- **Numero**: `03`
- **Titolo**: `Il fitness (quasi) senza rimorso.`
- **Cliente**: McFit
- **Contesto**: "Campagna #SenzaRimorso per una delle catene di palestre più grandi d'Europa. L'obiettivo: parlare a chi non va in palestra perché si sente già in colpa. Il concept: il fitness, finalmente, senza rimorso."
- **Media**: 1 video MP4 (player nativo)

#### Progetto 04 — Antico Forno Roscioli
- **Numero**: `04`
- **Titolo**: `Il pane è di tutti.`
- **Cliente**: Antico Forno Roscioli
- **Contesto**: "Posizionamento e verbal identity per un'istituzione del pane romano. L'obiettivo era ambizioso: meritarsi la scena giusta. Arrivarci come ospite d'onore alla puntata speciale di MasterChef è il miglior finale possibile."
- **Media**: 1 video YouTube (embed), ID `TirARcwS42s`

### Componente ProjectMedia
- Se `youtube_id` presente → embed YouTube (`https://www.youtube.com/embed/<id>`)
- Se `video_url` presente (mp4) → `<video controls>` nativo
- Se `immagini` presenti (array) → **ImageSlider** automatico (autoplay, pausa on hover, click = lightbox)
- Priorità: video YouTube > video MP4 > slider immagini

---

## 8. HUD (progresso + contatore)

- **Barra di progresso**: linea verticale sul lato sinistro che cresce con lo scroll (GSAP ScrollTrigger). Rispetta reduced-motion.
- **Contatore scena**: in basso a destra, formato `01 / N` dove N = numero totale scene visibili. Si aggiorna quando una `[data-scene]` entra/esce dal viewport.

---

## 9. Footer

- Copyright + link di contatto (LinkedIn, email `marzola.fra@gmail.com`)
- Link esterni con hover e focus styling accessibile

---

## 10. Media da caricare

> Lo sviluppatore deve fornire/sostituire questi file. Gli URL attuali sono ospitati su Base44 storage e vanno sostituiti con i path locali del nuovo progetto.

### Foto profilo Header
- `profilo.png` — foto tonda, mostrata a 36×36 / 40×40px

### Progetto 01 — Exequia (4 immagini slider)
- `exe3.png`
- `Image5.png`
- `exe2.png`
- `ImageEXE.png`

### Progetto 02 — ComparaSemplice
- `GerryScottiperComparaSemplice_Semplicecisiamo_1080p.mp4` (video)

### Progetto 03 — McFit
- `841965cea297268e70f1da08ac7c64bb3c72e9a8.mp4` (video)

### Progetto 04 — Antico Forno Roscioli
- Video YouTube ID: `TirARcwS42s` (nessun file locale, solo embed)

---

## 11. Admin (CMS)

Pannello protetto (auth) per gestire dinamicamente tutti i contenuti:
- **Scene**: ordine, tipo, tema, visibilità, sticky, titolo, sottotitolo, lista, opacità (marquee), parliamone_cta, numero, cliente, contesto, immagini, youtube_id, video_url, link, extra_class
- **Sito**: nome, firma, ruolo, foto_url, cta_label, email, modal_titolo
- **Risposta**: visualizza le risposte del form di contatto
- Salvataggio bulk ("Salva tutto") per le scene

Tipi di scena supportati: `intro`, `narrazione`, `progetto`, `check`, `contatto`, `parole`
Temi: `chiaro`, `arancione`, `scuro`

---

## 12. Accessibilità

- Label sempre presenti sui campi form
- `focus-visible:ring` su elementi interattivi (CTA, link)
- `prefers-reduced-motion: reduce` disattiva scroll-snap e animazioni marquee
- Sfondo decorativo (`SubtleBackground`): `aria-hidden`, no pointer events

---

## 13. Note di comportamento

- Lo scroll è nativo (nessun plugin tipo Lenis)
- Scroll-snap `proximity` (non mandatory) per non bloccare
- I link `#parliamone` nei sottotitoli (sintassi Markdown) aprono la modale contatto
- Gli altri link Markdown nei sottotitoli sono esterni (`target="_blank"`)
- Da mobile tutte le sezioni (eccetto hero) sono alte metà schermo (`50svh`)