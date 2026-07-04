#!/usr/bin/env python3
"""
Inject `faq.*` and `blog.*` UI keys into 6 locales (zh / ja / ko / de / es / fr)
so that /<locale>/faq and /<locale>/blog are localized.

Note: `blog.posts[]` (full article body) is intentionally NOT translated —
language-learning apps keep articles in the target language on purpose.
Only the UI strings (title / subtitle / readMore / cta / etc.) are localized.
"""
import json
from pathlib import Path

ROOT = Path("/workspace/src/locales")
LANGS = ["zh", "ja", "ko", "de", "es", "fr"]


def load(p: Path):
    return json.loads(p.read_text(encoding="utf-8"))


def save(p: Path, data):
    p.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


TRANSLATIONS = {
    "zh": {
        "faq": {
            "seoTitle": "常见问题 | LangOria",
            "seoDescription": "关于 LangOria 间隔重复语言学习的常见问题：10 分钟闭环怎么运作、是否免费、支持哪些语言、账户相关等。",
            "title": "常见问题",
            "subtitle": "关于 LangOria 你需要知道的一切。",
            "intro": "没找到想要的答案？欢迎通过社区联系我们，团队会尽快回复。",
            "groups": [
                {
                    "title": "入门",
                    "items": [
                        { "q": "如何注册账户？", "a": "点击右上角的「注册」按钮，输入邮箱和密码，选择目标语言和母语，就可以开始学习了。" },
                        { "q": "需要绑定信用卡吗？", "a": "不需要。核心学习体验完全免费。只有在未来选择升级到高级版时，才需要支付方式。" },
                        { "q": "以后能换目标语言吗？", "a": "可以。随时到 设置 → 目标语言 修改即可，所有学习进度都会与你之前练习的语言保持关联。" }
                    ]
                },
                {
                    "title": "学习",
                    "items": [
                        { "q": "每天应该学多久？", "a": "建议每天 10 分钟。间隔重复的效果在稳定、短时的练习中最佳——而不是一次性死记硬背。" },
                        { "q": "为什么用母语做解释？", "a": "研究表明用你最擅长的语言来解释，学得更快。你实际学习的单词始终是目标语言。" },
                        { "q": "漏一天会断签吗？", "a": "会。如果整整一天没学习，连续天数会重置。系统给到 36 小时的宽容窗口，覆盖不同时区。" }
                    ]
                },
                {
                    "title": "账户与隐私",
                    "items": [
                        { "q": "我的数据存放在哪里？", "a": "你的学习数据存放在离你较近区域的 Supabase（Postgres）上。我们绝不贩卖任何用户数据。" },
                        { "q": "如何注销账户？", "a": "到 我的 → 危险区，点击「注销账户」。所有数据将在 7 天内彻底删除。" }
                    ]
                }
            ],
            "ctaTitle": "准备好开始了吗？",
            "ctaDesc": "创建免费账户，体验每天 10 分钟的学习仪式。",
            "cta": "免费注册"
        },
        "blog": {
            "seoTitle": "语言学习博客 — 攻略与科学 | LangOria",
            "seoDescription": "实用攻略、学习科学与语言学习方法：间隔重复、跟读、每日 10 分钟习惯。",
            "title": "LangOria 博客",
            "subtitle": "实用攻略 · 学习科学 · 真实学习者的故事。",
            "readMore": "阅读全文",
            "backToList": "← 返回文章列表",
            "notFoundTitle": "文章未找到",
            "notFoundDesc": "你找的文章可能已经迁移或不存在了。",
            "empty": "暂时还没有文章，敬请期待。",
            "ctaTitle": "把方法落地到每天 10 分钟",
            "ctaDesc": "创建免费账户，从今天开始你的 10 分钟闭环。",
            "cta": "开始学习"
        }
    },
    "ja": {
        "faq": {
            "seoTitle": "よくある質問 | LangOria",
            "seoDescription": "LangOria の間隔反復学習に関するよくある質問：10 分ルールの仕組み、料金、対応言語、アカウントについて。",
            "title": "よくある質問",
            "subtitle": "LangOria について知っておくべきこと。",
            "intro": "答えが見つからない場合はコミュニティからご連絡ください。チームよりご返信します。",
            "groups": [
                {
                    "title": "はじめに",
                    "items": [
                        { "q": "アカウントはどう作りますか？", "a": "右上の「登録」ボタンをクリックし、メールアドレスとパスワードを入力、目標言語と母語を選択すれば完了です。" },
                        { "q": "クレジットカードは必要ですか？", "a": "不要です。コアとなる学習体験は無料。将来的にプレミアムへアップグレードする際に支払い情報が必要となります。" },
                        { "q": "あとから目標言語を変更できますか？", "a": "はい。設定 → 目標言語 からいつでも変更可能。進捗はこれまで練習していた言語に紐づいたまま保持されます。" }
                    ]
                },
                {
                    "title": "学習",
                    "items": [
                        { "q": "1 日にどのくらい勉強すべきですか？", "a": "1 日 10 分を推奨しています。間隔反復は、短く安定したセッションで最も効きます。" },
                        { "q": "なぜ母語で説明されるのですか？", "a": "研究では、最も得意な言語で説明された方が学習は速いとされています。学習する単語そのものは常に目標言語です。" },
                        { "q": "1 日休むと連続日数はリセットされますか？", "a": "はい、1 日完全に休むとリセットされます。タイムゾーン差を考慮し、36 時間の猶予があります。" }
                    ]
                },
                {
                    "title": "アカウントとプライバシー",
                    "items": [
                        { "q": "データはどこに保存されますか？", "a": "Supabase（Postgres）上のあなたの近くの地域に保存されます。ユーザーデータを販売することは一切ありません。" },
                        { "q": "アカウントを削除するには？", "a": "プロフィール → 危険ゾーン から「アカウントを削除」をクリック。データは 7 日以内にすべて削除されます。" }
                    ]
                }
            ],
            "ctaTitle": "始める準備はできましたか？",
            "ctaDesc": "無料アカウントを作成し、10 分の日課を試しましょう。",
            "cta": "無料登録"
        },
        "blog": {
            "seoTitle": "語学学習ブログ — ヒントと科学 | LangOria",
            "seoDescription": "間隔反復、語彙、リスニング、スピーキングに関する実践的なガイド。",
            "title": "LangOria ブログ",
            "subtitle": "実践ガイド・学習科学・学習者のリアルストーリー。",
            "readMore": "続きを読む",
            "backToList": "← 記事一覧へ戻る",
            "notFoundTitle": "記事が見つかりません",
            "notFoundDesc": "お探し記事は移動したか、存在しない可能性があります。",
            "empty": "まだ記事がありません。少々お待ちください。",
            "ctaTitle": "今日から 10 分を始めよう",
            "ctaDesc": "無料アカウントを作成し、今日から 10 分のループを始めましょう。",
            "cta": "学習を始める"
        }
    },
    "ko": {
        "faq": {
            "seoTitle": "자주 묻는 질문 | LangOria",
            "seoDescription": "LangOria 간격 반복 학습에 대한 자주 묻는 질문: 10분 루프 작동 방식, 가격, 지원 언어, 계정 안내.",
            "title": "자주 묻는 질문",
            "subtitle": "LangOria에 대해 알아야 할 모든 것.",
            "intro": "원하는 답을 찾지 못하셨나요? 커뮤니티로 연락해 주시면 팀에서 답변 드리겠습니다.",
            "groups": [
                {
                    "title": "시작하기",
                    "items": [
                        { "q": "계정은 어떻게 만드나요?", "a": "우측 상단의 '가입' 버튼을 누르고 이메일과 비밀번호를 입력한 뒤 목표 언어와 모국어를 선택하면 됩니다." },
                        { "q": "신용카드가 필요한가요?", "a": "아니요. 핵심 학습 경험은 무료입니다. 결제 수단은 향후 프리미엄으로 업그레이드할 때만 필요해요." },
                        { "q": "나중에 목표 언어를 바꿀 수 있나요?", "a": "네. 설정 → 목표 언어에서 언제든 변경할 수 있어요. 학습 진도는 이전에 연습하던 언어에 그대로 연결됩니다." }
                    ]
                },
                {
                    "title": "학습",
                    "items": [
                        { "q": "하루에 얼마나 공부해야 하나요?", "a": "하루 10분을 권장합니다. 간격 반복은 짧고 일관된 세션에서 가장 잘 작동해요." },
                        { "q": "왜 설명은 모국어로 나오나요?", "a": "가장 익숙한 언어로 설명할 때 학습이 더 빠르다는 연구 결과가 있어요. 실제 학습하는 단어는 항상 목표 언어입니다." },
                        { "q": "하루 쉬면 연속 일수가 리셋되나요?", "a": "네, 하루를 완전히 쉬면 리셋됩니다. 시간대 차이를 위해 36시간의 유예 기간이 있어요." }
                    ]
                },
                {
                    "title": "계정 & 개인정보",
                    "items": [
                        { "q": "제 데이터는 어디에 저장되나요?", "a": "Supabase(Postgres)에 가까운 지역에 저장됩니다. 사용자 데이터를 판매하는 일은 절대 없어요." },
                        { "q": "계정을 어떻게 삭제하나요?", "a": "프로필 → 위험 영역에서 '계정 삭제'를 클릭하세요. 모든 데이터는 7일 이내에 삭제됩니다." }
                    ]
                }
            ],
            "ctaTitle": "시작할 준비가 되셨나요?",
            "ctaDesc": "무료 계정을 만들고 10분 일상을 시작해 보세요.",
            "cta": "무료 가입"
        },
        "blog": {
            "seoTitle": "언어 학습 블로그 — 팁 & 사이언스 | LangOria",
            "seoDescription": "간격 반복, 어휘, 듣기, 말하기에 대한 실용 가이드.",
            "title": "LangOria 블로그",
            "subtitle": "실용 가이드, 학습 과학, 실제 학습자의 이야기.",
            "readMore": "더 읽기",
            "backToList": "← 모든 글로 돌아가기",
            "notFoundTitle": "글을 찾을 수 없어요",
            "notFoundDesc": "찾으시는 글이 이동되었거나 더 이상 존재하지 않습니다.",
            "empty": "아직 발행된 글이 없어요. 조금만 기다려 주세요!",
            "ctaTitle": "오늘부터 10분을 시작하세요",
            "ctaDesc": "무료 계정을 만들고 오늘부터 10분 루프를 시작하세요.",
            "cta": "학습 시작"
        }
    },
    "de": {
        "faq": {
            "seoTitle": "Häufig gestellte Fragen | LangOria",
            "seoDescription": "Antworten auf häufige Fragen zu LangOria's Spaced-Repetition-Lernen: 10-Minuten-Loop, Preise, unterstützte Sprachen und Konto-Hilfe.",
            "title": "Häufig gestellte Fragen",
            "subtitle": "Alles, was du über LangOria wissen musst.",
            "intro": "Du findest deine Antwort nicht? Melde dich über die Community — unser Team meldet sich bei dir.",
            "groups": [
                {
                    "title": "Erste Schritte",
                    "items": [
                        { "q": "Wie erstelle ich ein Konto?", "a": "Klicke oben rechts auf 'Registrieren', gib E-Mail und Passwort ein, wähle deine Zielsprache und Muttersprache — fertig." },
                        { "q": "Brauche ich eine Kreditkarte?", "a": "Nein. Die Lernerfahrung ist kostenlos. Zahlungsdaten brauchst du erst, wenn du später auf Premium upgraden willst." },
                        { "q": "Kann ich meine Zielsprache später ändern?", "a": "Ja. Gehe jederzeit zu Einstellungen → Zielsprache. Dein Fortschritt bleibt mit der zuvor gelernten Sprache verknüpft." }
                    ]
                },
                {
                    "title": "Lernen",
                    "items": [
                        { "q": "Wie lange sollte ich täglich lernen?", "a": "Wir empfehlen 10 Minuten am Tag. Spaced Repetition funktioniert am besten mit kurzen, konsistenten Einheiten." },
                        { "q": "Warum sind die Erklärungen in meiner Muttersprache?", "a": "Studien zeigen: Erklärungen in der stärksten Sprache beschleunigen das Lernen. Die gelernten Wörter selbst sind immer in der Zielsprache." },
                        { "q": "Wird mein Streak zurückgesetzt, wenn ich einen Tag aussetze?", "a": "Ja, ein ganzer Tag ohne Lernen setzt den Streak zurück. Es gibt ein 36-Stunden-Schonfrist für Zeitzonen." }
                    ]
                },
                {
                    "title": "Konto & Datenschutz",
                    "items": [
                        { "q": "Wo werden meine Daten gespeichert?", "a": "Deine Lerndaten liegen in Supabase (Postgres) in einer Region in deiner Nähe. Wir verkaufen keine Nutzerdaten." },
                        { "q": "Wie lösche ich mein Konto?", "a": "Gehe zu Profil → Gefahrenzone und klicke 'Konto löschen'. Alle Daten werden innerhalb von 7 Tagen entfernt." }
                    ]
                }
            ],
            "ctaTitle": "Bereit loszulegen?",
            "ctaDesc": "Erstelle ein kostenloses Konto und probiere das 10-Minuten-Ritual aus.",
            "cta": "Kostenlos registrieren"
        },
        "blog": {
            "seoTitle": "Sprachlern-Blog — Tipps & Wissenschaft | LangOria",
            "seoDescription": "Praktische Anleitungen, Lernwissenschaft und Tipps rund um Sprachenlernen mit Spaced Repetition, Shadowing und der 10-Minuten-Routine.",
            "title": "LangOria Blog",
            "subtitle": "Praktische Anleitungen, Lernwissenschaft und echte Lernende.",
            "readMore": "Weiterlesen",
            "backToList": "← Zurück zur Artikelübersicht",
            "notFoundTitle": "Artikel nicht gefunden",
            "notFoundDesc": "Der gesuchte Artikel wurde verschoben oder existiert nicht mehr.",
            "empty": "Es wurden noch keine Artikel veröffentlicht. Schau bald wieder vorbei!",
            "ctaTitle": "Setze die Tipps in die Tat um",
            "ctaDesc": "Erstelle ein kostenloses Konto und starte heute deine 10-Minuten-Routine.",
            "cta": "Jetzt lernen"
        }
    },
    "es": {
        "faq": {
            "seoTitle": "Preguntas frecuentes | LangOria",
            "seoDescription": "Respuestas a preguntas frecuentes sobre el aprendizaje por repetición espaciada de LangOria: cómo funciona el bucle de 10 minutos, precios, idiomas y cuenta.",
            "title": "Preguntas frecuentes",
            "subtitle": "Todo lo que necesitas saber sobre LangOria.",
            "intro": "¿No encuentras la respuesta? Escríbenos por la comunidad y nuestro equipo te responderá.",
            "groups": [
                {
                    "title": "Primeros pasos",
                    "items": [
                        { "q": "¿Cómo creo una cuenta?", "a": "Pulsa 'Registrarse' arriba a la derecha, introduce email y contraseña, elige tu idioma objetivo y nativo, y listo." },
                        { "q": "¿Necesito una tarjeta de crédito?", "a": "No. La experiencia de aprendizaje es gratuita. Solo necesitarás un método de pago si en el futuro decides pasarte a Premium." },
                        { "q": "¿Puedo cambiar mi idioma objetivo más tarde?", "a": "Sí. Ve a Ajustes → Idioma objetivo en cualquier momento. Tu progreso se mantiene ligado al idioma que venías practicando." }
                    ]
                },
                {
                    "title": "Aprendizaje",
                    "items": [
                        { "q": "¿Cuánto debo estudiar cada día?", "a": "Recomendamos 10 minutos al día. La repetición espaciada funciona mejor con sesiones cortas y constantes." },
                        { "q": "¿Por qué las explicaciones están en mi idioma nativo?", "a": "Las investigaciones muestran que aprender es más rápido cuando las explicaciones vienen de tu idioma más fuerte. Las palabras que estudias siempre están en el idioma objetivo." },
                        { "q": "¿Se reinicia la racha si me salto un día?", "a": "Sí, se reinicia si te saltas un día entero. Hay una ventana de gracia de 36 horas para cubrir diferencias horarias." }
                    ]
                },
                {
                    "title": "Cuenta y privacidad",
                    "items": [
                        { "q": "¿Dónde se guardan mis datos?", "a": "Tus datos de aprendizaje se guardan en Supabase (Postgres) en una región cercana a ti. No vendemos datos de usuario." },
                        { "q": "¿Cómo elimino mi cuenta?", "a": "Ve a Perfil → Zona peligrosa y haz clic en 'Eliminar cuenta'. Todos los datos se eliminan en 7 días." }
                    ]
                }
            ],
            "ctaTitle": "¿Listo para empezar?",
            "ctaDesc": "Crea una cuenta gratis y prueba el ritual diario de 10 minutos.",
            "cta": "Regístrate gratis"
        },
        "blog": {
            "seoTitle": "Blog de aprendizaje de idiomas — Consejos y ciencia | LangOria",
            "seoDescription": "Guías prácticas, ciencia del aprendizaje y consejos para dominar un idioma con repetición espaciada, shadowing y un hábito diario de 10 minutos.",
            "title": "Blog de LangOria",
            "subtitle": "Guías prácticas, ciencia del aprendizaje e historias reales.",
            "readMore": "Leer más",
            "backToList": "← Volver a todos los artículos",
            "notFoundTitle": "Artículo no encontrado",
            "notFoundDesc": "El artículo que buscas se ha movido o ya no existe.",
            "empty": "Aún no hay artículos publicados. ¡Vuelve pronto!",
            "ctaTitle": "Pon en práctica estos consejos",
            "ctaDesc": "Crea una cuenta gratis y empieza hoy tu bucle diario de 10 minutos.",
            "cta": "Empezar a aprender"
        }
    },
    "fr": {
        "faq": {
            "seoTitle": "Questions fréquentes | LangOria",
            "seoDescription": "Réponses aux questions fréquentes sur l'apprentissage par répétition espaciée LangOria : fonctionnement de la boucle 10 minutes, prix, langues prises en charge et compte.",
            "title": "Questions fréquentes",
            "subtitle": "Tout ce que vous devez savoir sur LangOria.",
            "intro": "Vous ne trouvez pas la réponse ? Écrivez-nous via la communauté, notre équipe vous répondra.",
            "groups": [
                {
                    "title": "Premiers pas",
                    "items": [
                        { "q": "Comment créer un compte ?", "a": "Cliquez sur 'S'inscrire' en haut à droite, saisissez email et mot de passe, choisissez langue cible et langue natale, et c'est parti." },
                        { "q": "Ai-je besoin d'une carte bancaire ?", "a": "Non. L'expérience d'apprentissage est gratuite. Il vous faudra un moyen de paiement uniquement si vous passez à Premium plus tard." },
                        { "q": "Puis-je changer ma langue cible plus tard ?", "a": "Oui. Allez dans Paramètres → Langue cible à tout moment. Votre progression reste liée à la langue que vous pratiquiez." }
                    ]
                },
                {
                    "title": "Apprentissage",
                    "items": [
                        { "q": "Combien de temps étudier chaque jour ?", "a": "Nous recommandons 10 minutes par jour. La répétition espaciée fonctionne mieux avec des sessions courtes et régulières." },
                        { "q": "Pourquoi les explications sont-elles dans ma langue natale ?", "a": "Les recherches montrent qu'apprendre est plus rapide quand les explications viennent de votre langue la plus forte. Les mots étudiés restent toujours dans la langue cible." },
                        { "q": "Mon streak est-il réinitialisé si je saute un jour ?", "a": "Oui, un jour complet sans apprentissage réinitialise le streak. Une fenêtre de grâce de 36 h couvre les décalages horaires." }
                    ]
                },
                {
                    "title": "Compte et confidentialité",
                    "items": [
                        { "q": "Où sont stockées mes données ?", "a": "Vos données d'apprentissage sont stockées sur Supabase (Postgres) dans une région proche de vous. Nous ne vendons aucune donnée utilisateur." },
                        { "q": "Comment supprimer mon compte ?", "a": "Allez dans Profil → Zone de danger et cliquez 'Supprimer le compte'. Toutes les données sont effacées sous 7 jours." }
                    ]
                }
            ],
            "ctaTitle": "Prêt à commencer ?",
            "ctaDesc": "Créez un compte gratuit et testez le rituel quotidien de 10 minutes.",
            "cta": "Inscription gratuite"
        },
        "blog": {
            "seoTitle": "Blog d'apprentissage des langues — Conseils & science | LangOria",
            "seoDescription": "Guides pratiques, science de l'apprentissage et conseils pour maîtriser une langue avec la répétition espacée, le shadowing et un rituel quotidien de 10 minutes.",
            "title": "Blog LangOria",
            "subtitle": "Guides pratiques, science de l'apprentissage et témoignages.",
            "readMore": "Lire la suite",
            "backToList": "← Retour à tous les articles",
            "notFoundTitle": "Article introuvable",
            "notFoundDesc": "L'article que vous cherchez a été déplacé ou n'existe plus.",
            "empty": "Aucun article publié pour l'instant. Revenez bientôt !",
            "ctaTitle": "Passez à la pratique",
            "ctaDesc": "Créez un compte gratuit et commencez votre boucle de 10 minutes dès aujourd'hui.",
            "cta": "Commencer à apprendre"
        }
    },
}


def main():
    for lang in LANGS:
        path = ROOT / lang / "translation.json"
        data = load(path)
        if "faq" not in data:
            data["faq"] = TRANSLATIONS[lang]["faq"]
        else:
            # already has faq — overwrite only UI keys, preserve any posts
            t = TRANSLATIONS[lang]["faq"]
            for k, v in t.items():
                data["faq"][k] = v
        if "blog" not in data:
            data["blog"] = TRANSLATIONS[lang]["blog"]
        else:
            t = TRANSLATIONS[lang]["blog"]
            for k, v in t.items():
                if k == "posts":
                    continue  # don't clobber existing posts
                data["blog"][k] = v
        save(path, data)
        print(f"  [OK] {lang}: patched faq + blog UI keys")

    print("Done.")


if __name__ == "__main__":
    main()
