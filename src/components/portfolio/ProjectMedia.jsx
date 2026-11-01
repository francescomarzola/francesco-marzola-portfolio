import ImageSlider from './ImageSlider';

// Renders a project's media: YouTube embed, mp4 video, or image slider.
// fill=true → occupa tutto lo spazio disponibile (h-full w-full, no aspect fisso).
export default function ProjectMedia({ youtubeId, videoUrl, images, fill = false }) {
  const frame = fill
    ? 'w-full h-full bg-black/5 overflow-hidden'
    : 'w-full max-w-[680px] aspect-video bg-black/5 rounded-md overflow-hidden';

  if (youtubeId) {
    return (
      <div className={frame}>
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title="Video progetto"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }
  if (videoUrl) {
    return (
      <div className={frame}>
        <video className="w-full h-full object-cover" src={videoUrl} controls playsInline preload="metadata" />
      </div>
    );
  }
  if (Array.isArray(images) && images.length > 0) {
    return <ImageSlider images={images} fill={fill} />;
  }
  return null;
}