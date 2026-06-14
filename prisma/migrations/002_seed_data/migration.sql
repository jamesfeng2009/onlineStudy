-- ============================================================
-- 初始数据种子（7种语言 + 课程 + 单词 + 社区帖子）
-- 执行顺序：先执行 001_init_online_study/migration.sql（建表）
--         再执行本文件
-- ============================================================

-- ------------------------------------------------------------
-- 1. Languages（7种语言）
-- ------------------------------------------------------------
INSERT INTO languages (code, name, native, flag, tagline, levels, status) VALUES
('en', '英语', 'English', '🇬🇧', '全球通用语言',
 '["A1", "A2", "B1", "B2", "C1", "C2"]', 'active'),
('ja', '日语', '日本語', '🇯🇵', '含蓄优雅的东方韵律',
 '["N5", "N4", "N3", "N2", "N1"]', 'active'),
('ko', '韩语', '한국어', '🇰🇷', '鲜活流行的韩流文化',
 '["初级", "中级", "高级"]', 'active'),
('zh', '汉语', '中文', '🇨🇳', '古老而充满生命力的表意文字',
 '["HSK1", "HSK2", "HSK3", "HSK4", "HSK5", "HSK6"]', 'active'),
('es', '西班牙语', 'Español', '🇪🇸', '热情如火的拉丁之声',
 '["A1", "A2", "B1", "B2", "C1", "C2"]', 'active'),
('fr', '法语', 'Français', '🇫🇷', '浪漫优雅的语言艺术',
 '["A1", "A2", "B1", "B2", "C1", "C2"]', 'active'),
('de', '德语', 'Deutsch', '🇩🇪', '严谨精准的哲学与工程之语',
 '["A1", "A2", "B1", "B2", "C1", "C2"]', 'active')
ON CONFLICT (code) DO NOTHING;

-- ------------------------------------------------------------
-- 2. Courses（每种语言 2-3 门课程）
-- ------------------------------------------------------------
INSERT INTO courses (id, languageCode, title, level, levelGroup, description, lessons, minutes, cover, tags, "vipOnly", "courseOrder") VALUES
-- 英语
('en-beg-1', 'en', '英语入门：从零开始', 'A1', 'beginner', '掌握日常基础对话，建立发音与基本语法框架', 25, 600, '📘', '["基础","发音","对话"]', false, 1),
('en-beg-2', 'en', '英语基础：日常交际', 'A2', 'beginner', '扩充核心词汇，掌握购物、问路、订餐等常见场景', 30, 720, '📗', '["日常","场景对话"]', false, 2),
('en-int', 'en', '英语进阶：商务与演讲', 'B1', 'intermediate', '进入职场英语，练习演讲、会议、邮件撰写', 35, 900, '📙', '["商务","演讲","写作"]', false, 3),
('en-adv', 'en', '英语高级：雅思/托福冲刺', 'C1', 'advanced', '系统攻克长难句与学术听力，冲刺国际考试高分', 40, 1200, '📕', '["考试","学术","VIP"]', true, 4),

-- 日语
('ja-beg-1', 'ja', '日语入门：五十音与基础表达', 'N5', 'beginner', '平假名/片假名全部掌握，学习最基础的日常问候', 20, 500, '🏯', '["五十音","基础"]', false, 1),
('ja-beg-2', 'ja', '日语基础：N4语法与实用对话', 'N4', 'beginner', '系统学习基础语法结构，能够进行简单的日语对话', 25, 600, '🎎', '["语法","对话"]', false, 2),
('ja-int', 'ja', '日语中级：N3-N2日常与职场', 'N3', 'intermediate', '进入中级语法与敬语学习，应对日本留学与工作场景', 40, 1000, '🌸', '["中级","敬语","留学"]', false, 3),
('ja-adv', 'ja', '日语高级：JLPT N1冲刺', 'N1', 'advanced', '攻克长篇阅读与高级听力，精讲真题与学术日语', 45, 1500, '⛩️', '["N1","考试","VIP"]', true, 4),

-- 韩语
('ko-beg-1', 'ko', '韩语入门：Hangul与基础对话', '初级', 'beginner', '快速掌握韩字拼读，学习最基础的自我介绍与问候', 20, 480, '🎵', '["Hangul","基础"]', false, 1),
('ko-beg-2', 'ko', '韩语基础：日常生活用语', '初级', 'beginner', '餐厅、购物、旅游等高频场景练习，韩剧台词教学', 28, 650, '🍜', '["日常","韩剧"]', false, 2),
('ko-int', 'ko', '韩语中级：TOPIK 3-4级', '中级', 'intermediate', '系统讲解TOPIK考试要点，掌握中级语法与写作', 35, 900, '🎬', '["TOPIK","考试"]', false, 3),
('ko-adv', 'ko', '韩语高级：TOPIK 5-6级冲刺', '高级', 'advanced', '高级语法、新闻听力与学术写作，冲刺TOPIK最高级', 40, 1200, '🏆', '["TOPIK","高级","VIP"]', true, 4),

-- 汉语（中文）
('zh-beg-1', 'zh', '中文入门：拼音与基础汉字', 'HSK1', 'beginner', '系统学习汉语拼音与最常用的150个汉字，学会基础问候', 20, 500, '🐉', '["拼音","汉字"]', false, 1),
('zh-beg-2', 'zh', '中文基础：日常对话', 'HSK2', 'beginner', '学习300-600词汇量，应对旅游、购物、简单工作场景', 28, 650, '🏛️', '["对话","日常"]', false, 2),
('zh-int', 'zh', '中文中级：HSK3-4级进阶', 'HSK3', 'intermediate', '进入中级语法与短文阅读，HSK考试系统讲解', 35, 900, '📜', '["HSK","阅读"]', false, 3),
('zh-adv', 'zh', '中文高级：HSK5-6级与文化阅读', 'HSK5', 'advanced', '高级阅读与写作，包含传统文化、古诗词、新闻等真实材料', 45, 1500, '🎋', '["HSK","文化","VIP"]', true, 4),

-- 西班牙语
('es-beg-1', 'es', '西班牙语入门：从零开始', 'A1', 'beginner', '掌握发音与基础动词变位，学会最基本的自我介绍与问候', 22, 500, '☀️', '["基础","发音"]', false, 1),
('es-beg-2', 'es', '西班牙语基础：A2日常交流', 'A2', 'beginner', '扩大核心词汇，熟悉现在时与过去时的基本变位', 28, 700, '🌮', '["日常","时态"]', false, 2),
('es-int', 'es', '西班牙语中级：DELE B1', 'B1', 'intermediate', '系统学习复杂时态与虚拟式，应对DELE B1考试', 35, 900, '🎸', '["DELE","中级"]', false, 3),
('es-adv', 'es', '西班牙语高级：DELE C1冲刺', 'C1', 'advanced', '高级语法、长文阅读与写作，冲刺DELE C1考试', 45, 1500, '🏆', '["DELE","高级","VIP"]', true, 4),

-- 法语
('fr-beg-1', 'fr', '法语入门：发音与基础', 'A1', 'beginner', '系统学习法语发音与联诵，掌握最核心的问候与自我介绍', 22, 500, '🗼', '["发音","基础"]', false, 1),
('fr-beg-2', 'fr', '法语基础：A2日常对话', 'A2', 'beginner', '学习基本动词变位与日常对话，能进行简单的书面表达', 28, 700, '🥐', '["对话","日常"]', false, 2),
('fr-int', 'fr', '法语中级：B1表达与DELF考试', 'B1', 'intermediate', '进入复合过去时等复杂时态学习，准备DELF B1考试', 35, 900, '🎨', '["DELF","中级"]', false, 3),
('fr-adv', 'fr', '法语高级：DALF C1与学术表达', 'C1', 'advanced', '高级阅读与写作，包含法国文化阅读与DALF考试备考', 45, 1500, '🏛️', '["DALF","高级","VIP"]', true, 4),

-- 德语
('de-beg-1', 'de', '德语入门：发音与格的奥秘', 'A1', 'beginner', '系统学习德语发音与4个格的基础概念，学会基本自我介绍', 25, 550, '🏰', '["发音","格"]', false, 1),
('de-beg-2', 'de', '德语基础：A2词汇与语法', 'A2', 'beginner', '扩大核心词汇量，掌握现在时与过去时的基础用法', 30, 720, '🍺', '["语法","词汇"]', false, 2),
('de-int', 'de', '德语中级：B1-B2进阶', 'B1', 'intermediate', '进入从句、过去完成时等复杂语法，练习长篇阅读与写作', 35, 900, '🎓', '["中级","从句"]', false, 3),
('de-adv', 'de', '德语高级：DSH/德福冲刺', 'C1', 'advanced', '针对大学入学考试，练习学术德语与长篇听力理解', 45, 1500, '📚', '["DSH","德福","VIP"]', true, 4)

ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- 3. Word Bank（每种语言 10+ 个典型单词）
-- ------------------------------------------------------------
INSERT INTO word_bank (id, languageCode, level, word, translation, phonetic, "exampleSentence", "vocabOrder") VALUES
-- 英语
('w-en-01', 'en', 'A1', 'hello', '你好', '/həˈloʊ/', 'Hello, how are you?', 1),
('w-en-02', 'en', 'A1', 'goodbye', '再见', '/ˌɡʊdˈbaɪ/', 'Goodbye, see you tomorrow!', 2),
('w-en-03', 'en', 'A1', 'morning', '早晨', '/ˈmɔːrnɪŋ/', 'Good morning, everyone!', 3),
('w-en-04', 'en', 'A1', 'book', '书', '/bʊk/', 'This is a good book.', 4),
('w-en-05', 'en', 'A1', 'water', '水', '/ˈwɔːtər/', 'Can I have some water?', 5),
('w-en-06', 'en', 'A1', 'friend', '朋友', '/frɛnd/', 'She is my best friend.', 6),
('w-en-07', 'en', 'A2', 'important', '重要的', '/ɪmˈpɔːrtənt/', 'This is important news.', 7),
('w-en-08', 'en', 'A2', 'understand', '理解', '/ˌʌndərˈstænd/', 'I understand what you mean.', 8),
('w-en-09', 'en', 'B1', 'achieve', '达成', '/əˈtʃiːv/', 'She achieved her goals.', 9),
('w-en-10', 'en', 'B1', 'opportunity', '机会', '/ˌɒpərˈtuːnəti/', 'This is a great opportunity.', 10),
('w-en-11', 'en', 'C1', 'comprehensive', '全面的', '/ˌkɒmprɪˈhensɪv/', 'A comprehensive report.', 11),
('w-en-12', 'en', 'C1', 'substantial', '大量的', '/səbˈstænʃəl/', 'Substantial evidence.', 12),

-- 日语
('w-ja-01', 'ja', 'N5', 'こんにちは', '你好', 'konnichiwa', 'こんにちは、田中さん！', 1),
('w-ja-02', 'ja', 'N5', 'ありがとう', '谢谢', 'arigatō', 'ありがとうございます。', 2),
('w-ja-03', 'ja', 'N5', '私', '我', 'watashi', '私は学生です。', 3),
('w-ja-04', 'ja', 'N5', '水', '水', 'mizu', '水をください。', 4),
('w-ja-05', 'ja', 'N4', '学校', '学校', 'gakkō', '学校に行きます。', 5),
('w-ja-06', 'ja', 'N4', '先生', '老师', 'sensei', '先生はとても優しいです。', 6),
('w-ja-07', 'ja', 'N3', '経験', '经验', 'keiken', '貴重な経験をしました。', 7),
('w-ja-08', 'ja', 'N2', '努力', '努力', 'doryoku', '努力は必ず報われる。', 8),
('w-ja-09', 'ja', 'N1', '継続', '持续', 'keizoku', '継続は力なり。', 9),
('w-ja-10', 'ja', 'N1', '発展', '发展', 'hatten', '経済が発展している。', 10),

-- 韩语
('w-ko-01', 'ko', '初级', '안녕하세요', '你好', 'annyeonghaseyo', '안녕하세요, 반갑습니다!', 1),
('w-ko-02', 'ko', '初级', '감사합니다', '谢谢', 'gamsahamnida', '정말 감사합니다.', 2),
('w-ko-03', 'ko', '初级', '저', '我', 'jeo', '저는 학생입니다.', 3),
('w-ko-04', 'ko', '初级', '물', '水', 'mul', '물 주세요.', 4),
('w-ko-05', 'ko', '中级', '학교', '学校', 'hakgyo', '학교에 갑니다.', 5),
('w-ko-06', 'ko', '中级', '선생님', '老师', 'seonsaengnim', '선생님은 친절하세요.', 6),
('w-ko-07', 'ko', '高级', '경험', '经验', 'gyeongheom', '소중한 경험이었습니다.', 7),
('w-ko-08', 'ko', '高级', '노력', '努力', 'noryeok', '노력은 배신하지 않는다.', 8),
('w-ko-09', 'ko', '高级', '성공', '成功', 'seonggong', '성공을 기원합니다.', 9),
('w-ko-10', 'ko', '高级', '발전', '发展', 'baljeon', '꾸준히 발전하고 있습니다.', 10),

-- 汉语（中文）
('w-zh-01', 'zh', 'HSK1', '你好', 'Hello', 'nǐ hǎo', '你好，很高兴认识你！', 1),
('w-zh-02', 'zh', 'HSK1', '谢谢', 'Thank you', 'xiè xiè', '真的非常谢谢你！', 2),
('w-zh-03', 'zh', 'HSK1', '我', 'I/me', 'wǒ', '我是学生。', 3),
('w-zh-04', 'zh', 'HSK1', '水', 'water', 'shuǐ', '请给我一杯水。', 4),
('w-zh-05', 'zh', 'HSK2', '学校', 'school', 'xué xiào', '我在学校学习中文。', 5),
('w-zh-06', 'zh', 'HSK3', '老师', 'teacher', 'lǎo shī', '这位老师非常亲切。', 6),
('w-zh-07', 'zh', 'HSK4', '经验', 'experience', 'jīng yàn', '这是宝贵的经验。', 7),
('w-zh-08', 'zh', 'HSK5', '努力', 'effort', 'nǔ lì', '努力一定会有回报。', 8),
('w-zh-09', 'zh', 'HSK6', '发展', 'development', 'fā zhǎn', '中国经济发展很快。', 9),
('w-zh-10', 'zh', 'HSK6', '持续', 'continuous', 'chí xù', '持续学习非常重要。', 10),

-- 西班牙语
('w-es-01', 'es', 'A1', 'hola', '你好', 'ˈola', '¡Hola, amigo!', 1),
('w-es-02', 'es', 'A1', 'gracias', '谢谢', 'ˈɡɾasjas', 'Muchas gracias.', 2),
('w-es-03', 'es', 'A1', 'yo', '我', 'ʝo', 'Yo soy estudiante.', 3),
('w-es-04', 'es', 'A2', 'agua', '水', 'ˈaɣwa', '¿Puedo tomar agua?', 4),
('w-es-05', 'es', 'A2', 'escuela', '学校', 'esˈkwela', 'Voy a la escuela.', 5),
('w-es-06', 'es', 'B1', 'profesor', '老师', 'pɾofesoɾ', 'El profesor es muy amable.', 6),
('w-es-07', 'es', 'B1', 'experiencia', '经验', 'ekspeɾiˈensja', 'Es una experiencia valiosa.', 7),
('w-es-08', 'es', 'B2', 'esfuerzo', '努力', 'esˈfweɾso', 'El esfuerzo siempre vale la pena.', 8),
('w-es-09', 'es', 'C1', 'éxito', '成功', 'ˈeksito', '¡Mucho éxito!', 9),
('w-es-10', 'es', 'C1', 'desarrollo', '发展', 'desaroˈʎo', 'El desarrollo económico es rápido.', 10),

-- 法语
('w-fr-01', 'fr', 'A1', 'bonjour', '你好', 'bɔ̃ʒuʁ', 'Bonjour, monsieur !', 1),
('w-fr-02', 'fr', 'A1', 'merci', '谢谢', 'mɛʁsi', 'Merci beaucoup.', 2),
('w-fr-03', 'fr', 'A1', 'je', '我', 'ʒə', 'Je suis étudiant.', 3),
('w-fr-04', 'fr', 'A2', 'eau', '水', 'o', 'Puis-je avoir de l eau?', 4),
('w-fr-05', 'fr', 'A2', 'école', '学校', 'ekɔl', 'Je vais à l école.', 5),
('w-fr-06', 'fr', 'B1', 'professeur', '老师', 'pʁɔfɛsœʁ', 'Le professeur est très gentil.', 6),
('w-fr-07', 'fr', 'B1', 'expérience', '经验', 'ɛkspeʁjɑ̃s', 'C est une expérience précieuse.', 7),
('w-fr-08', 'fr', 'B2', 'effort', '努力', 'efɔʁ', 'Les efforts portent toujours des fruits.', 8),
('w-fr-09', 'fr', 'C1', 'succès', '成功', 'syksɛ', 'Je vous souhaite plein succès.', 9),
('w-fr-10', 'fr', 'C1', 'développement', '发展', 'devlɔpmɑ̃', 'Le développement économique est rapide.', 10),

-- 德语
('w-de-01', 'de', 'A1', 'hallo', '你好', 'ˈhalo', 'Hallo, wie geht es dir?', 1),
('w-de-02', 'de', 'A1', 'danke', '谢谢', 'ˈdaŋkə', 'Vielen Dank!', 2),
('w-de-03', 'de', 'A1', 'ich', '我', 'ɪç', 'Ich bin Student.', 3),
('w-de-04', 'de', 'A2', 'Wasser', '水', 'ˈvasɐ', 'Kann ich Wasser haben?', 4),
('w-de-05', 'de', 'A2', 'Schule', '学校', 'ˈʃuːlə', 'Ich gehe zur Schule.', 5),
('w-de-06', 'de', 'B1', 'Lehrer', '老师', 'ˈleːʁɐ', 'Der Lehrer ist sehr freundlich.', 6),
('w-de-07', 'de', 'B1', 'Erfahrung', '经验', 'ɛɐ̯ˈfaːʁʊŋ', 'Das ist eine wertvolle Erfahrung.', 7),
('w-de-08', 'de', 'B2', 'Anstrengung', '努力', 'ˈanʃtʁeːnʊŋ', 'Anstrengung lohnt sich immer.', 8),
('w-de-09', 'de', 'C1', 'Erfolg', '成功', 'ɛɐ̯ˈfɔlk', 'Ich wünsche dir viel Erfolg!', 9),
('w-de-10', 'de', 'C1', 'Entwicklung', '发展', 'ɛntˈvɪklʊŋ', 'Die wirtschaftliche Entwicklung ist schnell.', 10)

ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- 4. Community Posts（示例社区帖子）
-- ------------------------------------------------------------
-- 先插入一个演示用户用于社区帖子（匿名示例）
INSERT INTO users (id, email, username, "passwordHash", "targetLanguage", "jwtVersion")
VALUES
('demo-user-001', 'demo@example.com', 'DemoUser',
 '$2a$10$demoHashValueNotRealPassword12345678901234567890', 'en', 0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO posts (id, "authorId", topic, content) VALUES
('p-001', 'demo-user-001', '每日一句', '今天学习的句子是："Practice makes perfect."——熟能生巧。每天背一句，三个月后你会惊讶于自己的进步！加油！💪'),
('p-002', 'demo-user-001', '学习心得', '坚持使用本平台学习英语30天了，从A1到A2。我的秘诀是：每天至少15分钟，背单词+听力+对话，缺一不可。'),
('p-003', 'demo-user-001', '提问求助', '请问日语的"は"什么时候读"wa"，什么时候读"ha"？总是搞不清楚，请高手赐教！'),
('p-004', 'demo-user-001', '文化分享', '韩国的"思密达"（습니다/ㅂ니다）其实是正式/礼貌用语的句尾，相当于中文的"是"。在韩语中根据听者的身份要选用不同的敬语，是韩语学习的一大特色哦~'),
('p-005', 'demo-user-001', '学习方法', '分享我的背单词方法：用例句代替死记硬背。每个单词至少造1个句子，在语境中记忆的效果是纯背字母的3倍！'),
('p-006', 'demo-user-001', '考试经验', '刚考完JLPT N2，最大的心得是：听力一定要每天练习15分钟以上，而且要用"先听后看原文"的方法，不要一开始就依赖字幕！'),
('p-007', 'demo-user-001', '每日一句', '今日の一言："千里の道も一歩から"（千里之行始于足下）。再大的目标也要从每天的小步积累开始。🌱'),
('p-008', 'demo-user-001', '文化分享', '法国文化中的"la bise"（贴面礼）非常有意思。根据地区不同，贴面次数从1次到5次不等，据说巴黎是2次，南部某些地区是4次。初次见面时一定别搞混次数哦！')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 完成！初始数据已插入。
-- 版本：v0.1.0
-- 生成时间：2026-06-14
-- ============================================================
