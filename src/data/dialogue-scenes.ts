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

  // ───────────────────────────────────────────────────────────
  //  English — Greeting a new colleague
  // ───────────────────────────────────────────────────────────
  {
    id: "dlg-en-greeting",
    language: "en",
    level: "A1",
    scenario: "greeting",
    title: "Greeting 见面打招呼",
    opening: "Hi! You must be the new team member. Welcome!",
    startTurnId: "ask-name",
    turns: {
      "ask-name": {
        id: "ask-name",
        prompt: "Nice to meet you. What's your name?",
        promptTranslation: "很高兴认识你。你叫什么名字？",
        branches: [
          { keywords: ["i'm", "im", "i am", "my name is", "叫"], nextTurnId: "ask-role" },
        ],
        fallbackBranchId: "ask-name-repeat",
      },
      "ask-name-repeat": {
        id: "ask-name-repeat",
        prompt: "Sorry, I missed that. What's your name?",
        promptTranslation: "抱歉没听清。你叫什么名字？",
        branches: [
          { keywords: ["i'm", "im", "i am", "my name is"], nextTurnId: "ask-role" },
        ],
        fallbackBranchId: "ask-name-repeat",
      },
      "ask-role": {
        id: "ask-role",
        prompt: "Great! So what do you do here?",
        promptTranslation: "好的！你在这里负责什么工作？",
        branches: [
          { keywords: ["developer", "engineer", "programmer", "developer", "开发"], nextTurnId: "role-dev" },
          { keywords: ["design", "designer", "设计"], nextTurnId: "role-design" },
          { keywords: ["manager", "pm", "product", "经理", "主管"], nextTurnId: "role-pm" },
          { keywords: ["intern", "student", "实习"], nextTurnId: "role-intern" },
        ],
        fallbackBranchId: "ask-role-repeat",
      },
      "ask-role-repeat": {
        id: "ask-role-repeat",
        prompt: "Sorry, what do you do here?",
        promptTranslation: "抱歉，你在这里做什么？",
        branches: [
          { keywords: ["developer", "engineer"], nextTurnId: "role-dev" },
          { keywords: ["design"], nextTurnId: "role-design" },
          { keywords: ["manager", "product"], nextTurnId: "role-pm" },
          { keywords: ["intern", "student"], nextTurnId: "role-intern" },
        ],
        fallbackBranchId: "ask-role-repeat",
      },
      "role-dev": {
        id: "role-dev",
        prompt: "Awesome, we need more developers! Let me show you your desk.",
        promptTranslation: "太好了，我们需要更多开发！我带你去看工位。",
        branches: [{ keywords: ["thank", "thanks", "ok", "sure", "好"], nextTurnId: "bye" }],
        fallbackBranchId: "bye",
      },
      "role-design": {
        id: "role-design",
        prompt: "Design is so important. Welcome to the team!",
        promptTranslation: "设计很重要。欢迎加入团队！",
        branches: [{ keywords: ["thank", "thanks", "ok"], nextTurnId: "bye" }],
        fallbackBranchId: "bye",
      },
      "role-pm": {
        id: "role-pm",
        prompt: "Oh great, a PM! Let's grab coffee sometime.",
        promptTranslation: "太好了，有 PM 了！改天一起喝咖啡。",
        branches: [{ keywords: ["thank", "ok", "sure", "好"], nextTurnId: "bye" }],
        fallbackBranchId: "bye",
      },
      "role-intern": {
        id: "role-intern",
        prompt: "Welcome, intern! Don't worry, we'll guide you.",
        promptTranslation: "欢迎实习生！别担心，我们会带你。",
        branches: [{ keywords: ["thank", "ok", "sure", "好"], nextTurnId: "bye" }],
        fallbackBranchId: "bye",
      },
      "bye": {
        id: "bye",
        prompt: "It's great to have you on the team! See you tomorrow.",
        promptTranslation: "欢迎加入团队！明天见。",
        branches: [],
        fallbackBranchId: "bye",
        isTerminal: true,
      },
    },
  },

  // ───────────────────────────────────────────────────────────
  //  English — Seeing a doctor
  // ───────────────────────────────────────────────────────────
  {
    id: "dlg-en-doctor",
    language: "en",
    level: "A2",
    scenario: "doctor",
    title: "Doctor 看医生",
    opening: "Good morning. What seems to be the problem today?",
    startTurnId: "ask-symptom",
    turns: {
      "ask-symptom": {
        id: "ask-symptom",
        prompt: "I see. How long have you had this?",
        promptTranslation: "知道了。这种情况多久了？",
        branches: [
          { keywords: ["day", "yesterday", "today"], nextTurnId: "acute" },
          { keywords: ["week", "weeks", "long time"], nextTurnId: "chronic" },
          { keywords: ["month", "months", "很久", "long"], nextTurnId: "chronic" },
        ],
        fallbackBranchId: "ask-symptom-repeat",
      },
      "ask-symptom-repeat": {
        id: "ask-symptom-repeat",
        prompt: "Sorry, how long have you felt this way?",
        promptTranslation: "抱歉，你这样多久了？",
        branches: [
          { keywords: ["day", "today", "yesterday"], nextTurnId: "acute" },
          { keywords: ["week", "month", "long"], nextTurnId: "chronic" },
        ],
        fallbackBranchId: "ask-symptom-repeat",
      },
      "acute": {
        id: "acute",
        prompt: "OK, it sounds like a short-term issue. Any fever?",
        promptTranslation: "好，听起来是短期问题。发烧吗？",
        branches: [
          { keywords: ["yes", "fever", "hot"], nextTurnId: "with-fever" },
          { keywords: ["no", "not", "没有"], nextTurnId: "no-fever" },
        ],
        fallbackBranchId: "acute",
      },
      "chronic": {
        id: "chronic",
        prompt: "That's been a while. Let me prescribe some tests.",
        promptTranslation: "有点久了。我先开些检查。",
        branches: [
          { keywords: ["ok", "sure", "好", "thank"], nextTurnId: "bye" },
        ],
        fallbackBranchId: "bye",
      },
      "with-fever": {
        id: "with-fever",
        prompt: "Take this twice a day, and drink lots of water. Rest well.",
        promptTranslation: "这个药一天两次，多喝水，好好休息。",
        branches: [
          { keywords: ["thank", "ok", "好"], nextTurnId: "bye" },
        ],
        fallbackBranchId: "bye",
      },
      "no-fever": {
        id: "no-fever",
        prompt: "That's good. Here are some lozenges. Should clear up in 2-3 days.",
        promptTranslation: "那就好。给你含片，2-3 天会好。",
        branches: [
          { keywords: ["thank", "ok", "好"], nextTurnId: "bye" },
        ],
        fallbackBranchId: "bye",
      },
      "bye": {
        id: "bye",
        prompt: "Take care. Book a follow-up in a week if it gets worse.",
        promptTranslation: "保重。一周后没好转就来复诊。",
        branches: [],
        fallbackBranchId: "bye",
        isTerminal: true,
      },
    },
  },

  // ───────────────────────────────────────────────────────────
  //  English — Weather small talk
  // ───────────────────────────────────────────────────────────
  {
    id: "dlg-en-weather",
    language: "en",
    level: "A2",
    scenario: "weather",
    title: "Weather 聊天气",
    opening: "Hi! Lovely weather today, isn't it?",
    startTurnId: "ask-opinion",
    turns: {
      "ask-opinion": {
        id: "ask-opinion",
        prompt: "Right? So are you more of a summer or winter person?",
        promptTranslation: "对吧。你更喜欢夏天还是冬天？",
        branches: [
          { keywords: ["summer", "sun", "hot", "夏"], nextTurnId: "summer" },
          { keywords: ["winter", "cold", "snow", "冬"], nextTurnId: "winter" },
          { keywords: ["spring", "autumn", "fall", "春", "秋"], nextTurnId: "shoulder" },
        ],
        fallbackBranchId: "ask-opinion-repeat",
      },
      "ask-opinion-repeat": {
        id: "ask-opinion-repeat",
        prompt: "Sorry, summer or winter?",
        promptTranslation: "抱歉，夏天还是冬天？",
        branches: [
          { keywords: ["summer", "sun", "hot"], nextTurnId: "summer" },
          { keywords: ["winter", "cold", "snow"], nextTurnId: "winter" },
        ],
        fallbackBranchId: "ask-opinion-repeat",
      },
      "summer": {
        id: "summer",
        prompt: "Same here! Nothing beats a beach day. Do you have plans?",
        promptTranslation: "我也喜欢！海边最好。你有安排吗？",
        branches: [
          { keywords: ["yes", "trip", "vacation", "travel"], nextTurnId: "have-plans" },
          { keywords: ["no", "not yet", "maybe"], nextTurnId: "no-plans" },
        ],
        fallbackBranchId: "have-plans",
      },
      "winter": {
        id: "winter",
        prompt: "Cold here, hot drinks and books for me. Do you ski?",
        promptTranslation: "这边冷，我喜欢热饮配书。你滑雪吗？",
        branches: [
          { keywords: ["yes", "ski", "snowboard"], nextTurnId: "have-plans" },
          { keywords: ["no", "not", "never"], nextTurnId: "no-plans" },
        ],
        fallbackBranchId: "have-plans",
      },
      "shoulder": {
        id: "shoulder",
        prompt: "Lovely! Spring/autumn is the best — not too hot, not too cold.",
        promptTranslation: "好选择！春秋最好，不冷不热。",
        branches: [{ keywords: ["agree", "yes", "right", "对"], nextTurnId: "bye" }],
        fallbackBranchId: "bye",
      },
      "have-plans": {
        id: "have-plans",
        prompt: "Sounds fun! Hope it works out. Catch you later!",
        promptTranslation: "听起来不错！祝你玩得开心。再见！",
        branches: [],
        fallbackBranchId: "bye",
        isTerminal: true,
      },
      "no-plans": {
        id: "no-plans",
        prompt: "Maybe we should plan something together. Anyway, see you!",
        promptTranslation: "要不一起安排？不管怎样，再见！",
        branches: [],
        fallbackBranchId: "bye",
        isTerminal: true,
      },
    },
  },

  // ───────────────────────────────────────────────────────────
  //  Chinese — 问候
  // ───────────────────────────────────────────────────────────
  {
    id: "dlg-zh-greeting",
    language: "zh",
    level: "HSK1",
    scenario: "greeting",
    title: "问候",
    opening: "你好！很高兴认识你。",
    startTurnId: "ask-name",
    turns: {
      "ask-name": {
        id: "ask-name",
        prompt: "你叫什么名字？",
        promptTranslation: "What's your name?",
        branches: [
          { keywords: ["叫", "是", "我"], nextTurnId: "ask-from" },
        ],
        fallbackBranchId: "ask-name-repeat",
      },
      "ask-name-repeat": {
        id: "ask-name-repeat",
        prompt: "不好意思，你叫什么名字？",
        promptTranslation: "Sorry, what's your name?",
        branches: [
          { keywords: ["叫", "是"], nextTurnId: "ask-from" },
        ],
        fallbackBranchId: "ask-name-repeat",
      },
      "ask-from": {
        id: "ask-from",
        prompt: "你是哪国人？",
        promptTranslation: "Where are you from?",
        branches: [
          { keywords: ["中国", "大陆"], nextTurnId: "from-cn" },
          { keywords: ["美国", "america", "usa"], nextTurnId: "from-us" },
          { keywords: ["日本", "japan"], nextTurnId: "from-jp" },
          { keywords: ["韩国", "korea"], nextTurnId: "from-kr" },
        ],
        fallbackBranchId: "ask-from-repeat",
      },
      "ask-from-repeat": {
        id: "ask-from-repeat",
        prompt: "不好意思，你是哪国人？",
        promptTranslation: "Sorry, where are you from?",
        branches: [
          { keywords: ["中国"], nextTurnId: "from-cn" },
          { keywords: ["美国", "america"], nextTurnId: "from-us" },
          { keywords: ["日本"], nextTurnId: "from-jp" },
          { keywords: ["韩国"], nextTurnId: "from-kr" },
        ],
        fallbackBranchId: "ask-from-repeat",
      },
      "from-cn": {
        id: "from-cn",
        prompt: "中国人啊！那你中文一定很好了。我们可以用中文聊天！",
        promptTranslation: "Oh a Chinese person! Your Chinese must be great. Let's chat!",
        branches: [{ keywords: ["好", "嗯", "可以", "谢谢", "ok"], nextTurnId: "bye" }],
        fallbackBranchId: "bye",
      },
      "from-us": {
        id: "from-us",
        prompt: "美国人呀！你学中文多久了？",
        promptTranslation: "American! How long have you studied Chinese?",
        branches: [
          { keywords: ["一年", "1年", "one year"], nextTurnId: "bye" },
          { keywords: ["两年", "2年", "two"], nextTurnId: "bye" },
          { keywords: ["刚刚", "初学", "beginner"], nextTurnId: "bye" },
        ],
        fallbackBranchId: "bye",
      },
      "from-jp": {
        id: "from-jp",
        prompt: "日本人！那你一定对汉字很熟悉了。",
        promptTranslation: "Japanese! You must be familiar with kanji.",
        branches: [{ keywords: ["是", "对", "嗯", "好", "yes"], nextTurnId: "bye" }],
        fallbackBranchId: "bye",
      },
      "from-kr": {
        id: "from-kr",
        prompt: "韩国朋友！中日韩文化都很有趣啊。",
        promptTranslation: "Korean friend! Chinese/Japanese/Korean cultures are all interesting.",
        branches: [{ keywords: ["是", "对", "好", "yes"], nextTurnId: "bye" }],
        fallbackBranchId: "bye",
      },
      "bye": {
        id: "bye",
        prompt: "很高兴认识你，以后再聊！",
        promptTranslation: "Nice meeting you, let's talk again!",
        branches: [],
        fallbackBranchId: "bye",
        isTerminal: true,
      },
    },
  },

  // ───────────────────────────────────────────────────────────
  //  Chinese — 看医生
  // ───────────────────────────────────────────────────────────
  {
    id: "dlg-zh-doctor",
    language: "zh",
    level: "HSK3",
    scenario: "doctor",
    title: "看医生",
    opening: "你好，哪里不舒服？",
    startTurnId: "ask-symptom",
    turns: {
      "ask-symptom": {
        id: "ask-symptom",
        prompt: "这样多久了？",
        promptTranslation: "How long have you had this?",
        branches: [
          { keywords: ["天", "昨天", "今天", "day"], nextTurnId: "acute" },
          { keywords: ["周", "星期", "week"], nextTurnId: "chronic" },
          { keywords: ["月", "很久", "month"], nextTurnId: "chronic" },
        ],
        fallbackBranchId: "ask-symptom-repeat",
      },
      "ask-symptom-repeat": {
        id: "ask-symptom-repeat",
        prompt: "不好意思，这种情况多久了？",
        promptTranslation: "Sorry, how long?",
        branches: [
          { keywords: ["天"], nextTurnId: "acute" },
          { keywords: ["周", "月"], nextTurnId: "chronic" },
        ],
        fallbackBranchId: "ask-symptom-repeat",
      },
      "acute": {
        id: "acute",
        prompt: "发烧吗？",
        promptTranslation: "Do you have a fever?",
        branches: [
          { keywords: ["有", "发烧", "yes", "fever"], nextTurnId: "with-fever" },
          { keywords: ["没", "不", "no"], nextTurnId: "no-fever" },
        ],
        fallbackBranchId: "acute",
      },
      "chronic": {
        id: "chronic",
        prompt: "有一段时间了，我给你开些检查。",
        promptTranslation: "It's been a while, let me prescribe some tests.",
        branches: [
          { keywords: ["好", "谢谢", "ok", "thank"], nextTurnId: "bye" },
        ],
        fallbackBranchId: "bye",
      },
      "with-fever": {
        id: "with-fever",
        prompt: "这个药一天三次，多喝水，好好休息。",
        promptTranslation: "Take this medicine 3x a day, drink water, rest well.",
        branches: [
          { keywords: ["好", "谢谢", "ok"], nextTurnId: "bye" },
        ],
        fallbackBranchId: "bye",
      },
      "no-fever": {
        id: "no-fever",
        prompt: "那就好。给你一些含片，2-3 天会好。",
        promptTranslation: "That's good. Here are some lozenges, 2-3 days to recover.",
        branches: [
          { keywords: ["好", "谢谢", "ok"], nextTurnId: "bye" },
        ],
        fallbackBranchId: "bye",
      },
      "bye": {
        id: "bye",
        prompt: "保重。一周后没好转就来复诊。",
        promptTranslation: "Take care. Come back in a week if it doesn't get better.",
        branches: [],
        fallbackBranchId: "bye",
        isTerminal: true,
      },
    },
  },

  // ───────────────────────────────────────────────────────────
  //  Chinese — 聊天气
  // ───────────────────────────────────────────────────────────
  {
    id: "dlg-zh-weather",
    language: "zh",
    level: "HSK2",
    scenario: "weather",
    title: "聊天气",
    opening: "今天天气真好啊！",
    startTurnId: "ask-opinion",
    turns: {
      "ask-opinion": {
        id: "ask-opinion",
        prompt: "你最喜欢什么季节？",
        promptTranslation: "What's your favorite season?",
        branches: [
          { keywords: ["夏天", "summer", "热"], nextTurnId: "summer" },
          { keywords: ["冬天", "winter", "冷"], nextTurnId: "winter" },
          { keywords: ["春天", "spring"], nextTurnId: "spring" },
          { keywords: ["秋天", "autumn", "fall"], nextTurnId: "autumn" },
        ],
        fallbackBranchId: "ask-opinion-repeat",
      },
      "ask-opinion-repeat": {
        id: "ask-opinion-repeat",
        prompt: "不好意思，夏天还是冬天？",
        promptTranslation: "Sorry, summer or winter?",
        branches: [
          { keywords: ["夏", "热"], nextTurnId: "summer" },
          { keywords: ["冬", "冷"], nextTurnId: "winter" },
        ],
        fallbackBranchId: "ask-opinion-repeat",
      },
      "summer": {
        id: "summer",
        prompt: "我也喜欢夏天！你一般去哪里玩？",
        promptTranslation: "I like summer too! Where do you usually go?",
        branches: [
          { keywords: ["海", "沙滩", "beach"], nextTurnId: "beach" },
          { keywords: ["家", "宅", "stay"], nextTurnId: "stay-home" },
        ],
        fallbackBranchId: "beach",
      },
      "winter": {
        id: "winter",
        prompt: "冬天也很好啊！可以滑雪、吃火锅。",
        promptTranslation: "Winter is great too! Skiing, hotpot.",
        branches: [
          { keywords: ["滑雪", "ski", "火锅", "hotpot"], nextTurnId: "agree-winter" },
          { keywords: ["对", "是", "agree"], nextTurnId: "agree-winter" },
        ],
        fallbackBranchId: "agree-winter",
      },
      "spring": {
        id: "spring",
        prompt: "春天万物复苏，最适合出门了。",
        promptTranslation: "Spring is when everything revives, perfect for going out.",
        branches: [{ keywords: ["对", "是", "agree", "好"], nextTurnId: "bye" }],
        fallbackBranchId: "bye",
      },
      "autumn": {
        id: "autumn",
        prompt: "秋高气爽，景色最美。",
        promptTranslation: "Autumn, crisp and the most beautiful scenery.",
        branches: [{ keywords: ["对", "是", "agree", "好"], nextTurnId: "bye" }],
        fallbackBranchId: "bye",
      },
      "beach": {
        id: "beach",
        prompt: "海边真不错！有空一起去啊。再见！",
        promptTranslation: "Beach is great! Let's go together sometime. Bye!",
        branches: [],
        fallbackBranchId: "bye",
        isTerminal: true,
      },
      "stay-home": {
        id: "stay-home",
        prompt: "宅家也不错！空调 WiFi 西瓜。再见！",
        promptTranslation: "Staying home is good too! AC, WiFi, watermelon. Bye!",
        branches: [],
        fallbackBranchId: "bye",
        isTerminal: true,
      },
      "agree-winter": {
        id: "agree-winter",
        prompt: "对吧！改天一起去滑雪。再见！",
        promptTranslation: "Right! Let's go skiing sometime. Bye!",
        branches: [],
        fallbackBranchId: "bye",
        isTerminal: true,
      },
    },
  },

  // ───────────────────────────────────────────────────────────
  //  Japanese — 挨拶
  // ───────────────────────────────────────────────────────────
  {
    id: "dlg-ja-greeting",
    language: "ja",
    level: "N5",
    scenario: "greeting",
    title: "挨拶",
    opening: "こんにちは！はじめまして。",
    startTurnId: "ask-name",
    turns: {
      "ask-name": {
        id: "ask-name",
        prompt: "お名前は何ですか？",
        promptTranslation: "What's your name?",
        branches: [
          { keywords: ["です", "といいます", "name is"], nextTurnId: "ask-from" },
        ],
        fallbackBranchId: "ask-name-repeat",
      },
      "ask-name-repeat": {
        id: "ask-name-repeat",
        prompt: "すみません、もう一度お名前を教えてください。",
        promptTranslation: "Sorry, your name again?",
        branches: [
          { keywords: ["です", "といいます", "name is"], nextTurnId: "ask-from" },
        ],
        fallbackBranchId: "ask-name-repeat",
      },
      "ask-from": {
        id: "ask-from",
        prompt: "どちらから来ましたか？",
        promptTranslation: "Where are you from?",
        branches: [
          { keywords: ["中国", "china", "ちゅうごく"], nextTurnId: "from-cn" },
          { keywords: ["アメリカ", "usa", "america"], nextTurnId: "from-us" },
          { keywords: ["日本", "japan", "にほん"], nextTurnId: "from-jp" },
          { keywords: ["韓国", "korea", "かんこく"], nextTurnId: "from-kr" },
        ],
        fallbackBranchId: "ask-from-repeat",
      },
      "ask-from-repeat": {
        id: "ask-from-repeat",
        prompt: "すみません、どちらから？",
        promptTranslation: "Sorry, from where?",
        branches: [
          { keywords: ["中国"], nextTurnId: "from-cn" },
          { keywords: ["アメリカ"], nextTurnId: "from-us" },
          { keywords: ["日本"], nextTurnId: "from-jp" },
          { keywords: ["韓国"], nextTurnId: "from-kr" },
        ],
        fallbackBranchId: "ask-from-repeat",
      },
      "from-cn": {
        id: "from-cn",
        prompt: "中国からですね！日本語は上手ですね。",
        promptTranslation: "From China! Your Japanese is good.",
        branches: [{ keywords: ["ありがとう", "thank", "いいえ"], nextTurnId: "bye" }],
        fallbackBranchId: "bye",
      },
      "from-us": {
        id: "from-us",
        prompt: "アメリカから！日本語の勉強はどのくらい？",
        promptTranslation: "From the US! How long have you studied Japanese?",
        branches: [
          { keywords: ["一年", "1年", "one year"], nextTurnId: "bye" },
          { keywords: ["半年", "half"], nextTurnId: "bye" },
          { keywords: ["始めた", "beginner"], nextTurnId: "bye" },
        ],
        fallbackBranchId: "bye",
      },
      "from-jp": {
        id: "from-jp",
        prompt: "あ、日本の方ですね！失礼しました。",
        promptTranslation: "Oh, you're Japanese! Sorry.",
        branches: [{ keywords: ["はい", "yes", "大丈夫"], nextTurnId: "bye" }],
        fallbackBranchId: "bye",
      },
      "from-kr": {
        id: "from-kr",
        prompt: "韓国から！お会いできてうれしいです。",
        promptTranslation: "From Korea! Nice to meet you.",
        branches: [{ keywords: ["ありがとう", "thank", "はい"], nextTurnId: "bye" }],
        fallbackBranchId: "bye",
      },
      "bye": {
        id: "bye",
        prompt: "また会いましょう。さようなら！",
        promptTranslation: "Let's meet again. Bye!",
        branches: [],
        fallbackBranchId: "bye",
        isTerminal: true,
      },
    },
  },

  // ───────────────────────────────────────────────────────────
  //  Japanese — 病院 (hospital)
  // ───────────────────────────────────────────────────────────
  {
    id: "dlg-ja-hospital",
    language: "ja",
    level: "N4",
    scenario: "doctor",
    title: "病院",
    opening: "こんにちは。どうしましたか？",
    startTurnId: "ask-symptom",
    turns: {
      "ask-symptom": {
        id: "ask-symptom",
        prompt: "それはいつからですか？",
        promptTranslation: "Since when?",
        branches: [
          { keywords: ["今日", "昨日", "きのう", "today", "yesterday"], nextTurnId: "acute" },
          { keywords: ["週間", "週", "week"], nextTurnId: "chronic" },
          { keywords: ["ヶ月", "月", "month"], nextTurnId: "chronic" },
        ],
        fallbackBranchId: "ask-symptom-repeat",
      },
      "ask-symptom-repeat": {
        id: "ask-symptom-repeat",
        prompt: "すみません、いつからですか？",
        promptTranslation: "Sorry, since when?",
        branches: [
          { keywords: ["今日", "昨日"], nextTurnId: "acute" },
          { keywords: ["週間", "月"], nextTurnId: "chronic" },
        ],
        fallbackBranchId: "ask-symptom-repeat",
      },
      "acute": {
        id: "acute",
        prompt: "熱はありますか？",
        promptTranslation: "Do you have a fever?",
        branches: [
          { keywords: ["はい", "ある", "yes", "fever"], nextTurnId: "with-fever" },
          { keywords: ["いいえ", "ない", "no"], nextTurnId: "no-fever" },
        ],
        fallbackBranchId: "acute",
      },
      "chronic": {
        id: "chronic",
        prompt: "長いですね。検査をしましょう。",
        promptTranslation: "It's been a while. Let's do some tests.",
        branches: [
          { keywords: ["はい", "おねがい", "ok", "thank"], nextTurnId: "bye" },
        ],
        fallbackBranchId: "bye",
      },
      "with-fever": {
        id: "with-fever",
        prompt: "一日三回、食後に飲んでください。",
        promptTranslation: "Take this 3x a day after meals.",
        branches: [
          { keywords: ["ありがとう", "thank", "ok"], nextTurnId: "bye" },
        ],
        fallbackBranchId: "bye",
      },
      "no-fever": {
        id: "no-fever",
        prompt: "それはよかった。うがい薬を出します。",
        promptTranslation: "That's good. Here's some gargle medicine.",
        branches: [
          { keywords: ["ありがとう", "thank", "ok"], nextTurnId: "bye" },
        ],
        fallbackBranchId: "bye",
      },
      "bye": {
        id: "bye",
        prompt: "お大事に。一週間後にもう一度来てください。",
        promptTranslation: "Take care. Please come back in a week.",
        branches: [],
        fallbackBranchId: "bye",
        isTerminal: true,
      },
    },
  },

  // ───────────────────────────────────────────────────────────
  //  Japanese — 天気
  // ───────────────────────────────────────────────────────────
  {
    id: "dlg-ja-weather",
    language: "ja",
    level: "N5",
    scenario: "weather",
    title: "天気",
    opening: "今日はいい天気ですね！",
    startTurnId: "ask-season",
    turns: {
      "ask-season": {
        id: "ask-season",
        prompt: "どの季節が一番好きですか？",
        promptTranslation: "Which season do you like most?",
        branches: [
          { keywords: ["夏", "summer", "なつ"], nextTurnId: "summer" },
          { keywords: ["冬", "winter", "ふゆ"], nextTurnId: "winter" },
          { keywords: ["春", "spring", "はる"], nextTurnId: "spring" },
          { keywords: ["秋", "autumn", "あき"], nextTurnId: "autumn" },
        ],
        fallbackBranchId: "ask-season-repeat",
      },
      "ask-season-repeat": {
        id: "ask-season-repeat",
        prompt: "すみません、夏と冬どちらが好き？",
        promptTranslation: "Sorry, summer or winter?",
        branches: [
          { keywords: ["夏", "なつ"], nextTurnId: "summer" },
          { keywords: ["冬", "ふゆ"], nextTurnId: "winter" },
        ],
        fallbackBranchId: "ask-season-repeat",
      },
      "summer": {
        id: "summer",
        prompt: "夏がいい！海に行きますか？",
        promptTranslation: "Summer! Do you go to the beach?",
        branches: [
          { keywords: ["はい", "行く", "yes"], nextTurnId: "bye" },
          { keywords: ["いいえ", "no"], nextTurnId: "bye" },
        ],
        fallbackBranchId: "bye",
      },
      "winter": {
        id: "winter",
        prompt: "冬がいい！スキーに行きますか？",
        promptTranslation: "Winter! Do you ski?",
        branches: [
          { keywords: ["はい", "行く", "yes"], nextTurnId: "bye" },
          { keywords: ["いいえ", "no"], nextTurnId: "bye" },
        ],
        fallbackBranchId: "bye",
      },
      "spring": {
        id: "spring",
        prompt: "春は桜がきれいです！",
        promptTranslation: "Spring cherry blossoms are beautiful!",
        branches: [{ keywords: ["はい", "きれい", "yes", "そう"], nextTurnId: "bye" }],
        fallbackBranchId: "bye",
      },
      "autumn": {
        id: "autumn",
        prompt: "秋は紅葉がきれいです！",
        promptTranslation: "Autumn leaves are beautiful!",
        branches: [{ keywords: ["はい", "きれい", "yes", "そう"], nextTurnId: "bye" }],
        fallbackBranchId: "bye",
      },
      "bye": {
        id: "bye",
        prompt: "また話しましょう。さようなら！",
        promptTranslation: "Let's talk again. Bye!",
        branches: [],
        fallbackBranchId: "bye",
        isTerminal: true,
      },
    },
  },

  // ───────────────────────────────────────────────────────────
  //  Cantonese — 打招呼
  // ───────────────────────────────────────────────────────────
  {
    id: "dlg-yue-greeting",
    language: "yue",
    level: "初级",
    scenario: "greeting",
    title: "打招呼",
    opening: "你好！好高興認識你。",
    startTurnId: "ask-name",
    turns: {
      "ask-name": {
        id: "ask-name",
        prompt: "你叫咩名呀？",
        promptTranslation: "What's your name?",
        branches: [
          { keywords: ["叫", "係", "我"], nextTurnId: "ask-from" },
        ],
        fallbackBranchId: "ask-name-repeat",
      },
      "ask-name-repeat": {
        id: "ask-name-repeat",
        prompt: "唔好意思，你叫咩名？",
        promptTranslation: "Sorry, what's your name?",
        branches: [
          { keywords: ["叫", "係"], nextTurnId: "ask-from" },
        ],
        fallbackBranchId: "ask-name-repeat",
      },
      "ask-from": {
        id: "ask-from",
        prompt: "你係邊度人？",
        promptTranslation: "Where are you from?",
        branches: [
          { keywords: ["香港", "hong kong", "hk"], nextTurnId: "from-hk" },
          { keywords: ["廣州", "guangzhou", "gd"], nextTurnId: "from-gd" },
          { keywords: ["中國", "china"], nextTurnId: "from-cn" },
          { keywords: ["外國", "外國人", "foreign"], nextTurnId: "from-foreign" },
        ],
        fallbackBranchId: "ask-from-repeat",
      },
      "ask-from-repeat": {
        id: "ask-from-repeat",
        prompt: "唔好意思，邊度人？",
        promptTranslation: "Sorry, from where?",
        branches: [
          { keywords: ["香港"], nextTurnId: "from-hk" },
          { keywords: ["廣州"], nextTurnId: "from-gd" },
          { keywords: ["外國"], nextTurnId: "from-foreign" },
        ],
        fallbackBranchId: "ask-from-repeat",
      },
      "from-hk": {
        id: "from-hk",
        prompt: "香港人呀！咁我哋可以用廣東話傾偈啦！",
        promptTranslation: "Hong Konger! We can chat in Cantonese!",
        branches: [{ keywords: ["好", "係", "yes", "ok"], nextTurnId: "bye" }],
        fallbackBranchId: "bye",
      },
      "from-gd": {
        id: "from-gd",
        prompt: "廣州朋友！你學粵語幾耐啦？",
        promptTranslation: "Guangzhou friend! How long have you studied Cantonese?",
        branches: [
          { keywords: ["一年", "1年", "one year"], nextTurnId: "bye" },
          { keywords: ["半年", "half"], nextTurnId: "bye" },
          { keywords: ["初學", "beginner"], nextTurnId: "bye" },
        ],
        fallbackBranchId: "bye",
      },
      "from-cn": {
        id: "from-cn",
        prompt: "普通話朋友！你嘅粵語已經講得好好啦。",
        promptTranslation: "Mandarin speaker! Your Cantonese is already good.",
        branches: [{ keywords: ["多謝", "thank", "好"], nextTurnId: "bye" }],
        fallbackBranchId: "bye",
      },
      "from-foreign": {
        id: "from-foreign",
        prompt: "外國朋友！學粵語好叻喎，繼續努力！",
        promptTranslation: "Foreign friend! Studying Cantonese is impressive, keep going!",
        branches: [{ keywords: ["多謝", "thank", "好", "yes"], nextTurnId: "bye" }],
        fallbackBranchId: "bye",
      },
      "bye": {
        id: "bye",
        prompt: "好開心識到你，下次再傾！",
        promptTranslation: "Nice to meet you, let's chat again!",
        branches: [],
        fallbackBranchId: "bye",
        isTerminal: true,
      },
    },
  },

  // ───────────────────────────────────────────────────────────
  //  Cantonese — 睇醫生
  // ───────────────────────────────────────────────────────────
  {
    id: "dlg-yue-doctor",
    language: "yue",
    level: "中级",
    scenario: "doctor",
    title: "睇醫生",
    opening: "你好，你邊度唔舒服？",
    startTurnId: "ask-symptom",
    turns: {
      "ask-symptom": {
        id: "ask-symptom",
        prompt: "咁樣幾耐啦？",
        promptTranslation: "How long?",
        branches: [
          { keywords: ["日", "今日", "尋日", "today", "yesterday"], nextTurnId: "acute" },
          { keywords: ["星期", "週", "week"], nextTurnId: "chronic" },
          { keywords: ["月", "month"], nextTurnId: "chronic" },
        ],
        fallbackBranchId: "ask-symptom-repeat",
      },
      "ask-symptom-repeat": {
        id: "ask-symptom-repeat",
        prompt: "唔好意思，幾耐啦？",
        promptTranslation: "Sorry, how long?",
        branches: [
          { keywords: ["日"], nextTurnId: "acute" },
          { keywords: ["星期", "月"], nextTurnId: "chronic" },
        ],
        fallbackBranchId: "ask-symptom-repeat",
      },
      "acute": {
        id: "acute",
        prompt: "有冇發燒？",
        promptTranslation: "Do you have a fever?",
        branches: [
          { keywords: ["有", "係", "yes"], nextTurnId: "with-fever" },
          { keywords: ["冇", "唔係", "no"], nextTurnId: "no-fever" },
        ],
        fallbackBranchId: "acute",
      },
      "chronic": {
        id: "chronic",
        prompt: "有啲耐喎，我幫你做啲檢查先。",
        promptTranslation: "It's been a while, let me do some tests.",
        branches: [
          { keywords: ["好", "多謝", "ok", "thank"], nextTurnId: "bye" },
        ],
        fallbackBranchId: "bye",
      },
      "with-fever": {
        id: "with-fever",
        prompt: "一日食三次，食完飯食。多飲水。",
        promptTranslation: "Take 3x a day after meals. Drink lots of water.",
        branches: [
          { keywords: ["好", "多謝", "ok"], nextTurnId: "bye" },
        ],
        fallbackBranchId: "bye",
      },
      "no-fever": {
        id: "no-fever",
        prompt: "冇發燒就好。俾啲含片你，兩三日會好。",
        promptTranslation: "No fever is good. Here are lozenges, recover in 2-3 days.",
        branches: [
          { keywords: ["好", "多謝", "ok"], nextTurnId: "bye" },
        ],
        fallbackBranchId: "bye",
      },
      "bye": {
        id: "bye",
        prompt: "保重身體。一個禮拜後再返嚟睇吓。",
        promptTranslation: "Take care. Come back in a week.",
        branches: [],
        fallbackBranchId: "bye",
        isTerminal: true,
      },
    },
  },
  // AUTO-GENERATED: dlg-en-hotel (en/hotel)
  {"id":"dlg-en-hotel","language":"en","level":"A2","scenario":"hotel","title":"Hotel check-in","opening":"Welcome to Hotel Sunrise! Do you have a reservation?","startTurnId":"ask-name","turns":{"ask-name":{"id":"ask-name","prompt":"Great. May I have your name, please?","promptTranslation":"好的，请告诉我您的名字。","branches":[{"keywords":["name","my name","i'm","im"],"nextTurnId":"ask-id"}],"fallbackBranchId":"ask-name-repeat"},"ask-name-repeat":{"id":"ask-name-repeat","prompt":"Sorry, I didn't catch that. Your name?","promptTranslation":"抱歉，请再说一次您的名字？","branches":[{"keywords":["name","i'm","im"],"nextTurnId":"ask-id"}],"fallbackBranchId":"ask-name-repeat"},"ask-id":{"id":"ask-id","prompt":"Thanks. May I see your ID, please?","promptTranslation":"谢谢，可以看一下您的身份证件吗？","branches":[{"keywords":["yes","sure","ok","here"],"nextTurnId":"ask-room"}],"fallbackBranchId":"ask-id"},"ask-room":{"id":"ask-room","prompt":"You're in room 305. Breakfast is included. Enjoy your stay!","promptTranslation":"您的房间是 305，含早餐。祝您入住愉快！","branches":[{"keywords":["thank","thanks","ok"],"nextTurnId":"bye"}],"fallbackBranchId":"bye"},"bye":{"id":"bye","prompt":"Welcome! The elevator is on your left.","promptTranslation":"欢迎入住！电梯在左手边。","branches":[],"fallbackBranchId":"bye","isTerminal":true}}},
];

/** Get all scenes for a language (falls back to English if none). */
export function getDialogueScenes(language: Language): DialogueScene[] {
  const matches = DIALOGUE_SCENES.filter((s) => s.language === language);
  if (matches.length > 0) return matches;
  // Fallback: show English scenes so the tab isn't empty for languages
  // we haven't authored yet.
  return DIALOGUE_SCENES.filter((s) => s.language === "en");
}
