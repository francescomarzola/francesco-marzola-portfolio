// Override-only editor for the site header (Sito) mobile content.
// Empty mobile field = inherits the desktop value (shown as a hint).
import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Upload } from 'lucide-react';

const overrideCls =
  'w-full bg-[#FFF7F0] border border-[#F26522]/30 rounded-sm px-3 py-2 text-[14px] text-[#111111] placeholder:text-[#6F6C66]/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F2EE]';

function MobileField({ label, desktopValue, mobileValue, onChange, type, placeholder }) {
  const inherited = !mobileValue || String(mobileValue).trim() === '';
  return (
    <label className="block">
      <span className="flex items-center justify-between text-[11px] uppercase tracking-[0.12em] text-[#6F6C66] mb-1.5">
        <span>{label}</span>
        <span className={`normal-case tracking-normal text-[11px] ${inherited ? 'text-[#6F6C66]/70' : 'text-[#F26522]'}`}>
          {inherited ? `eredita: ${desktopValue || '—'}` : 'override mobile'}
        </span>
      </span>
      <input className={overrideCls} type={type || 'text'} value={mobileValue || ''} placeholder={placeholder || desktopValue} onChange={onChange} />
    </label>
  );
}

export default function MobileSiteHeader() {
  const [record, setRecord] = useState(null);
  const [data, setData] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

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

  const onPickPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
      set('foto_url_mobile', file_url);
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
        nome_mobile: data.nome_mobile || '',
        firma_mobile: data.firma_mobile || '',
        ruolo_mobile: data.ruolo_mobile || '',
        foto_url_mobile: data.foto_url_mobile || '',
        cta_label_mobile: data.cta_label_mobile || '',
        email_mobile: data.email_mobile || '',
        modal_titolo_mobile: data.modal_titolo_mobile || ''
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
    <div className="border border-[#F26522]/20 rounded-md bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[14px] font-medium">Header · override mobile</span>
        <button
          onClick={save}
          disabled={saving}
          className="text-[13px] font-medium px-3 py-1.5 rounded-sm bg-[#F26522] text-white disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F2EE]"
        >
          {saving ? 'Salvo…' : saved ? 'Salvato ✓' : 'Salva header mobile'}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MobileField label="Nome" desktopValue={data.nome} mobileValue={data.nome_mobile} onChange={(e) => set('nome_mobile', e.target.value)} />
        <MobileField label="Firma" desktopValue={data.firma} mobileValue={data.firma_mobile} onChange={(e) => set('firma_mobile', e.target.value)} />
        <MobileField label="Etichetta CTA" desktopValue={data.cta_label} mobileValue={data.cta_label_mobile} onChange={(e) => set('cta_label_mobile', e.target.value)} />
        <MobileField label="Foto profilo (URL)" desktopValue={data.foto_url} mobileValue={data.foto_url_mobile} onChange={(e) => set('foto_url_mobile', e.target.value)} placeholder="https://…" />
        <label className="block">
          <span className="block text-[11px] uppercase tracking-[0.12em] text-[#6F6C66] mb-1.5">Oppure carica una foto mobile</span>
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 cursor-pointer text-[13px] font-medium px-3 py-2 rounded-sm bg-[#F26522] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F2EE]">
              <Upload className="w-4 h-4" />
              {uploading ? 'Carico…' : 'Carica file'}
              <input type="file" accept="image/*" className="hidden" onChange={onPickPhoto} disabled={uploading} />
            </label>
            {data.foto_url_mobile && (
              <span className="w-10 h-10 rounded-full overflow-hidden bg-[#1A1E29] shrink-0">
                <img src={data.foto_url_mobile} alt="anteprima mobile" className="w-full h-full object-cover" />
              </span>
            )}
          </div>
        </label>
        <label className="block sm:col-span-2">
          <span className="flex items-center justify-between text-[11px] uppercase tracking-[0.12em] text-[#6F6C66] mb-1.5">
            <span>Ruolo (pillola scura)</span>
            <span className={`normal-case tracking-normal text-[11px] ${!data.ruolo_mobile ? 'text-[#6F6C66]/70' : 'text-[#F26522]'}`}>
              {!data.ruolo_mobile ? `eredita: ${data.ruolo || '—'}` : 'override mobile'}
            </span>
          </span>
          <input className={overrideCls} value={data.ruolo_mobile || ''} placeholder={data.ruolo || 'CEO & Chief Creative Officer'} onChange={(e) => set('ruolo_mobile', e.target.value)} />
        </label>
        <MobileField label="Titolo modale contatto" desktopValue={data.modal_titolo} mobileValue={data.modal_titolo_mobile} onChange={(e) => set('modal_titolo_mobile', e.target.value)} placeholder={data.modal_titolo || 'Parliamone'} />
        <label className="block sm:col-span-2">
          <span className="flex items-center justify-between text-[11px] uppercase tracking-[0.12em] text-[#6F6C66] mb-1.5">
            <span>Email di destinazione</span>
            <span className={`normal-case tracking-normal text-[11px] ${!data.email_mobile ? 'text-[#6F6C66]/70' : 'text-[#F26522]'}`}>
              {!data.email_mobile ? `eredita: ${data.email || '—'}` : 'override mobile'}
            </span>
          </span>
          <input className={overrideCls} type="email" value={data.email_mobile || ''} placeholder={data.email || 'marzola.fra@gmail.com'} onChange={(e) => set('email_mobile', e.target.value)} />
        </label>
      </div>
    </div>
  );
}