export default async function latestUnlikeness() {
  // Public, fixed-source RSS lookup: no user data, credentials or caller URLs.
  const key = '__latestUnlikenessFeed';
  const now = Date.now();
  const reply = (article) => Response.json({ article });
  try {
    const cached = globalThis[key];
    if (cached && cached.expires > now) return reply(cached.article);
    const response = await fetch('https://unlikeness.substack.com/feed', {
      signal: AbortSignal.timeout(10000), headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NewsletterPreview/1.0)', Accept: 'application/rss+xml, application/xml, text/xml, */*' },
    });
    if (!response.ok) throw new Error('Feed unavailable');
    const xml = await response.text();
    if (xml.length > 2000000) throw new Error('Feed too large');
    const item = xml.match(/<item\b[^>]*>([\s\S]*?)<\/item>/i)?.[1];
    if (!item) throw new Error('No article');
    const decode = (value = '') => value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/&#(x[\da-f]+|\d+);/gi, (_, n) => String.fromCodePoint(n[0].toLowerCase() === 'x' ? parseInt(n.slice(1), 16) : Number(n))).replace(/&(amp|lt|gt|quot|apos);/g, (_, n) => ({ amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" })[n]).trim();
    const title = decode(item.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]);
    const link = decode(item.match(/<link\b[^>]*>([\s\S]*?)<\/link>/i)?.[1]);
    const url = new URL(link);
    if (!title || url.protocol !== 'https:' || url.hostname !== 'unlikeness.substack.com') throw new Error('Invalid article');
    const enclosure = [...item.matchAll(/<enclosure\b[^>]*>/gi)].find(([tag]) => /type\s*=\s*["']image\//i.test(tag))?.[0];
    const media = item.match(/<media:(?:content|thumbnail)\b[^>]*>/i)?.[0];
    const content = decode(item.match(/<content:encoded\b[^>]*>([\s\S]*?)<\/content:encoded>/i)?.[1] || item.match(/<description\b[^>]*>([\s\S]*?)<\/description>/i)?.[1]);
    const rawImage = (enclosure || media || '').match(/\burl\s*=\s*["']([^"']+)["']/i)?.[1] || content.match(/<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/i)?.[1];
    const image = rawImage ? decode(rawImage) : null;
    const article = { title: title.slice(0, 500), link: url.href, image: image?.startsWith('https://') ? image : null };
    globalThis[key] = { article, expires: now + 3600000 };
    return reply(article);
  } catch (error) {
    console.warn('Newsletter feed unavailable:', error.message);
    globalThis[key] = { article: null, expires: now + 60000 };
    return reply(null);
  }
}