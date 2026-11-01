import { Eye, EyeOff } from 'lucide-react';
import LinkTextarea from './LinkTextarea';
import ColorSwatches from './ColorSwatches';

const TIPI = [
  { value: 'intro', label: 'Intro (hero)' },
  { value: 'narrazione', label: 'Narrazione' },
  { value: 'narrativa_lunga', label: 'Narrativa lunga' },
  { value: 'progetto', label: 'Progetto' },
  { value: 'check', label: 'Check' },
  { value: 'contatto', label: 'Contatto' },
  { value: 'parole', label: 'Parole (marquee)' }
];
const TEMI = [
  { value: 'chiaro', label: 'Chiaro' },
  { value: 'arancione', label: 'Arancione' },
  { value: 'scuro', label: 'Scuro' }
];

const inputCls =
  'w-full bg-white border border-[#111111]/15 rounded-sm px-3 py-2 text-[14px] text-[#111111] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F2EE]';

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-[0.12em] text-[#6F6C66] mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-[12px] text-[#6F6C66]/70 mt-1">{hint}</span>}
    </label>
  );
}

// Like Field, but uses a link-aware textarea (div wrapper — not a label — so the
// "Aggiungi link" button isn't swallowed by the label's control association).
function LinkField({ label, value, onChange, rows = 2 }) {
  return (
    <div>
      <span className="block text-[11px] uppercase tracking-[0.12em] text-[#6F6C66] mb-1.5">{label}</span>
      <LinkTextarea className={inputCls} value={value || ''} onChange={onChange} rows={rows} />
    </div>
  );
}

// Controlled editor for a single scene: edits flow up to Admin via onChange.
export default function SceneCard({ scena, value, onChange }) {
  const data = value;
  const set = (k, v) => onChange({ ...data, [k]: v });
  const setArr = (k, v) => set(k, v.split('\n').map((s) => s.trim()).filter(Boolean));
  const arrVal = (k) => (Array.isArray(data[k]) ? data[k].join('\n') : '');

  const t = data.tipo;

  return (
    <div className={`border border-[#111111]/10 rounded-md bg-white p-5 ${data.visibile === false ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-[#6F6C66]">#{data.ordine}</span>
          <span className="text-[14px] font-medium">{TIPI.find((x) => x.value === t)?.label || t}</span>
        </div>
        <button
          type="button"
          onClick={() => set('visibile', data.visibile === false)}
          title={data.visibile === false ? 'Mostra sul sito' : 'Nascondi dal sito'}
          className="p-2 rounded-sm border border-[#111111]/15 text-[#111111] hover:bg-[#111111]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522]"
        >
          {data.visibile === false ? <EyeOff className="w-4 h-4 text-[#6F6C66]" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Ordine">
          <input type="number" className={inputCls} value={data.ordine} onChange={(e) => set('ordine', e.target.value)} />
        </Field>
        <Field label="Tipo">
          <select className={inputCls} value={data.tipo} onChange={(e) => set('tipo', e.target.value)}>
            {TIPI.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>
        <Field label="Tema">
          <select className={inputCls} value={data.tema || 'chiaro'} onChange={(e) => set('tema', e.target.value)}>
            {TEMI.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>
        <Field label="Appiccicata (sticky)">
          <select className={inputCls} value={data.appiccicata ? '1' : '0'} onChange={(e) => set('appiccicata', e.target.value === '1')}>
            <option value="0">No</option>
            <option value="1">Sì</option>
          </select>
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Altezza (% schermo)" hint="100 = tutto schermo, 50 = metà. Vuoto = default">
          <input type="number" min="0" max="300" className={inputCls} value={data.altezza_schermo ?? ''} onChange={(e) => set('altezza_schermo', e.target.value === '' ? null : Number(e.target.value))} />
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Titolo" hint="Usa ' / ' per andare a capo">
          <textarea className={inputCls} rows={2} value={data.titolo || ''} onChange={(e) => set('titolo', e.target.value)} />
        </Field>
      </div>

      {(t === 'intro' || t === 'narrazione' || t === 'narrativa_lunga' || t === 'check') && (
        <div className="mt-4 space-y-2">
          <LinkField label="Sottotitolo" value={data.sottotitolo} onChange={(v) => set('sottotitolo', v)} rows={2} />
          <div>
            <span className="block text-[11px] uppercase tracking-[0.12em] text-[#6F6C66] mb-1.5">Colore sottotitolo</span>
            <ColorSwatches value={data.sottotitolo_colore} onChange={(v) => set('sottotitolo_colore', v)} />
          </div>
        </div>
      )}

      {(t === 'narrazione' || t === 'narrativa_lunga') && (
        <>
          <div className="mt-4">
            <Field label="Lista (una voce per riga)">
              <textarea className={inputCls} rows={4} value={arrVal('lista')} onChange={(e) => setArr('lista', e.target.value)} />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Pulsante Parliamone" hint="Mostra in basso a sinistra un pulsante che apre il contatto come modale">
              <select className={inputCls} value={data.parliamone_cta ? '1' : '0'} onChange={(e) => set('parliamone_cta', e.target.value === '1')}>
                <option value="0">No</option>
                <option value="1">Sì</option>
              </select>
            </Field>
          </div>
        </>
      )}

      {t === 'parole' && (
        <>
          <div className="mt-4">
            <Field label="Parole (una per riga)" hint="Scorrono a tutto schermo da sinistra a destra">
              <textarea className={inputCls} rows={5} value={arrVal('lista')} onChange={(e) => setArr('lista', e.target.value)} />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Opacità (0–100)" hint="Quanto le parole sono visibili (0 = invisibili, 100 = pieno)">
              <input
                type="number"
                min="0"
                max="100"
                className={inputCls}
                value={data.opacita ?? 100}
                onChange={(e) => set('opacita', Number(e.target.value))}
              />
            </Field>
          </div>
        </>
      )}

      {t === 'progetto' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <Field label="Numero progetto">
              <input className={inputCls} value={data.numero || ''} onChange={(e) => set('numero', e.target.value)} />
            </Field>
            <Field label="Cliente">
              <input className={inputCls} value={data.cliente || ''} onChange={(e) => set('cliente', e.target.value)} />
            </Field>
          </div>
          <div className="mt-4">
            <LinkField label="Contesto" value={data.contesto} onChange={(v) => set('contesto', v)} rows={3} />
          </div>
          <div className="mt-4">
            <Field label="Immagini slider (un URL per riga)">
              <textarea className={inputCls} rows={4} value={arrVal('immagini')} onChange={(e) => setArr('immagini', e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <Field label="YouTube ID">
              <input className={inputCls} value={data.youtube_id || ''} onChange={(e) => set('youtube_id', e.target.value)} />
            </Field>
            <Field label="URL video mp4">
              <input className={inputCls} value={data.video_url || ''} onChange={(e) => set('video_url', e.target.value)} />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Classi extra (es. pb-28)">
              <input className={inputCls} value={data.extra_class || ''} onChange={(e) => set('extra_class', e.target.value)} />
            </Field>
          </div>
        </>
      )}

      {t === 'check' && (
        <>
          <div className="mt-4">
            <Field label="Nome brand (in evidenza)">
              <input className={inputCls} value={data.cliente || ''} onChange={(e) => set('cliente', e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <Field label="URL link">
              <input className={inputCls} value={data.link_url || ''} onChange={(e) => set('link_url', e.target.value)} />
            </Field>
            <Field label="Etichetta link">
              <input className={inputCls} value={data.link_etichetta || ''} onChange={(e) => set('link_etichetta', e.target.value)} />
            </Field>
          </div>
        </>
      )}
    </div>
  );
}