"""公共工具函数：下载 Tatoeba 数据、匹配例句、保存 JSON。"""
import bz2
import csv
import gzip
import json
import os
import re
import shutil
import urllib.request
from pathlib import Path
from typing import Optional

DATA_DIR = Path(__file__).parent / "data"
OUTPUT_DIR = Path(__file__).parent / "output"
DATA_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)

TATOEBA_BASE_URL = "https://downloads.tatoeba.org/exports/per_language"


def download_file(url: str, dest: Path, force: bool = False) -> Path:
    """下载文件到本地，支持断点续传和重试。"""
    import requests
    import subprocess

    dest = Path(dest)
    if dest.exists() and not force and dest.stat().st_size > 0:
        print(f"[skip] 文件已存在: {dest.name}")
        return dest

    dest.parent.mkdir(parents=True, exist_ok=True)
    print(f"[download] {url}")
    print(f"           -> {dest}")

    # 方法 1：requests
    for attempt in range(2):
        try:
            with requests.get(url, stream=True, timeout=300) as r:
                r.raise_for_status()
                with open(dest, "wb") as f:
                    shutil.copyfileobj(r.raw, f)
            print(f"[done] {dest.name} ({dest.stat().st_size // 1024} KB)")
            return dest
        except Exception as e:
            print(f"[warn] requests 下载失败，第 {attempt + 1} 次重试: {e}")

    # 方法 2：curl（某些环境 requests SSL 不稳定，curl 更可靠）
    try:
        subprocess.run(
            ["curl", "-sL", "--max-time", "300", "-o", str(dest), url],
            check=True,
            timeout=310,
        )
        if dest.exists() and dest.stat().st_size > 0:
            print(f"[done] {dest.name} ({dest.stat().st_size // 1024} KB)")
            return dest
    except Exception as e:
        print(f"[warn] curl 下载失败: {e}")

    raise RuntimeError(f"下载失败: {url}")


def download_tatoeba_language_sentences(lang: str, force: bool = False) -> Path:
    """下载指定语言的 Tatoeba 句子文件（按语言分割的 .tsv.bz2）。"""
    url = f"{TATOEBA_BASE_URL}/{lang}/{lang}_sentences.tsv.bz2"
    dest = DATA_DIR / f"{lang}_sentences.tsv.bz2"
    return download_file(url, dest, force=force)


def download_tatoeba_language_links(src_lang: str, tgt_lang: str, force: bool = False) -> Path:
    """下载两个语言之间的 Tatoeba 翻译链接文件（.tsv.bz2）。"""
    url = f"{TATOEBA_BASE_URL}/{src_lang}/{src_lang}-{tgt_lang}_links.tsv.bz2"
    dest = DATA_DIR / f"{src_lang}-{tgt_lang}_links.tsv.bz2"
    return download_file(url, dest, force=force)


def gunzip_file(src: Path, dest: Path, force: bool = False) -> Path:
    """解压 gzip 文件。"""
    dest = Path(dest)
    if dest.exists() and not force:
        return dest
    dest.parent.mkdir(parents=True, exist_ok=True)
    with gzip.open(src, "rb") as f_in, open(dest, "wb") as f_out:
        shutil.copyfileobj(f_in, f_out)
    return dest


def _open_text(path: Path):
    """根据后缀自动解压打开 .bz2 / .gz / 普通文本文件。"""
    name = path.name.lower()
    if name.endswith(".bz2"):
        return bz2.open(path, "rt", encoding="utf-8", errors="ignore")
    if name.endswith(".gz"):
        return gzip.open(path, "rt", encoding="utf-8", errors="ignore")
    return open(path, "r", encoding="utf-8", errors="ignore")


def load_tatoeba_sentences(path: Path, lang: str, max_count: Optional[int] = None) -> dict[int, str]:
    """加载 Tatoeba 句子文件（sentences.csv 或 {lang}_sentences.tsv.bz2），返回 {sentence_id: text}。

    格式：id\tlang\ttext
    """
    result: dict[int, str] = {}
    print(f"[load] 读取 {lang} 句子 from {path.name} ...")
    with _open_text(path) as f:
        reader = csv.reader(f, delimiter="\t", quoting=csv.QUOTE_NONE)
        for row in reader:
            if len(row) < 3:
                continue
            if row[1] != lang:
                continue
            try:
                sid = int(row[0])
            except ValueError:
                continue
            result[sid] = row[2]
            if max_count and len(result) >= max_count:
                break
    print(f"[load] {lang} 句子数: {len(result)}")
    return result


def load_tatoeba_links(path: Path, src_sentences: dict[int, str], tgt_sentences: dict[int, str]) -> dict[int, int]:
    """加载 Tatoeba 链接文件（links.csv 或 {src}-{tgt}_links.tsv.bz2），返回 {src_id: tgt_id}。

    只保留 src 在 src_sentences 且 tgt 在 tgt_sentences 的链接。
    """
    result: dict[int, int] = {}
    print(f"[load] 读取翻译链接 from {path.name} ...")
    src_ids = set(src_sentences.keys())
    tgt_ids = set(tgt_sentences.keys())
    with _open_text(path) as f:
        reader = csv.reader(f, delimiter="\t", quoting=csv.QUOTE_NONE)
        for row in reader:
            if len(row) < 2:
                continue
            try:
                sid = int(row[0])
                tid = int(row[1])
            except ValueError:
                continue
            if sid in src_ids and tid in tgt_ids:
                # 只保留每个源句子的第一个翻译
                if sid not in result:
                    result[sid] = tid
    print(f"[load] 有效翻译链接数: {len(result)}")
    return result


def load_tatoeba_language_data(src_lang: str, tgt_lang: str, max_src_sentences: Optional[int] = None):
    """一键下载并加载指定语言对的 Tatoeba 数据（使用按语言分割的小文件）。

    返回 (src_sentences: dict[int, str], tgt_sentences: dict[int, str], links: dict[int, int])
    """
    src_path = download_tatoeba_language_sentences(src_lang)
    tgt_path = download_tatoeba_language_sentences(tgt_lang)
    links_path = download_tatoeba_language_links(src_lang, tgt_lang)

    src_sentences = load_tatoeba_sentences(src_path, src_lang, max_count=max_src_sentences)
    tgt_sentences = load_tatoeba_sentences(tgt_path, tgt_lang)
    links = load_tatoeba_links(links_path, src_sentences, tgt_sentences)
    return src_sentences, tgt_sentences, links


def build_example_map(src_sentences: dict[int, str], links: dict[int, int], tgt_sentences: dict[int, str], target_words: Optional[set[str]] = None) -> dict[str, list[tuple[str, str]]]:
    """构建单词->例句列表的索引（简单按空格/标点分词匹配）。

    如果传入 target_words，则只索引目标单词，显著降低内存占用。
    """
    example_map: dict[str, list[tuple[str, str]]] = {}
    print("[build] 构建例句索引 ...")
    token_re = re.compile(r"[a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF-']+")
    for sid, text in src_sentences.items():
        tid = links.get(sid)
        if not tid:
            continue
        translation = tgt_sentences.get(tid, "")
        # 简单分词：保留字母、数字、连字符、撇号
        tokens = set(token_re.findall(text.lower()))
        if target_words:
            tokens = tokens & target_words
        for token in tokens:
            example_map.setdefault(token, []).append((text, translation))
    print(f"[build] 索引单词数: {len(example_map)}")
    return example_map


def find_example(word: str, example_map: dict[str, list[tuple[str, str]]]) -> Optional[tuple[str, str]]:
    """为单词找一个例句。优先完全匹配，其次小写匹配。"""
    word_clean = word.lower().strip("-'")
    candidates = example_map.get(word_clean)
    if candidates:
        return candidates[0]
    return None


def build_substring_example_map(words: list[str], sentences: dict[int, str], links: dict[int, int], translations: dict[int, str]) -> dict[str, tuple[str, str]]:
    """为无空格分词语言（日语、汉语等）构建子串匹配例句索引。

    返回 {word: (example, translation)}，每个单词只保留第一个匹配。
    """
    example_map: dict[str, tuple[str, str]] = {}
    remaining = set(words)
    print(f"[build] 为 {len(words)} 个单词构建子串例句索引 ...")
    for sid, text in sentences.items():
        if not remaining:
            break
        tid = links.get(sid)
        if not tid:
            continue
        translation = translations.get(tid, "")
        matched: set[str] = set()
        for word in remaining:
            if word in text:
                example_map[word] = (text, translation)
                matched.add(word)
        remaining -= matched
    print(f"[build] 子串匹配到 {len(example_map)} 个单词")
    return example_map


def find_example_by_substring(word: str, sentences: dict[int, str], links: dict[int, int], translations: dict[int, str]) -> Optional[tuple[str, str]]:
    """按子串匹配为单词找一个例句，适合日语、汉语等无空格分词语言。"""
    if not word:
        return None
    for sid, text in sentences.items():
        if word in text:
            tid = links.get(sid)
            if tid:
                translation = translations.get(tid, "")
                return text, translation
    return None


def save_json(data: list[dict], filename: str) -> Path:
    """保存结果到 output 目录。"""
    dest = OUTPUT_DIR / filename
    with open(dest, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"[save] {dest} ({len(data)} 条)")
    return dest


def dedup_by_field(data: list[dict], field: str = "word") -> list[dict]:
    """按字段去重。"""
    seen: set[str] = set()
    result: list[dict] = []
    for item in data:
        key = str(item.get(field, "")).lower().strip()
        if not key or key in seen:
            continue
        seen.add(key)
        result.append(item)
    return result
