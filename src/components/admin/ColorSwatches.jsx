import { SUBTITLE_PALETTE } from '@/lib/subtitleColors';

// Selettore a swatch per il colore del sottotitolo. Il primo elemento ("Eredita")
// svuota il valore e fa ricadere sul default del tipo di scena.
export default function ColorSwatches({ value, onChange, inheritHint = 'Eredita' }) {
  const current = value || '';
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {SUBTITLE_PALETTE.map((c) => {
        const selected = current === c.value;
        const isEredit = c.value === '';
        return (
          <button
            key={c.label}
            type="button"
            onClick={() => onChange(c.value)}
            title={isEredit ? inheritHint : c.label}
            aria-label={isEredit ? inheritHint : c.label}
            className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F2EE] ${
              selected ? 'ring-2 ring-[#F26522] ring-offset-2 ring-offset-[#F4F2EE] border-transparent' : 'border-[#111111]/15 hover:border-[#111111]/40'
            }`}
            style={isEredit ? { background: 'repeating-linear-gradient(45deg,#fff,#fff 4px,#eee 4px,#eee 8px)' } : { background: c.value }}
          >
            {isEredit && <span className="text-[12px] text-[#6F6C66] leading-none">∅</span>}
            {selected && !isEredit && <span className="w-2 h-2 rounded-full bg-white mix-blend-difference" />}
          </button>
        );
      })}
    </div>
  );
}