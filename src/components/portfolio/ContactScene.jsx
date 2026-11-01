// Scene 14: the "Parliamone" form scene.
// Colors and font sizes come from the per-type style (CSS variables on the wrapper).
import RevealTitle from './RevealTitle';
import ContactForm from './ContactForm';
import { styleVars } from '@/lib/styleResolver';

export default function ContactScene({ index, titolo, altezza = null, style }) {
  const vars = styleVars(style);
  return (
    <section
      id="parliamone"
      className="min-h-[50svh] sm:min-h-[100svh] flex flex-col justify-center px-6 sm:p-[5%] pt-24 bg-[var(--c-sfondo)] text-[color:var(--c-testo)]"
      style={{ ...vars, minHeight: altezza != null ? `${altezza}svh` : undefined }}
      data-scene={index}
    >
      <RevealTitle
        as="h2"
        text={titolo}
        className="font-semibold tracking-[-0.035em] leading-[1.0] text-[length:var(--f-titolo)] max-w-[16ch] text-left"
      />
      <ContactForm />
    </section>
  );
}