import { useEffect, useRef, useState } from 'react';
import { content } from '@/api/content';
import { useIsMobile } from '@/hooks/use-mobile';
import { resolveSito } from '@/lib/mobileOverride';
import RevealTitle from './RevealTitle';

const DEFAULT_EMAIL = 'marzola.fra@gmail.com';

// tone: 'orange' (default, for the orange contact scene) or 'light' (for the modal).
export default function ContactForm({ tone = 'orange' }) {
  const light = tone === 'light';
  const [referente, setReferente] = useState('');
  const [bisogno, setBisogno] = useState('');
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState(false);
  const [contactEmail, setContactEmail] = useState(DEFAULT_EMAIL);
  const textareaRef = useRef(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    content.list('Sito')
      .then((rows) => {
        const s = resolveSito(rows[0], isMobile);
        if (s?.email) setContactEmail(s.email);
      })
      .catch(() => {});
  }, [isMobile]);

  const grow = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${ta.scrollHeight}px`;
  };

  const canSend = bisogno.trim() !== '' && email.trim() !== '';

  const submit = async (e) => {
    e.preventDefault();
    if (!canSend || sending) return;
    setSending(true);
    setFailed(false);
    try {
      // Invio via FormSubmit: la richiesta arriva per email all'indirizzo del sito.
      const res = await fetch(`https://formsubmit.co/ajax/${contactEmail}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: 'Nuovo contatto da francescomarzola.it',
          _template: 'table',
          _captcha: 'false',
          _replyto: email.trim(),
          'Chi ti ha parlato di me': referente.trim(),
          'Di cosa hai bisogno': bisogno.trim(),
          Email: email.trim(),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === 'false' || json.success === false) throw new Error(json.message || 'Invio non riuscito');
      setDone(true);
    } catch (err) {
      console.error(err);
      setFailed(true);
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <h3 className="font-medium tracking-[-0.035em] leading-[1.05] text-[clamp(1.6rem,3.5vw,2.8rem)] max-w-[20ch]">
        Grazie. Ti scrivo io, a breve.
      </h3>
    );
  }

  const ink = light ? '#111111' : '#F4F2EE';
  const labelCls = light ? 'text-[#6F6C66]' : 'text-[#F4F2EE]/80';
  const offsetBg = light ? '#F4F2EE' : '#F26522';

  const inputBase = `w-full bg-transparent border-b py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[${ink}] focus-visible:ring-offset-2 focus-visible:ring-offset-[${offsetBg}] rounded-sm transition-shadow`;
  const inputColor = light
    ? 'border-[#111111] caret-[#111111] text-[#111111]'
    : 'border-[#F4F2EE] caret-[#F4F2EE] text-[#F4F2EE] placeholder:text-[#F4F2EE]/50';
  const ringCls = light
    ? 'focus-visible:ring-[#F26522]'
    : 'focus-visible:ring-[#F4F2EE]';

  return (
    <form onSubmit={submit} className="mt-12 max-w-[720px] space-y-10">
      <div>
        <label htmlFor="referente" className={`block text-[13px] ${labelCls} mb-2`}>
          Chi ti ha parlato di me?
        </label>
        <input
          id="referente"
          type="text"
          value={referente}
          onChange={(e) => setReferente(e.target.value)}
          className={`${inputBase} ${inputColor} ${ringCls} text-[clamp(1.2rem,2.4vw,1.8rem)]`}
        />
      </div>

      <div>
        <label htmlFor="bisogno" className={`block text-[13px] ${labelCls} mb-2`}>
          Di cosa hai bisogno?
        </label>
        <textarea
          id="bisogno"
          ref={textareaRef}
          rows={1}
          value={bisogno}
          placeholder="Anche solo un'idea."
          onChange={(e) => {
            setBisogno(e.target.value);
            grow();
          }}
          className={`${inputBase} ${inputColor} ${ringCls} resize-none text-[clamp(1.2rem,2.4vw,1.8rem)]`}
        />
      </div>

      <div>
        <label htmlFor="email" className={`block text-[13px] ${labelCls} mb-2`}>
          La tua email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`${inputBase} ${inputColor} ${ringCls} text-[16px]`}
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={!canSend || sending}
          className={`group text-[16px] font-medium disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 ${ringCls} focus-visible:ring-offset-2 focus-visible:ring-offset-[${offsetBg}] rounded-sm`}
          style={{ color: ink }}
        >
          <span className="relative">
            {sending ? 'Invio…' : 'Invia →'}
            <span className="absolute left-0 -bottom-0.5 h-px w-0 transition-all duration-300 group-hover:w-full" style={{ background: ink }} />
          </span>
        </button>
        {failed && (
          <p role="alert" className="mt-4 text-[15px]" style={{ color: ink }}>
            Qualcosa non è andato. Scrivimi direttamente all'indirizzo qui sotto.
          </p>
        )}
      </div>

      <p className={`text-[15px] leading-[1.6] max-w-[52ch] ${light ? 'text-[#6F6C66]' : 'text-[#F4F2EE]/80'}`}>
        Oppure scrivimi a{' '}
        <a
          href={`mailto:${contactEmail}`}
          className={`underline underline-offset-4 hover:text-[#F26522] focus-visible:outline-none focus-visible:ring-2 ${ringCls} focus-visible:ring-offset-2 focus-visible:ring-offset-[${offsetBg}] rounded-sm`}
          style={{ color: ink }}
        >
          {contactEmail}
        </a>
        .
      </p>
    </form>
  );
}