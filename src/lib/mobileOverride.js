// Resolution helpers for mobile content overrides.
// Desktop fields are the shared base; *_mobile fields override only on mobile viewports.
// A mobile value counts as "present" when: strings are non-empty trimmed, arrays have items, numbers are not null.

function hasValue(v) {
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === 'number') return true;
  if (typeof v === 'string') return v.trim() !== '';
  return v != null;
}

export function pick(desktop, mobile, isMobile) {
  if (isMobile && hasValue(mobile)) return mobile;
  return desktop;
}

const SCENA_FIELDS = [
  'titolo', 'sottotitolo', 'sottotitolo_colore', 'lista', 'numero', 'cliente', 'contesto',
  'immagini', 'youtube_id', 'video_url', 'link_url', 'link_etichetta',
  'extra_class', 'opacita', 'altezza_schermo'
];

export function resolveScena(scene, isMobile) {
  if (!scene) return scene;
  const out = { ...scene };
  for (const f of SCENA_FIELDS) {
    out[f] = pick(scene[f], scene[`${f}_mobile`], isMobile);
  }
  return out;
}

const SITO_FIELDS = ['nome', 'firma', 'ruolo', 'foto_url', 'cta_label', 'email', 'modal_titolo', 'progetti_titolo'];

export function resolveSito(sito, isMobile) {
  if (!sito) return sito;
  const out = { ...sito };
  for (const f of SITO_FIELDS) {
    out[f] = pick(sito[f], sito[`${f}_mobile`], isMobile);
  }
  return out;
}