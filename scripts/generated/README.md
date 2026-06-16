# Generated content (not committed)

This directory is the output of the quiz + listening generator
scripts. It is in `.gitignore` and regenerated locally.

## How to refresh

```bash
# 1) Get a free Gemini API key from
#    https://aistudio.google.com/apikey
#
#    Recommended: store the secret in Vercel and sync locally:
#      vercel link
#      vercel env pull .env.local      # writes to .env.local (gitignored)
#
#    Or paste the key straight into .env (also gitignored) if you
#    don't use Vercel for secret management.

# 2) Generate CEFR grammar quiz items (needs GEMINI_API_KEY)
pnpm tsx scripts/generate-quizzes-gemini.ts

# 3) Generate Tatoeba fill-in-the-blank listening drills (no key needed)
pnpm tsx scripts/generate-tatoeba-fillblanks.ts
```

### Cost safety

`scripts/generate-quizzes-gemini.ts` enforces a hard USD cap
(`GEMINI_MAX_COST_USD`, default `$1.00`). The script estimates
per-batch cost from input length + JSON output size and aborts
the run before the running total crosses the cap. If you bind a
card to your Gemini key, raise the cap carefully — `gemini-2.5-flash`
and friends are the **same alias** for free-tier and paid-tier
keys, so the only thing that decides whether you pay is whether
the key is bound to a billing account.

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
