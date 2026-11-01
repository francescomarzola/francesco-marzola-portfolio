import { useRef } from 'react';
import { useFadeIn } from '@/hooks/useReveal';
import InlineLinks from './InlineLinks';

// Secondary paragraph that fades in. Supports ' / ' line breaks and [text](url) links.
// A link with href '#parliamone' renders as a button that calls onModalLink (opens the contact modal).
export default function RevealText({ children, className = '', triggerRef = null, onModalLink = null }) {
  const ref = useRef(null);
  useFadeIn(ref, triggerRef);
  const content = typeof children === 'string'
    ? <InlineLinks text={children} onModalLink={onModalLink} />
    : children;
  return (
    <p ref={ref} className={className}>{content}</p>
  );
}