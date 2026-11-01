// Standard narrative scene: title + optional secondary text + optional list.
// `sticky` pins the content at the top for a scroll beat before releasing.
// Colors and font sizes come from the per-type style (CSS variables on the wrapper).
import { useState } from 'react';
import RevealTitle from './RevealTitle';
import RevealText from './RevealText';
import RevealList from './RevealList';
import ContactModal from './ContactModal';
import { styleVars } from '@/lib/styleResolver';

const WRAP = 'bg-[var(--c-sfondo)] text-[color:var(--c-testo)]';

export default function Scene({
  index,
  title,
  secondary,
  list,
  as = 'h2',
  sticky = false,
  ctaParliamone = false,
  altezza = null,
  style,
  titleClassName = 'font-semibold tracking-[-0.035em] leading-[1.0] text-[length:var(--f-titolo)] max-w-[16ch] text-left'
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const vars = styleVars(style);

  const content = (
    <>
      <RevealTitle as={as} text={title} className={titleClassName} />
      {secondary && (
        <RevealText
          className="text-[length:var(--f-sottotitolo)] leading-[1.45] font-semibold text-[color:var(--c-sottotitolo)] mt-10 max-w-[52ch]"
          onModalLink={() => setModalOpen(true)}
        >
          {secondary}
        </RevealText>
      )}
      {list && (
        <RevealList
          items={list}
          className="mt-10 text-[length:var(--f-lista)] uppercase tracking-[0.1em] text-[color:var(--c-testo-sec)]"
        />
      )}
      <ContactModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );

  if (altezza != null) {
    return (
      <section
        className={`flex flex-col justify-center overflow-hidden px-6 sm:p-[5%] ${WRAP}`}
        style={{ ...vars, height: `${altezza}svh` }}
        data-scene={index}
      >
        {content}
      </section>
    );
  }

  if (sticky) {
    return (
      <div data-scene={index} className={`relative h-[100svh] sm:h-[160svh] ${WRAP}`} style={vars}>
        <div className="sticky top-0 min-h-[50svh] sm:min-h-[100svh] flex flex-col justify-center px-6 sm:p-[5%]">
          {content}
        </div>
      </div>
    );
  }

  return (
    <section
      className={`min-h-[50svh] sm:min-h-[100svh] flex flex-col justify-center px-6 sm:p-[5%] ${WRAP}`}
      style={vars}
      data-scene={index}
    >
      {content}
    </section>
  );
}