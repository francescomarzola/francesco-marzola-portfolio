// Genera public/newsletter.json con l'ultimo articolo di The Unlikeness (Substack).
// Sostituisce la funzione backend Base44 "latestUnlikeness": gira in build
// (in locale e su GitHub Actions). Se il feed non risponde, scrive article: null
// e il widget newsletter semplicemente non compare: la build non fallisce mai.
import { writeFileSync, mkdirSync } from 'node:fs';

const FEED = 'https://unlikeness.substack.com/feed';
const OUT = new URL('../public/newsletter.json', import.meta.url);

const decode = (v = '') => v
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
  .replace(/&#(x[\da-f]+|\d+);/gi, (_, n) => String.fromCodePoint(n[0].toLowerCase() === 'x' ? parseInt(n.slice(1), 16) : Number(n)))
  .replace(/&(amp|lt|gt|quot|apos);/g, (_, n) => ({ amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" })[n])
  .trim();

async function latest() {
  const res = await fetch(FEED, {
    signal: AbortSignal.timeout(10000),
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NewsletterPreview/1.0)', Accept: 'application/rss+xml, application/xml, text/xml, */*' },
  });
  if (!res.ok) throw new Error(`Feed HTTP ${res.status}`);
  const xml = await res.text();
  const item = xml.match(/<item\b[^>]*>([\s\S]*?)<\/item>/i)?.[1];
  if (!item) throw new Error('Nessun articolo nel feed');
  const title = decode(item.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]);
  const link = decode(item.match(/<link\b[^>]*>([\s\S]*?)<\/link>/i)?.[1]);
  const url = new URL(link);
  if (!title || url.protocol !== 'https:' || url.hostname !== 'unlikeness.substack.com') throw new Error('Articolo non valido');
  const enclosure = [...item.matchAll(/<enclosure\b[^>]*>/gi)].find(([t]) => /type\s*=\s*["']image\//i.test(t))?.[0];
  const media = item.match(/<media:(?:content|thumbnail)\b[^>]*>/i)?.[0];
  const content = decode(item.match(/<content:encoded\b[^>]*>([\s\S]*?)<\/content:encoded>/i)?.[1] || item.match(/<description\b[^>]*>([\s\S]*?)<\/description>/i)?.[1]);
  const raw = (enclosure || media || '').match(/\burl\s*=\s*["']([^"']+)["']/i)?.[1] || content.match(/<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/i)?.[1];
  const image = raw ? decode(raw) : null;
  return { title: title.slice(0, 500), link: url.href, image: image?.startsWith('https://') ? image : null };
}

let article = null;
try {
  article = await latest();
  console.log(`[newsletter] ultimo articolo: ${article.title}`);
} catch (e) {
  console.warn(`[newsletter] feed non disponibile (${e.message}): widget nascosto`);
}
mkdirSync(new URL('../public/', import.meta.url), { recursive: true });
writeFileSync(OUT, JSON.stringify({ article, updated: new Date().toISOString() }, null, 2) + '\n');
