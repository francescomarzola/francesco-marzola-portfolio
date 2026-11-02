// Maps a Scena record to the right portfolio component.
import Scene from './Scene';
import ProjectEmbedScene from './ProjectEmbedScene';
import CheckScene from './CheckScene';
import ContactScene from './ContactScene';
import WordsMarquee from './WordsMarquee';
import RevealTitle from './RevealTitle';
import InlineLinks from './InlineLinks';
import HeroShader from './HeroShader';
import { styleVars } from '@/lib/styleResolver';

const titleCls = 'font-semibold tracking-[-0.035em] leading-[1.0] text-[length:var(--f-titolo)] max-w-[16ch] text-left';
const subCls = 'text-[length:var(--f-sottotitolo)] leading-[1.45] font-semibold text-[color:var(--c-sottotitolo)] mt-10 max-w-[52ch]';

export default function SceneRenderer({ scena, style }) {
  const {
    ordine, tipo, appiccicata,
    titolo, sottotitolo, lista,
    numero, cliente, contesto, immagini, youtube_id, video_url,
    link_url, link_etichetta, extra_class, opacita, parliamone_cta, altezza_schermo
  } = scena;

  const vars = styleVars(style);

  if (tipo === 'intro') {
    return (
      <section
        className="relative flex flex-col justify-center px-6 sm:p-[5%] overflow-hidden bg-[var(--c-sfondo)] text-[color:var(--c-testo)]"
        style={{ ...vars, height: altezza_schermo != null ? `${altezza_schermo}svh` : '100svh' }}
        data-scene={ordine}
      >
        <HeroShader />
        <div className="relative">
          <RevealTitle as="h1" text={titolo} className={titleCls} />
          {sottotitolo && <p className={subCls}><InlineLinks text={sottotitolo} /></p>}
        </div>
      </section>
    );
  }

  if (tipo === 'narrazione') {
    return (
      <Scene
        index={ordine}
        title={titolo}
        secondary={sottotitolo}
        list={lista}
        sticky={appiccicata}
        ctaParliamone={!!parliamone_cta}
        altezza={altezza_schermo}
        style={style}
      />
    );
  }

  if (tipo === 'narrativa_lunga') {
    return (
      <Scene
        index={ordine}
        title={titolo}
        secondary={sottotitolo}
        list={lista}
        sticky={appiccicata}
        ctaParliamone={!!parliamone_cta}
        altezza={altezza_schermo}
        style={style}
        titleClassName="font-semibold tracking-[-0.02em] leading-[1.15] text-[length:var(--f-titolo)] max-w-[40ch] text-left"
      />
    );
  }

  if (tipo === 'progetto') {
    return (
      <ProjectEmbedScene
        index={ordine}
        number={numero}
        title={titolo}
        client={cliente}
        context={contesto}
        images={immagini}
        youtubeId={youtube_id}
        videoUrl={video_url}
        extraClassName={extra_class}
        style={style}
      />
    );
  }

  if (tipo === 'check') {
    return (
      <CheckScene
        index={ordine}
        titolo={titolo}
        cliente={cliente}
        sottotitolo={sottotitolo}
        linkUrl={link_url}
        linkEtichetta={link_etichetta}
        altezza={altezza_schermo}
        style={style}
      />
    );
  }

  if (tipo === 'contatto') {
    return <ContactScene index={ordine} titolo={titolo} altezza={altezza_schermo} style={style} />;
  }

  if (tipo === 'parole') {
    return (
      <WordsMarquee
        index={ordine}
        words={lista}
        opacita={opacita}
        altezza={altezza_schermo}
        style={style}
      />
    );
  }

  return null;
}