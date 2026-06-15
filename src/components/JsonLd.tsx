import { useEffect } from "react";

/**
 * JSON-LD structured-data helpers.
 *
 * Injects a single <script type="application/ld+json"> tag carrying the
 * supplied graph. Re-renders clear and replace the previous tag so
 * route changes don't stack up duplicate structured data.
 *
 * All emitted JSON is a single object with @context set to schema.org.
 * Multiple blocks can be passed and they will be wrapped in an
 * @graph array so multiple @type values can coexist on one page
 * (e.g. WebPage + BreadcrumbList + FAQPage + Course).
 */

type JsonLd = Record<string, unknown>;

interface JsonLdProps {
  data: JsonLd | JsonLd[];
}

const SCRIPT_ID = "json-ld-main";

function serialize(items: JsonLd[]): string {
  // Single block: emit as a bare object.
  if (items.length === 1) {
    return JSON.stringify(items[0]);
  }
  // Multiple blocks: wrap in @graph.
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": items,
  });
}

export function JsonLd({ data }: JsonLdProps) {
  useEffect(() => {
    const items = Array.isArray(data) ? data : [data];
    let el = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement("script");
      el.id = SCRIPT_ID;
      el.type = "application/ld+json";
      document.head.appendChild(el);
    }
    el.textContent = serialize(items);
    return () => {
      // Don't remove on unmount: the next page may inject again and
      // a brief flicker of the previous page's JSON-LD in the
      // head is preferable to accidentally dropping structured
      // data that crawlers may have already read.
    };
  }, [data]);
  return null;
}

// ---------------------------------------------------------------------------
// Builders — keep them in one file so the field names stay consistent.
// ---------------------------------------------------------------------------

export function buildCourseLd(opts: {
  name: string;
  description: string;
  url: string;
  inLanguage: string; // e.g. "en", "ja", "zh-Hans"
  providerName?: string;
  image?: string;
  offers?: { price: number; currency: string; url?: string }[];
  aggregateRating?: { ratingValue: number; reviewCount: number };
}): JsonLd {
  return {
    "@type": "Course",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    inLanguage: opts.inLanguage,
    provider: {
      "@type": "Organization",
      name: opts.providerName ?? "LangOria",
      sameAs: "https://lang-oria.com",
    },
    ...(opts.image ? { image: opts.image } : {}),
    ...(opts.offers && opts.offers.length > 0
      ? {
          offers: opts.offers.map((o) => ({
            "@type": "Offer",
            price: o.price,
            priceCurrency: o.currency,
            ...(o.url ? { url: o.url } : {}),
          })),
        }
      : {}),
    ...(opts.aggregateRating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: opts.aggregateRating.ratingValue,
            reviewCount: opts.aggregateRating.reviewCount,
          },
        }
      : {}),
  };
}

export function buildFaqLd(
  faqs: { question: string; answer: string }[]
): JsonLd {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

export function buildBreadcrumbLd(
  items: { name: string; url: string }[]
): JsonLd {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

/**
 * Build an ItemList JSON-LD block. Used for vocabulary aggregations,
 * blog archives, and any other "list of N related pages" page.
 */
export function buildItemListLd(opts: {
  name: string;
  url: string;
  items: { name: string; url: string; description?: string }[];
}): JsonLd {
  return {
    "@type": "ItemList",
    name: opts.name,
    url: opts.url,
    numberOfItems: opts.items.length,
    itemListElement: opts.items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: it.url,
      ...(it.description ? { description: it.description } : {}),
    })),
  };
}
