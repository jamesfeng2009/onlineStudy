import { Link, NavLink, useLocation, type LinkProps, type NavLinkProps } from "react-router-dom";
import { buildLocalePath, extractLocaleFromPath, type SupportedLanguage } from "../lib/i18n";

/**
 * Returns the active locale derived from the current URL pathname.
 *   "/"           → "en"
 *   "/zh/faq"     → "zh"
 *   "/ja/blog/.."  → "ja"
 */
export function useLocale(): SupportedLanguage {
  const { pathname } = useLocation();
  return extractLocaleFromPath(pathname).locale;
}

/**
 * Prefix a locale-stripped path with the current locale.
 *   useLocalePath("/faq")  → "/faq"     (on en)
 *   useLocalePath("/faq")  → "/zh/faq"  (on zh)
 *   useLocalePath("/")     → "/zh"      (on zh)
 */
export function useLocalePath(path: string): string {
  const locale = useLocale();
  return buildLocalePath(locale, path);
}

/**
 * Drop-in replacement for <Link> that auto-prefixes the current locale.
 * `to` is a locale-stripped path (e.g. "/faq", "/blog/my-post").
 */
export function LocaleLink({ to, ...rest }: Omit<LinkProps, "to"> & { to: string }) {
  const href = useLocalePath(to);
  return <Link to={href} {...rest} />;
}

/**
 * Drop-in replacement for <NavLink> that auto-prefixes the current locale.
 * `isActive` matching works because the rendered `to` includes the locale
 * prefix, which matches the actual URL.
 */
export function LocaleNavLink({ to, ...rest }: Omit<NavLinkProps, "to"> & { to: string }) {
  const href = useLocalePath(to);
  return <NavLink to={href} {...rest} />;
}

export default LocaleLink;
