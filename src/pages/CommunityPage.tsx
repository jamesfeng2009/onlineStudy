import { useState, useMemo } from "react";
import { MessageCircle, Heart, Send, UserCircle2, Sparkles } from "lucide-react";
import PageShell from "../components/PageShell";
import { GlassCard } from "../components/GlassCard";
import { useAuthStore } from "../store/authStore";
import { useProgressStore } from "../store/progressStore";
import { formatDate } from "../utils/utils";

const TOPICS = ["全部", "每日一句", "日语学习心得", "韩语 K-pop 学习", "英语职场经验", "提问求助"];

export default function CommunityPage() {
  const currentUserId = useAuthStore((s) => s.currentUserId);
  const users = useAuthStore((s) => s.users);
  const user = useMemo(() => users.find((u) => u.id === currentUserId) ?? null, [users, currentUserId]);
  const posts = useProgressStore((s) => s.posts);
  const toggleLike = useProgressStore((s) => s.toggleLike);
  const addComment = useProgressStore((s) => s.addComment);
  const createPost = useProgressStore((s) => s.createPost);

  const [topic, setTopic] = useState("全部");
  const [newTopic, setNewTopic] = useState("每日一句");
  const [content, setContent] = useState("");
  const [commentMap, setCommentMap] = useState<Record<string, string>>({});

  const filtered =
    topic === "全部"
      ? posts
      : posts.filter((p) => p.topic === topic);

  return (
    <PageShell
      title="社区交流"
      subtitle="分享你的学习心得，和其他学习者一起成长。"
    >
      {/* 发帖区 */}
      <GlassCard className="mb-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-fuchsia-500 text-lg text-white">
            <UserCircle2 className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-brand-200/70">话题</span>
              <select
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-sky-400/50"
              >
                {TOPICS.filter((t) => t !== "全部").map((t) => (
                  <option key={t} value={t} className="bg-slate-900">
                    {t}
                  </option>
                ))}
              </select>
              <span className="ml-auto text-xs text-brand-200/50">
                {user ? user.username : "访客"} · 你现在说的每一句话都是未来的回响。
              </span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="分享一段你最近学到的表达，或提一个问题…"
              rows={3}
              className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-sky-400/50"
            />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-brand-200/60">{content.length} / 500</span>
              <button
                disabled={!user || content.trim().length < 5}
                onClick={() => {
                  createPost(newTopic, content.trim());
                  setContent("");
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send className="h-4 w-4" /> 发布
              </button>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* 话题筛选 */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {TOPICS.map((t) => (
          <button
            key={t}
            onClick={() => setTopic(t)}
            className={
              "rounded-full border px-3 py-1.5 text-xs transition " +
              (topic === t
                ? "border-sky-400/40 bg-sky-400/15 text-white"
                : "border-white/10 bg-white/5 text-brand-200/80 hover:bg-white/10 hover:text-white")
            }
          >
            {t}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="grid gap-4">
        {filtered.length === 0 && (
          <GlassCard className="p-8 text-center text-brand-200/60">
            还没有人在这个话题下发言，不如你先开个场。
          </GlassCard>
        )}
        {filtered.map((p) => {
          const liked = user ? p.likes.includes(user.id) : false;
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
                      {p.likes.length}
                    </button>
                    <div className="inline-flex items-center gap-1.5 text-xs text-brand-200/70">
                      <MessageCircle className="h-4 w-4" /> {p.comments.length}
                    </div>
                  </div>

                  {p.comments.length > 0 && (
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
                          addComment(p.id, commentInput.trim());
                          setCommentMap({ ...commentMap, [p.id]: "" });
                        }
                      }}
                      placeholder={user ? "写点什么回应…" : "登录后即可发表评论"}
                      disabled={!user}
                      className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-sky-400/50 disabled:opacity-60"
                    />
                    <button
                      disabled={!user || !commentInput.trim()}
                      onClick={() => {
                        addComment(p.id, commentInput.trim());
                        setCommentMap({ ...commentMap, [p.id]: "" });
                      }}
                      className="inline-flex items-center gap-1 rounded-xl bg-white/5 px-3 py-2 text-xs text-white transition hover:bg-white/10 disabled:opacity-40"
                    >
                      <Send className="h-3.5 w-3.5" /> 发送
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </PageShell>
  );
}
