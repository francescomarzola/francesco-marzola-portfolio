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
      create: async () => { throw new Error('Invio form non ancora configurato: servizio da approvare. Scrivi a marzola.fra@gmail.com'); },
    },
  },
  auth: {
    me: async () => null,
    isAuthenticated: async () => false,
    logout: () => {},
    redirectToLogin: () => {},
  },
};
