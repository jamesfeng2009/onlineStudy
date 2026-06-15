import { useEffect, useMemo, useState } from "react";
import { MessageCircle, Heart, Send, UserCircle2, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import PageShell from "../components/PageShell";
import { GlassCard } from "../components/GlassCard";
import { useAuthStore } from "../store/authStore";
import { useProgressStore } from "../store/progressStore";
import type { PostResp } from "../lib/api";

const TOPIC_VALUES = ["", "每日一句", "日语学习心得", "韩语 K-pop 学习", "英语职场经验", "提问求助"] as const;

function formatDate(iso: string | number): string {
  if (!iso) return "";
  try {
    const d = typeof iso === "number" ? new Date(iso) : new Date(iso);
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const h = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return `${d.getFullYear()}-${m}-${day} ${h}:${mi}`;
  } catch {
    return String(iso);
  }
}

export default function CommunityPage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const posts = useProgressStore((s) => s.posts);
  const postsLoading = useProgressStore((s) => s.postsLoading);
  const refreshPosts = useProgressStore((s) => s.refreshPosts);
  const toggleLike = useProgressStore((s) => s.toggleLike);
  const addComment = useProgressStore((s) => s.addComment);
  const createPost = useProgressStore((s) => s.createPost);

  const topics = useMemo(
    () =>
      TOPIC_VALUES.map((value, idx) => ({
        value,
        label: value ? t(`community.topics.${["daily", "japanese", "kpop", "english", "help"][idx - 1]}`) : t("community.topics.all"),
      })),
    [t]
  );

  const [topic, setTopic] = useState("");
  const [newTopic, setNewTopic] = useState<string>(TOPIC_VALUES[1]);
  const [content, setContent] = useState("");
  const [commentMap, setCommentMap] = useState<Record<string, string>>({});

  useEffect(() => {
    refreshPosts(topic || undefined);
  }, [topic, refreshPosts]);

  const filtered: PostResp[] =
    topic && topic !== "" ? posts.filter((p) => p.topic === topic) : posts;

  const submitPost = async () => {
    if (!user) return;
    if (content.trim().length < 5) return;
    const ok = await createPost(newTopic, content.trim());
    if (ok.ok) setContent("");
  };

  const submitComment = async (postId: string) => {
    const text = commentMap[postId]?.trim();
    if (!text) return;
    await addComment(postId, text);
    setCommentMap({ ...commentMap, [postId]: "" });
  };

  return (
    <PageShell
      title={t("community.title")}
      subtitle={t("community.subtitle")}
    >
      {/* 发帖区 */}
      <GlassCard className="mb-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-fuchsia-500 text-lg text-white">
            <UserCircle2 className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-brand-200/70">{t("community.topic")}</span>
              <select
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-sky-400/50"
              >
                {topics.filter((t) => t.value !== "").map((t) => (
                  <option key={t.value} value={t.value} className="bg-slate-900">
                    {t.label}
                  </option>
                ))}
              </select>
              <span className="ml-auto text-xs text-brand-200/50">
                {t("community.signature", { name: user ? user.username : t("community.guest") })}
              </span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                user ? t("community.placeholderLogged") : t("community.placeholderGuest")
              }
              rows={3}
              disabled={!user}
              className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-sky-400/50 disabled:opacity-60"
            />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-brand-200/60">{t("community.charCount", { length: content.length })}</span>
              <button
                disabled={!user || content.trim().length < 5}
                onClick={submitPost}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send className="h-4 w-4" /> {t("community.post")}
              </button>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* 话题筛选 */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {topics.map((t) => (
          <button
            key={t.value || "all"}
            onClick={() => setTopic(t.value)}
            className={
              "rounded-full border px-3 py-1.5 text-xs transition " +
              ((topic === "" && t.value === "") || topic === t.value
                ? "border-sky-400/40 bg-sky-400/15 text-white"
                : "border-white/10 bg-white/5 text-brand-200/80 hover:bg-white/10 hover:text-white")
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Posts */}
      {postsLoading && posts.length === 0 ? (
        <GlassCard className="p-8 text-center text-brand-200/70">{t("community.loading")}</GlassCard>
      ) : filtered.length === 0 ? (
        <GlassCard className="p-8 text-center text-brand-200/60">
          {t("community.empty")}
        </GlassCard>
      ) : (
        <div className="grid gap-4">
          {filtered.map((p) => {
            const liked = p.likedByMe;
            const commentInput = commentMap[p.id] ?? "";
            return (
              <GlassCard key={p.id}>
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-rose-500 text-white">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-white">{p.authorName}</span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-brand-100">
                        {p.topic}
                      </span>
                      <span className="text-xs text-brand-200/50">{formatDate(p.createdAt)}</span>
                    </div>
                    <p className="mt-2 whitespace-pre-line text-brand-100/90">{p.content}</p>

                    <div className="mt-3 flex items-center gap-4">
                      <button
                        onClick={() => user && toggleLike(p.id)}
                        className={
                          "inline-flex items-center gap-1.5 text-xs transition " +
                          (liked ? "text-rose-300" : "text-brand-200/70 hover:text-white")
                        }
                      >
                        <Heart className={"h-4 w-4 " + (liked ? "fill-rose-300" : "")} />
                        {p.likeCount}
                      </button>
                      <div className="inline-flex items-center gap-1.5 text-xs text-brand-200/70">
                        <MessageCircle className="h-4 w-4" /> {p.comments?.length ?? 0}
                      </div>
                    </div>

                    {p.comments && p.comments.length > 0 && (
                      <div className="mt-3 space-y-2 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                        {p.comments.map((c) => (
                          <div key={c.id} className="text-sm">
                            <span className="font-semibold text-sky-200">{c.authorName}</span>
                            <span className="ml-2 text-brand-200/80">{c.content}</span>
                            <span className="ml-2 text-[10px] text-brand-200/40">
                              {formatDate(c.createdAt)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-3 flex items-center gap-2">
                      <input
                        value={commentInput}
                        onChange={(e) =>
                          setCommentMap({ ...commentMap, [p.id]: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && commentInput.trim()) {
                            submitComment(p.id);
                          }
                        }}
                        placeholder={user ? t("community.commentPlaceholderLogged") : t("community.commentPlaceholderGuest")}
                        disabled={!user}
                        className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-sky-400/50 disabled:opacity-60"
                      />
                      <button
                        disabled={!user || !commentInput.trim()}
                        onClick={() => submitComment(p.id)}
                        className="inline-flex items-center gap-1 rounded-xl bg-white/5 px-3 py-2 text-xs text-white transition hover:bg-white/10 disabled:opacity-40"
                      >
                        <Send className="h-3.5 w-3.5" /> {t("community.send")}
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}
