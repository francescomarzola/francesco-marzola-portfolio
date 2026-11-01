import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Trash2 } from 'lucide-react';

const inputCls =
  'w-full bg-white border border-[#111111]/15 rounded-sm px-3 py-2 text-[14px] text-[#111111] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F2EE]';

// Editor for the site-wide footer content (single Sito record).
export default function FooterSection() {
  const [record, setRecord] = useState(null);
  const [data, setData] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    base44.entities.Sito.list('created_date', 10)
      .then((rows) => {
        if (rows[0]) {
          setRecord(rows[0]);
          setData(rows[0]);
        }
      })
      .catch(() => {});
  }, []);

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));
  const links = Array.isArray(data.footer_link) ? data.footer_link : [];

  const updateLink = (i, field, val) => {
    const next = links.map((l, idx) => (idx === i ? { ...l, [field]: val } : l));
    set('footer_link', next);
  };
  const addLink = () => set('footer_link', [...links, { etichetta: '', url: '' }]);
  const removeLink = (i) => set('footer_link', links.filter((_, idx) => idx !== i));

  const save = async () => {
    if (!record) return;
    setSaving(true);
    try {
      const updated = await base44.entities.Sito.update(record.id, {
        linkedin_url: data.linkedin_url || '',
        footer_testo: data.footer_testo || '',
        footer_link: links
      });
      setRecord(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  if (!record) return <div className="text-[#6F6C66] text-[13px]">Carico il footer…</div>;

  return (
    <div className="border border-[#111111]/10 rounded-md bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[14px] font-medium">Footer</span>
        <button
          onClick={save}
          disabled={saving}
          className="text-[13px] font-medium px-3 py-1.5 rounded-sm bg-[#111111] text-[#F4F2EE] disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F2EE]"
        >
          {saving ? 'Salvo…' : saved ? 'Salvato ✓' : 'Salva footer'}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="block text-[11px] uppercase tracking-[0.12em] text-[#6F6C66] mb-1.5">Testo copyright (sinistra)</span>
          <input className={inputCls} value={data.footer_testo || ''} onChange={(e) => set('footer_testo', e.target.value)} placeholder="© 2026 Francesco Marzola" />
        </label>
        <label className="block">
          <span className="block text-[11px] uppercase tracking-[0.12em] text-[#6F6C66] mb-1.5">URL LinkedIn</span>
          <input className={inputCls} value={data.linkedin_url || ''} onChange={(e) => set('linkedin_url', e.target.value)} placeholder="https://www.linkedin.com/in/…" />
        </label>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] uppercase tracking-[0.12em] text-[#6F6C66]">Link aggiuntivi</span>
          <button
            type="button"
            onClick={addLink}
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.1em] text-[#F26522] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522] rounded-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Aggiungi link
          </button>
        </div>
        {links.length === 0 && (
          <p className="text-[12px] text-[#6F6C66]/70">Nessun link aggiuntivo. Compariranno tra LinkedIn e l'email.</p>
        )}
        <div className="space-y-2">
          {links.map((l, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                className={inputCls}
                value={l.etichetta || ''}
                placeholder="Etichetta"
                onChange={(e) => updateLink(i, 'etichetta', e.target.value)}
              />
              <input
                className={inputCls}
                value={l.url || ''}
                placeholder="https://… o mailto:…"
                onChange={(e) => updateLink(i, 'url', e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeLink(i)}
                className="p-2 shrink-0 rounded-sm border border-[#111111]/15 text-[#6F6C66] hover:bg-[#111111]/5 hover:text-[#111111] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522]"
                title="Rimuovi"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[12px] text-[#6F6C66]/70 mt-3">
        L'email di contatto si imposta nell'editor Header (campo &laquo;Email di destinazione&raquo;) ed è usata nella modale di contatto.
      </p>
    </div>
  );
}