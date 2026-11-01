// Project scene with optional embedded video (YouTube or mp4) placed after the copy.
// Colors and font sizes come from the per-type style (CSS variables on the wrapper).
import RevealTitle from './RevealTitle';
import RevealText from './RevealText';
import InlineLinks from './InlineLinks';
import ImageSlider from './ImageSlider';
import { styleVars } from '@/lib/styleResolver';

export default function ProjectEmbedScene({ index, number, title, client, context, youtubeId, videoUrl, images, as = 'h2', extraClassName = '', style }) {
  const hasVideo = !!(youtubeId || videoUrl);
  const hasImages = Array.isArray(images) && images.length > 0;
  const vars = styleVars(style);
  return (
    <section
      className={`min-h-[50svh] sm:min-h-[100svh] flex flex-col justify-center px-6 sm:p-[5%] ${extraClassName} bg-[var(--c-sfondo)] text-[color:var(--c-testo)]`}
      style={vars}
      data-scene={index}
    >
      <span className="inline-block self-start bg-[var(--c-accento)] text-[color:var(--c-sfondo)] text-[length:var(--f-numero)] uppercase tracking-[0.14em] font-medium px-2.5 py-1 mb-8">
        Progetto {number}
      </span>
      <RevealTitle
        as={as}
        text={title}
        className="font-semibold tracking-[-0.035em] leading-[1.0] text-[length:var(--f-titolo)] max-w-[16ch] text-left"
      />
      <RevealText className="text-[length:var(--f-contesto)] leading-[1.6] text-[color:var(--c-testo-sec)] mt-10 max-w-[52ch]">
        <span className="font-medium text-[color:var(--c-testo)] transition-colors duration-300 hover:text-[color:var(--c-accento)] focus-visible:text-[color:var(--c-accento)] focus-visible:outline-none rounded-sm">
          {client}.
        </span>{' '}
        <InlineLinks text={context} />
      </RevealText>
      {hasVideo && (
        <div className="mt-12 w-full max-w-[900px] aspect-video bg-black/5">
          {youtubeId ? (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title={`Video ${client}`}
              loading="lazy"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <video className="w-full h-full" src={videoUrl} controls playsInline preload="metadata" />
          )}
        </div>
      )}
      {hasImages && <ImageSlider images={images} />}
    </section>
  );
}