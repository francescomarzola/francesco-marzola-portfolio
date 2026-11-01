import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useIsMobile } from '@/hooks/use-mobile';
import { resolveSito } from '@/lib/mobileOverride';

const inputCls = 'w-full text-[14px] px-3 py-2 rounded-sm bg-white border border-[#111111]/15 focus-visible:outline-none focus-visible:border-[#F26522]';

export default function ProjectsHeading({ mobile = false }) {
  const [sito, setSito] = useState(null);
  const [val, setVal] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    base44.entities.Sito.list('created_date', 10)
      .then((rows) => {
        const s = rows[0] || null;
        setSito(s);
        setVal(mobile ? (s?.progetti_titolo_mobile ?? '') : (s?.progetti_titolo ?? ''));
      })
      .catch(() => setSito(null));
  }, [mobile]);

  const save = async () => {
    if (!sito) return;
    setSaving(true);
    try {
      const patch = mobile ? { progetti_titolo_mobile: val } : { progetti_titolo: val };
      const updated = await base44.entities.Sito.update(sito.id, patch);
      setSito(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  if (mobile && !isMobile) {
    // editor è sempre renderizzato nel tab mobile; mostra sempre
  }

  const label = mobile ? 'Titolo progetti (mobile)' : 'Titolo progetti';
  const hint = mobile
    ? 'Override mobile del titolo sopra le card progetto. Lascia vuoto per ereditare il valore desktop.'
    : 'Testo mostrato come heading sopra le card progetto. Su mobile, se non c\u2019\u00e8 un override, vale questo.';

  return (
    <section className="space-y-3 border border-[#111111]/10 rounded-md p-4 bg-white/40">
      <div className="flex items-baseline justify-between">
        <h2 className="text-[15px] font-medium">{label}</h2>
        {sito && (
          <button
            onClick={save}
            disabled={saving}
            className="text-[13px] font-medium px-3 py-1.5 rounded-sm bg-[#111111] text-[#F4F2EE] disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522]"
          >
            {saving ? 'Salvo…' : saved ? 'Salvato ✓' : 'Salva'}
          </button>
        )}
      </div>
      <p className="text-[13px] text-[#6F6C66]">{hint}</p>
      <input
        className={inputCls}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder={mobile ? 'eredita desktop' : 'es. Lavori selezionati'}
      />
    </section>
  );
}