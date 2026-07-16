/**
 * P4-2: AI 对话页面
 *
 * 功能:
 *   - 选择目标语言 + 等级,开始新会话
 *   - 聊天 UI:消息列表 + 输入框 + 发送按钮
 *   - 显示今日剩余次数
 *   - 会话超时/结束提示
 *   - 历史会话列表(侧边栏,可切换)
 */

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { MessageCircle, Plus, Send, Loader2, AlertCircle, Clock, Trash2 } from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import LoginPromptModal from "../components/LoginPromptModal";
import { api, type AiConversationMessage, type AiConversationSummary } from "../lib/api";
import { useAuthStore } from "../store/authStore";
import { LANGUAGES } from "../data/languages";

// GlassCard / LoginPromptModal 默认导入兼容
// (GlassCard 是具名导出,这里改用类型正确的具名导入)

export default function AiConversationPage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const [conversations, setConversations] = useState<AiConversationSummary[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<AiConversationMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);

  // 新会话表单
  const [showNewForm, setShowNewForm] = useState(false);
  const [newLang, setNewLang] = useState("en");
  const [newLevel, setNewLevel] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 加载会话列表
  useEffect(() => {
    if (!user) return;
    void loadConversations();
  }, [user]);

  // 切换会话时加载消息
  useEffect(() => {
    if (!activeConvId || !user) return;
    void loadMessages(activeConvId);
  }, [activeConvId, user]);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadConversations() {
    try {
      const r = await api.aiConverseList(20);
      setConversations(r.conversations);
      if (r.conversations.length > 0 && !activeConvId) {
        setActiveConvId(r.conversations[0].id);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "加载会话失败");
    }
  }

  async function loadMessages(convId: string) {
    setLoading(true);
    setError(null);
    try {
      const r = await api.aiConverseGet(convId);
      setMessages(r.messages);
      setRemaining(r.remainingToday);
      if (r.conversation.status !== "active") {
        setError(`此会话已${r.conversation.status === "timeout" ? "超时" : "结束"},请开始新会话`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "加载消息失败");
    } finally {
      setLoading(false);
    }
  }

  async function handleStart() {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const r = await api.aiConverseStart({
        languageCode: newLang,
        level: newLevel || undefined,
        scenarioType: "free",
      });
      setRemaining(r.remainingToday);
      setShowNewForm(false);
      setMessages([]);
      setActiveConvId(r.conversationId);
      await loadConversations();
    } catch (e) {
      setError(e instanceof Error ? e.message : "创建会话失败");
    } finally {
      setLoading(false);
    }
  }

  async function handleSend() {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    const content = input.trim();
    if (!content || !activeConvId || sending) return;

    setSending(true);
    setError(null);
    setInput("");

    // 乐观更新:立即显示用户消息
    const tempUserMsg: AiConversationMessage = {
      id: `temp-${Date.now()}`,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const r = await api.aiConverseSend(activeConvId, content);
      // 替换临时消息 + 添加 AI 回复
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempUserMsg.id),
        r.userMessage,
        r.assistantMessage,
      ]);
      setRemaining(r.remainingToday);
    } catch (e) {
      // 回滚:移除临时消息
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));
      setError(e instanceof Error ? e.message : "发送失败");
      setInput(content); // 恢复输入
    } finally {
      setSending(false);
    }
  }

  async function handleEnd() {
    if (!activeConvId) return;
    try {
      await api.aiConverseEnd(activeConvId);
      await loadConversations();
      await loadMessages(activeConvId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "结束会话失败");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <GlassCard className="p-12 text-center">
          <MessageCircle className="mx-auto mb-4 h-12 w-12 text-fuchsia-400" />
          <h1 className="mb-2 text-2xl font-bold">AI 对话练习</h1>
          <p className="mb-6 text-brand-200/70">登录后即可与 AI 导师进行语言对话练习</p>
          <button
            onClick={() => setShowLoginPrompt(true)}
            className="rounded-xl bg-fuchsia-500 px-6 py-3 font-semibold text-white transition hover:bg-fuchsia-400"
          >
            立即登录
          </button>
        </GlassCard>
        {showLoginPrompt && <LoginPromptModal onClose={() => setShowLoginPrompt(false)} />}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <MessageCircle className="h-7 w-7 text-fuchsia-400" />
            AI 对话练习
          </h1>
          <p className="mt-1 text-sm text-brand-200/70">
            与 AI 导师用目标语言对话,提升口语和写作能力
          </p>
        </div>
        {remaining !== null && (
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm">
            <Clock className="h-4 w-4 text-fuchsia-400" />
            <span>今日剩余 <span className="font-bold text-fuchsia-400">{remaining}</span> 次</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* 左侧:会话列表 */}
        <div className="lg:col-span-1">
          <GlassCard className="p-4">
            <button
              onClick={() => setShowNewForm(!showNewForm)}
              className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg bg-fuchsia-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-fuchsia-400"
            >
              <Plus className="h-4 w-4" />
              新对话
            </button>

            {showNewForm && (
              <div className="mb-4 space-y-3 rounded-lg border border-white/10 bg-black/20 p-3">
                <div>
                  <label className="mb-1 block text-xs text-brand-200/70">目标语言</label>
                  <select
                    value={newLang}
                    onChange={(e) => setNewLang(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.flag} {l.native}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-brand-200/70">等级(可选)</label>
                  <input
                    type="text"
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value)}
                    placeholder="如 A1 / HSK3 / N5"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
                  />
                </div>
                <button
                  onClick={handleStart}
                  disabled={loading}
                  className="w-full rounded-lg bg-fuchsia-500/80 px-4 py-2 text-sm font-semibold text-white transition hover:bg-fuchsia-500 disabled:opacity-50"
                >
                  {loading ? "创建中..." : "开始对话"}
                </button>
              </div>
            )}

            <div className="space-y-1">
              <div className="px-2 py-1 text-xs uppercase text-brand-200/50">历史会话</div>
              {conversations.length === 0 && (
                <div className="px-2 py-4 text-center text-xs text-brand-200/40">暂无会话</div>
              )}
              {conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveConvId(c.id)}
                  className={`flex w-full flex-col items-start rounded-lg px-3 py-2 text-left transition ${
                    activeConvId === c.id ? "bg-fuchsia-500/20" : "hover:bg-white/5"
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="text-sm font-medium">
                      {LANGUAGES.find((l) => l.id === c.languageCode)?.flag ?? "🌐"}{" "}
                      {c.title ?? `${c.languageCode.toUpperCase()} 对话`}
                    </span>
                    {c.status !== "active" && (
                      <span className="text-[10px] text-brand-200/40">
                        {c.status === "timeout" ? "超时" : "已结束"}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-brand-200/50">
                    {c.turnCount} 轮 · {new Date(c.lastActiveAt).toLocaleDateString()}
                  </span>
                </button>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* 右侧:聊天区 */}
        <div className="lg:col-span-3">
          <GlassCard className="flex h-[600px] flex-col">
            {/* 顶栏 */}
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="text-sm font-medium">
                {activeConvId ? "对话中" : "选择或创建会话"}
              </div>
              {activeConvId && messages.length > 0 && (
                <button
                  onClick={handleEnd}
                  className="flex items-center gap-1 rounded-lg px-3 py-1 text-xs text-red-400 transition hover:bg-red-500/10"
                >
                  <Trash2 className="h-3 w-3" />
                  结束会话
                </button>
              )}
            </div>

            {/* 消息列表 */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {loading && messages.length === 0 && (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-fuchsia-400" />
                </div>
              )}
              {!loading && messages.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center text-center text-brand-200/50">
                  <MessageCircle className="mb-3 h-12 w-12 opacity-30" />
                  <p className="text-sm">开始与 AI 导师对话吧</p>
                  <p className="mt-1 text-xs">输入任何话题,AI 会用目标语言回复</p>
                </div>
              )}
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`mb-4 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-sm ${
                      m.role === "user"
                        ? "bg-fuchsia-500 text-white"
                        : "bg-white/10 text-brand-100"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="mb-4 flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-sm text-brand-200/70">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    AI 正在输入...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* 输入区 */}
            {activeConvId && (
              <div className="border-t border-white/10 p-4">
                {error && (
                  <div className="mb-2 flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-300">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                  </div>
                )}
                <div className="flex items-end gap-2">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="输入消息(Enter 发送,Shift+Enter 换行)..."
                    rows={1}
                    disabled={sending}
                    className="flex-1 resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-fuchsia-400/50 focus:outline-none disabled:opacity-50"
                    style={{ minHeight: "44px", maxHeight: "120px" }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || sending}
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-fuchsia-500 text-white transition hover:bg-fuchsia-400 disabled:opacity-30"
                  >
                    {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      </div>

      {showLoginPrompt && <LoginPromptModal onClose={() => setShowLoginPrompt(false)} />}
    </div>
  );
}
