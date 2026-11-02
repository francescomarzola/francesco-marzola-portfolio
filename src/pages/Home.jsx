import { useEffect, useState } from 'react';
import { content } from '@/api/content';
import { useIsMobile } from '@/hooks/use-mobile';
import { resolveScena } from '@/lib/mobileOverride';
import { resolveStyle } from '@/lib/styleResolver';
import Header from '@/components/portfolio/Header';
import Hud from '@/components/portfolio/Hud';
import SceneRenderer from '@/components/portfolio/SceneRenderer';
import AccordionProjects from '@/components/portfolio/AccordionProjects';
import Footer from '@/components/portfolio/Footer';
import { resolveSito } from '@/lib/mobileOverride';
import magicaCase from '@/components/portfolio/magicaCase';

export default function Home() {
  const [scene, setScene] = useState(null);
  const [stili, setStili] = useState(null);
  const [sito, setSito] = useState(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    content.list('Scena')
      .then(setScene)
      .catch(() => setScene([]));
    content.list('StileScena')
      .then((rows) => {
        const map = {};
        rows.forEach((r) => { map[r.tipo] = r; });
        setStili(map);
      })
      .catch(() => setStili({}));
    content.list('Sito')
      .then((rows) => setSito(rows[0] || null))
      .catch(() => setSito(null));
  }, []);

  // Le scene si caricano dopo il montaggio. Lo scroll-snap mandatory + il
  // content dinamico possono fissare la sezione sbagliata: disabilito lo snap,
  // forzo il top su più frame, poi riattivo lo snap.
  useEffect(() => {
    if (!scene) return;
    const root = document.documentElement;
    const snap = root.style.scrollSnapType;
    const behavior = root.style.scrollBehavior;
    root.style.scrollSnapType = 'none';
    root.style.scrollBehavior = 'auto';
    const top = () => window.scrollTo(0, 0);
    top();
    const raf = requestAnimationFrame(top);
    const t = window.setTimeout(() => {
      top();
      root.style.scrollSnapType = snap || '';
      root.style.scrollBehavior = behavior || '';
    }, 250);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
      root.style.scrollSnapType = snap || '';
      root.style.scrollBehavior = behavior || '';
    };
  }, [scene]);

  const visible = scene
    ? scene.filter((s) => s.visibile !== false).map((s) => resolveScena(s, isMobile))
    : null;
  const stileFor = (tipo, tema) => resolveStyle(stili?.[tipo], tipo, tema, isMobile);
  // Il colore del sottotitolo può essere scelto per-scena: sovrascrive il default del tipo.
  const sceneStyle = (s) => {
    const base = stileFor(s.tipo, s.tema);
    return s.sottotitolo_colore ? { ...base, sottotitolo: s.sottotitolo_colore } : base;
  };

  const projects = visible ? [...visible.filter((s) => s.tipo === 'progetto'), ...(magicaCase.visibile !== false ? [magicaCase] : [])] : [];
  const items = [];
  let inserted = false;
  if (visible) {
    visible.forEach((s) => {
      if (s.tipo === 'progetto') {
        if (!inserted) {
          items.push(
            <AccordionProjects
              key="accordion"
              projects={projects}
              ordine={s.ordine}
              altezza={projects[0]?.altezza_schermo}
              titolo={resolveSito(sito, isMobile)?.progetti_titolo}
              style={stileFor('progetto', undefined)}
            />
          );
          inserted = true;
        }
      } else {
        items.push(<SceneRenderer key={s.id} scena={s} style={sceneStyle(s)} />);
      }
    });
  }
  const count = items.length;

  return (
    <div className="bg-[#F4F2EE] text-[#111111] min-h-screen w-full">
      <Header />
      <Hud count={count} />
      {visible ? items : null}
      <Footer />
    </div>
  );
}