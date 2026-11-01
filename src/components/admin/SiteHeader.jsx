import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Upload } from 'lucide-react';

const inputCls =
  'w-full bg-white border border-[#111111]/15 rounded-sm px-3 py-2 text-[14px] text-[#111111] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F2EE]';

// Editor for site-wide header content (single Sito record).
export default function SiteHeader() {
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
  const [uploading, setUploading] = useState(false);

  const onPickPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
      set('foto_url', file_url);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const save = async () => {
    if (!record) return;
    setSaving(true);
    try {
      const updated = await base44.entities.Sito.update(record.id, {
        nome: data.nome || '',
        firma: data.firma || '',
        ruolo: data.ruolo || '',
        foto_url: data.foto_url || '',
        cta_label: data.cta_label || '',
        email: data.email || '',
        modal_titolo: data.modal_titolo || ''
      });
      setRecord(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  if (!record) return <div className="text-[#6F6C66] text-[13px]">Carico l'header…</div>;

  return (
    <div className="border border-[#111111]/10 rounded-md bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[14px] font-medium">Header</span>
        <button
          onClick={save}
          disabled={saving}
          className="text-[13px] font-medium px-3 py-1.5 rounded-sm bg-[#111111] text-[#F4F2EE] disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F2EE]"
        >
          {saving ? 'Salvo…' : saved ? 'Salvato ✓' : 'Salva header'}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className="block">
          <span className="block text-[11px] uppercase tracking-[0.12em] text-[#6F6C66] mb-1.5">Nome</span>
          <input className={inputCls} value={data.nome || ''} onChange={(e) => set('nome', e.target.value)} />
        </label>
        <label className="block">
          <span className="block text-[11px] uppercase tracking-[0.12em] text-[#6F6C66] mb-1.5">Firma</span>
          <input className={inputCls} value={data.firma || ''} onChange={(e) => set('firma', e.target.value)} />
        </label>
        <label className="block">
          <span className="block text-[11px] uppercase tracking-[0.12em] text-[#6F6C66] mb-1.5">Etichetta CTA</span>
          <input className={inputCls} value={data.cta_label || ''} onChange={(e) => set('cta_label', e.target.value)} />
        </label>
        <label className="block">
          <span className="block text-[11px] uppercase tracking-[0.12em] text-[#6F6C66] mb-1.5">Foto profilo (URL)</span>
          <input className={inputCls} value={data.foto_url || ''} onChange={(e) => set('foto_url', e.target.value)} placeholder="https://…" />
        </label>
        <label className="block">
          <span className="block text-[11px] uppercase tracking-[0.12em] text-[#6F6C66] mb-1.5">Oppure carica una foto</span>
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 cursor-pointer text-[13px] font-medium px-3 py-2 rounded-sm bg-[#111111] text-[#F4F2EE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F2EE]">
              <Upload className="w-4 h-4" />
              {uploading ? 'Carico…' : 'Carica file'}
              <input type="file" accept="image/*" className="hidden" onChange={onPickPhoto} disabled={uploading} />
            </label>
            {data.foto_url && (
              <span className="w-10 h-10 rounded-full overflow-hidden bg-[#1A1E29] shrink-0">
                <img src={data.foto_url} alt="anteprima" className="w-full h-full object-cover" />
              </span>
            )}
          </div>
        </label>
        <label className="block sm:col-span-2">
          <span className="block text-[11px] uppercase tracking-[0.12em] text-[#6F6C66] mb-1.5">Ruolo (pillola scura)</span>
          <input className={inputCls} value={data.ruolo || ''} onChange={(e) => set('ruolo', e.target.value)} placeholder="CEO & Chief Creative Officer" />
        </label>
        <label className="block">
          <span className="block text-[11px] uppercase tracking-[0.12em] text-[#6F6C66] mb-1.5">Titolo modale contatto</span>
          <input className={inputCls} value={data.modal_titolo || ''} onChange={(e) => set('modal_titolo', e.target.value)} placeholder="Parliamone" />
        </label>
        <label className="block sm:col-span-2">
          <span className="block text-[11px] uppercase tracking-[0.12em] text-[#6F6C66] mb-1.5">Email di destinazione (modale + footer)</span>
          <input className={inputCls} type="email" value={data.email || ''} onChange={(e) => set('email', e.target.value)} placeholder="marzola.fra@gmail.com" />
        </label>
      </div>
    </div>
  );
}