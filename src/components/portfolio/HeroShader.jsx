// Hero background. Shows the live WebGPU shader (HeroShaderCanvas) when the browser supports it;
// otherwise — or with prefers-reduced-motion — keeps the old SubtleBackground blobs.
// The shader chunk is downloaded only when it can actually run.
import { lazy, Suspense, useEffect, useState } from 'react';
import SubtleBackground from './SubtleBackground';

const HeroShaderCanvas = lazy(() => import('./HeroShaderCanvas'));

export default function HeroShader() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!('gpu' in navigator)) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    // Some browsers expose navigator.gpu without a usable adapter.
    navigator.gpu
      .requestAdapter()
      .then((adapter) => { if (!cancelled && adapter) setEnabled(true); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  if (!enabled) return <SubtleBackground />;

  return (
    <Suspense fallback={<SubtleBackground />}>
      <HeroShaderCanvas />
    </Suspense>
  );
}
