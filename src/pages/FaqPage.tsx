import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, Sparkles } from "lucide-react";
import PageShell from "../components/PageShell";
import { Seo } from "../components/Seo";
import { JsonLd, buildFaqLd, buildBreadcrumbLd } from "../components/JsonLd";
import LocaleLink from "../components/LocaleLink";

export default function FaqPage() {
  const { t } = useTranslation();

  const groups = useMemo(
    () =>
      t("faq.groups", { returnObjects: true }) as {
        title: string;
        items: { q: string; a: string }[];
      }[],
    [t]
  );

  // Flatten every group into a single FAQPage question list.
  const flatFaqs = useMemo(
    () => groups.flatMap((g) => g.items),
    [groups]
  );

  return (
    <PageShell title={t("faq.title")} subtitle={t("faq.subtitle")}>
      <Seo
        title={t("faq.seoTitle", { defaultValue: "FAQ — LangOria" })}
        description={t("faq.seoDescription", {
          defaultValue:
            "Common questions about LangOria: how lessons work, spaced repetition, languages offered, free vs VIP, and more.",
        })}
        pathname="/faq"
      />
      <JsonLd
        data={[
          buildBreadcrumbLd([
            { name: "Home", url: "https://lang-oria.com/" },
            { name: "FAQ", url: "https://lang-oria.com/faq" },
          ]),
          buildFaqLd(flatFaqs.map((x) => ({ question: x.q, answer: x.a }))),
        ]}
      />
      <div className="mb-10 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-brand-200/80 md:text-base">
        {t("faq.intro")}
      </div>
      <div className="space-y-8">
        {groups.map((g, gi) => (
          <section key={gi}>
            <h2 className="font-display text-xl font-bold text-white md:text-2xl">{g.title}</h2>
            <div className="mt-4 glass divide-y divide-white/5 overflow-hidden rounded-2xl">
              {g.items.map((item, i) => (
                <details key={i} className="group p-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                    <span className="text-sm font-medium text-white md:text-base">{item.q}</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-brand-200/60 transition group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-brand-200/80">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
      <div className="mt-12">
        <div className="glass relative overflow-hidden rounded-3xl p-8 text-center md:p-12">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-sky-500/10 via-fuchsia-500/10 to-amber-400/10" />
          <div className="relative">
            <Sparkles className="mx-auto h-6 w-6 text-amber-300" />
            <h2 className="mt-3 font-display text-2xl font-bold text-white md:text-3xl">
              {t("faq.ctaTitle")}
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-brand-200/70 md:text-base">
              {t("faq.ctaDesc")}
            </p>
            <LocaleLink
              to="/register"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 via-fuchsia-400 to-amber-300 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-fuchsia-500/30"
            >
              {t("faq.cta")}
            </LocaleLink>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
