// Auto-rotating image slider matching the video footprint (max-w-[900px] aspect-video).
// Pauses on hover; click opens a lightbox preview with prev/next.
import { useState, useEffect } from 'react';
import { Image } from '@/components/ui/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageSlider({ images = [], interval = 3800, fill = false }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  const count = images.length;

  useEffect(() => {
    if (paused || count <= 1) return;
    const id = setInterval(() => setActive((a) => (a + 1) % count), interval);
    return () => clearInterval(id);
  }, [paused, count, interval]);

  if (!count) return null;

  return (
    <>
      <div
        className={fill
          ? "w-full h-full bg-[#111111]/5 overflow-hidden cursor-zoom-in relative"
          : "mt-0 sm:mt-12 w-full max-w-[900px] aspect-video bg-[#111111]/5 overflow-hidden cursor-zoom-in relative"}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onClick={() => setLightbox(active)}
      >
        <Image
          src={images[active]}
          alt={`Exequia ${active + 1}`}
          className="w-full h-full"
          fittingType="fill"
        />
        {count > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setActive(i);
                }}
                className={`h-1.5 rounded-full transition-all ${i === active ? 'w-6 bg-[#111111]' : 'w-1.5 bg-[#111111]/40'}`}
                aria-label={`Immagine ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(null);
            }}
            className="absolute top-5 right-5 text-white/80 hover:text-white focus-visible:outline-none"
            aria-label="Chiudi"
          >
            <X className="w-7 h-7" />
          </button>
          {count > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox((l) => (l - 1 + count) % count);
                }}
                className="absolute left-5 text-white/80 hover:text-white focus-visible:outline-none"
                aria-label="Precedente"
              >
                <ChevronLeft className="w-9 h-9" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox((l) => (l + 1) % count);
                }}
                className="absolute right-5 text-white/80 hover:text-white focus-visible:outline-none"
                aria-label="Successiva"
              >
                <ChevronRight className="w-9 h-9" />
              </button>
            </>
          )}
          <div className="max-w-[92vw] max-h-[88vh] w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[lightbox]}
              alt={`Exequia ${lightbox + 1}`}
              className="max-w-full max-h-full"
              fittingType="fit"
            />
          </div>
        </div>
      )}
    </>
  );
}