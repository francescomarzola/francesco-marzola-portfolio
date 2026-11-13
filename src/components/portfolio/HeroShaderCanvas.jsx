// The actual WebGPU shader stack. Loaded on demand by HeroShader only when WebGPU is available,
// because the shader library is heavy (~700 KB gzip).
// "Mare arancione": a slow tone-on-tone liquid surface on #F26522, no fluted lines.
// Moving the cursor drags a soft wake and sends ripples through the water, like a hand in it.
import { Shader, Swirl, ChromaFlow, CursorRipples, FilmGrain } from 'shaders/react';

export const WATER_PRESETS = {
  calma: {
    opacity: 0.7,
    swirl: { colorA: '#F26522', colorB: '#F57A3E', detail: 1.2, speed: 0.35 },
    wake: '#F68A55',
    wakeMomentum: 10,
    wakeRadius: 3,
    ripples: { intensity: 8, decay: 6, radius: 0.5 },
  },
  mossa: {
    opacity: 0.85,
    swirl: { colorA: '#EE5C18', colorB: '#F78A55', detail: 1.6, speed: 0.6 },
    wake: '#F9A57C',
    wakeMomentum: 14,
    wakeRadius: 3.8,
    ripples: { intensity: 16, decay: 4, radius: 0.7 },
  },
};

export default function HeroShaderCanvas({ preset = 'calma' }) {
  const p = WATER_PRESETS[preset] || WATER_PRESETS.calma;
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ opacity: p.opacity }}>
      <div className="w-full h-full animate-[heroShaderIn_1.6s_ease-out_both]">
        <Shader className="w-full h-full">
          <Swirl {...p.swirl} />
          <ChromaFlow
            baseColor="#F26522"
            upColor={p.wake}
            downColor={p.wake}
            leftColor={p.wake}
            rightColor={p.wake}
            momentum={p.wakeMomentum}
            radius={p.wakeRadius}
            opacity={0.6}
          />
          <CursorRipples {...p.ripples} chromaticSplit={0} edges="mirror" />
          <FilmGrain strength={0.04} />
        </Shader>
      </div>
      <style>{`@keyframes heroShaderIn { from { opacity: 0 } to { opacity: 1 } }`}</style>
    </div>
  );
}
