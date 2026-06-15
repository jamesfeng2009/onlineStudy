# Generated content (not committed)

This directory is the output of the quiz + listening generator
scripts. It is in `.gitignore` and regenerated locally.

## How to refresh

```bash
# 1) Get a free Gemini API key from
#    https://aistudio.google.com/apikey
#    and paste it into GEMINI_API_KEY= in the repo-root .env

# 2) Generate CEFR grammar quiz items (needs GEMINI_API_KEY)
pnpm tsx scripts/generate-quizzes-gemini.ts

# 3) Generate Tatoeba fill-in-the-blank listening drills (no key needed)
pnpm tsx scripts/generate-tatoeba-fillblanks.ts
```

Output layout:

```
generated/
  quizzes/   {lang}-{level}.json    7 langs × 4 levels = 28 files
  listening/ {lang}-{level}.json    7 langs × 4 levels = 28 files
```

When you're happy with the output, copy selected items into
`src/data/content.ts` `QUIZZES` / `LISTENING` (or wire the files
into a dynamic loader — the existing fallback
`base.length >= 2 ? base : getQuizzes("en")` already covers the
"this language has too few" case).
