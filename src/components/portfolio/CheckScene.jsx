// Scene 12: CheckYourBrand — title + brand callout + external check-up link.
// Colors and font sizes come from the per-type style (CSS variables on the wrapper).
import RevealTitle from './RevealTitle';
import RevealText from './RevealText';
import InlineLinks from './InlineLinks';
import { styleVars } from '@/lib/styleResolver';

export default function CheckScene({ index, titolo, cliente, sottotitolo, linkUrl, linkEtichetta, altezza = null, style }) {
  const vars = styleVars(style);
  return (
    <section
      className="min-h-[50svh] sm:min-h-[100svh] flex flex-col justify-center px-6 sm:p-[5%] bg-[var(--c-sfondo)] text-[color:var(--c-testo)]"
      style={{ ...vars, minHeight: altezza != null ? `${altezza}svh` : undefined }}
      data-scene={index}
    >
      <RevealTitle
        as="h2"
        text={titolo}
        className="font-semibold tracking-[-0.035em] leading-[1.0] text-[length:var(--f-titolo)] max-w-[16ch] text-left"
      />
      <RevealText className="text-[length:var(--f-sottotitolo)] leading-[1.45] font-semibold text-[color:var(--c-sottotitolo)] mt-10 max-w-[52ch]">
        {cliente && (
          <span className="font-medium text-[color:var(--c-testo)] transition-colors duration-300 hover:text-[color:var(--c-accento)]">
            {cliente}.
          </span>
        )}{' '}
        <InlineLinks text={sottotitolo} />
      </RevealText>
      {linkUrl && (
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 group text-[16px] font-medium text-[color:var(--c-testo)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-accento)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--c-sfondo)] rounded-sm self-start"
        >
          <span className="relative">
            {linkEtichetta}
            <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-[var(--c-testo)] transition-all duration-300 group-hover:w-full" />
          </span>
        </a>
      )}
    </section>
  );
}