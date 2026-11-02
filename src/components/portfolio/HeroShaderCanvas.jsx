// The actual WebGPU shader stack. Loaded on demand by HeroShader only when WebGPU is available,
// because the shader library is heavy (~700 KB gzip).
// Recipe from the Axion reference (swirl + liquid cursor trail + fluted glass + grain),
// adapted to the site palette (avorio + #F26522).
import { Shader, Swirl, ChromaFlow, FlutedGlass, FilmGrain } from 'shaders/react';

export default function HeroShaderCanvas() {
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none opacity-70">
      <div className="w-full h-full animate-[heroShaderIn_1.6s_ease-out_both]">
      <Shader className="w-full h-full">
        <Swirl colorA="#FBFAF7" colorB="#F4F2EE" detail={1.7} />
        <ChromaFlow
          baseColor="#FBFAF7"
          upColor="#F26522"
          downColor="#F26522"
          leftColor="#F26522"
          rightColor="#F26522"
          momentum={13}
          radius={3.5}
        />
        <FlutedGlass
          aberration={0.61}
          angle={31}
          frequency={8}
          highlight={0.12}
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
