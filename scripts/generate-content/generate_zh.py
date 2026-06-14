"""从 CC-CEDICT + Tatoeba 批量生成汉语单词+例句数据。

输出格式（JSON）：
[
  {
    "word": "你好",
    "phonetic": "nǐ hǎo",
    "translation": "hello; hi",
    "example": "你好，你好吗？",
    "exampleTranslation": "Hello, how are you?",
    "language": "zh",
    "level": "HSK1"
  }
]

运行：
  cd scripts/generate-content
  pip install -r requirements.txt
  python generate_zh.py

说明：
- 默认生成 1000 个汉语单词+例句。
- 需要联网下载 CC-CEDICT 和 Tatoeba 数据。
- 级别按字数粗略估算（HSK1-6），后续建议用真实 HSK 词表校准。
"""
import os
import re
from pathlib import Path

from utils import (
    DATA_DIR,
    build_substring_example_map,
    dedup_by_field,
    download_file,
    find_example_by_substring,
    gunzip_file,
    load_tatoeba_language_data,
    save_json,
)

CC_CEDICT_URL = "https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.txt.gz"

# HSK 2012 词表（按级别，仅简体字）
HSK_LEVEL_URLS = [
    "https://raw.githubusercontent.com/glxxyz/hskhsk.com/main/data/lists/HSK%20Official%202012%20L1.txt",
    "https://raw.githubusercontent.com/glxxyz/hskhsk.com/main/data/lists/HSK%20Official%202012%20L2.txt",
    "https://raw.githubusercontent.com/glxxyz/hskhsk.com/main/data/lists/HSK%20Official%202012%20L3.txt",
    "https://raw.githubusercontent.com/glxxyz/hskhsk.com/main/data/lists/HSK%20Official%202012%20L4.txt",
    "https://raw.githubusercontent.com/glxxyz/hskhsk.com/main/data/lists/HSK%20Official%202012%20L5.txt",
    "https://raw.githubusercontent.com/glxxyz/hskhsk.com/main/data/lists/HSK%20Official%202012%20L6.txt",
]


def estimate_hsk_level(word: str) -> str:
    """按字数粗略估算 HSK 级别。"""
    length = len(word)
    if length == 1:
        return "HSK1"
    if length == 2:
        return "HSK2"
    if length == 3:
        return "HSK3"
    if length == 4:
        return "HSK4"
    if length <= 6:
        return "HSK5"
    return "HSK6"


def parse_pinyin_tone(pinyin: str) -> str:
    """把数字声调转换为带声调符号的拼音（简化版）。"""
    tone_map = {
        "a": ["ā", "á", "ǎ", "à"],
        "e": ["ē", "é", "ě", "è"],
        "i": ["ī", "í", "ǐ", "ì"],
        "o": ["ō", "ó", "ǒ", "ò"],
        "u": ["ū", "ú", "ǔ", "ù"],
        "ü": ["ǖ", "ǘ", "ǚ", "ǜ"],
    }
    # 简单处理：最后一个元音替换为带声调符号
    parts = pinyin.split()
    out = []
    for part in parts:
        m = re.match(r"^([a-zü]+)([1-5])$", part)
        if not m:
            out.append(part)
            continue
        syllable, tone = m.group(1), int(m.group(2))
        if tone == 5:
            out.append(syllable)
            continue
        # 在 a, e, o, u, i, ü 中按优先级替换
        for vowel in ["a", "e", "o", "u", "i", "ü"]:
            if vowel in syllable:
                syllable = syllable.replace(vowel, tone_map[vowel][tone - 1], 1)
                break
        out.append(syllable)
    return " ".join(out)


def parse_cc_cedict() -> dict[str, dict]:
    """解析 CC-CEDICT，返回 {simplified: {word, traditional, phonetic, translation, level}} 查询表。"""
    gz_path = download_file(CC_CEDICT_URL, DATA_DIR / "cc_cedict.txt.gz")
    txt_path = gunzip_file(gz_path, DATA_DIR / "cc_cedict.txt")
    print(f"[parse] 解析 {txt_path.name} ...")

    results: dict[str, dict] = {}

    with open(txt_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            # 格式：trad simp [pinyin] /def1/def2/
            m = re.match(r"^(\S+)\s+(\S+)\s+\[(.+?)\]\s+(/(.+)?/)$", line)
            if not m:
                continue
            traditional, simplified, pinyin, defs_raw, _ = m.groups()
            defs = [d.strip() for d in defs_raw.strip("/").split("/") if d.strip()]
            if not defs:
                continue

            # 过滤：必须包含至少一个汉字
            if not re.search(r"[\u4e00-\u9fff]", simplified):
                continue
            # 过滤掉过于罕见或纯人名地名的条目
            first_def = defs[0].lower()
            if any(tag in first_def for tag in ["variant of", "see also", "archaic", "surname", "place name"]):
                continue
            if len(simplified) > 8:
                continue

            if simplified in results:
                continue

            results[simplified] = {
                "word": simplified,
                "traditional": traditional,
                "phonetic": parse_pinyin_tone(pinyin),
                "translation": "; ".join(defs[:3]),
                "level": estimate_hsk_level(simplified),
            }

    print(f"[parse] 解析到 {len(results)} 个有效汉语条目")
    return results


def load_hsk_words(max_words: int = 1000) -> list[tuple[str, str]]:
    """加载 HSK 词表，返回 (word, level) 列表，按 L1-L6 顺序。"""
    import gzip

    words: list[tuple[str, str]] = []
    seen: set[str] = set()
    for idx, url in enumerate(HSK_LEVEL_URLS):
        level = f"HSK{idx + 1}"
        path = download_file(url, DATA_DIR / f"hsk_l{idx + 1}.txt")
        # GitHub raw 可能返回 gzip，需要兼容
        try:
            f = gzip.open(path, "rt", encoding="utf-8", errors="ignore")
            f.read(1)
            f.seek(0)
        except (gzip.BadGzipFile, OSError):
            f = open(path, "r", encoding="utf-8", errors="ignore")
        with f:
            for line in f:
                w = line.strip()
                if not w or w in seen:
                    continue
                seen.add(w)
                words.append((w, level))
                if len(words) >= max_words:
                    return words
    return words


def main():
    max_words = int(os.environ.get("MAX_WORDS", "1000"))
    max_sentences = int(os.environ.get("MAX_SENTENCES", "10000000"))
    target_translation_lang = os.environ.get("TARGET_LANG", "eng")  # 汉语例句默认配英文翻译

    # 1. 加载 HSK 词表，并用 CC-CEDICT 补全拼音和释义
    print("[step 1/4] 加载 HSK 词表 + CC-CEDICT ...")
    cedict = parse_cc_cedict()
    hsk_words = load_hsk_words(max_words)
    word_list: list[dict] = []
    for w, level in hsk_words:
        entry = cedict.get(w)
        if not entry:
            continue
        word_list.append({
            "word": entry["word"],
            "phonetic": entry["phonetic"],
            "translation": entry["translation"],
            "level": level,
        })
    print(f"[step 1/4] 获取 {len(word_list)} 个有效汉语条目 (source: HSK + CC-CEDICT)")

    # 2. 加载 Tatoeba（使用按语言分割的小文件）
    print("[step 2/4] 加载 Tatoeba 数据 ...")
    cmn_sentences, tgt_sentences, links = load_tatoeba_language_data(
        "cmn", target_translation_lang, max_src_sentences=max_sentences
    )

    # 3. 为每个单词匹配例句（先为所有目标单词一次性构建子串索引）
    print("[step 3/4] 匹配例句 ...")
    target_words = [item["word"] for item in word_list]
    example_map = build_substring_example_map(target_words, cmn_sentences, links, tgt_sentences)

    output: list[dict] = []
    for item in word_list:
        example_pair = example_map.get(item["word"])
        if not example_pair:
            example_pair = find_example_by_substring(item["word"], cmn_sentences, links, tgt_sentences)
        if example_pair:
            example, example_translation = example_pair
            output.append({
                "word": item["word"],
                "phonetic": item["phonetic"],
                "translation": item["translation"],
                "example": example,
                "exampleTranslation": example_translation,
                "language": "zh",
                "level": item["level"],
            })

    # 4. 保存
    print("[step 4/4] 保存结果 ...")
    output = dedup_by_field(output, "word")
    save_json(output, "generated_zh.json")
    print(f"[done] 共生成了 {len(output)} 条汉语单词数据")


if __name__ == "__main__":
    main()
