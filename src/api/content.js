// Contenuti del sito, letti dai file JSON in src/data.
// Per cambiare un testo, un'immagine o l'ordine delle scene basta modificare quei file.
import scene from '@/data/Scena.json';
import sito from '@/data/Sito.json';
import stili from '@/data/StileScena.json';

const sources = {
  Scena: [...scene].sort((a, b) => (a.ordine ?? 0) - (b.ordine ?? 0)),
  Sito: sito,
  StileScena: stili,
};

// Stessa forma asincrona della vecchia API, così i componenti non cambiano.
export const content = {
  list: (entity) => Promise.resolve(sources[entity] ?? []),
};
