// Listing-page card extractors for sites with no usable RSS.
// Each function is pure HTML → cards so the shapes can be tested without fetching.

export interface ListingCard {
  href: string;
  title: string;
  dateRaw: string | null;
  summary: string | null;
}

const MONTHS: Record<string, number> = {
  january: 0, jan: 0, february: 1, feb: 1, march: 2, mar: 2,
  april: 3, apr: 3, may: 4, june: 5, jun: 5, july: 6, jul: 6,
  august: 7, aug: 7, september: 8, sep: 8, sept: 8, october: 9, oct: 9,
  november: 10, nov: 10, december: 11, dec: 11,
};

const MONTH_RE = "January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec";

export function decodeEntities(s: string): string {
  return s
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseLooseDate(raw: string | null): string | null {
  if (!raw) return null;
  const s = raw.trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d.toISOString();
  }
  const m = s.match(new RegExp(`(${MONTH_RE})\\.?\\s+(\\d{1,2}),?\\s+(\\d{4})`, "i"));
  if (!m) return null;
  const mo = MONTHS[m[1].toLowerCase()];
  if (mo === undefined) return null;
  const d = new Date(Date.UTC(parseInt(m[3], 10), mo, parseInt(m[2], 10)));
  return isNaN(d.getTime()) ? null : d.toISOString();
}

function monthIn(text: string): string | null {
  return text.match(new RegExp(`\\b(?:${MONTH_RE})\\.?\\s+\\d{1,2},?\\s+\\d{4}\\b`, "i"))?.[0] ?? null;
}

/** Drupal notices table. One row: date cell, notice link, description div. */
export function extractFinraNotices(html: string): ListingCard[] {
  const re = /<tr\b[^>]*>[\s\S]*?href="(\/rules-guidance\/notices\/[a-z0-9-]+)"[\s\S]*?<\/tr>/gi;
  const seen = new Set<string>();
  const out: ListingCard[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const href = m[1];
    if (seen.has(href)) continue;
    seen.add(href);
    const row = m[0];
    const title = decodeEntities(
      (row.match(/field-notice-title-tx[\s\S]*?<div>([\s\S]*?)<\/div>/i) || [])[1]
      || (row.match(/<a[^>]*>([\s\S]*?)<\/a>/i) || [])[1]
      || "",
    );
    if (title.length < 8) continue;
    const dateCell = (row.match(/core-official-dt[\s\S]*?<\/td>/i) || [])[0] ?? "";
    const dateRaw = monthIn(decodeEntities(dateCell)) || monthIn(decodeEntities(row));
    out.push({ href, title, dateRaw, summary: title });
  }
  return out;
}

/** Sanity/React blog cards: href, h3 title, time datetime. href may follow other attributes. */
export function extractJumpPosts(html: string): ListingCard[] {
  const re = /<a\b[^>]*href="(\/blog\/[a-z0-9][^"]*)"[^>]*>([\s\S]{0,20000}?)<\/a>/gi;
  const seen = new Set<string>();
  const out: ListingCard[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const href = m[1];
    if (seen.has(href) || href === "/blog/") continue;
    seen.add(href);
    const body = m[2];
    const title = decodeEntities((body.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i) || [])[1] || "");
    if (title.length < 8) continue;
    const dateRaw = (body.match(/datetime="([^"]+)"/i) || [])[1] ?? null;
    out.push({ href, title, dateRaw, summary: null });
  }
  return out;
}

/** Webflow blog cards. Title is the image alt; date is a month string in the card. */
export function extractZocksPosts(html: string): ListingCard[] {
  const re = /<a href="(\/blog\/[^"]+)" class="nav-blog_card[\s\S]*?<\/a>/gi;
  const seen = new Set<string>();
  const out: ListingCard[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const href = m[1];
    if (seen.has(href)) continue;
    seen.add(href);
    const body = m[0];
    const title = decodeEntities((body.match(/alt="([^"]+)"/i) || [])[1] || "");
    if (title.length < 8) continue;
    const dateRaw = monthIn(decodeEntities(body));
    out.push({ href, title, dateRaw, summary: null });
  }
  return out;
}
