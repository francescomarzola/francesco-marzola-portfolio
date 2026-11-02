// Contact form rendered inside a dialog (modal) — light theme.
import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { content } from '@/api/content';
import { useIsMobile } from '@/hooks/use-mobile';
import { resolveSito } from '@/lib/mobileOverride';
import ContactForm from './ContactForm';

export default function ContactModal({ open, onOpenChange }) {
  const [titolo, setTitolo] = useState('Parliamone');
  const isMobile = useIsMobile();

  useEffect(() => {
    content.list('Sito')
      .then((rows) => {
        const s = resolveSito(rows[0], isMobile);
        if (s?.modal_titolo) setTitolo(s.modal_titolo);
      })
      .catch(() => {});
  }, [isMobile]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[640px] bg-[#F4F2EE] text-[#111111] border border-[#111111]/10 p-0 overflow-hidden">
        <div className="px-6 sm:px-10 py-10">
          <h2 className="font-medium tracking-[-0.03em] leading-[1.05] text-[clamp(2rem,4vw,3rem)] mb-8">
            {titolo}
          </h2>
          <ContactForm tone="light" />
        </div>
      </DialogContent>
    </Dialog>
  );
}