import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Image } from '@/components/ui/image';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import NewsletterCard from '@/components/newsletter/NewsletterCard';

export default function NewsletterWidget() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { data: article } = useQuery({
    queryKey: ['latest-unlikeness', pathname],
    queryFn: () => base44.functions.invoke('latestUnlikeness', {}).then(({ data }) => data.article || null).catch(() => null),
    staleTime: 3600000,
    gcTime: 3600000,
    retry: false,
    refetchOnWindowFocus: false,
  });
  useEffect(() => { setOpen(false); }, [pathname]);
  if (!article) return null;
  return (
    <div className="newsletter-widget fixed z-40 font-body">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button type="button" aria-label="Apri l’ultima newsletter di The Unlikeness" className="newsletter-trigger flex h-14 w-14 items-center justify-center rounded-full border border-newsletter-surface/60 bg-newsletter-ink text-newsletter-surface shadow-lg hover:bg-newsletter-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-newsletter-accent focus-visible:ring-offset-2" data-open={open}>
            <Image src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFFFFF'%3E%3Cpath d='M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z'/%3E%3C/svg%3E" alt="" className="h-6 w-6" fittingType="fit" />
          </button>
        </PopoverTrigger>
        <PopoverContent side="top" align="end" sideOffset={12} collisionPadding={12} aria-label="Ultima newsletter di The Unlikeness" className="z-[45] max-h-[calc(100dvh-8rem)] w-[min(320px,calc(100vw-24px))] overflow-y-auto rounded-2xl border-newsletter-ink/10 bg-newsletter-surface p-0 font-body text-newsletter-ink shadow-xl motion-reduce:animate-none">
          <NewsletterCard article={article} onClose={() => setOpen(false)} />
        </PopoverContent>
      </Popover>
    </div>
  );
}