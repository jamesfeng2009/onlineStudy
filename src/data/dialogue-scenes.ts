import type { DialogueScene, Language } from "../types";

/**
 * Hand-authored dialogue scenes for the conversation module.
 *
 * Each scene is a small directed graph: an `opening` line, then a set
 * of `turns`. Each turn has a prompt (what the NPC says) and a list of
 * `branches` (keyword → next turn). The first branch whose keywords
 * appear in the user's reply wins; otherwise the `fallbackBranchId` is
 * used (usually "please say that again" → loop back).
 *
 * Scenes here are deliberately small (3-5 turns) — enough to feel like
 * a real conversation, not so much that authoring becomes a burden.
 * For scale, Gemini can batch-generate more scenes in the same shape.
 */

export const DIALOGUE_SCENES: DialogueScene[] = [
  // ───────────────────────────────────────────────────────────
  //  English — Ordering coffee
  // ───────────────────────────────────────────────────────────
  {
    id: "dlg-en-coffee",
    language: "en",
    level: "A1",
    scenario: "ordering-coffee",
    title: "点咖啡",
    opening: "Hi there! What can I get for you today?",
    startTurnId: "ask-size",
    turns: {
      "ask-size": {
        id: "ask-size",
        prompt: "Great, a coffee. What size would you like — small, medium, or large?",
        promptTranslation: "好的，一杯咖啡。您要什么尺寸——小杯、中杯还是大杯？",
        branches: [
          { keywords: ["small"], nextTurnId: "confirm-small" },
          { keywords: ["medium", "regular"], nextTurnId: "confirm-medium" },
          { keywords: ["large", "big"], nextTurnId: "confirm-large" },
        ],
        fallbackBranchId: "ask-size-repeat",
      },
      "ask-size-repeat": {
        id: "ask-size-repeat",
        prompt: "Sorry, I didn't catch that. Small, medium, or large?",
        promptTranslation: "抱歉没听清。小杯、中杯还是大杯？",
        branches: [
          { keywords: ["small"], nextTurnId: "confirm-small" },
          { keywords: ["medium", "regular"], nextTurnId: "confirm-medium" },
          { keywords: ["large", "big"], nextTurnId: "confirm-large" },
        ],
        fallbackBranchId: "ask-size-repeat",
      },
      "confirm-small": {
        id: "confirm-small",
        prompt: "A small coffee, coming up. That's $3. Anything else?",
        promptTranslation: "小杯咖啡，马上来。一共 3 美元。还要别的吗？",
        branches: [
          { keywords: ["no", "nothing", "that's all", "all"], nextTurnId: "bye" },
          { keywords: ["yes", "yeah", "also"], nextTurnId: "anything-else" },
        ],
        fallbackBranchId: "bye",
      },
      "confirm-medium": {
        id: "confirm-medium",
        prompt: "A medium coffee. That's $4. Anything else?",
        promptTranslation: "中杯咖啡。一共 4 美元。还要别的吗？",
        branches: [
          { keywords: ["no", "nothing", "that's all", "all"], nextTurnId: "bye" },
          { keywords: ["yes", "yeah", "also"], nextTurnId: "anything-else" },
        ],
        fallbackBranchId: "bye",
      },
      "confirm-large": {
        id: "confirm-large",
        prompt: "A large coffee. That's $5. Anything else?",
        promptTranslation: "大杯咖啡。一共 5 美元。还要别的吗？",
        branches: [
          { keywords: ["no", "nothing", "that's all", "all"], nextTurnId: "bye" },
          { keywords: ["yes", "yeah", "also"], nextTurnId: "anything-else" },
        ],
        fallbackBranchId: "bye",
      },
      "anything-else": {
        id: "anything-else",
        prompt: "Sure, what would you like?",
        promptTranslation: "好的，您想要什么？",
        branches: [
          { keywords: ["muffin", "cake", "cookie", "bagel"], nextTurnId: "add-snack" },
          { keywords: ["tea", "juice", "water"], nextTurnId: "add-drink" },
        ],
        fallbackBranchId: "bye",
      },
      "add-snack": {
        id: "add-snack",
        prompt: "Good choice! I'll add that. Anything else?",
        promptTranslation: "好选择！我加上。还要别的吗？",
        branches: [
          { keywords: ["no", "nothing", "that's all", "all"], nextTurnId: "bye" },
        ],
        fallbackBranchId: "bye",
      },
      "add-drink": {
        id: "add-drink",
        prompt: "Got it, I'll add that to your order. Anything else?",
        promptTranslation: "好的，加到您的订单里。还要别的吗？",
        branches: [
          { keywords: ["no", "nothing", "that's all", "all"], nextTurnId: "bye" },
        ],
        fallbackBranchId: "bye",
      },
      "bye": {
        id: "bye",
        prompt: "Thank you! Your order will be ready shortly. Have a great day!",
        promptTranslation: "谢谢！您的订单马上就好。祝您愉快！",
        branches: [],
        fallbackBranchId: "bye",
        isTerminal: true,
      },
    },
  },

  // ───────────────────────────────────────────────────────────
  //  English — Asking directions
  // ───────────────────────────────────────────────────────────
  {
    id: "dlg-en-directions",
    language: "en",
    level: "A2",
    scenario: "asking-directions",
    title: "问路",
    opening: "Hello! Can I help you find something?",
    startTurnId: "ask-where",
    turns: {
      "ask-where": {
        id: "ask-where",
        prompt: "Sure, I can help. Where are you trying to go?",
        promptTranslation: "好的，我可以帮忙。您想去哪儿？",
        branches: [
          { keywords: ["station", "train"], nextTurnId: "to-station" },
          { keywords: ["hotel"], nextTurnId: "to-hotel" },
          { keywords: ["restaurant", "eat", "food"], nextTurnId: "to-restaurant" },
          { keywords: ["bathroom", "toilet", "wc"], nextTurnId: "to-bathroom" },
        ],
        fallbackBranchId: "ask-where-repeat",
      },
      "ask-where-repeat": {
        id: "ask-where-repeat",
        prompt: "Sorry, where would you like to go?",
        promptTranslation: "抱歉，您想去哪儿？",
        branches: [
          { keywords: ["station", "train"], nextTurnId: "to-station" },
          { keywords: ["hotel"], nextTurnId: "to-hotel" },
          { keywords: ["restaurant", "eat", "food"], nextTurnId: "to-restaurant" },
          { keywords: ["bathroom", "toilet", "wc"], nextTurnId: "to-bathroom" },
        ],
        fallbackBranchId: "ask-where-repeat",
      },
      "to-station": {
        id: "to-station",
        prompt: "The station? Go straight for two blocks, then turn left. It's on your right.",
        promptTranslation: "车站？直走两个街区，然后左转。就在您右手边。",
        branches: [{ keywords: ["thank", "thanks", "ok"], nextTurnId: "bye" }],
        fallbackBranchId: "bye",
      },
      "to-hotel": {
        id: "to-hotel",
        prompt: "The hotel is just around the corner. Turn right at the next street.",
        promptTranslation: "酒店就在拐角处。下个路口右转。",
        branches: [{ keywords: ["thank", "thanks", "ok"], nextTurnId: "bye" }],
        fallbackBranchId: "bye",
      },
      "to-restaurant": {
        id: "to-restaurant",
        prompt: "There's a good restaurant across the street. Walk straight and cross at the lights.",
        promptTranslation: "街对面有家不错的餐厅。直走在红绿灯处过马路。",
        branches: [{ keywords: ["thank", "thanks", "ok"], nextTurnId: "bye" }],
        fallbackBranchId: "bye",
      },
      "to-bathroom": {
        id: "to-bathroom",
        prompt: "The bathroom is down the hall, on the left.",
        promptTranslation: "洗手间在走廊尽头，左手边。",
        branches: [{ keywords: ["thank", "thanks", "ok"], nextTurnId: "bye" }],
        fallbackBranchId: "bye",
      },
      "bye": {
        id: "bye",
        prompt: "You're welcome! Good luck!",
        promptTranslation: "不客气！祝好运！",
        branches: [],
        fallbackBranchId: "bye",
        isTerminal: true,
      },
    },
  },

  // ───────────────────────────────────────────────────────────
  //  Chinese — 点餐
  // ───────────────────────────────────────────────────────────
  {
    id: "dlg-zh-restaurant",
    language: "zh",
    level: "HSK2",
    scenario: "ordering-food",
    title: "餐厅点餐",
    opening: "您好！请问几位？",
    startTurnId: "ask-count",
    turns: {
      "ask-count": {
        id: "ask-count",
        prompt: "好的，请问您想坐哪里？靠窗还是里面？",
        promptTranslation: "Sure, where would you like to sit — by the window or inside?",
        branches: [
          { keywords: ["窗", "靠窗", "window"], nextTurnId: "seat-window" },
          { keywords: ["里", "里面", "inside", "随便", "都行"], nextTurnId: "seat-inside" },
        ],
        fallbackBranchId: "ask-count-repeat",
      },
      "ask-count-repeat": {
        id: "ask-count-repeat",
        prompt: "不好意思没听清，您想坐靠窗还是里面？",
        promptTranslation: "Sorry, window or inside?",
        branches: [
          { keywords: ["窗", "靠窗", "window"], nextTurnId: "seat-window" },
          { keywords: ["里", "里面", "inside", "随便", "都行"], nextTurnId: "seat-inside" },
        ],
        fallbackBranchId: "ask-count-repeat",
      },
      "seat-window": {
        id: "seat-window",
        prompt: "好的，靠窗的位置。这是菜单，请问您想吃点什么？",
        promptTranslation: "Sure, a window seat. Here's the menu — what would you like?",
        branches: [
          { keywords: ["面条", "面", "noodle"], nextTurnId: "order-noodle" },
          { keywords: ["饭", "米饭", "rice"], nextTurnId: "order-rice" },
          { keywords: ["饺子", "dumpling"], nextTurnId: "order-dumpling" },
          { keywords: ["看看", "等一下", "later", "look"], nextTurnId: "need-time" },
        ],
        fallbackBranchId: "seat-window",
      },
      "seat-inside": {
        id: "seat-inside",
        prompt: "好的，里面的位置。这是菜单，请问您想吃点什么？",
        promptTranslation: "Sure, an inside seat. Menu's here — what would you like?",
        branches: [
          { keywords: ["面条", "面", "noodle"], nextTurnId: "order-noodle" },
          { keywords: ["饭", "米饭", "rice"], nextTurnId: "order-rice" },
          { keywords: ["饺子", "dumpling"], nextTurnId: "order-dumpling" },
          { keywords: ["看看", "等一下", "later", "look"], nextTurnId: "need-time" },
        ],
        fallbackBranchId: "seat-inside",
      },
      "order-noodle": {
        id: "order-noodle",
        prompt: "好的，一碗面条。要辣的吗？",
        promptTranslation: "OK, one bowl of noodles. Spicy?",
        branches: [
          { keywords: ["要", "辣", "yes", "spicy"], nextTurnId: "spicy-yes" },
          { keywords: ["不要", "不辣", "no"], nextTurnId: "spicy-no" },
        ],
        fallbackBranchId: "order-noodle",
      },
      "order-rice": {
        id: "order-rice",
        prompt: "好的，一份米饭。还要别的菜吗？",
        promptTranslation: "OK, one rice. Anything else?",
        branches: [
          { keywords: ["不要", "不用", "no", "够了"], nextTurnId: "bye" },
          { keywords: ["要", "yes", "还要"], nextTurnId: "seat-window" },
        ],
        fallbackBranchId: "bye",
      },
      "order-dumpling": {
        id: "order-dumpling",
        prompt: "好的，一份饺子。要蒸的还是煮的？",
        promptTranslation: "OK, dumplings. Steamed or boiled?",
        branches: [
          { keywords: ["蒸", "steamed"], nextTurnId: "bye" },
          { keywords: ["煮", "boiled", "水饺"], nextTurnId: "bye" },
        ],
        fallbackBranchId: "bye",
      },
      "need-time": {
        id: "need-time",
        prompt: "好的，您慢慢看，想好了告诉我。",
        promptTranslation: "Sure, take your time, tell me when you're ready.",
        branches: [
          { keywords: ["面条", "面"], nextTurnId: "order-noodle" },
          { keywords: ["饭", "米饭"], nextTurnId: "order-rice" },
          { keywords: ["饺子"], nextTurnId: "order-dumpling" },
        ],
        fallbackBranchId: "need-time",
      },
      "spicy-yes": {
        id: "spicy-yes",
        prompt: "好的，加辣。请稍等，马上就来。",
        promptTranslation: "OK, spicy. Coming right up.",
        branches: [{ keywords: ["谢谢", "好", "ok", "thanks"], nextTurnId: "bye" }],
        fallbackBranchId: "bye",
      },
      "spicy-no": {
        id: "spicy-no",
        prompt: "好的，不辣。请稍等，马上就来。",
        promptTranslation: "OK, not spicy. Coming right up.",
        branches: [{ keywords: ["谢谢", "好", "ok", "thanks"], nextTurnId: "bye" }],
        fallbackBranchId: "bye",
      },
      "bye": {
        id: "bye",
        prompt: "好的，您的菜马上就好，请稍候！",
        promptTranslation: "Your food will be ready shortly!",
        branches: [],
        fallbackBranchId: "bye",
        isTerminal: true,
      },
    },
  },

  // ───────────────────────────────────────────────────────────
  //  Japanese — 自己紹介 (greeting / self-introduction)
  // ───────────────────────────────────────────────────────────
  {
    id: "dlg-ja-intro",
    language: "ja",
    level: "N5",
    scenario: "self-introduction",
    title: "自己紹介",
    opening: "こんにちは！はじめまして。",
    startTurnId: "ask-name",
    turns: {
      "ask-name": {
        id: "ask-name",
        prompt: "お名前は何ですか？",
        promptTranslation: "What's your name?",
        branches: [
          { keywords: ["です", "だよ", "といいます", "name is", "im ", "i'm"], nextTurnId: "ask-origin" },
        ],
        fallbackBranchId: "ask-name-repeat",
      },
      "ask-name-repeat": {
        id: "ask-name-repeat",
        prompt: "すみません、もう一度お名前を教えてください。",
        promptTranslation: "Sorry, could you say your name again?",
        branches: [
          { keywords: ["です", "だよ", "といいます", "name is", "im ", "i'm"], nextTurnId: "ask-origin" },
        ],
        fallbackBranchId: "ask-name-repeat",
      },
      "ask-origin": {
        id: "ask-origin",
        prompt: "そうですか。どちらから来ましたか？",
        promptTranslation: "I see. Where are you from?",
        branches: [
          { keywords: ["中国", "china", "chinese", "ちゅうごく"], nextTurnId: "from-china" },
          { keywords: ["アメリカ", "america", "usa", "アメリカ"], nextTurnId: "from-usa" },
          { keywords: ["日本", "japan", "にほん"], nextTurnId: "from-japan" },
          { keywords: ["韓国", "korea", "かんこく"], nextTurnId: "from-korea" },
        ],
        fallbackBranchId: "ask-origin-repeat",
      },
      "ask-origin-repeat": {
        id: "ask-origin-repeat",
        prompt: "すみません、どちらから来ましたか？",
        promptTranslation: "Sorry, where are you from?",
        branches: [
          { keywords: ["中国", "china"], nextTurnId: "from-china" },
          { keywords: ["アメリカ", "america", "usa"], nextTurnId: "from-usa" },
          { keywords: ["日本", "japan"], nextTurnId: "from-japan" },
          { keywords: ["韓国", "korea"], nextTurnId: "from-korea" },
        ],
        fallbackBranchId: "ask-origin-repeat",
      },
      "from-china": {
        id: "from-china",
        prompt: "中国から来たんですね！日本語の勉強はどのくらいですか？",
        promptTranslation: "From China! How long have you studied Japanese?",
        branches: [
          { keywords: ["一年", "1年", "one year", "year"], nextTurnId: "bye" },
          { keywords: ["半年", "half", "6ヶ月"], nextTurnId: "bye" },
          { keywords: ["始めた", "beginner", "初心者", "beginner"], nextTurnId: "bye" },
        ],
        fallbackBranchId: "bye",
      },
      "from-usa": {
        id: "from-usa",
        prompt: "アメリカからですね！日本語はお上手ですね。",
        promptTranslation: "From the US! Your Japanese is good.",
        branches: [{ keywords: ["ありがとう", "thank", "いいえ"], nextTurnId: "bye" }],
        fallbackBranchId: "bye",
      },
      "from-japan": {
        id: "from-japan",
        prompt: "あ、日本の方ですか！失礼しました。",
        promptTranslation: "Oh, you're from Japan! Sorry about that.",
        branches: [{ keywords: ["はい", "yes", "大丈夫"], nextTurnId: "bye" }],
        fallbackBranchId: "bye",
      },
      "from-korea": {
        id: "from-korea",
        prompt: "韓国からですね！日本語の勉強頑張ってください。",
        promptTranslation: "From Korea! Keep up the Japanese studies.",
        branches: [{ keywords: ["ありがとう", "thank", "はい"], nextTurnId: "bye" }],
        fallbackBranchId: "bye",
      },
      "bye": {
        id: "bye",
        prompt: "よかったです！また話しましょう。さようなら！",
        promptTranslation: "Great! Let's talk again. Bye!",
        branches: [],
        fallbackBranchId: "bye",
        isTerminal: true,
      },
    },
  },

  // ───────────────────────────────────────────────────────────
  //  Cantonese — 買嘢 (shopping)
  // ───────────────────────────────────────────────────────────
  {
    id: "dlg-yue-shopping",
    language: "yue",
    level: "初级",
    scenario: "shopping",
    title: "買嘢",
    opening: "你好！歡迎光臨，隨便睇隨便揀。",
    startTurnId: "ask-help",
    turns: {
      "ask-help": {
        id: "ask-help",
        prompt: "請問你想搵啲咩？",
        promptTranslation: "What are you looking for?",
        branches: [
          { keywords: ["衫", "衣服", "clothes", "shirt"], nextTurnId: "to-clothes" },
          { keywords: ["鞋", "shoes"], nextTurnId: "to-shoes" },
          { keywords: ["袋", "包", "bag"], nextTurnId: "to-bag" },
          { keywords: ["睇吓", "隨便", "just looking", "look"], nextTurnId: "just-looking" },
        ],
        fallbackBranchId: "ask-help-repeat",
      },
      "ask-help-repeat": {
        id: "ask-help-repeat",
        prompt: "不好意思聽唔到，你想搵啲咩？",
        promptTranslation: "Sorry didn't hear, what are you looking for?",
        branches: [
          { keywords: ["衫", "衣服", "clothes"], nextTurnId: "to-clothes" },
          { keywords: ["鞋", "shoes"], nextTurnId: "to-shoes" },
          { keywords: ["袋", "包", "bag"], nextTurnId: "to-bag" },
          { keywords: ["睇吓", "隨便", "just looking"], nextTurnId: "just-looking" },
        ],
        fallbackBranchId: "ask-help-repeat",
      },
      "to-clothes": {
        id: "to-clothes",
        prompt: "衫喺嗰邊，請問你想搵咩色？",
        promptTranslation: "Clothes are over there. What color?",
        branches: [
          { keywords: ["黑", "black"], nextTurnId: "color-black" },
          { keywords: ["白", "white"], nextTurnId: "color-white" },
          { keywords: ["藍", "blue"], nextTurnId: "color-blue" },
          { keywords: ["紅", "red"], nextTurnId: "color-red" },
        ],
        fallbackBranchId: "to-clothes",
      },
      "to-shoes": {
        id: "to-shoes",
        prompt: "鞋喺隔籬，請問著幾多號？",
        promptTranslation: "Shoes are next door. What size?",
        branches: [
          { keywords: ["四十", "40", "size 40"], nextTurnId: "shoes-40" },
          { keywords: ["四十一", "41", "size 41"], nextTurnId: "shoes-41" },
          { keywords: ["唔知", "don't know", "不知道"], nextTurnId: "shoes-measure" },
        ],
        fallbackBranchId: "to-shoes",
      },
      "to-bag": {
        id: "to-bag",
        prompt: "袋喺呢邊，你鍾意邊隻款？",
        promptTranslation: "Bags are here. Which style do you like?",
        branches: [
          { keywords: ["呢個", "this one", "呢隻"], nextTurnId: "bag-this" },
          { keywords: ["嗰個", "that one", "嗰隻"], nextTurnId: "bag-that" },
        ],
        fallbackBranchId: "to-bag",
      },
      "just-looking": {
        id: "just-looking",
        prompt: "好嘞，你慢慢睇，有需要叫我就得。",
        promptTranslation: "OK, take your time, just call me if you need anything.",
        branches: [
          { keywords: ["好", "ok", "thanks", "多謝"], nextTurnId: "bye" },
        ],
        fallbackBranchId: "bye",
      },
      "color-black": {
        id: "color-black",
        prompt: "黑色嘅喺呢度，要唔要試吓？",
        promptTranslation: "Black ones are here. Want to try?",
        branches: [{ keywords: ["要", "好", "ok", "yes"], nextTurnId: "bye" }],
        fallbackBranchId: "bye",
      },
      "color-white": {
        id: "color-white",
        prompt: "白色嘅喺呢度，要唔要試吓？",
        promptTranslation: "White ones are here. Want to try?",
        branches: [{ keywords: ["要", "好", "ok", "yes"], nextTurnId: "bye" }],
        fallbackBranchId: "bye",
      },
      "color-blue": {
        id: "color-blue",
        prompt: "藍色嘅喺呢度，啱唔啱你？",
        promptTranslation: "Blue ones are here. Suit you?",
        branches: [{ keywords: ["啱", "好", "ok", "yes"], nextTurnId: "bye" }],
        fallbackBranchId: "bye",
      },
      "color-red": {
        id: "color-red",
        prompt: "紅色嘅喺呢度，好搶眼㗎。",
        promptTranslation: "Red ones are here, very eye-catching.",
        branches: [{ keywords: ["好", "ok", "yes"], nextTurnId: "bye" }],
        fallbackBranchId: "bye",
      },
      "shoes-40": {
        id: "shoes-40",
        prompt: "40號嘅有貨，你試吓啦。",
        promptTranslation: "Size 40 in stock. Try them.",
        branches: [{ keywords: ["好", "ok", "yes"], nextTurnId: "bye" }],
        fallbackBranchId: "bye",
      },
      "shoes-41": {
        id: "shoes-41",
        prompt: "41號嘅有貨，你試吓啦。",
        promptTranslation: "Size 41 in stock. Try them.",
        branches: [{ keywords: ["好", "ok", "yes"], nextTurnId: "bye" }],
        fallbackBranchId: "bye",
      },
      "shoes-measure": {
        id: "shoes-measure",
        prompt: "冇問題，我幫你度吓腳長。",
        promptTranslation: "No problem, let me measure your foot.",
        branches: [{ keywords: ["好", "ok", "yes"], nextTurnId: "bye" }],
        fallbackBranchId: "bye",
      },
      "bag-this": {
        id: "bag-this",
        prompt: "呢個好好睇，要唔要？",
        promptTranslation: "This one's nice. Want it?",
        branches: [{ keywords: ["要", "好", "yes"], nextTurnId: "bye" }],
        fallbackBranchId: "bye",
      },
      "bag-that": {
        id: "bag-that",
        prompt: "嗰個都唔錯，要唔要？",
        promptTranslation: "That one's not bad either. Want it?",
        branches: [{ keywords: ["要", "好", "yes"], nextTurnId: "bye" }],
        fallbackBranchId: "bye",
      },
      "bye": {
        id: "bye",
        prompt: "多謝嚟到，下次再見！",
        promptTranslation: "Thanks for coming, see you next time!",
        branches: [],
        fallbackBranchId: "bye",
        isTerminal: true,
      },
    },
  },
];

/** Get all scenes for a language (falls back to English if none). */
export function getDialogueScenes(language: Language): DialogueScene[] {
  const matches = DIALOGUE_SCENES.filter((s) => s.language === language);
  if (matches.length > 0) return matches;
  // Fallback: show English scenes so the tab isn't empty for languages
  // we haven't authored yet.
  return DIALOGUE_SCENES.filter((s) => s.language === "en");
}
