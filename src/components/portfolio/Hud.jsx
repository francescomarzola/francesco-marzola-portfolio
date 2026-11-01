import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Progress spine (left edge) + scene counter (bottom-right).
export default function Hud({ count = 0 }) {
  const [active, setActive] = useState(1);

  useEffect(() => {
    if (!count) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const bar = document.getElementById('progress-bar');
    if (!bar) return;
    if (reduced) {
      gsap.set(bar, { scaleY: 1 });
      return;
    }
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      scrub: 1,
      animation: gsap.fromTo(bar, { scaleY: 0 }, { scaleY: 1, ease: 'none' })
    });
    return () => st.kill();
  }, [count]);

  useEffect(() => {
    if (!count) return;
    const sections = Array.from(document.querySelectorAll('[data-scene]'));
    if (!sections.length) return;
    const triggers = sections.map((sec, i) => {
      const idx = i + 1;
      return ScrollTrigger.create({
        trigger: sec,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: (self) => {
          if (self.isActive) setActive(idx);
        },
        onEnter: () => setActive(idx),
        onEnterBack: () => setActive(idx)
      });
    });
    return () => triggers.forEach((t) => t.kill());
  }, [count]);

  const padded = String(active).padStart(2, '0');

  return (
    <>
      <div className="fixed left-0 top-0 w-px h-full bg-[#111111]/10 z-30 origin-top">
        <div id="progress-bar" className="w-full h-full bg-[#111111] origin-top" />
      </div>
      <div
        className="fixed bottom-6 right-6 text-[12px] tabular-nums text-[#6F6C66] z-30"
        aria-live="polite"
      >
        <span className="text-[#111111]">{padded}</span> / {count}
      </div>
    </>
  );
}