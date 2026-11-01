import { X } from 'lucide-react';
import { Image } from '@/components/ui/image';

export default function NewsletterCard({ article, onClose }) {
  return (
    <>
      <div className="flex items-center justify-between gap-3 px-5 py-3">
        <span className="text-xs font-semibold tracking-wide">The Unlikeness</span>
        <button type="button" onClick={onClose} aria-label="Chiudi anteprima newsletter" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-newsletter-ink/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-newsletter-accent">
          <X className="h-4 w-4" />
        </button>
      </div>
      <a href={article.link} target="_blank" rel="noopener noreferrer" className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-newsletter-accent" aria-label={`${article.title}, leggi su Substack in una nuova scheda`}>
        {article.image && <Image src={article.image} alt="" className="aspect-video w-full" fittingType="fill" />}
        <div className="p-5">
          <h2 className="font-heading text-xl font-semibold leading-tight tracking-tight">{article.title}</h2>
          <p className="mt-3 text-sm font-semibold text-newsletter-accent">Leggi su Substack</p>
        </div>
      </a>
    </>
  );
}