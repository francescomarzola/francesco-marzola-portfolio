import { useRef } from 'react';
import { useWordReveal } from '@/hooks/useReveal';

// A single line of dot-separated items; each word reveals separately.
export default function RevealList({ items, className = '' }) {
  const ref = useRef(null);
  useWordReveal(ref);
  return (
    <p ref={ref} className={className}>
      {items.map((item, i) => (
        <span key={i}>
          {item.split(' ').map((w, j) => (
            <span key={j} className="inline-block overflow-hidden align-bottom">
              <span className="inline-block" data-word>{w}</span>
            </span>
          ))}
          {i < items.length - 1 && <span data-word> · </span>}
        </span>
      ))}
    </p>
  );
}