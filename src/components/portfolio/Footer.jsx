import { useEffect, useState } from 'react';
import { content } from '@/api/content';
import { useIsMobile } from '@/hooks/use-mobile';
import { resolveSito } from '@/lib/mobileOverride';

const LINKEDIN_DEFAULT = 'https://www.linkedin.com/in/francescomarzola';
const EMAIL_DEFAULT = 'marzola.fra@gmail.com';
const FOOTER_DEFAULT = '© 2026 Francesco Marzola';

const linkCls =
  'hover:text-[#F26522] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111] rounded-sm';

// Link interni a pagine singole (es. /chi-sono): colore molto saturo.
const pageLinkCls =
  'text-[#FF3D00] font-semibold hover:text-[#ff6a3d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3D00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111] rounded-sm';

const isInternal = (url) => typeof url === 'string' && url.startsWith('/');

export default function Footer() {
  const [sito, setSito] = useState(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    content.list('Sito')
      .then((rows) => setSito(rows[0] || null))
      .catch(() => setSito(null));
  }, []);

  const s = resolveSito(sito, isMobile);
  const email = s?.email || EMAIL_DEFAULT;
  const linkedin = s?.linkedin_url || LINKEDIN_DEFAULT;
  const footerTesto = s?.footer_testo || FOOTER_DEFAULT;
  const extra = Array.isArray(s?.footer_link) ? s.footer_link.filter((l) => l && l.etichetta && l.url) : [];

  return (
    <footer className="snap-start pt-8 pb-28 sm:py-8 px-6 sm:px-10 lg:px-16 text-[13px] text-[#F4F2EE]/80 bg-[#111111] flex flex-wrap gap-x-6 gap-y-2 justify-between">
      <span>{footerTesto}</span>
      <div className="flex flex-wrap gap-x-6 gap-y-2 items-center">
        <a href={linkedin} target="_blank" rel="noopener noreferrer" className={linkCls}>LinkedIn</a>
        {extra.map((l, i) => (
          <a
            key={i}
            href={l.url}
            target={/^https?:\/\//.test(l.url) ? '_blank' : undefined}
            rel={/^https?:\/\//.test(l.url) ? 'noopener noreferrer' : undefined}
            className={isInternal(l.url) ? pageLinkCls : linkCls}
          >
            {l.etichetta}
          </a>
        ))}
      </div>
    </footer>
  );
}