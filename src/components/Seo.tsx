import { useEffect } from "react";

interface SeoProps {
  title: string;
  description?: string;
  image?: string;
  type?: "website" | "article";
  lang?: string;
  alternates?: { lang: string; url: string }[];
}

export function Seo({ title, description, image, type = "website", lang, alternates }: SeoProps) {
  useEffect(() => {
    document.title = title;
    const setMeta = (name: string, content: string, attr: "name" | "property" = "name") => {
      let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    if (description) setMeta("description", description);
    setMeta("og:title", title, "property");
    setMeta("og:type", type, "property");
    if (description) setMeta("og:description", description, "property");
    if (image) setMeta("og:image", image, "property");
    setMeta("twitter:card", "summary_large_image", "name");
    if (description) setMeta("twitter:description", description, "name");
    setMeta("twitter:title", title, "name");
    if (image) setMeta("twitter:image", image, "name");
    if (lang) setMeta("og:locale", lang, "property");

    // hreflang
    document.head.querySelectorAll('link[rel="alternate"]').forEach((el) => {
      if (el.getAttribute("data-seo") === "1") el.remove();
    });
    if (alternates) {
      alternates.forEach((a) => {
        const link = document.createElement("link");
        link.rel = "alternate";
        link.setAttribute("hreflang", a.lang);
        link.href = a.url;
        link.setAttribute("data-seo", "1");
        document.head.appendChild(link);
      });
    }
  }, [title, description, image, type, lang, alternates]);
  return null;
}
