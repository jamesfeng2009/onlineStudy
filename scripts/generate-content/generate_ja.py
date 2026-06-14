"""从 JMdict + Tatoeba 批量生成日语单词+例句数据。

输出格式（JSON）：
[
  {
    "word": "猫",
    "reading": "ねこ",
    "translation": "cat",
    "example": "猫が好きです。",
    "exampleTranslation": "我喜欢猫。",
    "language": "ja",
    "level": "N5"
  }
]

运行：
  cd scripts/generate-content
  pip install -r requirements.txt
  python generate_ja.py

说明：
- 默认生成 1000 个日语单词+例句。
- 需要联网下载 JMdict_e.gz 和 Tatoeba 数据。
"""
import gzip
import os
import re
import xml.etree.ElementTree as ET
from pathlib import Path

from utils import (
    DATA_DIR,
    build_substring_example_map,
    dedup_by_field,
    download_file,
    find_example_by_substring,
    load_tatoeba_language_data,
    save_json,
)

JMDICT_URL = "http://www.edrdg.org/pub/Nihongo/JMdict_e.gz"


def estimate_jlpt_level(priorities: list[str]) -> str:
    """根据 JMdict 优先级标签估算 JLPT 级别。"""
    pri = " ".join(priorities).lower()
    # 常见优先级：ichi1, news1, nf01 等表示高频
    if any(p in pri for p in ("ichi1", "news1", "nf01", "nf02", "nf03", "nf04", "nf05")):
        return "N5"
    if any(p in pri for p in ("ichi2", "news2", "nf06", "nf07", "nf08", "nf09", "nf10")):
        return "N4"
    if any(p in pri for p in ("nf11", "nf12", "nf13", "nf14", "nf15", "nf16", "nf17", "nf18", "nf19", "nf20")):
        return "N3"
    if any(p in pri for p in ("nf21", "nf22", "nf23", "nf24", "nf25", "nf26", "nf27", "nf28", "nf29", "nf30")):
        return "N2"
    return "N1"


# 至少包含一个日文有效字符（平假名/片假名/汉字）
_JA_CHAR_RE = re.compile(r"[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]")
# 排除全角英数字、符号
_JA_ONLY_RE = re.compile(r"^[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]+$")


def _priority_score(priorities: list[str]) -> int:
    """根据 JMdict 优先级标签计算词频分数，分数越高越常见。"""
    score = 0
    for p in priorities:
        p = p.lower()
        if p in ("ichi1", "news1"):
            score += 100
        elif p in ("ichi2", "news2"):
            score += 50
        elif p.startswith("nf"):
            try:
                n = int(p[2:])
                score += max(0, 49 - n)  # nf01 分数最高
            except ValueError:
                pass
    return score


def parse_jmdict(max_words: int = 1000) -> list[dict]:
    """解析 JMdict_e，返回按常见度排序的单词条目列表。"""
    gz_path = download_file(JMDICT_URL, DATA_DIR / "JMdict_e.gz")
    print(f"[parse] 解析 {gz_path.name} ...")

    entries: list[tuple[int, dict]] = []
    with gzip.open(gz_path, "rb") as f:
        tree = ET.parse(f)
    root = tree.getroot()

    for entry in root.findall("entry"):
        words = [keb.text for keb in entry.findall("k_ele/keb") if keb.text]
        readings = [reb.text for reb in entry.findall("r_ele/reb") if reb.text]
        glosses = []
        priorities = []
        for sense in entry.findall("sense"):
            for gloss in sense.findall("gloss"):
                if gloss.text:
                    glosses.append(gloss.text)
        for ke_pri in entry.findall("k_ele/ke_pri"):
            if ke_pri.text:
                priorities.append(ke_pri.text)
        for re_pri in entry.findall("r_ele/re_pri"):
            if re_pri.text:
                priorities.append(re_pri.text)

        if not readings or not glosses:
            continue

        # 过滤掉纯符号/标点
        surface = words[0] if words else readings[0]
        if not _JA_CHAR_RE.search(surface):
            continue
        # 跳过含全角英数字的条目（如 ＣＤプレーヤー、Ｔシャツ）
        if not _JA_ONLY_RE.match(surface):
            continue
        # 跳过纯片假名且过长的条目（多为外来语）
        if re.fullmatch(r"[\u30A0-\u30FF]+", surface) and len(surface) > 4:
            continue

        pri_score = _priority_score(priorities)
        # 没有优先级标签的条目降低优先级，靠后选取
        if pri_score == 0:
            pri_score = -1000

        entries.append((pri_score, {
            "words": words,
            "readings": readings,
            "glosses": glosses,
            "priorities": priorities,
        }))

    # 按常见度降序排列，取前 max_words
    entries.sort(key=lambda x: x[0], reverse=True)
    selected = entries[:max_words]

    results: list[dict] = []
    seen: set[str] = set()
    for _, e in selected:
        word = e["words"][0] if e["words"] else e["readings"][0]
        reading = e["readings"][0] if e["readings"] else ""
        translation = "; ".join(e["glosses"][:3])
        key = (word + "#" + reading).lower()
        if key in seen:
            continue
        seen.add(key)
        results.append({
            "word": word,
            "reading": reading,
            "translation": translation,
            "level": estimate_jlpt_level(e["priorities"]),
        })

    print(f"[parse] 解析到 {len(results)} 个有效日语条目")
    return results


def main():
    max_words = int(os.environ.get("MAX_WORDS", "1000"))
    max_sentences = int(os.environ.get("MAX_SENTENCES", "10000000"))
    target_translation_lang = os.environ.get("TARGET_LANG", "cmn")

    # 1. 解析 JMdict
    print("[step 1/4] 解析 JMdict ...")
    word_list = parse_jmdict(max_words)

    # 2. 加载 Tatoeba（使用按语言分割的小文件）
    print("[step 2/4] 加载 Tatoeba 数据 ...")
    jpn_sentences, tgt_sentences, links = load_tatoeba_language_data(
        "jpn", target_translation_lang, max_src_sentences=max_sentences
    )

    # 3. 为每个单词匹配例句（先为所有目标单词一次性构建子串索引）
    print("[step 3/4] 匹配例句 ...")
    surface_words = [item["word"] for item in word_list]
    example_map = build_substring_example_map(surface_words, jpn_sentences, links, tgt_sentences)

    output: list[dict] = []
    for item in word_list:
        word = item["word"]
        example_pair = example_map.get(word)
        if not example_pair:
            # 尝试用读音匹配
            example_pair = find_example_by_substring(item["reading"], jpn_sentences, links, tgt_sentences)
        if example_pair:
            example, example_translation = example_pair
            output.append({
                "word": item["word"],
                "reading": item["reading"],
                "translation": item["translation"],
                "phonetic": "",
                "example": example,
                "exampleTranslation": example_translation,
                "language": "ja",
                "level": item["level"],
            })

    # 4. 保存
    print("[step 4/4] 保存结果 ...")
    output = dedup_by_field(output, "word")
    save_json(output, "generated_ja.json")
    print(f"[done] 共生成了 {len(output)} 条日语单词数据")


if __name__ == "__main__":
    main()
