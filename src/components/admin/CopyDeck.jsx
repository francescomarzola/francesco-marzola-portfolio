import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { X, Copy, Check, FileText } from 'lucide-react';

const TIPI = {
  intro: 'Intro (hero)',
  narrazione: 'Narrazione',
  narrativa_lunga: 'Narrativa lunga',
  progetto: 'Progetto',
  check: 'Check',
  contatto: 'Contatto',
  parole: 'Parole (marquee)'
};

const has = (v) => v != null && v !== '' && !(Array.isArray(v) && v.length === 0);

function buildDeck(sito, scene) {
  const lines = [];
  lines.push('FRANCESCO MARZOLA — COPY DECK');
  lines.push('='.repeat(48));
  lines.push('');

  if (sito) {
    lines.push('[HEADER]');
    if (has(sito.nome)) lines.push(`Nome: ${sito.nome}`);
    if (has(sito.firma)) lines.push(`Firma: ${sito.firma}`);
    if (has(sito.ruolo)) lines.push(`Ruolo: ${sito.ruolo}`);
    if (has(sito.cta_label)) lines.push(`CTA: ${sito.cta_label}`);
    if (has(sito.modal_titolo)) lines.push(`Titolo modale: ${sito.modal_titolo}`);
    if (has(sito.email)) lines.push(`Email: ${sito.email}`);
    lines.push('');
    lines.push('[FOOTER]');
    if (has(sito.footer_testo)) lines.push(`Testo: ${sito.footer_testo}`);
    if (has(sito.linkedin_url)) lines.push(`LinkedIn: ${sito.linkedin_url}`);
    if (Array.isArray(sito.footer_link)) {
      sito.footer_link.forEach((l) => {
        if (l && l.etichetta && l.url) lines.push(`- ${l.etichetta}: ${l.url}`);
      });
    }
    lines.push('');
  }

  scene
    .filter((s) => s.visibile !== false)
    .forEach((s) => {
      const label = TIPI[s.tipo] || s.tipo;
      lines.push(`[SCENA ${String(s.ordine ?? '').padStart(2, '0')} — ${label}]`);
      if (s.tema) lines.push(`Tema: ${s.tema}`);
      if (has(s.titolo)) lines.push(`Titolo: ${s.titolo}`);
      if (has(s.sottotitolo)) lines.push(`Sottotitolo: ${s.sottotitolo}`);
      if (has(s.lista)) lines.push(`Lista:\n${s.lista.map((i) => `  - ${i}`).join('\n')}`);
      if (has(s.numero)) lines.push(`Numero: ${s.numero}`);
      if (has(s.cliente)) lines.push(`Cliente: ${s.cliente}`);
      if (has(s.contesto)) lines.push(`Contesto: ${s.contesto}`);
      if (has(s.youtube_id)) lines.push(`YouTube: ${s.youtube_id}`);
      if (has(s.video_url)) lines.push(`Video: ${s.video_url}`);
      if (has(s.immagini)) lines.push(`Immagini:\n${s.immagini.map((i) => `  - ${i}`).join('\n')}`);
      if (has(s.link_etichetta)) lines.push(`Link: ${s.link_etichetta} (${s.link_url || ''})`);
      if (s.opacita != null && s.tipo === 'parole') lines.push(`Opacità: ${s.opacita}`);
      if (has(s.altezza_schermo)) lines.push(`Altezza schermo: ${s.altezza_schermo}%`);
      lines.push('');
    });

  return lines.join('\n');
}

export default function CopyDeck() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [scene, siti] = await Promise.all([
        base44.entities.Scena.list('ordine', 100),
        base44.entities.Sito.list('created_date', 10)
      ]);
      setText(buildDeck(siti[0] || null, scene));
    } catch (e) {
      setText('Errore nel caricamento dei contenuti.');
    } finally {
      setLoading(false);
    }
  };

  const openPanel = () => {
    setOpen(true);
    setCopied(false);
    load();
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // fallback: select the textarea
    }
  };

  if (!open) {
    return (
      <button
        onClick={openPanel}
        className="inline-flex items-center gap-1.5 text-[13px] text-[#6F6C66] hover:text-[#F26522] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522] rounded-sm"
      >
        <FileText className="w-3.5 h-3.5" /> Copy deck
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setOpen(false)}>
      <div
        className="bg-white rounded-md w-full max-w-2xl h-[85vh] flex flex-col overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#111111]/10">
          <h2 className="text-[15px] font-medium">Copy deck del sito</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={copy}
              disabled={loading}
              className="inline-flex items-center gap-1.5 text-[13px] font-medium px-3 py-1.5 rounded-sm bg-[#111111] text-[#F4F2EE] disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522]"
            >
              {copied ? <><Check className="w-3.5 h-3.5" /> Copiato</> : <><Copy className="w-3.5 h-3.5" /> Copia</>}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-sm text-[#6F6C66] hover:bg-[#111111]/5 hover:text-[#111111] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522]"
              title="Chiudi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <textarea
          readOnly
          value={loading ? 'Carico…' : text}
          className="flex-1 min-h-0 w-full px-5 py-4 text-[12px] font-mono leading-[1.5] text-[#111111] resize-none focus:outline-none bg-[#FBFAF8]"
          onFocus={(e) => e.target.select()}
        />
      </div>
    </div>
  );
}