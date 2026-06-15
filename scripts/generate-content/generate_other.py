"""为 ko/es/fr/de 4 个目标语言生成 Tatoeba 句子对数据。

与 generate_en.py / generate_zh.py / generate_ja.py 不同：4 个新语言
没有现成的高质量单词词典（无 WordNet 等价物），所以我们改用
"Tatoeba 句子对"作为学习内容颗粒度——这其实更接近真实学习场景
（学语言需要的是"在 X 语言里 Y 情境怎么说"）。

数据模型跟 LearnWord 接口保持一致：
- word: tgt 语言代表性短语（取 tgt 句子的前 30 字符）
- translation: en 句子（作为对照/翻译）
- example: tgt 句子（用作例句）
- exampleTranslation: en 句子翻译
- language: ko / es / fr / de
- level: A1 / A2 / B1 / B2（按 en 词频估算）

UI 在 LearnWordPage 会自动检测 word 长度并切换"单词卡" vs "句卡"
显示样式。

运行：
  cd scripts/generate-content
  python generate_other.py              # 4 语言全跑
  python generate_other.py --lang ko     # 单跑韩语
"""
import argparse
import json
import os
import re
import gzip
from pathlib import Path

from utils import (
    DATA_DIR,
    build_example_map,
    dedup_by_field,
    download_file,
    find_example,
    load_tatoeba_language_data,
    save_json,
)

# Tatoeba ISO 639-3 codes (note: en/cmn/jpn, not en/zh/ja)
TATOEBA_CODE = {
    "ko": "kor",
    "es": "spa",
    "fr": "fra",
    "de": "deu",
}

UI_LANG = {
    "ko": "ko",
    "es": "es",
    "fr": "fr",
    "de": "de",
}

LEVEL_FILE = {
    "es": ("https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/es/es_50k.txt", "es"),
    "fr": ("https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/fr/fr_50k.txt", "fr"),
    "de": ("https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/de/de_50k.txt", "de"),
}

FALLBACK_WORDLIST_URL = "https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english.txt"


def estimate_level(rank: int, total: int) -> str:
    """按 en 词在 google-10000 中的排名估算 CEFR 级别。"""
    if rank < total * 0.15:
        return "A1"
    if rank < total * 0.30:
        return "A2"
    if rank < total * 0.55:
        return "B1"
    if rank < total * 0.75:
        return "B2"
    if rank < total * 0.90:
        return "C1"
    return "C2"


def get_english_seed_words(max_words: int = 2000) -> list[str]:
    """读 google-10000-english 取前 max_words 个英文种子词。"""
    path = download_file(FALLBACK_WORDLIST_URL, DATA_DIR / "google-10000-english.txt.gz")
    words: list[str] = []
    with gzip.open(path, "rt", encoding="utf-8", errors="ignore") as f:
        for line in f:
            w = line.strip()
            if w and w.isalpha() and 2 <= len(w) <= 18:
                words.append(w)
            if len(words) >= max_words:
                break
    return words


def truncate_word(text: str, max_chars: int = 30) -> str:
    """截断 tgt 短语作为 word 字段（避免 word 字段过 50 字符影响 UI）。"""
    text = text.strip()
    if len(text) <= max_chars:
        return text
    return text[:max_chars - 1] + "…"


def generate_for_language(target: str, max_words: int = 200) -> list[dict]:
    """为单个目标语言生成 Tatoeba 句对数据。"""
    tgt_tatoeba = TATOEBA_CODE[target]
    ui_lang = UI_LANG[target]
    print(f"\n=== 生成 {target} ({tgt_tatoeba}) 数据 ===")

    # 1. 英文种子词表
    seed_words = get_english_seed_words(max_words=max_words * 4)
    target_words = {w.lower().strip("-'") for w in seed_words}
    print(f"[step 1] {len(seed_words)} 个英文种子词")

    # 2. 加载 Tatoeba eng-<target> 数据
    print(f"[step 2] 加载 Tatoeba eng-{tgt_tatoeba} ...")
    eng_sents, tgt_sents, links = load_tatoeba_language_data("eng", tgt_tatoeba)
    print(f"[step 2] eng 句子 {len(eng_sents)}, {tgt_tatoeba} 句子 {len(tgt_sents)}, 链接 {len(links)}")

    # 3. 构建 en 词 → 例句索引
    print("[step 3] 构建例句索引 ...")
    example_map = build_example_map(eng_sents, links, tgt_sents, target_words=target_words)

    # 4. 收集有效句对
    print("[step 4] 收集句对 ...")
    output: list[dict] = []
    seen_tgt_sentences: set[str] = set()
    for rank, word in enumerate(seed_words):
        if len(output) >= max_words:
            break
        pair = find_example(word, example_map)
        if not pair:
            continue
        en_sent, tgt_sent = pair
        # 跳过空 tgt 句子或重复 tgt 句子
        if not tgt_sent or not tgt_sent.strip():
            continue
        # 跳过非目标语言字符（防止错配）
        if target == "ko" and not re.search(r"[\uAC00-\uD7AF]", tgt_sent):
            continue
        if target == "es" and not re.search(r"[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]", tgt_sent):
            continue
        if target == "fr" and not re.search(r"[a-zA-ZàâçéèêëîïôûùüÿœæÀÂÇÉÈÊËÎÏÔÛÙÜŸŒÆ]", tgt_sent):
            continue
        if target == "de" and not re.search(r"[a-zA-ZäöüßÄÖÜ]", tgt_sent):
            continue
        # 截断 tgt 句子作为 word 字段
        key = tgt_sent[:80]
        if key in seen_tgt_sentences:
            continue
        seen_tgt_sentences.add(key)
        output.append({
            "word": truncate_word(tgt_sent),
            "translation": en_sent,
            "phonetic": "",
            "example": tgt_sent,
            "exampleTranslation": en_sent,
            "language": ui_lang,
            "level": estimate_level(rank, len(seed_words)),
        })

    print(f"[step 4] 收集到 {len(output)} 条 {target} 句对")
    return output


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--lang", choices=["ko", "es", "fr", "de", "all"], default="all",
                        help="要生成的目标语言（默认 all）")
    parser.add_argument("--max-words", type=int, default=200,
                        help="每个语言最多生成多少条（默认 200）")
    args = parser.parse_args()

    langs = ["ko", "es", "fr", "de"] if args.lang == "all" else [args.lang]

    for target in langs:
        try:
            data = generate_for_language(target, max_words=args.max_words)
        except Exception as e:
            print(f"[error] {target} 生成失败: {e}")
            continue
        if not data:
            print(f"[warn] {target} 0 条数据，跳过保存")
            continue
        data = dedup_by_field(data, "word")
        save_json(data, f"generated_{UI_LANG[target]}.json")
        # 打印样本
        print(f"[sample {target}] {json.dumps(data[0], ensure_ascii=False)[:200]}")


if __name__ == "__main__":
    main()
