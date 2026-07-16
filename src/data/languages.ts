import type { LanguageMeta } from "../types";
import { LEVEL_META } from "./level-meta";
import { LANGUAGE_REGISTRY } from "./language-registry";

/**
 * 支持的语言列表。
 *
 * 从 language-registry 派生（单一数据源）。registry 包含所有语言的
 * code/slug/levels/flag 等元数据，这里映射成 LanguageMeta 结构。
 *
 * P0-2: ko 等级从 ["初级","中级","高级","심화"] 迁移到 ["TOPIK1"..."TOPIK6"]
 * th / yue 也对齐 CEFR A1-C1。
 */
export const LANGUAGES: LanguageMeta[] = LANGUAGE_REGISTRY.map((e) => ({
  id: e.code,
  name: e.name,
  native: e.nativeName,
  flag: e.flag,
  tagline: e.tagline,
  levels: e.levels,
  levelMeta: LEVEL_META[e.code],
}));

export const getLanguage = (id: string) =>
  LANGUAGES.find((l) => l.id === id) ?? LANGUAGES[0];
