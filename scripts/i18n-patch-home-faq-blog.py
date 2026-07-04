#!/usr/bin/env python3
"""
Inject `home.steps / stories / faq / blog / cta` into 6 locale files
(zh / ja / ko / de / es / fr) so that the homepage is fully i18n'd
and does not fall back to English for non-en visitors.

Source of truth: en/translation.json (read in-script).
"""
import json
import os
import re
from pathlib import Path

ROOT = Path("/workspace/src/locales")
LANGS = ["zh", "ja", "ko", "de", "es", "fr"]


def load(p: Path):
    with p.open("r", encoding="utf-8") as f:
        return json.load(f)


def save(p: Path, data):
    # 2-space indent + ensure_ascii=False so CJK reads in PRs
    with p.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")


# ----------------------------------------------------------------------------
# Translations. Keys mirror en/translation.json shape exactly.
# ----------------------------------------------------------------------------
TRANSLATIONS = {
    "zh": {
        "steps": {
            "badge": "方法论",
            "title": "从入门到流利，只需经过这 3 步",
            "desc": "每位学习者起点不同，但通往流利的路径始终一致：输入、输出、反馈。LangOria 把这条闭环浓缩成每天 10 分钟的仪式。",
            "items": [
                { "title": "精准测评起点", "desc": "选择目标语言与起始等级，我们根据你已知的内容生成个性化路径。" },
                { "title": "每日 10 分钟闭环", "desc": "词汇 + 语法 + 听力 + 口语，由间隔重复科学排布，让记忆真正留存。" },
                { "title": "开口即自信", "desc": "跟读真实句子，获得即时反馈，用连续天数让习惯持续燃烧。" }
            ]
        },
        "stories": {
            "badge": "学员故事",
            "title": "真实的进步，真实的人",
            "desc": "听听那些把每天 10 分钟变成真正可用语言能力的学习者怎么说。",
            "items": [
                { "name": "Yuki，27 岁", "role": "市场经理 · 东京", "quote": "我之前试过三款应用，LangOria 是唯一让我每天都会打开的。连续打卡机制真的有效。" },
                { "name": "Carlos，34 岁", "role": "软件工程师 · 马德里", "quote": "语法讲解又短又清晰。通勤路上三个月，我就从 A2 升到了 B1。" },
                { "name": "小美，22 岁", "role": "大学生 · 上海", "quote": "界面是中文，单词却是日语，这种「为我而做」的感觉太棒了。" }
            ]
        },
        "faq": {
            "badge": "常见问题",
            "title": "高频问题，清晰解答",
            "desc": "开始之前你需要知道的一切。",
            "viewAll": "查看全部问题",
            "items": [
                { "q": "LangOria 真的免费吗？", "a": "是的。核心学习体验——词汇、语法、听力、口语与社区——全部免费。高级功能将稍后为深度用户上线。" },
                { "q": "需要安装任何东西吗？", "a": "不需要。LangOria 在任何现代浏览器中直接运行。Web 版稳定后，我们会推出移动 App。" },
                { "q": "支持哪些语言？", "a": "英语、日语、韩语、中文、西班牙语、法语和德语。我们会基于学员需求每月新增语言。" },
                { "q": "多久能看到进步？", "a": "坚持 10 分钟闭环的大多数学员，4-6 周就能感受到明显变化。连续打卡 + 间隔重复就是为这个习惯而设计的。" },
                { "q": "手机能用吗？", "a": "可以。站点完全响应式，在手机浏览器上体验极佳。把它加到主屏幕，即可获得类 App 的体验。" }
            ]
        },
        "blog": {
            "badge": "博客精选",
            "title": "方法、攻略与学习科学",
            "desc": "短小精悍的文章，让你的每一分钟学习都更有效。",
            "viewAll": "全部文章 →",
            "readMore": "阅读全文",
            "items": [
                { "tag": "方法", "title": "为什么每天 10 分钟胜过周末 2 小时", "excerpt": "间隔重复是学习科学中研究最充分的方法。告诉你为什么短而频繁的练习胜过一次性死记硬背。" },
                { "tag": "词汇", "title": "不崩溃地记住 1000 个单词", "excerpt": "一份基于 3-2-1 法则的 8 周实操计划，覆盖英语、日语和西班牙语三语示例。" },
                { "tag": "口语", "title": "跟读：真正有效的口语训练", "excerpt": "为什么复述母语者音频是纠正发音的最快方式，以及今天就能开始的 5 步流程。" }
            ]
        },
        "cta": {
            "title": "开启你的 10 分钟每日仪式",
            "desc": "永久免费，无需信用卡。随时取消——但你大概率不会。",
            "start": "创建免费账户",
            "browse": "先看看课程"
        }
    },
    "ja": {
        "steps": {
            "badge": "学習メソッド",
            "title": "初級から流暢へ、3 ステップの最短ルート",
            "desc": "学習者ごとに違っても、流暢への道はいつも同じ：インプット・アウトプット・フィードバック。LangOria はそのループを 10 分の日課に変えます。",
            "items": [
                { "title": "レベルを診断", "desc": "目標言語と開始レベルを選ぶだけで、既に知っている内容をもとに個別最適化された学習パスを生成します。" },
                { "title": "毎日 10 分のループ", "desc": "語彙 + 文法 + リスニング + スピーキング。間隔反復で配置し、確実に記憶へ。" },
                { "title": "自信を持って話す", "desc": "リアルな文をシャドーイングし、即時フィードバックを得て、連続日数で習慣を続けます。" }
            ]
        },
        "stories": {
            "badge": "学習者の声",
            "title": "リアルな成長、リアルな人",
            "desc": "10 分の日課を「実際に使える言語」に変えた学習者の声をお届けします。",
            "items": [
                { "name": "Yuki、27 歳", "role": "マーケティングマネージャー · 東京", "quote": "三つのアプリを試しましたが、LangOria だけが毎日開きたくなるアプリでした。連続日数の仕組みが効きます。" },
                { "name": "Carlos、34 歳", "role": "ソフトウェアエンジニア · マドリード", "quote": "文法解説が短く明快。通勤の 3 ヶ月で A2 から B1 に上がりました。" },
                { "name": "メイ、22 歳", "role": "大学生 · 上海", "quote": "UI は中国語で、単語は日本語。私のために作られている感じが最高です。" }
            ]
        },
        "faq": {
            "badge": "よくある質問",
            "title": "よくある疑問に、明確な回答を",
            "desc": "始める前に知っておくべきこと、すべて。",
            "viewAll": "すべての質問を見る",
            "items": [
                { "q": "LangOria は本当に無料ですか？", "a": "はい。語彙・文法・リスニング・スピーキング・コミュニティなどの中核学習体験は無料です。プレミアム機能は上級者向けに後から追加されます。" },
                { "q": "インストールは必要ですか？", "a": "不要です。LangOria はモダンブラウザで動作します。Web 版が安定し次第、モバイルアプリも提供予定です。" },
                { "q": "対応言語は？", "a": "英語、日本語、韓国語、中国語、スペイン語、フランス語、ドイツ語です。学習者の要望に応じて毎月追加しています。" },
                { "q": "効果はいつ頃から実感できますか？", "a": "10 分の日課を続けた方の多くは 4〜6 週間で明確な手応えを感じます。連続日数と間隔反復がその継続を後押しします。" },
                { "q": "スマホでも使えますか？", "a": "はい。サイトは完全レスポンシブで、モバイルブラウザでも快適に使えます。ホーム画面に追加すればアプリ感覚で利用できます。" }
            ]
        },
        "blog": {
            "badge": "ブログより",
            "title": "ヒント・攻略・学習科学",
            "desc": "短い時間で効果を最大化する、珠玉の記事たち。",
            "viewAll": "すべての記事 →",
            "readMore": "続きを読む",
            "items": [
                { "tag": "メソッド", "title": "週末 2 時間より毎日 10 分が効く理由", "excerpt": "間隔反復は学習科学で最も研究された技法。短時間×高頻度が詰め込み勉強に勝つ理由を解説。" },
                { "tag": "語彙", "title": "1000 語を燃え尽きずに覚える方法", "excerpt": "3-2-1 ルールに基づく 8 週間プラン。英語・日本語・スペイン語の例で具体的に紹介。" },
                { "tag": "スピーキング", "title": "本当に効くシャドーイングという発声練習", "excerpt": "ネイティブ音声の復唱が発音を劇的に直す理由と、今日から始められる 5 ステップ。" }
            ]
        },
        "cta": {
            "title": "10 分の日課を始めましょう",
            "desc": "ずっと無料。クレジットカード不要。いつでも解約できます——でも、きっとやめないはず。",
            "start": "無料アカウントを作成",
            "browse": "まずはコースを見る"
        }
    },
    "ko": {
        "steps": {
            "badge": "학습 방법",
            "title": "입문에서 유창함까지, 검증된 3단계 경로",
            "desc": "학습자마다 다르지만, 유창함으로 가는 길은 항상 같습니다: 입력, 출력, 피드백. LangOria는 이 루프를 매일 10분의 의식으로 바꿔줍니다.",
            "items": [
                { "title": "레벨 진단", "desc": "목표 언어와 시작 레벨을 고르면 이미 아는 것을 바탕으로 개인 맞춤 경로를 만들어 드립니다." },
                { "title": "매일 10분 루프", "desc": "어휘 + 문법 + 듣기 + 말하기, 간격 반복으로 배치해 진짜 기억에 남도록 합니다." },
                { "title": "자신 있게 말하기", "desc": "실제 문장을 따라 읽고, 즉각적인 피드백을 받고, 연속 일수로 습관을 이어가세요." }
            ]
        },
        "stories": {
            "badge": "학습자 후기",
            "title": "진짜 성장, 진짜 사람들",
            "desc": "10분의 일상을 진짜 쓸 수 있는 언어로 바꾼 학습자들의 이야기를 들어보세요.",
            "items": [
                { "name": "Yuki, 27세", "role": "마케팅 매니저 · 도쿄", "quote": "세 개의 앱을 써봤지만 LangOria가 유일하게 매일 열게 만든 앱이에요. 연속 일수 시스템이 진짜 작동합니다." },
                { "name": "Carlos, 34세", "role": "소프트웨어 엔지니어 · 마드리드", "quote": "문법 설명이 짧고 명확해요. 출퇴근길 3개월 만에 A2에서 B1으로 올라갔습니다." },
                { "name": "메이, 22세", "role": "대학생 · 상하이", "quote": "인터페이스는 중국어, 단어는 일본어. 마치 나를 위해 만들어진 것 같은 느낌이 들어요." }
            ]
        },
        "faq": {
            "badge": "자주 묻는 질문",
            "title": "자주 묻는 질문, 명확한 답변",
            "desc": "시작하기 전에 알아야 할 모든 것.",
            "viewAll": "모든 질문 보기",
            "items": [
                { "q": "LangOria는 정말 무료인가요?", "a": "네. 어휘, 문법, 듣기, 말하기, 커뮤니티 등 핵심 학습 경험은 무료입니다. 프리미엄 기능은 파워 유저를 위해 추후 추가될 예정이에요." },
                { "q": "설치해야 할 것이 있나요?", "a": "아니요. LangOria는 모든 최신 브라우저에서 동작합니다. 웹 버전이 안정화되면 모바일 앱도 제공될 예정이에요." },
                { "q": "어떤 언어를 지원하나요?", "a": "영어, 일본어, 한국어, 중국어, 스페인어, 프랑스어, 독일어를 지원합니다. 매월 학습자 수요에 따라 언어를 추가하고 있어요." },
                { "q": "얼마나 지나야 효과를 느끼나요?", "a": "10분 일상을 꾸준히 이어간 학습자 대부분이 4~6주 안에 분명한 변화를 느껴요. 연속 일수와 간격 반복이 바로 그 습관을 지탱하도록 설계되어 있습니다." },
                { "q": "휴대폰에서도 사용할 수 있나요?", "a": "네. 사이트는 완전 반응형으로 모바일 브라우저에서도 잘 작동합니다. 홈 화면에 추가하면 앱처럼 사용할 수 있어요." }
            ]
        },
        "blog": {
            "badge": "블로그에서",
            "title": "팁, 가이드, 학습 과학",
            "desc": "짧고 임팩트 있는 글들로 학습 시간을 더 효과적으로.",
            "viewAll": "모든 글 보기 →",
            "readMore": "더 읽기",
            "items": [
                { "tag": "학습법", "title": "주말 2시간보다 매일 10분이 좋은 이유", "excerpt": "간격 반복은 학습 과학에서 가장 많이 연구된 기법. 짧고 빈번한 세션이 오래 몰아치는 공부를 이기는 이유." },
                { "tag": "어휘", "title": "타고 남김 없이 1000단어 외우기", "excerpt": "3-2-1 규칙에 기반한 8주 실행 계획. 영어, 일본어, 스페인어 예시로 설명." },
                { "tag": "말하기", "title": "실제 효과가 있는 따라 말하기 훈련", "excerpt": "원어민 음성 반복이 발음을 고치는 가장 빠른 이유, 그리고 오늘부터 시작할 수 있는 5단계 루틴." }
            ]
        },
        "cta": {
            "title": "10분 일상을 시작해 보세요",
            "desc": "영원히 무료. 신용카드 없음. 원할 때 해지하세요 — 아마 그럴 일은 없겠지만요.",
            "start": "무료 계정 만들기",
            "browse": "코스 먼저 둘러보기"
        }
    },
    "de": {
        "steps": {
            "badge": "So funktioniert's",
            "title": "Ein bewährter 3-Schritte-Weg vom Anfänger zum fließenden Sprecher",
            "desc": "Jeder Lernende ist anders, aber der Weg zur Sprachgewandtheit ist immer gleich: Input, Output, Feedback. LangOria macht aus diesem Kreislauf ein tägliches 10-Minuten-Ritual.",
            "items": [
                { "title": "Diagnostiziere dein Niveau", "desc": "Wähle Zielsprache und Startniveau. Wir bauen einen personalisierten Pfad auf dem, was du bereits kannst." },
                { "title": "Tägliche 10-Minuten-Schleife", "desc": "Vokabeln + Grammatik + Hören + Sprechen, geplant durch Spaced Repetition, damit es wirklich hängen bleibt." },
                { "title": "Sprich mit Selbstvertrauen", "desc": "Schaue echte Sätze nach, erhalte sofort Feedback und halte den Streak am Leben." }
            ]
        },
        "stories": {
            "badge": "Lernende erzählen",
            "title": "Echter Fortschritt, echte Menschen",
            "desc": "Höre von Lernenden, die aus 10 Minuten pro Tag eine Sprache gemacht haben, die sie wirklich benutzen können.",
            "items": [
                { "name": "Yuki, 27", "role": "Marketing-Managerin · Tokio", "quote": "Ich habe drei Apps ausprobiert. LangOria ist die einzige, die ich jeden Tag öffne. Das Streak-System wirkt." },
                { "name": "Carlos, 34", "role": "Software-Ingenieur · Madrid", "quote": "Die Grammatik-Erklärungen sind kurz und klar. In drei Monaten Pendelzeit bin ich von A2 auf B1 gekommen." },
                { "name": "Mei, 22", "role": "Studentin · Shanghai", "quote": "Die Oberfläche ist auf Chinesisch, die Wörter sind Japanisch. Es fühlt sich an, als wäre die App für mich gemacht." }
            ]
        },
        "faq": {
            "badge": "FAQ",
            "title": "Häufige Fragen, klare Antworten",
            "desc": "Alles, was du vor dem Start wissen solltest.",
            "viewAll": "Alle Fragen ansehen",
            "items": [
                { "q": "Ist LangOria wirklich kostenlos?", "a": "Ja. Das gesamte Lernerlebnis — Vokabeln, Grammatik, Hören, Sprechen und Community — ist kostenlos. Premium-Funktionen folgen später für Power-User." },
                { "q": "Muss ich etwas installieren?", "a": "Nein. LangOria läuft in jedem modernen Browser. Mobile Apps folgen, sobald die Web-Version stabil ist." },
                { "q": "Welche Sprachen werden unterstützt?", "a": "Englisch, Japanisch, Koreanisch, Chinesisch, Spanisch, Französisch und Deutsch. Jeden Monat kommen neue Sprachen hinzu." },
                { "q": "Wann sehe ich Fortschritte?", "a": "Die meisten Lernenden spüren in 4–6 Wochen einen klaren Unterschied, wenn sie bei der 10-Minuten-Routine bleiben." },
                { "q": "Kann ich es auf dem Handy nutzen?", "a": "Ja. Die Seite ist vollständig responsiv und funktioniert auf mobilen Browsern hervorragend. Auf den Startbildschirm legen — fertig ist das App-Gefühl." }
            ]
        },
        "blog": {
            "badge": "Aus dem Blog",
            "title": "Tipps, Anleitungen und Lernwissenschaft",
            "desc": "Kompakte Artikel, die deine Lernzeit effektiver machen.",
            "viewAll": "Alle Artikel →",
            "readMore": "Weiterlesen",
            "items": [
                { "tag": "Methoden", "title": "Warum 10 Minuten am Tag besser sind als 2 Stunden am Wochenende", "excerpt": "Spaced Repetition ist die am besten erforschte Lerntechnik. Warum kurze, häufige Einheiten langes Bulimie-Lernen schlagen." },
                { "tag": "Vokabeln", "title": "1000 Wörter merken — ohne auszubrennen", "excerpt": "Ein praxisnaher 8-Wochen-Plan nach der 3-2-1-Regel, mit Beispielen aus Englisch, Japanisch und Spanisch." },
                { "tag": "Sprechen", "title": "Shadowing: die Sprechübung, die wirklich wirkt", "excerpt": "Warum das Nachsprechen nativer Audios der schnellste Weg zur besseren Aussprache ist — plus 5-Schritte-Routine für den Start." }
            ]
        },
        "cta": {
            "title": "Starte dein tägliches 10-Minuten-Ritual",
            "desc": "Für immer kostenlos. Keine Kreditkarte. Jederzeit kündbar — aber das wirst du wahrscheinlich nicht.",
            "start": "Kostenloses Konto erstellen",
            "browse": "Erst Kurse ansehen"
        }
    },
    "es": {
        "steps": {
            "badge": "Cómo funciona",
            "title": "Un camino probado en 3 pasos de principiante a fluido",
            "desc": "Cada aprendiz es distinto, pero el camino hacia la fluidez siempre es el mismo: input, output y feedback. LangOria convierte ese ciclo en un ritual diario de 10 minutos.",
            "items": [
                { "title": "Diagnostica tu nivel", "desc": "Elige tu idioma objetivo y tu nivel de partida. Creamos una ruta personalizada según lo que ya sabes." },
                { "title": "Bucle diario de 10 minutos", "desc": "Vocabulario + gramática + escucha + habla, programados por repetición espaciada para que lo aprendido permanezca." },
                { "title": "Habla con confianza", "desc": "Repite frases reales, recibe feedback al instante y mantén tu racha viva." }
            ]
        },
        "stories": {
            "badge": "Historias de aprendices",
            "title": "Progreso real, personas reales",
            "desc": "Escucha a aprendices que convirtieron un hábito diario de 10 minutos en un idioma que realmente pueden usar.",
            "items": [
                { "name": "Yuki, 27", "role": "Responsable de marketing · Tokio", "quote": "Probé tres apps antes. LangOria es la única que abro cada día. El sistema de rachas funciona." },
                { "name": "Carlos, 34", "role": "Ingeniero de software · Madrid", "quote": "Las explicaciones de gramática son cortas y claras. Pasé de A2 a B1 en tres meses yendo al trabajo." },
                { "name": "Mei, 22", "role": "Estudiante universitaria · Shanghái", "quote": "Me encanta que la interfaz esté en chino pero las palabras en japonés. Se siente como si la app me conociera." }
            ]
        },
        "faq": {
            "badge": "FAQ",
            "title": "Preguntas frecuentes, respuestas claras",
            "desc": "Todo lo que necesitas saber antes de empezar.",
            "viewAll": "Ver todas las preguntas",
            "items": [
                { "q": "¿LangOria es realmente gratis?", "a": "Sí. La experiencia central — vocabulario, gramática, escucha, habla y la comunidad — es gratuita. Las funciones premium se añadirán más adelante para usuarios avanzados." },
                { "q": "¿Necesito instalar algo?", "a": "No. LangOria funciona en cualquier navegador moderno. Las apps móviles llegarán cuando la versión web se estabilice." },
                { "q": "¿Qué idiomas están soportados?", "a": "Inglés, japonés, coreano, chino, español, francés y alemán. Cada mes añadimos nuevos idiomas según la demanda." },
                { "q": "¿Cuánto tarda en notarse el progreso?", "a": "La mayoría de los aprendices nota una diferencia clara en 4–6 semanas si mantiene la rutina de 10 minutos. El sistema de rachas y la repetición espaciada están diseñados para que el hábito se mantenga." },
                { "q": "¿Puedo usarlo en el móvil?", "a": "Sí. El sitio es totalmente responsivo y funciona muy bien en navegadores móviles. Añádelo a la pantalla de inicio para tener una experiencia tipo app." }
            ]
        },
        "blog": {
            "badge": "Desde el blog",
            "title": "Consejos, guías y ciencia del aprendizaje",
            "desc": "Artículos breves que hacen tu tiempo de estudio más efectivo.",
            "viewAll": "Todos los artículos →",
            "readMore": "Leer más",
            "items": [
                { "tag": "Métodos", "title": "Por qué 10 minutos al día ganan a 2 horas el fin de semana", "excerpt": "La repetición espaciada es la técnica más investigada en la ciencia del aprendizaje. Por qué las sesiones cortas y frecuentes superan al estudio maratoniano." },
                { "tag": "Vocabulario", "title": "Cómo recordar 1000 palabras sin quemarte", "excerpt": "Un plan práctico de 8 semanas basado en la regla 3-2-1, con ejemplos en inglés, japonés y español." },
                { "tag": "Speaking", "title": "Shadowing: el ejercicio de speaking que sí funciona", "excerpt": "Por qué repetir audio nativo es la forma más rápida de corregir la pronunciación, y una rutina de 5 pasos para empezar hoy." }
            ]
        },
        "cta": {
            "title": "Empieza tu ritual diario de 10 minutos",
            "desc": "Gratis para siempre. Sin tarjeta de crédito. Cancela cuando quieras — aunque probablemente no lo harás.",
            "start": "Crear cuenta gratis",
            "browse": "Ver cursos primero"
        }
    },
    "fr": {
        "steps": {
            "badge": "Comment ça marche",
            "title": "Un parcours en 3 étapes, de débutant à courant",
            "desc": "Chaque apprenant est unique, mais le chemin vers la fluidité est toujours le même : input, output, feedback. LangOria transforme cette boucle en un rituel quotidien de 10 minutes.",
            "items": [
                { "title": "Diagnostiquez votre niveau", "desc": "Choisissez votre langue cible et votre niveau de départ. Nous construisons un parcours personnalisé à partir de ce que vous savez déjà." },
                { "title": "Boucle quotidienne de 10 minutes", "desc": "Vocabulaire + grammaire + écoute + oral, orchestrés par la répétition espacée pour que ça reste en mémoire." },
                { "title": "Parlez avec confiance", "desc": "Répétez de vraies phrases, obtenez un feedback instantané et entretenez votre streak." }
            ]
        },
        "stories": {
            "badge": "Témoignages d'apprenants",
            "title": "De vrais progrès, de vraies personnes",
            "desc": "Découvrez des apprenants qui ont transformé 10 minutes par jour en une langue qu'ils peuvent vraiment utiliser.",
            "items": [
                { "name": "Yuki, 27 ans", "role": "Responsable marketing · Tokyo", "quote": "J'ai essayé trois applis avant. LangOria est la seule que j'ouvre vraiment chaque jour. Le système de streak fonctionne." },
                { "name": "Carlos, 34 ans", "role": "Ingénieur logiciel · Madrid", "quote": "Les explications de grammaire sont courtes et claires. En trois mois de trajet, je suis passé de A2 à B1." },
                { "name": "Mei, 22 ans", "role": "Étudiante · Shanghai", "quote": "J'adore que l'interface soit en chinois mais les mots en japonais. On a l'impression que l'appli me connaît." }
            ]
        },
        "faq": {
            "badge": "FAQ",
            "title": "Questions fréquentes, réponses claires",
            "desc": "Tout ce qu'il faut savoir avant de commencer.",
            "viewAll": "Voir toutes les questions",
            "items": [
                { "q": "LangOria est-il vraiment gratuit ?", "a": "Oui. L'expérience centrale — vocabulaire, grammaire, écoute, oral et la communauté — est gratuite. Des fonctions premium arriveront plus tard pour les utilisateurs avancés." },
                { "q": "Faut-il installer quelque chose ?", "a": "Non. LangOria fonctionne dans n'importe quel navigateur moderne. Les applications mobiles suivront une fois la version web stabilisée." },
                { "q": "Quelles langues sont prises en charge ?", "a": "Anglais, japonais, coréen, chinois, espagnol, français et allemand. De nouvelles langues sont ajoutées chaque mois." },
                { "q": "Quand verrai-je des progrès ?", "a": "La plupart des apprenants constatent une différence nette en 4 à 6 semaines s'ils maintiennent la routine de 10 minutes. Le système de streak et la répétition espacée sont conçus pour faire tenir l'habitude." },
                { "q": "Puis-je l'utiliser sur mon téléphone ?", "a": "Oui. Le site est entièrement responsive et fonctionne très bien sur les navigateurs mobiles. Ajoutez-le à votre écran d'accueil pour une expérience proche d'une appli." }
            ]
        },
        "blog": {
            "badge": "Depuis le blog",
            "title": "Conseils, guides et science de l'apprentissage",
            "desc": "Des articles courts pour rendre votre temps d'étude plus efficace.",
            "viewAll": "Tous les articles →",
            "readMore": "Lire la suite",
            "items": [
                { "tag": "Méthodes", "title": "Pourquoi 10 minutes par jour battent 2 heures le week-end", "excerpt": "La répétition espacée est la technique la plus étudiée en sciences de l'apprentissage. Voici pourquoi des sessions courtes et fréquentes surpassent le bachotage." },
                { "tag": "Vocabulaire", "title": "Retenir 1000 mots sans s'épuiser", "excerpt": "Un plan pratique de 8 semaines bâti sur la règle 3-2-1, avec des exemples en anglais, japonais et espagnol." },
                { "tag": "Expression orale", "title": "Le shadowing : l'exercice oral qui marche vraiment", "excerpt": "Pourquoi répéter un audio natif est le moyen le plus rapide de corriger sa prononciation, et une routine en 5 étapes pour commencer aujourd'hui." }
            ]
        },
        "cta": {
            "title": "Lancez votre rituel quotidien de 10 minutes",
            "desc": "Gratuit pour toujours. Pas de carte bancaire. Annulez à tout moment — mais vous ne le ferez probablement pas.",
            "start": "Créer un compte gratuit",
            "browse": "Voir d'abord les cours"
        }
    },
}


def main():
    en_path = ROOT / "en" / "translation.json"
    en = load(en_path)
    en_home = en["home"]

    # Sanity: en must have all 5 sections
    for k in ("steps", "stories", "faq", "blog", "cta"):
        if k not in en_home:
            raise SystemExit(f"en/translation.json missing home.{k}")

    for lang in LANGS:
        path = ROOT / lang / "translation.json"
        data = load(path)
        home = data.get("home")
        if home is None:
            print(f"  [SKIP] {lang}: no home section")
            continue
        for k in ("steps", "stories", "faq", "blog", "cta"):
            if k in TRANSLATIONS[lang]:
                home[k] = TRANSLATIONS[lang][k]
            else:
                # Defensive: never lose keys by accident
                print(f"  [WARN] {lang} missing {k} in TRANSLATIONS")
        # Keep the field order compatible with en: append after `courses`.
        # Simplest: rebuild the dict in the canonical order.
        canonical = ["seoTitle", "seoDescription", "hero", "languages", "tasks",
                     "steps", "features", "courses", "stories", "faq", "blog", "cta"]
        ordered = {k: home[k] for k in canonical if k in home}
        # Append any unknown future keys at the end
        for k in home:
            if k not in ordered:
                ordered[k] = home[k]
        data["home"] = ordered
        save(path, data)
        print(f"  [OK] {lang}: patched home.steps/stories/faq/blog/cta")

    print("Done.")


if __name__ == "__main__":
    main()
