// Dati locali al posto dell'SDK Base44: il nome del file è mantenuto per non
// toccare i componenti. Per modificare i testi del sito: src/api/local-*.json
// Shim indipendente (branch "indipendente"): dati locali al posto dell'API Base44.
// Solo lettura dati pubblici. Risposta.create fallisce onestamente: il servizio
// form non e' stato ancora scelto/approvato.
import scena from './local-Scena.json';
import sito from './local-Sito.json';
import stile from './local-StileScena.json';

const sortBy = (rows, key) => {
  const r = [...rows];
  if (key === 'ordine') r.sort((a, b) => (a.ordine ?? 0) - (b.ordine ?? 0));
  else r.sort((a, b) => String(a.created_date ?? '').localeCompare(String(b.created_date ?? '')));
  return r;
};

const readOnly = (rows) => ({
  list: async (sort, limit = 100) => sortBy(rows, sort).slice(0, limit),
  filter: async () => { throw new Error('Solo lettura locale: filtri non implementati nel shim'); },
  get: async (id) => rows.find((r) => r.id === id) ?? null,
  create: async () => { throw new Error('Solo lettura locale'); },
  update: async () => { throw new Error('Solo lettura locale'); },
  delete: async () => { throw new Error('Solo lettura locale'); },
});

export const base44 = {
  entities: {
    Scena: readOnly(scena),
    Sito: readOnly(sito),
    StileScena: readOnly(stile),
    Risposta: {
      list: async () => { throw new Error('Risposta non esportata: dati privati'); },
      // Invio del form "Sentiamoci" tramite FormSubmit (gratuito, senza account).
      // Le risposte arrivano via email all'indirizzo in local-Sito.json ("email").
      // Al PRIMO invio FormSubmit manda a quell'indirizzo una mail di attivazione:
      // va cliccata una volta, poi gli invii arrivano normalmente.
      create: async ({ referente, bisogno, email }) => {
        throw new Error('Anteprima: il modulo Sentiamoci non e ancora attivo. Scrivi a marzola.fra@gmail.com'); // PREVIEW-ONLY
        const to = sito[0]?.email || 'marzola.fra@gmail.com';
        const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            'Chi mi ha parlato di te': referente || '-',
            'Di cosa ho bisogno': bisogno,
            email,
            _replyto: email,
            _subject: 'Nuovo contatto dal sito — Sentiamoci',
            _template: 'table',
            _captcha: 'false',
            _honey: '',
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || String(data.success) !== 'true') throw new Error(data.message || `Invio non riuscito (${res.status})`);
        return data;
      },
    },
  },
  auth: {
    me: async () => null,
    isAuthenticated: async () => false,
    logout: () => {},
    redirectToLogin: () => {},
  },
};
