import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Line-by-line reveal for titles split by " / "
export function useLineReveal(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    const ctx = gsap.context(() => {
      const lines = el.querySelectorAll('[data-line]');
      gsap.set(lines, { yPercent: 105 });
      gsap.to(lines, {
        yPercent: 0,
        duration: 1,
        ease: 'power4.out',
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 60%', once: true }
      });
    }, el);
    return () => ctx.revert();
  }, [ref]);
}

// Fade-in for secondary text (sottotitoli): appare 2s dopo l'arrivo sulla
// sezione, anche senza scroll aggiuntivo (IntersectionObserver, no ScrollTrigger).
export function useFadeIn(ref, delayRef) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReduced()) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }
    let timer;
    const ctx = gsap.context(() => {
      gsap.set(el, { opacity: 0, y: 28 });
    }, el);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          io.disconnect();
          timer = window.setTimeout(() => {
            gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
          }, 1200);
        });
      },
      { threshold: 0.5 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      window.clearTimeout(timer);
      ctx.revert();
    };
  }, [ref, delayRef]);
}

// Word-by-word reveal for list lines
export function useWordReveal(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    const ctx = gsap.context(() => {
      const words = el.querySelectorAll('[data-word]');
      gsap.set(words, { opacity: 0, yPercent: 40 });
      gsap.to(words, {
        opacity: 1,
        yPercent: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 60%', once: true }
      });
    }, el);
    return () => ctx.revert();
  }, [ref]);
}