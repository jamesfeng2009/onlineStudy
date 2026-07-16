/**
 * P1-1: 字母/发音基础数据（亚洲语言入门）
 *
 * 静态参考数据，不入库（参考 courses.ts / grammar-points.ts 的硬编码模式）。
 * 字符通过 Web Speech API（src/lib/tts.ts）朗读，BCP-47 lang 在 AlphabetPage 中映射。
 *
 * 覆盖范围：
 *   - 日语：Hiragana（46 基础 + 拗音组合）+ Katakana（46 基础）
 *   - 韩语：Hangul（10 元音 + 14 辅音 + 10 个代表音节）
 *   - 汉语：Pinyin（21 声母 + 24 韵母 + 4 声调示例）
 *   - 粤语：Jyutping（19 声母 + 代表韵母 + 9 声调）
 *   - 泰语：Thai（44 辅音 + 15 元音中选取代表子集）
 */

import type { Language } from "../types";

export type AlphabetSystem =
  | "hiragana"
  | "katakana"
  | "hangul-basic"
  | "pinyin"
  | "jyutping"
  | "thai";

export interface AlphabetChar {
  /** The character / letter itself, e.g. "あ" / "ア" / "ㄱ" / "ā" */
  char: string;
  /** Romanization (romaji / pinyin / rr), e.g. "a" / "ga" / "g" */
  romaji: string;
  /** Short pronunciation hint or IPA, e.g. "[a]" / "k" */
  sound?: string;
  /** Example word using this char */
  example?: string;
  /** Translation of the example word */
  exampleTranslation?: string;
}

export interface Alphabet {
  language: Language;
  system: AlphabetSystem;
  /** Display title, e.g. "平假名" / "Hangul" / "Pinyin 声母" */
  title: string;
  /** Short description shown at the top of the chart */
  description: string;
  /** The characters in display order */
  chars: AlphabetChar[];
}

export const ALPHABETS: Alphabet[] = [
  // ============================================================
  // 日语 — 平假名（基础 46 + 浊音/半浊音/拗音省略，留作 P2 内容扩容）
  // ============================================================
  {
    language: "ja",
    system: "hiragana",
    title: "平假名（ひらがな）",
    description: "日语基础音节文字，用于动词词尾、助词、本土词汇。",
    chars: [
      { char: "あ", romaji: "a", sound: "[a]", example: "あい", exampleTranslation: "爱" },
      { char: "い", romaji: "i", sound: "[i]", example: "いぬ", exampleTranslation: "狗" },
      { char: "う", romaji: "u", sound: "[ɯ]", example: "うみ", exampleTranslation: "海" },
      { char: "え", romaji: "e", sound: "[e]", example: "えき", exampleTranslation: "车站" },
      { char: "お", romaji: "o", sound: "[o]", example: "おちゃ", exampleTranslation: "茶" },
      { char: "か", romaji: "ka", sound: "[ka]", example: "かぜ", exampleTranslation: "风" },
      { char: "き", romaji: "ki", sound: "[ki]", example: "きつね", exampleTranslation: "狐狸" },
      { char: "く", romaji: "ku", sound: "[kɯ]", example: "くも", exampleTranslation: "云" },
      { char: "け", romaji: "ke", sound: "[ke]", example: "けむり", exampleTranslation: "烟" },
      { char: "こ", romaji: "ko", sound: "[ko]", example: "こども", exampleTranslation: "孩子" },
      { char: "さ", romaji: "sa", sound: "[sa]", example: "さかな", exampleTranslation: "鱼" },
      { char: "し", romaji: "shi", sound: "[ɕi]", example: "しま", exampleTranslation: "岛" },
      { char: "す", romaji: "su", sound: "[sɯ]", example: "すし", exampleTranslation: "寿司" },
      { char: "せ", romaji: "se", sound: "[se]", example: "せかい", exampleTranslation: "世界" },
      { char: "そ", romaji: "so", sound: "[so]", example: "そら", exampleTranslation: "天空" },
      { char: "た", romaji: "ta", sound: "[ta]", example: "たまご", exampleTranslation: "蛋" },
      { char: "ち", romaji: "chi", sound: "[tɕi]", example: "ちず", exampleTranslation: "地图" },
      { char: "つ", romaji: "tsu", sound: "[tsɯ]", example: "つき", exampleTranslation: "月亮" },
      { char: "て", romaji: "te", sound: "[te]", example: "て", exampleTranslation: "手" },
      { char: "と", romaji: "to", sound: "[to]", example: "とり", exampleTranslation: "鸟" },
      { char: "な", romaji: "na", sound: "[na]", example: "なつ", exampleTranslation: "夏天" },
      { char: "に", romaji: "ni", sound: "[ɲi]", example: "にわ", exampleTranslation: "院子" },
      { char: "ぬ", romaji: "nu", sound: "[nɯ]", example: "ぬい", exampleTranslation: "缝" },
      { char: "ね", romaji: "ne", sound: "[ne]", example: "ねこ", exampleTranslation: "猫" },
      { char: "の", romaji: "no", sound: "[no]", example: "のはら", exampleTranslation: "原野" },
      { char: "は", romaji: "ha", sound: "[ha]", example: "はな", exampleTranslation: "花" },
      { char: "ひ", romaji: "hi", sound: "[çi]", example: "ひかり", exampleTranslation: "光" },
      { char: "ふ", romaji: "fu", sound: "[ɸɯ]", example: "ふね", exampleTranslation: "船" },
      { char: "へ", romaji: "he", sound: "[he]", example: "へや", exampleTranslation: "房间" },
      { char: "ほ", romaji: "ho", sound: "[ho]", example: "ほし", exampleTranslation: "星星" },
      { char: "ま", romaji: "ma", sound: "[ma]", example: "まち", exampleTranslation: "城镇" },
      { char: "み", romaji: "mi", sound: "[mi]", example: "みち", exampleTranslation: "路" },
      { char: "む", romaji: "mu", sound: "[mɯ]", example: "むし", exampleTranslation: "虫" },
      { char: "め", romaji: "me", sound: "[me]", example: "めがね", exampleTranslation: "眼镜" },
      { char: "も", romaji: "mo", sound: "[mo]", example: "もり", exampleTranslation: "森林" },
      { char: "や", romaji: "ya", sound: "[ja]", example: "やま", exampleTranslation: "山" },
      { char: "ゆ", romaji: "yu", sound: "[jɯ]", example: "ゆき", exampleTranslation: "雪" },
      { char: "よ", romaji: "yo", sound: "[jo]", example: "よる", exampleTranslation: "夜晚" },
      { char: "ら", romaji: "ra", sound: "[ɾa]", example: "らいおん", exampleTranslation: "狮子" },
      { char: "り", romaji: "ri", sound: "[ɾi]", example: "りんご", exampleTranslation: "苹果" },
      { char: "る", romaji: "ru", sound: "[ɾɯ]", example: "るす", exampleTranslation: "不在家" },
      { char: "れ", romaji: "re", sound: "[ɾe]", example: "れきし", exampleTranslation: "历史" },
      { char: "ろ", romaji: "ro", sound: "[ɾo]", example: "ろうそく", exampleTranslation: "蜡烛" },
      { char: "わ", romaji: "wa", sound: "[wa]", example: "わに", exampleTranslation: "鳄鱼" },
      { char: "を", romaji: "wo", sound: "[o]", example: "を (助词)", exampleTranslation: "宾格标记" },
      { char: "ん", romaji: "n", sound: "[ɴ]", example: "ほん", exampleTranslation: "书" },
    ],
  },

  // ============================================================
  // 日语 — 片假名（基础 46，主要用于外来语）
  // ============================================================
  {
    language: "ja",
    system: "katakana",
    title: "片假名（カタカナ）",
    description: "用于外来语、动植物学名、强调文字。",
    chars: [
      { char: "ア", romaji: "a", sound: "[a]", example: "アイス", exampleTranslation: "冰" },
      { char: "イ", romaji: "i", sound: "[i]", example: "イス", exampleTranslation: "椅子" },
      { char: "ウ", romaji: "u", sound: "[ɯ]", example: "ウシ", exampleTranslation: "牛" },
      { char: "エ", romaji: "e", sound: "[e]", example: "エキ", exampleTranslation: "车站" },
      { char: "オ", romaji: "o", sound: "[o]", example: "オト", exampleTranslation: "声音" },
      { char: "カ", romaji: "ka", sound: "[ka]", example: "カメラ", exampleTranslation: "相机" },
      { char: "キ", romaji: "ki", sound: "[ki]", example: "キツネ", exampleTranslation: "狐狸" },
      { char: "ク", romaji: "ku", sound: "[kɯ]", example: "クモ", exampleTranslation: "云" },
      { char: "ケ", romaji: "ke", sound: "[ke]", example: "ケーキ", exampleTranslation: "蛋糕" },
      { char: "コ", romaji: "ko", sound: "[ko]", example: "コーヒー", exampleTranslation: "咖啡" },
      { char: "サ", romaji: "sa", sound: "[sa]", example: "サカナ", exampleTranslation: "鱼" },
      { char: "シ", romaji: "shi", sound: "[ɕi]", example: "シャツ", exampleTranslation: "衬衫" },
      { char: "ス", romaji: "su", sound: "[sɯ]", example: "スシ", exampleTranslation: "寿司" },
      { char: "セ", romaji: "se", sound: "[se]", example: "センセー", exampleTranslation: "老师" },
      { char: "ソ", romaji: "so", sound: "[so]", example: "ソラ", exampleTranslation: "天空" },
      { char: "タ", romaji: "ta", sound: "[ta]", example: "タマゴ", exampleTranslation: "蛋" },
      { char: "チ", romaji: "chi", sound: "[tɕi]", example: "チズ", exampleTranslation: "地图" },
      { char: "ツ", romaji: "tsu", sound: "[tsɯ]", example: "ツキ", exampleTranslation: "月亮" },
      { char: "テ", romaji: "te", sound: "[te]", example: "テレビ", exampleTranslation: "电视" },
      { char: "ト", romaji: "to", sound: "[to]", example: "トイレ", exampleTranslation: "厕所" },
      { char: "ナ", romaji: "na", sound: "[na]", example: "ナツ", exampleTranslation: "夏天" },
      { char: "ニ", romaji: "ni", sound: "[ɲi]", example: "ニワトリ", exampleTranslation: "鸡" },
      { char: "ヌ", romaji: "nu", sound: "[nɯ]", example: "ヌイ", exampleTranslation: "缝" },
      { char: "ネ", romaji: "ne", sound: "[ne]", example: "ネコ", exampleTranslation: "猫" },
      { char: "ノ", romaji: "no", sound: "[no]", example: "ノハラ", exampleTranslation: "原野" },
      { char: "ハ", romaji: "ha", sound: "[ha]", example: "ハナ", exampleTranslation: "花" },
      { char: "ヒ", romaji: "hi", sound: "[çi]", example: "ヒカリ", exampleTranslation: "光" },
      { char: "フ", romaji: "fu", sound: "[ɸɯ]", example: "フネ", exampleTranslation: "船" },
      { char: "ヘ", romaji: "he", sound: "[he]", example: "ヘヤ", exampleTranslation: "房间" },
      { char: "ホ", romaji: "ho", sound: "[ho]", example: "ホシ", exampleTranslation: "星星" },
      { char: "マ", romaji: "ma", sound: "[ma]", example: "マチ", exampleTranslation: "城镇" },
      { char: "ミ", romaji: "mi", sound: "[mi]", example: "ミチ", exampleTranslation: "路" },
      { char: "ム", romaji: "mu", sound: "[mɯ]", example: "ムシ", exampleTranslation: "虫" },
      { char: "メ", romaji: "me", sound: "[me]", example: "メガネ", exampleTranslation: "眼镜" },
      { char: "モ", romaji: "mo", sound: "[mo]", example: "モリ", exampleTranslation: "森林" },
      { char: "ヤ", romaji: "ya", sound: "[ja]", example: "ヤマ", exampleTranslation: "山" },
      { char: "ユ", romaji: "yu", sound: "[jɯ]", example: "ユキ", exampleTranslation: "雪" },
      { char: "ヨ", romaji: "yo", sound: "[jo]", example: "ヨル", exampleTranslation: "夜晚" },
      { char: "ラ", romaji: "ra", sound: "[ɾa]", example: "ライオン", exampleTranslation: "狮子" },
      { char: "リ", romaji: "ri", sound: "[ɾi]", example: "リンゴ", exampleTranslation: "苹果" },
      { char: "ル", romaji: "ru", sound: "[ɾɯ]", example: "ルス", exampleTranslation: "不在家" },
      { char: "レ", romaji: "re", sound: "[ɾe]", example: "レキシ", exampleTranslation: "历史" },
      { char: "ロ", romaji: "ro", sound: "[ɾo]", example: "ロウソク", exampleTranslation: "蜡烛" },
      { char: "ワ", romaji: "wa", sound: "[wa]", example: "ワニ", exampleTranslation: "鳄鱼" },
      { char: "ヲ", romaji: "wo", sound: "[o]", example: "ヲ (助词)", exampleTranslation: "宾格标记" },
      { char: "ン", romaji: "n", sound: "[ɴ]", example: "ホン", exampleTranslation: "书" },
    ],
  },

  // ============================================================
  // 韩语 — Hangul 基础（10 元音 + 14 辅音 + 10 个代表音节）
  // ============================================================
  {
    language: "ko",
    system: "hangul-basic",
    title: "한글 기초 (Hangul 基础)",
    description: "韩文字母基础：10 个单元音 + 14 个基本辅音 + 10 个代表音节。",
    chars: [
      // 单元音
      { char: "ㅏ", romaji: "a", sound: "[a]", example: "아이", exampleTranslation: "孩子" },
      { char: "ㅑ", romaji: "ya", sound: "[ja]", example: "야구", exampleTranslation: "棒球" },
      { char: "ㅓ", romaji: "eo", sound: "[ʌ]", example: "어린이", exampleTranslation: "儿童" },
      { char: "ㅕ", romaji: "yeo", sound: "[jʌ]", example: "여자", exampleTranslation: "女人" },
      { char: "ㅗ", romaji: "o", sound: "[o]", example: "오이", exampleTranslation: "黄瓜" },
      { char: "ㅛ", romaji: "yo", sound: "[jo]", example: "요리", exampleTranslation: "料理" },
      { char: "ㅜ", romaji: "u", sound: "[u]", example: "우유", exampleTranslation: "牛奶" },
      { char: "ㅠ", romaji: "yu", sound: "[ju]", example: "유리", exampleTranslation: "玻璃" },
      { char: "ㅡ", romaji: "eu", sound: "[ɯ]", example: "으악", exampleTranslation: "啊！" },
      { char: "ㅣ", romaji: "i", sound: "[i]", example: "이름", exampleTranslation: "名字" },
      // 基本辅音
      { char: "ㄱ", romaji: "g/k", sound: "[k]/[ɡ]", example: "가다", exampleTranslation: "去" },
      { char: "ㄴ", romaji: "n", sound: "[n]", example: "나무", exampleTranslation: "树" },
      { char: "ㄷ", romaji: "d/t", sound: "[t]/[d]", example: "다리", exampleTranslation: "桥" },
      { char: "ㄹ", romaji: "r/l", sound: "[ɾ]/[l]", example: "라면", exampleTranslation: "拉面" },
      { char: "ㅁ", romaji: "m", sound: "[m]", example: "바다", exampleTranslation: "海" },
      { char: "ㅂ", romaji: "b/p", sound: "[p]/[b]", example: "보라", exampleTranslation: "紫色" },
      { char: "ㅅ", romaji: "s", sound: "[s]/[ɕ]", example: "사과", exampleTranslation: "苹果" },
      { char: "ㅇ", romaji: "(ng)", sound: "[∅]/[ŋ]", example: "아이", exampleTranslation: "孩子" },
      { char: "ㅈ", romaji: "j", sound: "[tɕ]", example: "자동차", exampleTranslation: "汽车" },
      { char: "ㅊ", romaji: "ch", sound: "[tɕʰ]", example: "차", exampleTranslation: "茶/车" },
      { char: "ㅋ", romaji: "k", sound: "[kʰ]", example: "코", exampleTranslation: "鼻子" },
      { char: "ㅌ", romaji: "t", sound: "[tʰ]", example: "토마토", exampleTranslation: "番茄" },
      { char: "ㅍ", romaji: "p", sound: "[pʰ]", example: "포도", exampleTranslation: "葡萄" },
      { char: "ㅎ", romaji: "h", sound: "[h]", example: "하늘", exampleTranslation: "天空" },
      // 代表音节（辅音 + ㅏ 组合）
      { char: "가", romaji: "ga", sound: "[ka]", example: "가족", exampleTranslation: "家庭" },
      { char: "나", romaji: "na", sound: "[na]", example: "나라", exampleTranslation: "国家" },
      { char: "다", romaji: "da", sound: "[ta]", example: "다음", exampleTranslation: "下一个" },
      { char: "라", romaji: "ra", sound: "[ɾa]", example: "라디오", exampleTranslation: "收音机" },
      { char: "마", romaji: "ma", sound: "[ma]", example: "마음", exampleTranslation: "心" },
      { char: "바", romaji: "ba", sound: "[pa]", example: "바람", exampleTranslation: "风" },
      { char: "사", romaji: "sa", sound: "[sa]", example: "사람", exampleTranslation: "人" },
      { char: "아", romaji: "a", sound: "[a]", example: "아버지", exampleTranslation: "父亲" },
      { char: "자", romaji: "ja", sound: "[tɕa]", example: "자격", exampleTranslation: "资格" },
      { char: "차", romaji: "cha", sound: "[tɕʰa]", example: "차량", exampleTranslation: "车辆" },
    ],
  },

  // ============================================================
  // 汉语 — Pinyin（21 声母 + 24 韵母 + 4 声调示例）
  // ============================================================
  {
    language: "zh",
    system: "pinyin",
    title: "拼音（Pinyin）",
    description: "普通话罗马字注音系统：21 个声母 + 24 个韵母 + 4 个声调。",
    chars: [
      // 声母
      { char: "b", romaji: "b", sound: "[p]", example: "爸爸", exampleTranslation: "father" },
      { char: "p", romaji: "p", sound: "[pʰ]", example: "跑步", exampleTranslation: "run" },
      { char: "m", romaji: "m", sound: "[m]", example: "妈妈", exampleTranslation: "mother" },
      { char: "f", romaji: "f", sound: "[f]", example: "发现", exampleTranslation: "discover" },
      { char: "d", romaji: "d", sound: "[t]", example: "大", exampleTranslation: "big" },
      { char: "t", romaji: "t", sound: "[tʰ]", example: "天", exampleTranslation: "sky" },
      { char: "n", romaji: "n", sound: "[n]", example: "你", exampleTranslation: "you" },
      { char: "l", romaji: "l", sound: "[l]", example: "来", exampleTranslation: "come" },
      { char: "g", romaji: "g", sound: "[k]", example: "哥", exampleTranslation: "brother" },
      { char: "k", romaji: "k", sound: "[kʰ]", example: "看", exampleTranslation: "look" },
      { char: "h", romaji: "h", sound: "[x]", example: "好", exampleTranslation: "good" },
      { char: "j", romaji: "j", sound: "[tɕ]", example: "家", exampleTranslation: "home" },
      { char: "q", romaji: "q", sound: "[tɕʰ]", example: "去", exampleTranslation: "go" },
      { char: "x", romaji: "x", sound: "[ɕ]", example: "小", exampleTranslation: "small" },
      { char: "zh", romaji: "zh", sound: "[ʈʂ]", example: "中国", exampleTranslation: "China" },
      { char: "ch", romaji: "ch", sound: "[ʈʂʰ]", example: "吃饭", exampleTranslation: "eat" },
      { char: "sh", romaji: "sh", sound: "[ʂ]", example: "是", exampleTranslation: "is" },
      { char: "r", romaji: "r", sound: "[ʐ]", example: "人", exampleTranslation: "person" },
      { char: "z", romaji: "z", sound: "[ts]", example: "字", exampleTranslation: "word" },
      { char: "c", romaji: "c", sound: "[tsʰ]", example: "才", exampleTranslation: "then" },
      { char: "s", romaji: "s", sound: "[s]", example: "三", exampleTranslation: "three" },
      // 单韵母
      { char: "a", romaji: "a", sound: "[ɑ]", example: "啊", exampleTranslation: "ah" },
      { char: "o", romaji: "o", sound: "[o]", example: "哦", exampleTranslation: "oh" },
      { char: "e", romaji: "e", sound: "[ɤ]", example: "饿", exampleTranslation: "hungry" },
      { char: "i", romaji: "i", sound: "[i]", example: "一", exampleTranslation: "one" },
      { char: "u", romaji: "u", sound: "[u]", example: "五", exampleTranslation: "five" },
      { char: "ü", romaji: "ü", sound: "[y]", example: "女", exampleTranslation: "woman" },
      // 复韵母
      { char: "ai", romaji: "ai", sound: "[aɪ]", example: "爱", exampleTranslation: "love" },
      { char: "ei", romaji: "ei", sound: "[eɪ]", example: "给", exampleTranslation: "give" },
      { char: "ui", romaji: "ui", sound: "[ueɪ]", example: "水", exampleTranslation: "water" },
      { char: "ao", romaji: "ao", sound: "[ɑʊ]", example: "好", exampleTranslation: "good" },
      { char: "ou", romaji: "ou", sound: "[oʊ]", example: "狗", exampleTranslation: "dog" },
      { char: "iu", romaji: "iu", sound: "[ioʊ]", example: "六", exampleTranslation: "six" },
      { char: "ie", romaji: "ie", sound: "[iɛ]", example: "写", exampleTranslation: "write" },
      { char: "üe", romaji: "üe", sound: "[yɛ]", example: "月", exampleTranslation: "moon" },
      { char: "er", romaji: "er", sound: "[ɚ]", example: "二", exampleTranslation: "two" },
      // 鼻韵母
      { char: "an", romaji: "an", sound: "[an]", example: "安", exampleTranslation: "peace" },
      { char: "en", romaji: "en", sound: "[ən]", example: "门", exampleTranslation: "door" },
      { char: "in", romaji: "in", sound: "[in]", example: "新", exampleTranslation: "new" },
      { char: "un", romaji: "un", sound: "[uən]", example: "春", exampleTranslation: "spring" },
      { char: "ün", romaji: "ün", sound: "[yn]", example: "云", exampleTranslation: "cloud" },
      { char: "ang", romaji: "ang", sound: "[ɑŋ]", example: "帮", exampleTranslation: "help" },
      { char: "eng", romaji: "eng", sound: "[əŋ]", example: "风", exampleTranslation: "wind" },
      { char: "ing", romaji: "ing", sound: "[iŋ]", example: "星", exampleTranslation: "star" },
      { char: "ong", romaji: "ong", sound: "[ʊŋ]", example: "东", exampleTranslation: "east" },
      // 声调示例（用 ma 演示 4 声 + 轻声）
      { char: "mā", romaji: "mā (1声)", sound: "高平", example: "妈妈", exampleTranslation: "mother (高平调)" },
      { char: "má", romaji: "má (2声)", sound: "上升", example: "麻", exampleTranslation: "hemp (上升调)" },
      { char: "mǎ", romaji: "mǎ (3声)", sound: "降升", example: "马", exampleTranslation: "horse (降升调)" },
      { char: "mà", romaji: "mà (4声)", sound: "下降", example: "骂", exampleTranslation: "scold (下降调)" },
    ],
  },

  // ============================================================
  // 粤语 — Jyutping（19 声母 + 代表韵母 + 9 声调）
  // ============================================================
  {
    language: "yue",
    system: "jyutping",
    title: "粤拼（Jyutping）",
    description: "粤语罗马字注音系统：19 个声母 + 代表韵母 + 9 声调（六调九声）。",
    chars: [
      // 声母 — example 字段为粤语汉字（TTS 朗读用），romaji 字段为 jyutping 罗马字
      { char: "b", romaji: "b (baa1)", sound: "[p]", example: "巴", exampleTranslation: "bus" },
      { char: "p", romaji: "p (paa3)", sound: "[pʰ]", example: "怕", exampleTranslation: "fear" },
      { char: "m", romaji: "m (maa1)", sound: "[m]", example: "妈", exampleTranslation: "mother" },
      { char: "f", romaji: "f (faa1)", sound: "[f]", example: "花", exampleTranslation: "flower" },
      { char: "d", romaji: "d (daa2)", sound: "[t]", example: "打", exampleTranslation: "hit" },
      { char: "t", romaji: "t (taa1)", sound: "[tʰ]", example: "他", exampleTranslation: "he" },
      { char: "n", romaji: "n (nei5)", sound: "[n]", example: "你", exampleTranslation: "you" },
      { char: "l", romaji: "l (laa1)", sound: "[l]", example: "啦", exampleTranslation: "(particle)" },
      { char: "g", romaji: "g (gaa1)", sound: "[k]", example: "家", exampleTranslation: "home" },
      { char: "k", romaji: "k (kaa1)", sound: "[kʰ]", example: "卡", exampleTranslation: "card" },
      { char: "ng", romaji: "ng (ngo5)", sound: "[ŋ]", example: "我", exampleTranslation: "I" },
      { char: "h", romaji: "h (hoi2)", sound: "[h]", example: "海", exampleTranslation: "sea" },
      { char: "gw", romaji: "gw (gwo2)", sound: "[kʷ]", example: "果", exampleTranslation: "fruit" },
      { char: "kw", romaji: "kw (kwaa1)", sound: "[kʷʰ]", example: "夸", exampleTranslation: "boast" },
      { char: "w", romaji: "w (waa1)", sound: "[w]", example: "蛙", exampleTranslation: "frog" },
      { char: "z", romaji: "z (zi6)", sound: "[ts]", example: "字", exampleTranslation: "word" },
      { char: "c", romaji: "c (ce1)", sound: "[tsʰ]", example: "车", exampleTranslation: "car" },
      { char: "s", romaji: "s (saa1)", sound: "[s]", example: "沙", exampleTranslation: "sand" },
      { char: "j", romaji: "j (ze1)", sound: "[tɕ]", example: "姐", exampleTranslation: "sister" },
      // 代表韵母
      { char: "aa", romaji: "aa (saa1)", sound: "[aː]", example: "沙", exampleTranslation: "sand" },
      { char: "a", romaji: "a (sap6)", sound: "[ɐ]", example: "十", exampleTranslation: "ten" },
      { char: "e", romaji: "e (se1)", sound: "[ɛː]", example: "些", exampleTranslation: "some" },
      { char: "i", romaji: "i (si1)", sound: "[iː]/[ɪ]", example: "诗", exampleTranslation: "poem" },
      { char: "o", romaji: "o (go1)", sound: "[ɔː]/[o]", example: "哥", exampleTranslation: "brother" },
      { char: "u", romaji: "u (fu1)", sound: "[uː]/[ʊ]", example: "夫", exampleTranslation: "husband" },
      { char: "oe", romaji: "oe (hoe1)", sound: "[œː]", example: "靴", exampleTranslation: "boot" },
      { char: "eo", romaji: "eo (ceot1)", sound: "[ɵ]", example: "出", exampleTranslation: "out" },
      { char: "yu", romaji: "yu (syu1)", sound: "[yː]", example: "书", exampleTranslation: "book" },
      // 声调示例（用 si 演示 6 调；TTS 朗读 example 字段的汉字以听辨声调）
      { char: "诗", romaji: "si¹ (高平/阴平)", sound: "55", example: "诗", exampleTranslation: "poem" },
      { char: "史", romaji: "si² (中升/阴上)", sound: "35", example: "史", exampleTranslation: "history" },
      { char: "试", romaji: "si³ (中平/阴去)", sound: "33", example: "试", exampleTranslation: "try" },
      { char: "时", romaji: "si⁴ (低平/阳平)", sound: "21", example: "时", exampleTranslation: "time" },
      { char: "市", romaji: "si⁵ (低升/阳上)", sound: "13", example: "市", exampleTranslation: "market" },
      { char: "事", romaji: "si⁶ (低去/阳去)", sound: "22", example: "事", exampleTranslation: "matter" },
    ],
  },
];

/** Get all alphabets for a language. */
export function getAlphabetsByLanguage(language: Language): Alphabet[] {
  return ALPHABETS.filter((a) => a.language === language);
}

/** Get a specific alphabet by (language, system). */
export function getAlphabet(language: Language, system: AlphabetSystem): Alphabet | undefined {
  return ALPHABETS.find((a) => a.language === language && a.system === system);
}

/** Languages that have at least one alphabet chart. */
export const LANGUAGES_WITH_ALPHABETS: Language[] = Array.from(
  new Set(ALPHABETS.map((a) => a.language)),
);
