# Dati pubblici del portfolio (export 01/11/2026)

Esportati dall'API pubblica dell'app Base44 (gli stessi dati che il sito pubblico serve ai visitatori):

- `Scena.json` — 14 scene (ordine 1..14): testi, temi, media URL, link
- `Sito.json` — 1 record: identita' sito (nome, ruolo, foto_url, CTA, email contatto)
- `StileScena.json` — 7 record di stile per scena

ESCLUSO di proposito: entita' `Risposta` (risposte del form contatto = dati privati di terzi). Non esportare.

La cartella `../media/` contiene gli asset pubblici referenziati (5 immagini + 2 video + foto profilo), scaricati da media.base44.com. Il video di progetto 04 e' un embed YouTube (ID TirARcwS42s), nessun file.

Per la migrazione: sostituire gli URL media.base44.com nei JSON/componenti con path locali ../media/.
