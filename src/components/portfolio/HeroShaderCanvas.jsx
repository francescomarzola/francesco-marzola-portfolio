// The actual WebGPU shader stack. Loaded on demand by HeroShader only when WebGPU is available,
// because the shader library is heavy (~700 KB gzip).
// Recipe from the Axion reference (swirl + liquid cursor trail + fluted glass + grain),
// tuned tone-on-tone on the orange hero (#F26522): the animation is only slightly visible.
import { Shader, Swirl, ChromaFlow, FlutedGlass, FilmGrain } from 'shaders/react';

export default function HeroShaderCanvas() {
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none opacity-60">
      <div className="w-full h-full animate-[heroShaderIn_1.6s_ease-out_both]">
      <Shader className="w-full h-full">
        <Swirl colorA="#F26522" colorB="#EC5A16" detail={1.7} />
        <ChromaFlow
          baseColor="#F26522"
          upColor="#F68A55"
          downColor="#F68A55"
          leftColor="#F68A55"
          rightColor="#F68A55"
          momentum={13}
          radius={3.5}
        />
        <FlutedGlass
          aberration={0.61}
          angle={31}
          frequency={8}
          highlight={0.08}
          highlightSoftness={0}
          lightAngle={-90}
          refraction={4}
          shape="rounded"
          softness={1}
          speed={0.15}
        />
        <FilmGrain strength={0.05} />
      </Shader>
      </div>
      <style>{`@keyframes heroShaderIn { from { opacity: 0 } to { opacity: 1 } }`}</style>
    </div>
  );
}
