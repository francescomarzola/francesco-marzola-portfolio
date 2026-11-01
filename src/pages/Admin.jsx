import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import SceneCard from '@/components/admin/SceneCard';
import SiteHeader from '@/components/admin/SiteHeader';
import FooterSection from '@/components/admin/FooterSection';
import CopyDeck from '@/components/admin/CopyDeck';
import MobileSceneCard from '@/components/admin/MobileSceneCard';
import MobileSiteHeader from '@/components/admin/MobileSiteHeader';
import StyleTab from '@/components/admin/StyleTab';
import ProjectsHeading from '@/components/admin/ProjectsHeading';

const payload = (d) => ({
  ordine: Number(d.ordine) || 0,
  tipo: d.tipo,
  tema: d.tema || 'chiaro',
  appiccicata: !!d.appiccicata,
  titolo: d.titolo || '',
  sottotitolo: d.sottotitolo || '',
  sottotitolo_colore: d.sottotitolo_colore || '',
  lista: d.lista || [],
  opacita: d.opacita == null ? 100 : Number(d.opacita),
  parliamone_cta: !!d.parliamone_cta,
  numero: d.numero || '',
  cliente: d.cliente || '',
  contesto: d.contesto || '',
  immagini: d.immagini || [],
  youtube_id: d.youtube_id || '',
  video_url: d.video_url || '',
  link_url: d.link_url || '',
  link_etichetta: d.link_etichetta || '',
  extra_class: d.extra_class || '',
  visibile: d.visibile !== false,
  altezza_schermo: d.altezza_schermo == null || d.altezza_schermo === '' ? null : Number(d.altezza_schermo),
  // mobile overrides — empty string/null/[] = inherit desktop
  titolo_mobile: d.titolo_mobile || '',
  sottotitolo_mobile: d.sottotitolo_mobile || '',
  sottotitolo_colore_mobile: d.sottotitolo_colore_mobile || '',
  lista_mobile: Array.isArray(d.lista_mobile) ? d.lista_mobile : [],
  opacita_mobile: d.opacita_mobile == null || d.opacita_mobile === '' ? null : Number(d.opacita_mobile),
  numero_mobile: d.numero_mobile || '',
  cliente_mobile: d.cliente_mobile || '',
  contesto_mobile: d.contesto_mobile || '',
  immagini_mobile: Array.isArray(d.immagini_mobile) ? d.immagini_mobile : [],
  youtube_id_mobile: d.youtube_id_mobile || '',
  video_url_mobile: d.video_url_mobile || '',
  link_url_mobile: d.link_url_mobile || '',
  link_etichetta_mobile: d.link_etichetta_mobile || '',
  extra_class_mobile: d.extra_class_mobile || '',
  altezza_schermo_mobile: d.altezza_schermo_mobile == null || d.altezza_schermo_mobile === '' ? null : Number(d.altezza_schermo_mobile)
});

export default function Admin() {
  const [scene, setScene] = useState(null);
  const [user, setUser] = useState(null);
  const [edits, setEdits] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = () =>
    base44.entities.Scena.list('ordine', 100).then((rows) => {
      setScene(rows);
      setEdits({});
    });

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
    load().catch(() => setScene([]));
  }, []);

  const getValue = (s) => edits[s.id] ?? s;
  const handleChange = (id, data) => setEdits((e) => ({ ...e, [id]: data }));
  const dirtyCount = Object.keys(edits).length;

  const saveAll = async () => {
    if (!dirtyCount) return;
    setSaving(true);
    try {
      const changed = Object.entries(edits).map(([id, d]) => ({ id, ...payload(d) }));
      await base44.entities.Scena.bulkUpdate(changed);
      await load();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center text-[#6F6C66]">Carico…</div>;
  }

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-2 px-6 text-center">
        <h1 className="text-[20px] font-medium">Accesso riservato</h1>
        <p className="text-[14px] text-[#6F6C66]">Questa area è riservata agli amministratori.</p>
      </div>
    );
  }

  const renderSceneList = (Card) => {
    if (!scene) return <div className="text-[#6F6C66]">Carico le scene…</div>;
    return (
      <>
        <section className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[15px] font-medium">Progetti · fisarmonica orizzontale</h2>
            <span className="text-[12px] text-[#6F6C66]">Ordine = ordine delle tab</span>
          </div>
          <div className="space-y-4">
            {scene.filter((s) => s.tipo === 'progetto')
              .sort((a, b) => (a.ordine || 0) - (b.ordine || 0))
              .map((s) => (
                <Card key={s.id} scena={s} value={getValue(s)} onChange={(d) => handleChange(s.id, d)} />
              ))}
          </div>
        </section>
        <section className="space-y-3">
          <h2 className="text-[15px] font-medium">Altre scene</h2>
          <div className="space-y-4">
            {scene.filter((s) => s.tipo !== 'progetto')
              .sort((a, b) => (a.ordine || 0) - (b.ordine || 0))
              .map((s) => (
                <Card key={s.id} scena={s} value={getValue(s)} onChange={(d) => handleChange(s.id, d)} />
              ))}
          </div>
        </section>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-[#F4F2EE] text-[#111111]">
      <header className="sticky top-0 z-10 bg-[#F4F2EE]/90 backdrop-blur-sm border-b border-[#111111]/10 px-6 py-4 flex items-center justify-between">
        <h1 className="text-[18px] font-medium">Admin · Contenuti portfolio</h1>
        <div className="flex items-center gap-3">
          {dirtyCount > 0 && (
            <span className="text-[12px] text-[#6F6C66]">{dirtyCount} {dirtyCount === 1 ? 'modifica' : 'modifiche'}</span>
          )}
          <button
            onClick={saveAll}
            disabled={saving || dirtyCount === 0}
            className="text-[13px] font-medium px-3 py-1.5 rounded-sm bg-[#111111] text-[#F4F2EE] disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F2EE]"
          >
            {saving ? 'Salvo…' : saved ? 'Salvato ✓' : 'Salva tutto'}
          </button>
          <CopyDeck />
          <a href="/" className="text-[13px] text-[#6F6C66] hover:text-[#F26522]">Apri il sito →</a>
        </div>
      </header>
      <main className="max-w-[860px] mx-auto px-4 sm:px-6 py-8 space-y-8">
        <Tabs defaultValue="desktop">
          <TabsList className="bg-[#111111]/5">
            <TabsTrigger value="desktop" className="data-[state=active]:bg-white">Desktop</TabsTrigger>
            <TabsTrigger value="mobile" className="data-[state=active]:bg-[#FFF7F0] data-[state=active]:text-[#F26522]">Mobile</TabsTrigger>
            <TabsTrigger value="stile" className="data-[state=active]:bg-[#111111] data-[state=active]:text-[#F4F2EE]">Stile</TabsTrigger>
          </TabsList>

          <TabsContent value="desktop" className="mt-6 space-y-8">
            <p className="text-[14px] text-[#6F6C66]">
              Modifica testi, immagini e video di ogni scena. Questi valori sono la base valida per desktop e mobile: se nella scheda Mobile non c'è un override, si usa questo.
            </p>
            <SiteHeader />
            <FooterSection />
            <ProjectsHeading />
            {renderSceneList(SceneCard)}
          </TabsContent>

          <TabsContent value="mobile" className="mt-6 space-y-8">
            <p className="text-[14px] text-[#6F6C66]">
              Qui sovrascrivi solo ciò che deve cambiare su mobile. Un campo vuoto eredita il valore desktop (mostrato come «eredita: …»). Lascia vuoto = vale il desktop.
            </p>
            <MobileSiteHeader />
            <ProjectsHeading mobile />
            {renderSceneList(MobileSceneCard)}
          </TabsContent>

          <TabsContent value="stile" className="mt-6 space-y-8">
            <StyleTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}