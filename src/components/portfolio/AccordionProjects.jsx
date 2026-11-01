import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2 } from 'lucide-react';
import ProjectMedia from './ProjectMedia';
import ProjectModal from './ProjectModal';
import { styleVars } from '@/lib/styleResolver';

const REDUCED = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function AccordionProjects({ projects, ordine, altezza = null, titolo, style }) {
  const [open, setOpen] = useState(null);
  if (!projects?.length) return null;
  const vars = styleVars(style);

  return (
    <section
      className="h-[100svh] flex flex-col justify-center px-6 pt-[clamp(4.5rem,14vw,6.5rem)] pb-[clamp(5.5rem,16vw,7.5rem)] sm:p-[5%] bg-[var(--c-sfondo)] text-[color:var(--c-testo)]"
      style={{ ...vars, height: altezza != null ? `${altezza}svh` : undefined }}
      data-scene={ordine}
    >
      {titolo && (
        <h2 className="mb-6 sm:mb-8 font-semibold tracking-[-0.03em] leading-[1.05] text-[clamp(2rem,5vw,3.5rem)] text-[color:var(--c-testo)]">
          {titolo}
        </h2>
      )}

      <div className="flex-1 flex flex-col min-h-0 border-t border-[#111111]/10">
        {projects.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setOpen(p)}
            className="group flex-1 min-h-0 w-full text-left border-b border-[#111111]/10 transition-colors duration-200 hover:bg-[#F26522] focus-visible:outline-none focus-visible:bg-[#F26522]"
          >
            <div className="h-full flex items-center gap-4 sm:gap-6 px-2 sm:px-6">
              <span className="shrink-0 w-8 text-[12px] sm:text-[13px] tabular-nums text-[#A0A0A0] group-hover:text-white/80 transition-colors">
                {p.numero}
              </span>
              <h3 className="shrink min-w-0 font-semibold tracking-[-0.03em] leading-[1.05] text-[length:var(--f-titolo)] text-[color:var(--c-testo)] group-hover:text-white whitespace-nowrap overflow-hidden text-ellipsis transition-colors">
                {p.cliente}
              </h3>
              <Maximize2 className="shrink-0 w-5 h-5 sm:w-6 sm:h-6 text-[color:var(--c-testo)] group-hover:text-white opacity-50 group-hover:opacity-100 transition-all" />
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {open && <ProjectModal project={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </section>
  );
}