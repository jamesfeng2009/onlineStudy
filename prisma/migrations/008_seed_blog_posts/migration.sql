-- Seed default blog posts (idempotent via existing unique(slug))
-- content is now a single markdown string (not JSON array)

INSERT INTO "blog_posts" ("id", "slug", "title", "excerpt", "content", "tag", "readTime", "baseLanguageCode", "status", "publishedAt", "createdAt", "updatedAt")
VALUES
(
  'seed-blog-001',
  'ten-minutes-beat-two-hours',
  'Why 10 minutes a day beats 2 hours on weekends',
  'Spaced repetition is the most researched technique in learning science. Here is why shorter, more frequent sessions outperform long cramming.',
  E'## Why short sessions win\n\nIf you have ever crammed for an exam and forgotten everything two weeks later, you already know the problem with long, infrequent study sessions. The fix is not studying harder. The fix is studying more often.\n\n## The science of forgetting\n\nLearning science has been clear on this for decades. Hermann Ebbinghaus discovered the forgetting curve in 1885: we lose newly learned information at a predictable rate unless we actively recall it at the right moment. The **right moment** is just before you are about to forget.\n\n## How spaced repetition works\n\nThis is exactly what spaced repetition does. LinguaVerse schedules each word and grammar point for review at the moment you are most likely to forget it. Hit *remembered* and the next review gets pushed further out. Hit *not familiar* and the next review comes sooner.\n\nThe result: in 10 minutes a day, you cover more ground than 2 hours on Sunday, because every minute is spent on something your brain actually needs to recall. After 30 days, most learners have reviewed 600+ items — more than a single weekend cramming session could ever cover.\n\n## Try it yourself\n\nSo if you have been telling yourself you don''t have time to learn a language, you do. Ten minutes. Every day. That is the entire trick.',
  'Methods',
  '6 min read',
  'en',
  'published',
  NOW() - INTERVAL '5 days',
  NOW(),
  NOW()
),
(
  'seed-blog-002',
  'how-to-remember-1000-words',
  'How to remember 1000 words without burning out',
  'A practical 8-week plan built on the 3-2-1 rule, with examples across English, Japanese, and Spanish.',
  E'## Set a realistic target\n\nMost language learners aim for 1000 words as a first milestone. The bad news: trying to memorize them all at once is a recipe for burnout. The good news: you do not need to memorize them. You need to *meet* them.\n\n## The 3-2-1 rule\n\nWe use a simple rule. **Three** encounters a day, **two** contexts per encounter, and **one** forced recall. That is it.\n\n## A week-by-week walkthrough\n\nDay 1: learn 3 new words. See them in your flashcard, see them in a sentence, see them in a grammar example. Day 2: 3 more new words, plus 6 from yesterday. Day 7: 21 new words this week, but 80+ reviews. By the time a word has been reviewed 5 times, retention is over 90%.\n\n## Scaling up\n\nAcross 8 weeks, this adds up to 168 words at a pace of 3 per day. To hit 1000, you scale to 15 new words a day by month 3, when reviews are mostly cached. The 10-minute daily loop in LinguaVerse handles this for you automatically.\n\n## The takeaway\n\nThe key insight: vocabulary is not a memory contest. It is a *frequency game*. Show up every day, trust the system, and the words will stick.',
  'Vocabulary',
  '8 min read',
  'en',
  'published',
  NOW() - INTERVAL '11 days',
  NOW(),
  NOW()
),
(
  'seed-blog-003',
  'shadowing-the-speaking-exercise-that-works',
  'Shadowing: the speaking exercise that actually works',
  'Why repeating native audio is the fastest way to fix pronunciation, and a 5-step routine you can start today.',
  E'## The problem: you can read but not say\n\nIf you can read a sentence but cannot say it, you are not alone. Most learners spend 90% of their time reading and listening, and 10% speaking. That ratio is backwards.\n\n## What is shadowing?\n\nShadowing is the practice of listening to a native speaker and repeating what they say in real time, mimicking rhythm, intonation, and stress. It is the technique professional interpreters use to maintain fluency, and it works for any language.\n\n## The 5-step routine\n\n1. Listen to a sentence at native speed\n2. Listen again with the transcript\n3. Repeat at native speed while recording\n4. Compare your recording to the original\n5. Repeat 3 times before moving on\n\n## What to expect\n\nDo this for 5 minutes a day. Within a month, your accent will start to shift noticeably. Within three months, you will be able to produce sentences you could not read aloud before.\n\n## How LinguaVerse helps\n\nLinguaVerse''s Speaking module is built around this exact idea. Pick a sentence, listen, repeat, repeat, repeat. No judging, no feedback anxiety. Just your voice and the model.',
  'Speaking',
  '5 min read',
  'en',
  'published',
  NOW() - INTERVAL '18 days',
  NOW(),
  NOW()
)
ON CONFLICT ("slug") DO NOTHING;

