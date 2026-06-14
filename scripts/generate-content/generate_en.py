"""从 WordNet + Tatoeba 批量生成英语单词+例句数据。

输出格式（JSON）：
[
  {
    "word": "hello",
    "translation": "你好",
    "phonetic": "",
    "example": "Hello, how are you?",
    "exampleTranslation": "你好，你好吗？",
    "language": "en",
    "level": "A1"
  }
]

运行：
  cd scripts/generate-content
  pip install -r requirements.txt
  python generate_en.py

说明：
- 默认生成 1000 个英语单词+例句。
- 需要联网下载 Tatoeba sentences.csv / links.csv（约 1GB）。
- 可选设置环境变量 TATOEBA_DIR 复用已下载的数据。
"""
import json
import os
import random
import re
from pathlib import Path
from typing import Optional

from utils import (
    DATA_DIR,
    build_example_map,
    dedup_by_field,
    download_file,
    find_example,
    load_tatoeba_language_data,
    save_json,
)

# Oxford 3000 常见词表（公开）作为 WordNet 不可用时的 fallback
FALLBACK_WORDLIST_URL = "https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english.txt"

# CEFR 级别分桶（按词频/长度简单估算）
def estimate_level(word: str, rank: int, total: int) -> str:
    """按单词排名估算 CEFR 级别。"""
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


def get_wordnet_definition(word: str) -> str:
    """查询 WordNet 释义，返回第一条释义或空字符串。"""
    try:
        from nltk.corpus import wordnet as wn
    except Exception:
        return ""
    synsets = wn.synsets(word)
    if not synsets:
        return ""
    definition = synsets[0].definition()
    return definition[:120] + ("..." if len(definition) > 120 else "")


def get_wordnet_words(max_words: int = 1000) -> list[tuple[str, str]]:
    """从 WordNet (NLTK) 获取单词和释义（按 WordNet 顺序，非词频顺序）。"""
    try:
        import nltk
        from nltk.corpus import wordnet as wn

        # 尝试下载 wordnet 数据
        nltk.data.find("corpora/wordnet")
    except (LookupError, ImportError):
        print("[info] 尝试下载 WordNet 数据 ...")
        try:
            import nltk
            nltk.download("wordnet", quiet=True)
        except Exception as e:
            print(f"[warn] NLTK WordNet 不可用: {e}")
            return []

    try:
        from nltk.corpus import wordnet as wn
    except Exception as e:
        print(f"[warn] 无法加载 WordNet: {e}")
        return []

    results: list[tuple[str, str]] = []
    seen: set[str] = set()

    for synset in wn.all_synsets():
        if len(results) >= max_words:
            break
        # 只取名词、动词、形容词
        if synset.pos() not in ("n", "v", "a"):
            continue
        for lemma in synset.lemmas():
            word = lemma.name().replace("_", " ")
            if not word.isalpha() or len(word) < 2 or len(word) > 20:
                continue
            key = word.lower()
            if key in seen:
                continue
            seen.add(key)
            definition = synset.definition()
            # 取第一条释义，最多 120 字符
            definition = definition[:120] + ("..." if len(definition) > 120 else "")
            results.append((word, definition))
            if len(results) >= max_words:
                break

    return results


def get_frequency_words(max_words: int = 1000) -> list[tuple[str, str]]:
    """使用公开常见词表（Google 10000 英语词频表），并尝试从 WordNet 获取释义。"""
    import gzip

    path = download_file(FALLBACK_WORDLIST_URL, DATA_DIR / "google-10000-english.txt.gz")
    words: list[str] = []
    with gzip.open(path, "rt", encoding="utf-8", errors="ignore") as f:
        for line in f:
            w = line.strip()
            if w and w.isalpha() and len(w) >= 2 and len(w) <= 20:
                words.append(w)

    results: list[tuple[str, str]] = []
    seen: set[str] = set()
    for w in words:
        if len(results) >= max_words:
            break
        key = w.lower()
        if key in seen:
            continue
        seen.add(key)
        definition = get_wordnet_definition(w)
        results.append((w, definition))
    return results


def main():
    max_words = int(os.environ.get("MAX_WORDS", "1000"))
    max_sentences = int(os.environ.get("MAX_SENTENCES", "10000000"))
    target_translation_lang = os.environ.get("TARGET_LANG", "cmn")  # 默认配中文例句

    # 1. 获取单词列表（优先使用高频词表，质量更高）
    print("[step 1/4] 获取英语单词 ...")
    word_list = get_frequency_words(max_words)
    source = "frequency wordlist + WordNet"
    if not word_list:
        print("[fallback] 高频词表不可用，使用 WordNet ...")
        word_list = get_wordnet_words(max_words)
        source = "WordNet"
    print(f"[step 1/4] 获取 {len(word_list)} 个单词 (source: {source})")

    # 2. 下载/加载 Tatoeba 数据（使用按语言分割的小文件）
    print("[step 2/4] 加载 Tatoeba 数据 ...")
    eng_sentences, tgt_sentences, links = load_tatoeba_language_data(
        "eng", target_translation_lang, max_src_sentences=max_sentences
    )
    target_words = {w.lower().strip("-'") for w, _ in word_list}
    example_map = build_example_map(eng_sentences, links, tgt_sentences, target_words=target_words)

    # 3. 为每个单词匹配例句
    print("[step 3/4] 匹配例句 ...")
    output: list[dict] = []
    for rank, (word, definition) in enumerate(word_list):
        example_pair = find_example(word, example_map)
        if not example_pair:
            continue
        example, example_translation = example_pair
        # 用 WordNet 释义作为翻译；如果为空则保留空
        output.append({
            "word": word,
            "translation": definition or "",
            "phonetic": "",
            "example": example,
            "exampleTranslation": example_translation,
            "language": "en",
            "level": estimate_level(word, rank, len(word_list)),
        })

    # 4. 去重并保存
    print("[step 4/4] 保存结果 ...")
    output = dedup_by_field(output, "word")
    save_json(output, "generated_en.json")
    print(f"[done] 共生成了 {len(output)} 条英语单词数据")


if __name__ == "__main__":
    main()
