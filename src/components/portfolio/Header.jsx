import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { content } from '@/api/content';
import { useIsMobile } from '@/hooks/use-mobile';
import { resolveSito } from '@/lib/mobileOverride';
import { Image } from '@/components/ui/image';
import ContactModal from './ContactModal';

// Fixed header: name + signature on the left, CTA link on the right.
// Content is editable from Admin via the Sito entity.
export default function Header() {
  const [sito, setSito] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    content.list('Sito')
      .then((rows) => setSito(rows[0] || null))
      .catch(() => setSito(null));
  }, []);

  const s = resolveSito(sito, isMobile);
  const nome = s?.nome || 'Francesco Marzola';
  const ruolo = s?.ruolo || '';
  const foto = s?.foto_url || '';
  const cta = s?.cta_label || 'Contattami';

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40 bg-transparent sm:bg-transparent py-[0.9rem] sm:py-4 px-4 sm:px-10 lg:px-16 sm:backdrop-blur-sm">
        <div className="flex items-center justify-center sm:justify-between gap-2 sm:gap-4">
          {/* Badge: foto tonda + nome + pillola ruolo — centrato su mobile, +30% su mobile */}
          <div className="flex items-center gap-[clamp(0.5rem,1.8vw,0.65rem)] sm:gap-3 bg-white rounded-full pl-[clamp(0.4rem,1.5vw,0.5rem)] sm:pl-2 pr-[clamp(0.5rem,1.8vw,0.65rem)] sm:pr-3 py-[clamp(0.6rem,2.6vw,0.875rem)] sm:py-1.5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.22)] min-w-0">
            <span className="w-[clamp(2rem,7vw,2.6rem)] h-[clamp(2rem,7vw,2.6rem)] sm:w-9 sm:h-9 rounded-full overflow-hidden bg-[#1A1E29] flex items-center justify-center shrink-0">
              {foto ? (
                <Image src={foto} alt={nome} className="w-full h-full" fittingType="fill" />
              ) : (
                <span className="text-[clamp(12px,3.8vw,14px)] sm:text-[12px] font-medium text-white">FM</span>
              )}
            </span>
            <span className="text-[clamp(14px,4.6vw,17px)] sm:text-[14px] font-semibold text-[#111111] truncate">{nome}</span>
            {ruolo && (
              <span className="inline-block text-[clamp(12px,4vw,15px)] sm:text-[12px] font-medium text-white bg-[#1A1E29] rounded-full px-[clamp(0.6rem,2.2vw,0.8rem)] sm:px-2.5 py-[clamp(0.25rem,0.9vw,0.3rem)] sm:py-1 whitespace-nowrap">
                {ruolo}
              </span>
            )}
          </div>
          {/* CTA arancione con freccia — solo desktop/tablet (in header) */}
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="group hidden sm:inline-flex items-center gap-2.5 rounded-full bg-[#111111] border border-white/60 pl-5 pr-2 py-2 text-white text-[14px] font-semibold shadow-[0_2px_12px_-4px_rgba(0,0,0,0.28)] hover:bg-[#000000] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F26522] shrink-0"
          >
            <span className="whitespace-nowrap">{cta}</span>
            <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center shrink-0 transition-transform group-hover:translate-x-0.5">
              <ArrowRight className="w-4 h-4 text-[#F26522]" />
            </span>
          </button>
        </div>
      </header>
      {/* CTA fisso in basso al centro — solo mobile (fuori dall'header per il containing block del backdrop-blur) */}
      <div className="sm:hidden fixed bottom-4 inset-x-0 z-50 flex justify-center pointer-events-none">
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="group pointer-events-auto inline-flex items-center gap-[clamp(0.6rem,2vw,0.75rem)] rounded-full bg-[#111111] border border-white/60 pl-[clamp(1.4rem,5.5vw,2rem)] pr-[clamp(0.6rem,2.2vw,0.8rem)] py-[clamp(0.6rem,2.2vw,0.8rem)] text-white text-[clamp(1.125rem,5.8vw,1.75rem)] font-semibold shadow-[0_8px_18px_-12px_rgba(0,0,0,0.18)] hover:bg-[#000000] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F26522]"
        >
          <span className="whitespace-nowrap">{cta}</span>
          <span className="w-[clamp(2.2rem,7.5vw,2.75rem)] h-[clamp(2.2rem,7.5vw,2.75rem)] rounded-full bg-white flex items-center justify-center shrink-0 transition-transform group-hover:translate-x-0.5">
          <ArrowRight className="w-[clamp(1.2rem,4vw,1.5rem)] h-[clamp(1.2rem,4vw,1.5rem)] text-[#F26522]" />
          </span>
        </button>
      </div>
      <ContactModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}