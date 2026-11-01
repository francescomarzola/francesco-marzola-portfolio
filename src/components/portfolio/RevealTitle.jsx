import { useRef } from 'react';
import { useLineReveal } from '@/hooks/useReveal';

// Splits `text` on " / " into masked lines that reveal from below.
export default function RevealTitle({ text, as: Tag = 'h2', className = '' }) {
  const ref = useRef(null);
  useLineReveal(ref);
  const lines = text.split(' / ');
  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <span className="block" data-line>{line}</span>
        </span>
      ))}
    </Tag>
  );
}