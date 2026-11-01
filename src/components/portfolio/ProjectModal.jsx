import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import ProjectMedia from './ProjectMedia';

const REDUCED = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-[#F4F2EE] text-[#111111] overflow-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: REDUCED ? 0 : 0.25 }}
    >
      <button
        type="button"
        onClick={onClose}
        className="fixed top-5 right-5 z-10 w-11 h-11 rounded-full bg-[#111111] text-[#F4F2EE] flex items-center justify-center hover:bg-[#F26522] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522]"
        aria-label="Chiudi"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="min-h-screen flex flex-col lg:flex-row">
        <div className="lg:w-1/2 h-[44vh] sm:h-[50vh] lg:h-screen lg:sticky lg:top-0 bg-[#111111]/5">
          <ProjectMedia fill youtubeId={project.youtube_id} videoUrl={project.video_url} images={project.immagini} />
        </div>
        <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center min-h-[50vh]">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-[13px] tabular-nums text-[#A0A0A0]">{project.numero}</span>
            <span className="text-[15px] font-semibold tracking-[-0.02em]">{project.cliente}</span>
          </div>
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-semibold tracking-[-0.03em] leading-[1.05] mb-6">
            {project.titolo}
          </h2>
          <p className="text-[16px] sm:text-[17px] leading-[1.6] text-[#3A3A3A] max-w-[52ch]">
            {project.contesto}
          </p>
        </div>
      </div>
    </motion.div>
  );
}