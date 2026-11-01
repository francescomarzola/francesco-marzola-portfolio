import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { defaultColors, defaultFonts } from '@/lib/styleResolver';

const inputCls =
  'w-full bg-white border border-[#111111]/15 rounded-sm px-3 py-2 text-[14px] text-[#111111] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F2EE]';

const TIPI = [
  { tipo: 'intro', label: 'Intro (hero)', fonts: ['dim_titolo', 'dim_sottotitolo'] },
  { tipo: 'narrazione', label: 'Narrazione', fonts: ['dim_titolo', 'dim_sottotitolo', 'dim_lista'], tema: true },
  { tipo: 'narrativa_lunga', label: 'Narrativa lunga', fonts: ['dim_titolo', 'dim_sottotitolo', 'dim_lista'], tema: true },
  { tipo: 'progetto', label: 'Progetto', fonts: ['dim_titolo', 'dim_numero', 'dim_cliente', 'dim_contesto'] },
  { tipo: 'check', label: 'Check', fonts: ['dim_titolo', 'dim_sottotitolo'] },
  { tipo: 'contatto', label: 'Contatto', fonts: ['dim_titolo'] },
  { tipo: 'parole', label: 'Parole (marquee)', fonts: ['dim_parole'], tema: true }
];

const COLOR_FIELDS = [
  { key: 'sfondo', label: 'Sfondo' },
  { key: 'testo', label: 'Testo' },
  { key: 'accento', label: 'Accento' },
  { key: 'testo_secondario', label: 'Testo secondario' }
];

const FONT_LABELS = {
  dim_titolo: 'Titolo',
  dim_sottotitolo: 'Sottotitolo',
  dim_lista: 'Lista',
  dim_numero: 'Numero',
  dim_cliente: 'Cliente',
  dim_contesto: 'Contesto',
  dim_parole: 'Parole'
};

const ALL_FIELDS = [...COLOR_FIELDS.map((f) => f.key), ...Object.keys(FONT_LABELS)];

function buildPayload(data) {
  const p = {};
  for (const f of ALL_FIELDS) {
    p[f] = data[f] || '';
    p[`${f}_mobile`] = data[`${f}_mobile`] || '';
  }
  return p;
}

function ColorField({ label, value, onChange, placeholder }) {
  const v = value || '';
  const picker = /^#[0-9a-fA-F]{6}$/.test(v) ? v : '#ffffff';
  return (
    <div>
      <span className="block text-[11px] uppercase tracking-[0.12em] text-[#6F6C66] mb-1.5">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={picker}
          onChange={(e) => onChange(e.target.value)}
          className="w-9 h-9 shrink-0 rounded-sm border border-[#111111]/15 cursor-pointer bg-white p-0.5"
        />
        <input className={inputCls} value={v} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      </div>
    </div>
  );
}

function FontField({ label, value, onChange, placeholder }) {
  return (
    <div>
      <span className="block text-[11px] uppercase tracking-[0.12em] text-[#6F6C66] mb-1.5">{label}</span>
      <input className={inputCls} value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

function Column({ title, data, fonts, df, dc, mobile, onChange }) {
  const suffix = mobile ? '_mobile' : '';
  const get = (f) => data[`${f}${suffix}`] || '';
  const set = (f, v) => onChange({ [`${f}${suffix}`]: v });
  const inherit = (f, def) => data[f] || def;
  return (
    <div className={`rounded-md p-4 ${mobile ? 'bg-[#FFF7F0]' : 'bg-[#F4F2EE]/50'}`}>
      <span className="block text-[11px] uppercase tracking-[0.12em] text-[#6F6C66] mb-3">{title}</span>
      <div className="space-y-3">
        {COLOR_FIELDS.map((c) => (
          <ColorField
            key={c.key}
            label={c.label}
            value={get(c.key)}
            onChange={(v) => set(c.key, v)}
            placeholder={mobile ? `eredita: ${inherit(c.key, dc[c.key])}` : dc[c.key]}
          />
        ))}
        <div className="h-px bg-[#111111]/10 my-2" />
        {fonts.map((f) => (
          <FontField
            key={f}
            label={FONT_LABELS[f]}
            value={get(f)}
            onChange={(v) => set(f, v)}
            placeholder={mobile ? `eredita: ${inherit(f, df[f])}` : df[f]}
          />
        ))}
      </div>
    </div>
  );
}

export default function StyleTab() {
  const [records, setRecords] = useState(null);
  const [edits, setEdits] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    base44.entities.StileScena
      .list('created_date', 50)
      .then((rows) => {
        const map = {};
        rows.forEach((r) => { map[r.tipo] = r; });
        setRecords(map);
      })
      .catch(() => setRecords({}));
  }, []);

  const getValue = (tipo) => edits[tipo] ?? records?.[tipo] ?? {};
  const handleChange = (tipo, data) => setEdits((e) => ({ ...e, [tipo]: { ...getValue(tipo), ...data } }));
  const dirty = Object.keys(edits).length;

  const save = async () => {
    setSaving(true);
    try {
      for (const [tipo, data] of Object.entries(edits)) {
        const payload = { tipo, ...buildPayload(data) };
        const existing = records?.[tipo];
        if (existing) {
          const updated = await base44.entities.StileScena.update(existing.id, payload);
          setRecords((m) => ({ ...m, [tipo]: updated }));
        } else {
          const created = await base44.entities.StileScena.create(payload);
          setRecords((m) => ({ ...m, [tipo]: created }));
        }
      }
      setEdits({});
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  if (!records) return <div className="text-[#6F6C66] text-[13px]">Carico gli stili…</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-[#6F6C66]">Lascia vuoto per usare i valori di default. La colonna Mobile sovrascrive su telefono (vuoto = eredita desktop).</p>
        <div className="flex items-center gap-3 shrink-0 ml-4">
          {dirty > 0 && <span className="text-[12px] text-[#6F6C66]">{dirty} {dirty === 1 ? 'modifica' : 'modifiche'}</span>}
          <button
            onClick={save}
            disabled={saving || dirty === 0}
            className="text-[13px] font-medium px-3 py-1.5 rounded-sm bg-[#111111] text-[#F4F2EE] disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F2EE]"
          >
            {saving ? 'Salvo…' : saved ? 'Salvato ✓' : 'Salva stili'}
          </button>
        </div>
      </div>
      {TIPI.map(({ tipo, label, fonts, tema }) => {
        const data = getValue(tipo);
        const df = defaultFonts(tipo);
        const dc = defaultColors(tipo, 'chiaro');
        return (
          <div key={tipo} className="border border-[#111111]/10 rounded-md bg-white p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-medium">{label}</span>
              <div className="flex items-center gap-2">
                {tema && <span className="text-[11px] text-[#6F6C66]">colori vuoti = default del tema</span>}
                <span className="text-[11px] font-mono text-[#6F6C66]">{tipo}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Column title="Desktop" data={data} fonts={fonts} df={df} dc={dc} onChange={(d) => handleChange(tipo, d)} />
              <Column title="Mobile (override)" data={data} fonts={fonts} df={df} dc={dc} mobile onChange={(d) => handleChange(tipo, d)} />
            </div>
          </div>
        );
      })}
    </div>
  );
}