// Override-only editor for a single scene's mobile content.
// Empty mobile field = inherits the desktop value (shown as a hint).
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

const inputCls =
  'w-full bg-white border border-[#111111]/15 rounded-sm px-3 py-2 text-[14px] text-[#111111] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F2EE]';
const overrideCls =
  'w-full bg-[#FFF7F0] border border-[#F26522]/30 rounded-sm px-3 py-2 text-[14px] text-[#111111] placeholder:text-[#6F6C66]/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F2EE]';

function MobileField({ label, desktopValue, mobileValue, onChange, rows, placeholder, enableLinks }) {
  const Tag = enableLinks ? 'div' : 'label';
  const inherited = !mobileValue || (Array.isArray(mobileValue) ? mobileValue.length === 0 : String(mobileValue).trim() === '');
  const preview = Array.isArray(desktopValue) ? desktopValue.join(', ') : (desktopValue || '');
  return (
    <Tag className="block">
      <span className="flex items-center justify-between text-[11px] uppercase tracking-[0.12em] text-[#6F6C66] mb-1.5">
        <span>{label}</span>
        <span className={`normal-case tracking-normal text-[11px] ${inherited ? 'text-[#6F6C66]/70' : 'text-[#F26522]'}`}>
          {inherited ? `eredita: ${preview || '—'}` : 'override mobile'}
        </span>
      </span>
      {rows ? (
        enableLinks ? (
          <LinkTextarea className={overrideCls} value={Array.isArray(mobileValue) ? mobileValue.join('\n') : (mobileValue || '')} onChange={onChange} rows={rows} placeholder={placeholder || preview} />
        ) : (
          <textarea className={overrideCls} rows={rows} value={Array.isArray(mobileValue) ? mobileValue.join('\n') : (mobileValue || '')} placeholder={placeholder || preview} onChange={onChange} />
        )
      ) : (
        <input className={overrideCls} value={Array.isArray(mobileValue) ? mobileValue.join(', ') : (mobileValue || '')} placeholder={placeholder || preview} onChange={onChange} />
      )}
    </Tag>
  );
}

// Selettore colore sottotitolo per override mobile: mostra il valore desktop
// ereditato e permette di sovrascriverlo con un colore della palette.
function MobileSubtitleColor({ desktopValue, mobileValue, onChange }) {
  const inherited = !mobileValue || (String(mobileValue).trim() === '');
  return (
    <div>
      <span className="flex items-center justify-between text-[11px] uppercase tracking-[0.12em] text-[#6F6C66] mb-1.5">
        <span>Colore sottotitolo</span>
        <span className={`normal-case tracking-normal text-[11px] ${inherited ? 'text-[#6F6C66]/70' : 'text-[#F26522]'}`}>
          {inherited ? `eredita: ${desktopValue || '—'}` : 'override mobile'}
        </span>
      </span>
      <ColorSwatches value={mobileValue} onChange={onChange} inheritHint={`Eredita (${desktopValue || 'default'})`} />
    </div>
  );
}

export default function MobileSceneCard({ scena, value, onChange }) {
  const data = value;
  const set = (k, v) => onChange({ ...data, [k]: v });
  const setArr = (k, v) => set(k, v.split('\n').map((s) => s.trim()).filter(Boolean));
  const arrVal = (k) => (Array.isArray(data[k]) ? data[k].join('\n') : '');

  const t = data.tipo;

  return (
    <div className={`border border-[#F26522]/20 rounded-md bg-white p-5 ${data.visibile === false ? 'opacity-50' : ''}`}>
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

      <div className="space-y-4">
        <MobileField label="Altezza (% schermo)" desktopValue={data.altezza_schermo} mobileValue={data.altezza_schermo_mobile} onChange={(e) => set('altezza_schermo_mobile', e.target.value === '' ? null : Number(e.target.value))} />
        <MobileField label="Titolo" desktopValue={data.titolo} mobileValue={data.titolo_mobile} rows={2} onChange={(e) => set('titolo_mobile', e.target.value)} />
        {(t === 'intro' || t === 'narrazione' || t === 'narrativa_lunga' || t === 'check') && (
          <>
            <MobileField label="Sottotitolo" desktopValue={data.sottotitolo} mobileValue={data.sottotitolo_mobile} rows={2} enableLinks onChange={(v) => set('sottotitolo_mobile', v)} />
            <MobileSubtitleColor desktopValue={data.sottotitolo_colore} mobileValue={data.sottotitolo_colore_mobile} onChange={(v) => set('sottotitolo_colore_mobile', v)} />
          </>
        )}
        {(t === 'narrazione' || t === 'narrativa_lunga') && (
          <MobileField label="Lista (una voce per riga)" desktopValue={Array.isArray(data.lista) ? data.lista.join(', ') : ''} mobileValue={data.lista_mobile} rows={4} onChange={(e) => setArr('lista_mobile', e.target.value)} />
        )}
        {t === 'parole' && (
          <>
            <MobileField label="Parole (una per riga)" desktopValue={Array.isArray(data.lista) ? data.lista.join(', ') : ''} mobileValue={data.lista_mobile} rows={5} onChange={(e) => setArr('lista_mobile', e.target.value)} />
            <MobileField label="Opacità (0–100)" desktopValue={data.opacita ?? 100} mobileValue={data.opacita_mobile} onChange={(e) => set('opacita_mobile', e.target.value === '' ? null : Number(e.target.value))} />
          </>
        )}
        {t === 'progetto' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MobileField label="Numero progetto" desktopValue={data.numero} mobileValue={data.numero_mobile} onChange={(e) => set('numero_mobile', e.target.value)} />
              <MobileField label="Cliente" desktopValue={data.cliente} mobileValue={data.cliente_mobile} onChange={(e) => set('cliente_mobile', e.target.value)} />
            </div>
            <MobileField label="Contesto" desktopValue={data.contesto} mobileValue={data.contesto_mobile} rows={3} enableLinks onChange={(v) => set('contesto_mobile', v)} />
            <MobileField label="Immagini slider (un URL per riga)" desktopValue={Array.isArray(data.immagini) ? data.immagini.join(', ') : ''} mobileValue={data.immagini_mobile} rows={4} onChange={(e) => setArr('immagini_mobile', e.target.value)} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MobileField label="YouTube ID" desktopValue={data.youtube_id} mobileValue={data.youtube_id_mobile} onChange={(e) => set('youtube_id_mobile', e.target.value)} />
              <MobileField label="URL video mp4" desktopValue={data.video_url} mobileValue={data.video_url_mobile} onChange={(e) => set('video_url_mobile', e.target.value)} />
            </div>
            <MobileField label="Classi extra" desktopValue={data.extra_class} mobileValue={data.extra_class_mobile} onChange={(e) => set('extra_class_mobile', e.target.value)} />
          </>
        )}
        {t === 'check' && (
          <>
            <MobileField label="Nome brand" desktopValue={data.cliente} mobileValue={data.cliente_mobile} onChange={(e) => set('cliente_mobile', e.target.value)} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MobileField label="URL link" desktopValue={data.link_url} mobileValue={data.link_url_mobile} onChange={(e) => set('link_url_mobile', e.target.value)} />
              <MobileField label="Etichetta link" desktopValue={data.link_etichetta} mobileValue={data.link_etichetta_mobile} onChange={(e) => set('link_etichetta_mobile', e.target.value)} />
            </div>
          </>
        )}
        {t === 'contatto' && (
          <p className="text-[13px] text-[#6F6C66]/80">La scena contatto usa il titolo sopra; nessun altro campo mobile da sovrascrivere.</p>
        )}
      </div>
    </div>
  );
}