// Renders a string, turning [text](url) markdown into <a> links.
// A link with href '#parliamone' becomes a button that calls onModalLink.
// Newlines and " / " both render as line breaks.
const LINK_RE = /\[([^\]]+)\]\(([^)\s]+)\)/g;
const SEP_RE = /\s\/\s|\r?\n/;

function renderLinks(line, onModalLink) {
  const out = [];
  let last = 0;
  let m;
  let i = 0;
  LINK_RE.lastIndex = 0;
  while ((m = LINK_RE.exec(line))) {
    if (m.index > last) out.push(line.slice(last, m.index));
    const isModal = m[2] === '#parliamone' && onModalLink;
    out.push(
      isModal ? (
        <button
          key={`l-${i++}`}
          type="button"
          onClick={onModalLink}
          className="text-current underline underline-offset-4 hover:text-[var(--c-accento)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-accento)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--c-sfondo)] rounded-sm"
        >
          {m[1]}
        </button>
      ) : (
        <a
          key={`l-${i++}`}
          href={m[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-current underline underline-offset-4 hover:text-[var(--c-accento)] active:text-[var(--c-accento)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-accento)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--c-sfondo)] rounded-sm"
        >
          {m[1]}
        </a>
      )
    );
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

export default function InlineLinks({ text, onModalLink = null }) {
  if (typeof text !== 'string' || !text) return null;
  const lines = text.split(SEP_RE);
  return (
    <>
      {lines.map((line, i) => (
        <span key={i}>
          {i > 0 && <br />}
          {renderLinks(line, onModalLink)}
        </span>
      ))}
    </>
  );
}