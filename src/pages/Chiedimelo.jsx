// Landing dedicata al traffico da ChatGPT Ads: una schermata, niente scroll.
// Titolo "chiedilo a me" + chat che si apre da sola e raccoglie domanda, sito ed email.
// Le richieste arrivano via FormSubmit, come il form contatti del sito.
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUp, X } from 'lucide-react';
import RevealTitle from '@/components/portfolio/RevealTitle';
import HeroShader from '@/components/portfolio/HeroShader';

// Le richieste arrivano direttamente all'email personale (FormSubmit: alla prima richiesta
// manda a questo indirizzo un'email di attivazione da confermare una volta sola).
const CONTACT_EMAIL = 'marzola.fra@gmail.com';
const SEND_TIMEOUT = 15000;
const FOTO = '/media/profilo.webp';
const OPEN_DELAY = 2300; // ms: titolo, poi saluto, poi si apre la chat

const STEPS = [
  {
    key: 'domanda',
    bot: [
      'Ciao, sono Francesco.',
      'Chiedimi quello che hai chiesto a ChatGPT.',
      'Non so se la mia risposta sarà migliore, ma ti assicuro che sarà vera e unica.',
    ],
    placeholder: 'Scrivi la tua domanda…',
    multiline: true,
  },
  {
    key: 'sito',
    bot: ['Bella domanda. Ma la risposta giusta dipende da chi sei.', 'Su quale brand? Incollami il sito.'],
    placeholder: 'www.iltuobrand.it',
    skip: 'Non ho ancora un sito',
  },
  {
    key: 'email',
    bot: ['Ultima cosa: dove ti mando la risposta?'],
    placeholder: 'nome@azienda.it',
    type: 'email',
  },
];

const DONE_MSG = ['Ricevuto.', 'Ti rispondo io, di persona, entro 24 ore. Niente risposte automatiche.'];

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function readUtm() {
  const p = new URLSearchParams(window.location.search);
  const out = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((k) => {
    if (p.get(k)) out[k] = p.get(k);
  });
  return out;
}

function Avatar() {
  return (
    <span className="w-8 h-8 rounded-full overflow-hidden bg-[#1A1E29] shrink-0">
      <img src={FOTO} alt="" className="w-full h-full object-cover" />
    </span>
  );
}

function Typing() {
  return (
    <span className="inline-flex gap-1 py-1" aria-label="Sta scrivendo">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-[#111111]/40 motion-safe:animate-bounce"
          style={{ animationDelay: `${i * 120}ms` }}
        />
      ))}
    </span>
  );
}

function ChatPanel({ onClose }) {
  const [messages, setMessages] = useState([]); // { from: 'bot' | 'me', text }
  const [step, setStep] = useState(-1); // -1 = sta scrivendo il primo messaggio
  const [typing, setTyping] = useState(false);
  const [value, setValue] = useState('');
  const [answers, setAnswers] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | done | failed
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const started = useRef(false);

  const say = async (lines) => {
    for (const text of lines) {
      setTyping(true);
      await wait(Math.min(1100, 380 + text.length * 14));
      setTyping(false);
      setMessages((m) => [...m, { from: 'bot', text }]);
      await wait(180);
    }
  };

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    say(STEPS[0].bot).then(() => setStep(0));
  }, []);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing, status]);

  useEffect(() => {
    if (step >= 0 && status === 'idle') inputRef.current?.focus({ preventScroll: true });
  }, [step, status]);

  const current = step >= 0 && step < STEPS.length ? STEPS[step] : null;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  const canSend = current && value.trim() !== '' && (current.type !== 'email' || emailOk) && status === 'idle';

  const submitAll = async (all) => {
    setStatus('sending');
    setTyping(true);
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), SEND_TIMEOUT);
      const res = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: 'POST',
        signal: ctrl.signal,
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: 'Domanda da "Chiedimelo" (ChatGPT Ads) — francescomarzola.it',
          _template: 'table',
          _captcha: 'false',
          _replyto: all.email,
          Domanda: all.domanda,
          Sito: all.sito || '—',
          Email: all.email,
          Pagina: window.location.href,
          ...readUtm(),
        }),
      });
      clearTimeout(timer);
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === 'false' || json.success === false) throw new Error(json.message || 'Invio non riuscito');
      setTyping(false);
      // Evento per il tracciamento conversioni (GTM / pixel), se presente.
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'lead_chiedimelo', ...readUtm() });
      await say(DONE_MSG);
      setStatus('done');
    } catch (err) {
      console.error(err);
      setTyping(false);
      setStatus('failed');
    }
  };

  const answer = async (text, isSkip = false) => {
    if (!current) return;
    const key = current.key;
    const next = { ...answers, [key]: isSkip ? '' : text.trim() };
    setAnswers(next);
    setMessages((m) => [...m, { from: 'me', text: text.trim() }]);
    setValue('');
    const nextStep = step + 1;
    setStep(STEPS.length + 1); // blocca l'input mentre "scrive"
    await wait(250);
    if (nextStep < STEPS.length) {
      await say(STEPS[nextStep].bot);
      setStep(nextStep);
    } else {
      await submitAll(next);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (canSend) answer(value);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (canSend) answer(value);
    }
  };

  const grow = (el) => {
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Chiedilo a Francesco"
      className="chat-in w-full sm:w-[420px] h-[min(430px,54svh)] sm:h-[min(580px,calc(100svh-7rem))] flex flex-col bg-[#F4F2EE] text-[#111111] rounded-t-3xl sm:rounded-3xl shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)] overflow-hidden"
    >
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[#111111]/10">
        <Avatar />
        <div className="min-w-0">
          <p className="text-[14px] font-semibold leading-tight">Francesco Marzola</p>
          <p className="text-[12px] text-[#6F6C66] leading-tight">Strategic Design &amp; Direction</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Chiudi la chat"
          className="ml-auto w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#111111]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div ref={listRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-2.5" aria-live="polite">
        {messages.map((m, i) =>
          m.from === 'bot' ? (
            <div key={i} className="msg-in flex">
              <p className="max-w-[85%] bg-white rounded-2xl rounded-bl-md px-4 py-2.5 text-[15px] leading-[1.45] shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
                {m.text}
              </p>
            </div>
          ) : (
            <div key={i} className="msg-in flex justify-end">
              <p className="max-w-[85%] bg-[#111111] text-[#F4F2EE] rounded-2xl rounded-br-md px-4 py-2.5 text-[15px] leading-[1.45] whitespace-pre-wrap break-words">
                {m.text}
              </p>
            </div>
          )
        )}
        {typing && (
          <div className="flex">
            <p className="bg-white rounded-2xl rounded-bl-md px-4 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
              <Typing />
            </p>
          </div>
        )}
        {status === 'done' && (
          <div className="msg-in pt-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-[14px] font-semibold underline underline-offset-4 hover:text-[#F26522] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522] rounded-sm"
            >
              Nel frattempo, scopri chi sono <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
        {status === 'failed' && (
          <div className="msg-in flex">
            <p role="alert" className="max-w-[85%] bg-white rounded-2xl rounded-bl-md px-4 py-2.5 text-[15px] leading-[1.45] shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
              Non sono riuscito a riceverla da qui.{' '}
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('La mia domanda')}&body=${encodeURIComponent(`${answers.domanda || ''}\n\nSito: ${answers.sito || '—'}`)}`}
                className="underline underline-offset-4 font-semibold hover:text-[#F26522]"
              >
                Mandamela per email
              </a>
              , è già scritta.
            </p>
          </div>
        )}
      </div>

      {status !== 'done' && status !== 'failed' && (
        <div className="px-4 pb-4 pt-2">
          {current?.skip && (
            <button
              type="button"
              onClick={() => answer(current.skip, true)}
              className="mb-2 text-[13px] font-medium text-[#6F6C66] border border-[#111111]/15 rounded-full px-3 py-1.5 hover:border-[#111111]/40 hover:text-[#111111] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522]"
            >
              {current.skip}
            </button>
          )}
          <form onSubmit={onSubmit} className="flex items-end gap-2 bg-white rounded-2xl pl-4 pr-2 py-2 border border-[#111111]/10 focus-within:border-[#111111]/40 transition-colors">
            {current?.multiline ? (
              <textarea
                ref={inputRef}
                rows={1}
                value={value}
                disabled={!current}
                placeholder={current?.placeholder || ''}
                onChange={(e) => { setValue(e.target.value); grow(e.target); }}
                onKeyDown={onKeyDown}
                aria-label={current?.placeholder || 'Messaggio'}
                className="flex-1 resize-none bg-transparent py-1.5 text-[16px] leading-[1.4] placeholder:text-[#6F6C66]/70 focus:outline-none disabled:opacity-50"
              />
            ) : (
              <input
                ref={inputRef}
                type={current?.type || 'text'}
                inputMode={current?.type === 'email' ? 'email' : 'url'}
                autoComplete={current?.type === 'email' ? 'email' : 'url'}
                value={value}
                disabled={!current}
                placeholder={current?.placeholder || ''}
                onChange={(e) => setValue(e.target.value)}
                aria-label={current?.placeholder || 'Messaggio'}
                className="flex-1 bg-transparent py-1.5 text-[16px] placeholder:text-[#6F6C66]/70 focus:outline-none disabled:opacity-50"
              />
            )}
            <button
              type="submit"
              disabled={!canSend}
              aria-label="Invia"
              className="w-9 h-9 rounded-full bg-[#F26522] text-white flex items-center justify-center shrink-0 disabled:bg-[#111111]/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default function Chiedimelo() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // la chat resta montata dopo la prima apertura
  const [waveKey, setWaveKey] = useState(0); // cambia chiave = riparte il saluto

  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Chiedilo a me — Francesco Marzola';
    // Landing a pagamento: fuori dall'indice, la pagina organica resta la home.
    const robots = document.querySelector('meta[name="robots"]');
    const prevRobots = robots?.getAttribute('content');
    robots?.setAttribute('content', 'noindex, follow');
    // Nessuno scroll su questa pagina.
    const html = document.documentElement;
    const prevSnap = html.style.scrollSnapType;
    html.style.scrollSnapType = 'none';
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => { setMounted(true); setOpen(true); }, OPEN_DELAY);
    return () => {
      clearTimeout(t);
      document.title = prevTitle;
      if (robots && prevRobots) robots.setAttribute('content', prevRobots);
      html.style.scrollSnapType = prevSnap;
      document.body.style.overflow = '';
    };
  }, []);

  const openChat = () => { setMounted(true); setOpen(true); };

  // Se l'utente resta fermo 2 secondi (dopo l'apertura della chat), una manina sale dal basso,
  // indica "Scopri chi sono" e poi fa il pollice in su. Succede una volta sola per visita.
  const [hint, setHint] = useState('off'); // off | point | like | gone
  const hintDone = useRef(false);
  useEffect(() => {
    if (!mounted || hintDone.current) return;
    const linkVisible = () => !open || window.matchMedia('(min-width: 640px)').matches;
    let idle;
    const timers = [];
    const arm = () => {
      clearTimeout(idle);
      idle = setTimeout(() => {
        if (hintDone.current || !linkVisible()) return;
        hintDone.current = true;
        setHint('point');
        timers.push(setTimeout(() => setHint('like'), 1700));
        timers.push(setTimeout(() => setHint('gone'), 3300));
        stop();
      }, 2000);
    };
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'wheel', 'input'];
    const stop = () => events.forEach((e) => window.removeEventListener(e, arm, true));
    events.forEach((e) => window.addEventListener(e, arm, { capture: true, passive: true }));
    arm();
    return () => { clearTimeout(idle); stop(); };
  }, [mounted, open]);


  return (
    <main className="relative h-[100svh] overflow-hidden bg-[#F26522] text-[#F4F2EE]">
      <HeroShader />

      {/* Badge in alto, come sul sito */}
      <div className="absolute top-0 inset-x-0 z-20 px-4 sm:px-10 lg:px-16 py-[0.9rem] sm:py-4 flex justify-center sm:justify-start">
        <div
          onMouseEnter={() => setWaveKey((k) => k + 1)}
          className="flex items-center gap-3 bg-white rounded-full pl-2 pr-3 py-1.5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.22)]"
        >
          <span className="relative w-9 h-9 shrink-0">
            {/* Manina che esce da dietro la foto e saluta */}
            <span
              key={waveKey}
              aria-hidden="true"
              className="wave-hand absolute z-0 -left-[26px] top-1/2 text-[26px] leading-none pointer-events-none select-none"
            >
              👋
            </span>
            <span className="relative z-10 block w-9 h-9 rounded-full overflow-hidden bg-[#1A1E29] ring-2 ring-white">
              <img src={FOTO} alt="Francesco Marzola" className="w-full h-full object-cover" />
            </span>
          </span>
          <span className="text-[14px] font-semibold text-[#111111]">Francesco Marzola</span>
          <span className="hidden sm:inline-block text-[12px] font-medium text-white bg-[#1A1E29] rounded-full px-2.5 py-1">
            Strategic Design &amp; Direction
          </span>
        </div>
      </div>

      {/* Titolo */}
      <section className="relative z-10 h-full flex flex-col justify-start sm:justify-center px-6 sm:px-[5%] pt-[5.75rem] sm:pt-28 sm:pb-16">
        <RevealTitle
          as="h1"
          text="Hai chiesto / a ChatGPT. / Ora chiedilo / a me."
          className="font-semibold tracking-[-0.035em] leading-[1.0] text-[clamp(2rem,min(10.5vw,7.6svh),7rem)] sm:text-[clamp(3rem,min(11vw,13svh),7rem)] max-w-[16ch] text-left"
        />
        <p className="hidden sm:block text-[clamp(1.05rem,2.6vw,1.6rem)] leading-[1.4] font-semibold mt-10 max-w-[32ch] sm:max-w-[40ch]">
          Piacere, sono Francesco. Mi occupo di branding strategico da vent'anni.
        </p>
        {(
          <button
            type="button"
            onClick={openChat}
            tabIndex={open ? -1 : 0}
            aria-hidden={open}
            className={`${open ? 'invisible' : ''} group mt-8 self-start inline-flex items-center gap-2.5 rounded-full bg-[#111111] border border-white/60 pl-5 pr-2 py-2 text-white text-[15px] font-semibold shadow-[0_2px_12px_-4px_rgba(0,0,0,0.28)] hover:bg-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F26522]`}
          >
            Chiedimelo
            <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center transition-transform group-hover:translate-x-0.5">
              <ArrowRight className="w-4 h-4 text-[#F26522]" />
            </span>
          </button>
        )}
      </section>

      {/* Chat: a destra su desktop, foglio dal basso su mobile */}
      {mounted && (
        <div
          className={`fixed z-30 inset-x-0 bottom-0 sm:inset-x-auto sm:right-10 lg:right-16 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 ${open ? '' : 'hidden'}`}
        >
          <ChatPanel onClose={() => setOpen(false)} />
        </div>
      )}

      {/* Scopri chi sono — in basso a destra (nascosto su mobile mentre la chat è aperta) */}
      <Link
        to="/"
        className={`group fixed z-20 right-4 sm:right-10 lg:right-16 bottom-4 sm:bottom-6 items-center gap-1.5 text-[14px] sm:text-[15px] font-semibold text-[#F4F2EE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4F2EE] rounded-sm ${open ? 'hidden sm:inline-flex' : 'inline-flex'}`}
      >
        <span className="relative">
          Scopri chi sono
          <span className="absolute left-0 -bottom-0.5 h-px w-full bg-[#F4F2EE]/60 group-hover:bg-[#F4F2EE]" />
        </span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        {/* Manina "da inattività": sale dal basso, indica il link, poi pollice in su */}
        <span
          aria-hidden="true"
          data-hint={hint}
          className="idle-hand absolute right-full mr-2 bottom-[-2px] text-[30px] sm:text-[34px] leading-none pointer-events-none select-none"
        >
          <span className="idle-hand-inner block">{hint === 'like' || hint === 'gone' ? '👍' : '👉'}</span>
        </span>
      </Link>
    </main>
  );
}
