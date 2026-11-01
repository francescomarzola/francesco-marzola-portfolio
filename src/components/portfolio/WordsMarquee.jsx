// Full-screen left-to-right word marquee. Opacity is data-driven (inline style).
// Colors and font sizes come from the per-type style (CSS variables on the wrapper).
import { styleVars } from '@/lib/styleResolver';

export default function WordsMarquee({ index, words = [], opacita = 100, altezza = null, style }) {
  const items = (Array.isArray(words) ? words : []).filter(Boolean);
  const opacity = Math.max(0, Math.min(100, Number(opacita) ?? 100)) / 100;
  const track = [...items, ...items];
  const duration = Math.max(24, items.length * 7);
  const vars = styleVars(style);

  return (
    <section
      data-scene={index}
      data-marquee="1"
      className="flex items-center overflow-hidden py-[7vh] bg-[var(--c-sfondo)] text-[color:var(--c-testo)]"
      style={{ ...vars, minHeight: altezza != null ? `${altezza}svh` : undefined }}
    >
      <div className="w-full" style={{ opacity }}>
        <div
          className="flex whitespace-nowrap will-change-transform"
          style={{ animation: `marqueeRTL ${duration}s linear infinite` }}
        >
          {track.map((w, i) => (
            <span key={i} className="flex items-center">
              <span className="font-semibold tracking-[-0.03em] leading-none text-[length:var(--f-parole)] px-6">
                {w}
              </span>
              <span className="text-[clamp(1.4rem,4vw,4rem)] text-[color:var(--c-testo)] opacity-30">·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}