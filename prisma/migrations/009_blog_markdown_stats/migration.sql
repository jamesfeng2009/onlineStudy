-- ============================================================
-- Migration 009: blog_posts v2 - markdown + new fields + stats tables
-- ============================================================

-- 1. 调整 content 字段：JSONB 数组 → TEXT (整篇 markdown)
--    兼容旧数据：若已是 JSONB 数组则按 \n\n 拼接成 markdown
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'blog_posts'
      AND column_name = 'content'
      AND data_type = 'jsonb'
  ) THEN
    ALTER TABLE "blog_posts"
      ALTER COLUMN "content" DROP DEFAULT;
    ALTER TABLE "blog_posts"
      ALTER COLUMN "content" TYPE TEXT
      USING array_to_string(
        ARRAY(SELECT jsonb_array_elements_text("content"::jsonb)),
        E'\n\n'
      );
  END IF;
END $$;

-- 2. 新增字段
ALTER TABLE "blog_posts"
  ADD COLUMN IF NOT EXISTS "coverImageUrl"   TEXT,
  ADD COLUMN IF NOT EXISTS "tldr"            TEXT,
  ADD COLUMN IF NOT EXISTS "seoTitle"        TEXT,
  ADD COLUMN IF NOT EXISTS "seoDescription"  TEXT;

-- 3. 旧 unique(slug) → 新 unique(baseLanguageCode, slug)
ALTER TABLE "blog_posts" DROP CONSTRAINT IF EXISTS "blog_posts_slug_key";

-- 4. 索引调整
DROP INDEX IF EXISTS "blog_posts_status_publishedAt_idx";
CREATE INDEX "blog_posts_status_publishedAt_idx"
  ON "blog_posts"("status", "publishedAt" DESC);

CREATE UNIQUE INDEX IF NOT EXISTS "blog_posts_baseLanguageCode_slug_key"
  ON "blog_posts"("baseLanguageCode", "slug");

-- ============================================================
-- blog_post_revisions
-- ============================================================
CREATE TABLE IF NOT EXISTS "blog_post_revisions" (
  "id"                 TEXT NOT NULL,
  "postId"             TEXT NOT NULL,
  "revisionNo"         INTEGER NOT NULL,
  "title"              TEXT NOT NULL,
  "excerpt"            TEXT NOT NULL,
  "content"            TEXT NOT NULL,
  "coverImageUrl"      TEXT,
  "tldr"               TEXT,
  "seoTitle"           TEXT,
  "seoDescription"     TEXT,
  "tag"                TEXT NOT NULL,
  "readTime"           TEXT NOT NULL DEFAULT '5 min read',
  "baseLanguageCode"   TEXT NOT NULL,
  "status"             TEXT NOT NULL,
  "editorId"           TEXT,
  "createdAt"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "blog_post_revisions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "blog_post_revisions_postId_revisionNo_key"
  ON "blog_post_revisions"("postId", "revisionNo");

CREATE INDEX IF NOT EXISTS "blog_post_revisions_postId_revisionNo_idx"
  ON "blog_post_revisions"("postId", "revisionNo" DESC);

-- ============================================================
-- blog_post_views
-- ============================================================
CREATE TABLE IF NOT EXISTS "blog_post_views" (
  "id"        BIGSERIAL NOT NULL,
  "postId"    TEXT NOT NULL,
  "userId"    TEXT,
  "viewedAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "blog_post_views_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "blog_post_views_postId_idx"
  ON "blog_post_views"("postId");

CREATE INDEX IF NOT EXISTS "blog_post_views_viewedAt_idx"
  ON "blog_post_views"("viewedAt" DESC);
