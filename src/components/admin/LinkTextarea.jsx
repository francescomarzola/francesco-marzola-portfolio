import { useRef, useState } from 'react';
import { Link2, X, MessageSquare, ExternalLink } from 'lucide-react';

// Textarea with an "Aggiungi link" helper that inserts [testo](url) at the cursor.
// The front-end renders [testo](url) as a link; #parliamone opens the contact modal.
// The picker offers the contact modal as a ready option alongside external URLs.
export default function LinkTextarea({ value, onChange, rows = 2, className = '', placeholder = '' }) {
  const ref = useRef(null);
  const [panel, setPanel] = useState(null); // { start, end, label, mode, url }

  const openPanel = (e) => {
    e.preventDefault();
    const el = ref.current;
    const start = el ? el.selectionStart : value.length;
    const end = el ? el.selectionEnd : value.length;
    const selected = value.slice(start, end).trim();
    setPanel({ start, end, label: selected, mode: 'modal', url: '' });
  };

  const closePanel = () => setPanel(null);

  const confirm = () => {
    if (!panel) return;
    const label = (panel.label || '').trim();
    if (!label) return;
    const url = panel.mode === 'modal' ? '#parliamone' : (panel.url || '').trim();
    if (panel.mode === 'external' && !url) return;
    const markup = `[${label}](${url})`;
    const next = value.slice(0, panel.start) + markup + value.slice(panel.end);
    onChange(next);
    const pos = panel.start + markup.length;
    closePanel();
    requestAnimationFrame(() => {
      if (!ref.current) return;
      ref.current.focus();
      ref.current.setSelectionRange(pos, pos);
    });
  };

  return (
    <div>
      <div className="flex justify-end mb-1">
        <button
          type="button"
          onMouseDown={openPanel}
          className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.1em] text-[#F26522] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522] rounded-sm"
        >
          <Link2 className="w-3.5 h-3.5" /> Aggiungi link
        </button>
      </div>

      {panel && (
        <div className="mb-2 rounded-md border border-[#111111]/15 bg-white p-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-[0.12em] text-[#6F6C66]">Nuovo link</span>
            <button
              type="button"
              onClick={closePanel}
              className="p-1 rounded-sm text-[#6F6C66] hover:bg-[#111111]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <label className="block">
            <span className="block text-[11px] uppercase tracking-[0.12em] text-[#6F6C66] mb-1.5">Testo linkato</span>
            <input
              className="w-full bg-white border border-[#111111]/15 rounded-sm px-3 py-2 text-[14px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522]"
              value={panel.label}
              autoFocus
              onChange={(e) => setPanel((p) => ({ ...p, label: e.target.value }))}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); confirm(); } }}
            />
          </label>

          <div>
            <span className="block text-[11px] uppercase tracking-[0.12em] text-[#6F6C66] mb-1.5">Destinazione</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPanel((p) => ({ ...p, mode: 'modal' }))}
                className={`flex items-center gap-2 px-3 py-2 rounded-sm border text-[13px] text-left ${
                  panel.mode === 'modal'
                    ? 'border-[#F26522] bg-[#FFF7F0] text-[#F26522]'
                    : 'border-[#111111]/15 bg-white text-[#111111] hover:bg-[#111111]/5'
                }`}
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span>Modale di contatto</span>
              </button>
              <button
                type="button"
                onClick={() => setPanel((p) => ({ ...p, mode: 'external' }))}
                className={`flex items-center gap-2 px-3 py-2 rounded-sm border text-[13px] text-left ${
                  panel.mode === 'external'
                    ? 'border-[#F26522] bg-[#FFF7F0] text-[#F26522]'
                    : 'border-[#111111]/15 bg-white text-[#111111] hover:bg-[#111111]/5'
                }`}
              >
                <ExternalLink className="w-4 h-4 shrink-0" />
                <span>Link esterno</span>
              </button>
            </div>
          </div>

          {panel.mode === 'external' && (
            <label className="block">
              <span className="block text-[11px] uppercase tracking-[0.12em] text-[#6F6C66] mb-1.5">URL</span>
              <input
                className="w-full bg-white border border-[#111111]/15 rounded-sm px-3 py-2 text-[14px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522]"
                value={panel.url}
                placeholder="https://…"
                onChange={(e) => setPanel((p) => ({ ...p, url: e.target.value }))}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); confirm(); } }}
              />
            </label>
          )}

          {panel.mode === 'modal' && (
            <p className="text-[12px] text-[#6F6C66]">
              Apre la modale &ldquo;Parliamone&rdquo; con il form di contatto.
            </p>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={confirm}
              disabled={!panel.label.trim() || (panel.mode === 'external' && !panel.url.trim())}
              className="text-[13px] font-medium px-3 py-1.5 rounded-sm bg-[#111111] text-[#F4F2EE] disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522]"
            >
              Inserisci
            </button>
          </div>
        </div>
      )}

      <textarea
        ref={ref}
        className={className}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      <span className="block text-[12px] text-[#6F6C66]/70 mt-1">
        Premi Invio per andare a capo. Seleziona una parola e premi &quot;Aggiungi link&quot;, oppure scrivi [testo](url) — #parliamone apre il contatto.
      </span>
    </div>
  );
}