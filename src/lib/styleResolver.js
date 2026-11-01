// Resolution helpers for per-type scene styling (colors + font sizes).
// Desktop fields are the shared base; *_mobile fields override only on mobile viewports.
// Empty values fall back to the hardcoded defaults that match the original design.

import { pick } from './mobileOverride';

export const COLORS = ['sfondo', 'testo', 'accento', 'testo_secondario', 'sottotitolo'];
export const FONTS = ['dim_titolo', 'dim_sottotitolo', 'dim_lista', 'dim_numero', 'dim_cliente', 'dim_contesto', 'dim_parole'];

const LIGHT = { sfondo: '#F4F2EE', testo: '#111111', accento: '#F26522', testo_secondario: '#6F6C66', sottotitolo: '#6F6C66' };
const ORANGE = { sfondo: '#F26522', testo: '#F4F2EE', accento: '#111111', testo_secondario: '#F4F2EE', sottotitolo: '#F4F2EE' };
const DARK = { sfondo: '#111111', testo: '#F4F2EE', accento: '#F26522', testo_secondario: '#F4F2EE', sottotitolo: '#F4F2EE' };

export function defaultColors(tipo, tema) {
  if (tipo === 'contatto') return ORANGE;
  if (tipo === 'parole') return tema === 'scuro' ? DARK : LIGHT;
  if (tema === 'arancione') return ORANGE;
  if (tema === 'scuro') return DARK;
  return LIGHT;
}

export function defaultFonts(tipo) {
  const f = {
    dim_titolo: 'clamp(3.4rem,12vw,7rem)',
    dim_sottotitolo: 'clamp(1.4rem,2.6vw,1.6rem)',
    dim_lista: '13px',
    dim_numero: '11px',
    dim_cliente: '15px',
    dim_contesto: '15px',
    dim_parole: 'clamp(3.2rem,11vw,9rem)'
  };
  if (tipo === 'narrativa_lunga') f.dim_titolo = 'clamp(1.7rem,6vw,3.5rem)';
  return f;
}

// Resolve a style record for the active viewport, applying mobile overrides and defaults.
export function resolveStyle(stile, tipo, tema, isMobile) {
  const dc = defaultColors(tipo, tema);
  const df = defaultFonts(tipo);
  const get = (f) => {
    const v = pick(stile?.[f], stile?.[`${f}_mobile`], isMobile);
    return v != null && String(v).trim() !== '' ? v : null;
  };
  const out = {};
  for (const c of COLORS) out[c] = get(c) || dc[c];
  for (const f of FONTS) out[f] = get(f) || df[f];
  return out;
}

// CSS custom properties object to spread on a section wrapper's inline style.
export function styleVars(style) {
  return {
    '--c-sfondo': style.sfondo,
    '--c-testo': style.testo,
    '--c-accento': style.accento,
    '--c-testo-sec': style.testo_secondario,
    '--c-sottotitolo': style.sottotitolo,
    '--f-titolo': style.dim_titolo,
    '--f-sottotitolo': style.dim_sottotitolo,
    '--f-lista': style.dim_lista,
    '--f-numero': style.dim_numero,
    '--f-cliente': style.dim_cliente,
    '--f-contesto': style.dim_contesto,
    '--f-parole': style.dim_parole
  };
}