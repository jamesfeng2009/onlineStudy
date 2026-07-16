/**
 * P2-1: League 排行榜前端（LeaguePage）
 *
 * 路由：
 *   /league                                  — 默认看本周赛季 + 当前用户所在 division
 *   /league?division=gold                    — 指定查看某个 division 排行
 *
 * 组成：
 *   1. 顶部：当前 season 信息（seasonKey / 剩余时间 / 总人数）
 *   2. 用户卡片：登录用户在该 division 的 rank / weekExp / 升降级提示
 *   3. Division 切换 tab
 *   4. 排行榜表格：top N 条目，按 weekExp DESC
 *   5. 未登录：显示登录入口卡片
 */

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Trophy, Crown, TrendingUp, TrendingDown, Users, Calendar,
  RefreshCw, Loader2, Info,
} from "lucide-react";
import PageShell from "../components/PageShell";
import { Seo } from "../components/Seo";
import { GlassCard } from "../components/GlassCard";
import LoginPromptModal from "../components/LoginPromptModal";
import { api } from "../lib/api";
import type {
  LeagueDivision, LeagueCurrentSeasonResp, LeagueStandingsResp, LeagueMeResp,
} from "../lib/api";
import { useAuthStore } from "../store/authStore";

const DIVISIONS: LeagueDivision[] = [
  "bronze", "silver", "gold", "platinum", "diamond", "master",
];

const DIVISION_LABEL: Record<LeagueDivision, string> = {
  bronze: "青铜",
  silver: "白银",
  gold: "黄金",
  platinum: "铂金",
  diamond: "钻石",
  master: "大师",
};

const DIVISION_ICON: Record<LeagueDivision, string> = {
  bronze: "🥉",
  silver: "🥈",
  gold: "🥇",
  platinum: "💎",
  diamond: "🔷",
  master: "👑",
};

const DIVISION_GRADIENT: Record<LeagueDivision, string> = {
  bronze: "from-amber-700 to-orange-800",
  silver: "from-slate-400 to-slate-600",
  gold: "from-amber-400 to-yellow-500",
  platinum: "from-sky-300 to-cyan-400",
  diamond: "from-violet-400 to-fuchsia-500",
  master: "from-rose-400 to-pink-500",
};

function isDivision(v: string | null): v is LeagueDivision {
  return !!v && (DIVISIONS as readonly string[]).includes(v);
}

function formatCountdown(endsAt: string): string {
  const end = new Date(endsAt).getTime();
  const now = Date.now();
  const diff = Math.max(0, end - now);
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  if (days > 0) return `${days} 天 ${hours} 时`;
  const mins = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  return `${hours} 时 ${mins} 分`;
}

/** 显示用户头像（无头像时取 username 首字母） */
function Avatar({ username, avatar, size = 40 }: { username: string; avatar: string | null; size?: number }) {
  if (avatar) {
    return (
      <img
        src={avatar}
        alt={username}
        style={{ width: size, height: size }}
        className="rounded-full object-cover"
      />
    );
  }
  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      className="flex items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-fuchsia-500 font-bold text-white"
    >
      {(username || "?").slice(0, 1).toUpperCase()}
    </div>
  );
}

export default function LeaguePage() {
  const user = useAuthStore((s) => s.user);
  const [searchParams, setSearchParams] = useSearchParams();
  const divisionParam = searchParams.get("division");

  const [season, setSeason] = useState<LeagueCurrentSeasonResp | null>(null);
  const [standings, setStandings] = useState<LeagueStandingsResp | null>(null);
  const [me, setMe] = useState<LeagueMeResp | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // 默认 division：登录用户优先取自己所在 division；否则 gold
  const activeDivision: LeagueDivision = useMemo(() => {
    if (isDivision(divisionParam)) return divisionParam;
    if (me?.standing.division) return me.standing.division;
    return "gold";
  }, [divisionParam, me]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([
      api.leagueSeason(),
      api.leagueStandings({ division: isDivision(divisionParam) ? divisionParam : undefined, limit: 50 }),
      user ? api.leagueMe() : Promise.resolve(null),
    ])
      .then(([s, st, m]) => {
        if (cancelled) return;
        setSeason(s);
        setStandings(st);
        setMe(m);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError(err.message ?? "加载排行榜失败");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user, divisionParam]);

  const switchDivision = (d: LeagueDivision) => {
    const qs = new URLSearchParams(searchParams);
    qs.set("division", d);
    setSearchParams(qs);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const [s, st, m] = await Promise.all([
        api.leagueSeason(),
        api.leagueStandings({ division: activeDivision, limit: 50 }),
        user ? api.leagueMe() : Promise.resolve(null),
      ]);
      setSeason(s);
      setStandings(st);
      setMe(m);
    } catch (err) {
      setError((err as Error).message ?? "刷新失败");
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <PageShell
      title="周度排行榜"
      subtitle="按周赛季累计 XP，争夺大师段位 · 升降级每周一结算"
      action={
        <>
          <Seo
            title="周度排行榜 · League"
            description="按周赛季累计 XP，争夺大师段位"
            pathname="/league"
          />
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="glass inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs text-brand-200/80 transition hover:text-white disabled:opacity-50"
          >
            {refreshing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
            刷新
          </button>
        </>
      }
    >
      {/* Season 概览 */}
      <GlassCard className="mb-4 p-5">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white">
            <Trophy className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-display text-lg font-bold text-white">
              {season ? `赛季 ${season.seasonKey}` : "加载中…"}
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-brand-200/70">
              <span className="inline-flex items-center gap-1">
                <Users className="h-3 w-3" />
                {season?.totalPlayers ?? "—"} 名玩家参与
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {season && `剩余 ${formatCountdown(season.endsAt)}`}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {season?.divisions.map((d) => (
              <span
                key={d.key}
                className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-brand-200/70"
                title={`${d.label}：周 XP ≥ ${d.minExp}`}
              >
                <span>{d.icon}</span>
                <span>{d.label}</span>
                <span className="text-white/30">{d.minExp}+</span>
              </span>
            ))}
          </div>
        </div>
      </GlassCard>

      {error && (
        <GlassCard className="mb-4 p-4 text-sm text-rose-300">{error}</GlassCard>
      )}

      {/* 当前用户卡片（仅登录用户） */}
      {loading && !me && (
        <GlassCard className="mb-4 p-5 text-center text-sm text-brand-200/70">
          <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
          正在加载你的排名…
        </GlassCard>
      )}
      {!loading && !user && (
        <GlassCard className="mb-4 p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-fuchsia-500 text-white">
              <Crown className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-white">登录后查看你的排名</div>
              <div className="mt-0.5 text-xs text-brand-200/70">
                登录后将自动加入本周赛季，并根据你的 XP 总量定位段位
              </div>
            </div>
            <button
              onClick={() => setShowLogin(true)}
              className="rounded-xl bg-gradient-to-r from-sky-400 to-fuchsia-400 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5"
            >
              立即登录
            </button>
          </div>
        </GlassCard>
      )}
      {me && (
        <GlassCard className="mb-4 p-5">
          <div className="flex flex-wrap items-center gap-4">
            <div
              className={`flex h-16 w-16 flex-none items-center justify-center rounded-2xl bg-gradient-to-br ${DIVISION_GRADIENT[me.standing.division]} text-white shadow-lg`}
            >
              <div className="text-center">
                <div className="text-2xl">{DIVISION_ICON[me.standing.division]}</div>
                <div className="text-[10px] font-bold uppercase tracking-wide">
                  {DIVISION_LABEL[me.standing.division]}
                </div>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Avatar username={me.user.username} avatar={me.user.avatar} size={28} />
                <span className="font-display text-lg font-bold text-white">
                  {me.user.username}
                </span>
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-brand-200/70">
                  Lv.{me.user.level}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs">
                <span className="text-brand-200/70">
                  段位排名：
                  <span className="ml-1 font-semibold text-white">
                    #{me.standing.rankInDivision}
                  </span>
                  <span className="text-brand-200/40"> / {me.standing.divisionSize}</span>
                </span>
                <span className="text-brand-200/70">
                  本周 XP：
                  <span className="ml-1 font-semibold text-emerald-300">
                    +{me.standing.weekExp}
                  </span>
                </span>
                <span className="text-brand-200/70">
                  总 XP：
                  <span className="ml-1 font-semibold text-white">
                    {me.standing.currentExp}
                  </span>
                </span>
                {me.standing.bestDivision && (
                  <span className="text-brand-200/70">
                    历史最佳：
                    <span className="ml-1 font-semibold text-amber-300">
                      {DIVISION_ICON[me.standing.bestDivision]} {DIVISION_LABEL[me.standing.bestDivision]}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 升降级提示 */}
          {(me.standing.isPromotionZone || me.standing.isDemotionZone) && (
            <div
              className={
                "mt-4 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs " +
                (me.standing.isPromotionZone
                  ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
                  : "border-rose-400/30 bg-rose-500/10 text-rose-200")
              }
            >
              {me.standing.isPromotionZone ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>
                {me.standing.isPromotionZone
                  ? "已进入升级区！赛季结束时将晋升到下一段位。"
                  : "当前处于降级区，赛季结束时可能降级。加油！"}
              </span>
            </div>
          )}
          <div className="mt-3 flex items-start gap-1.5 rounded-lg bg-white/5 px-3 py-2 text-[11px] text-brand-200/60">
            <Info className="mt-0.5 h-3 w-3 flex-none" />
            <span>
              升降级规则：每个段位前 10% 升级，后 10% 降级，赛季结束时（每周一）批量结算。
            </span>
          </div>
        </GlassCard>
      )}

      {/* Division 切换 */}
      <div className="mb-4 flex flex-wrap gap-2">
        {DIVISIONS.map((d) => {
          const active = activeDivision === d;
          return (
            <button
              key={d}
              onClick={() => switchDivision(d)}
              className={
                "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition " +
                (active
                  ? `bg-gradient-to-r ${DIVISION_GRADIENT[d]} text-white shadow-lg`
                  : "glass text-brand-200/80 hover:text-white")
              }
            >
              <span>{DIVISION_ICON[d]}</span>
              <span>{DIVISION_LABEL[d]}</span>
            </button>
          );
        })}
      </div>

      {/* 排行榜表格 */}
      <GlassCard className="overflow-hidden p-0">
        <div className="border-b border-white/5 px-5 py-3">
          <div className="font-display text-base font-bold text-white">
            {DIVISION_ICON[activeDivision]} {DIVISION_LABEL[activeDivision]} 段位排行榜
          </div>
          <div className="mt-0.5 text-xs text-brand-200/60">
            按本周 XP 排序 · 每页最多 50 名
          </div>
        </div>

        {loading && !standings && (
          <div className="p-8 text-center text-sm text-brand-200/70">
            <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
            正在加载排行榜…
          </div>
        )}

        {standings && standings.entries.length === 0 && (
          <div className="p-8 text-center text-sm text-brand-200/60">
            本周该段位暂无玩家 — 努力刷 XP，第一个上榜吧！
          </div>
        )}

        {standings && standings.entries.length > 0 && (
          <div className="divide-y divide-white/5">
            {standings.entries.map((entry, idx) => {
              const isMe = !!user && entry.userId === user.id;
              const rank = entry.rank ?? idx + 1;
              const rankColor =
                rank === 1
                  ? "from-amber-400 to-yellow-500 text-slate-900"
                  : rank === 2
                  ? "from-slate-300 to-slate-400 text-slate-900"
                  : rank === 3
                  ? "from-amber-700 to-orange-800 text-white"
                  : "bg-white/5 text-brand-200/70";
              return (
                <div
                  key={entry.userId}
                  className={
                    "flex items-center gap-3 px-5 py-3 " +
                    (isMe ? "bg-sky-400/5" : "")
                  }
                >
                  <div
                    className={
                      "flex h-8 w-8 flex-none items-center justify-center rounded-full text-xs font-bold " +
                      (rank <= 3 ? `bg-gradient-to-br ${rankColor}` : rankColor)
                    }
                  >
                    {rank}
                  </div>
                  <Avatar username={entry.username} avatar={entry.avatar} size={36} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium text-white">
                        {entry.username}
                      </span>
                      {isMe && (
                        <span className="rounded-full bg-sky-400/20 px-2 py-0.5 text-[10px] font-semibold text-sky-300">
                          我
                        </span>
                      )}
                      <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-brand-200/60">
                        Lv.{entry.level}
                      </span>
                    </div>
                    <div className="mt-0.5 text-[11px] text-brand-200/50">
                      总 XP {entry.currentExp} · 周起始 {entry.startingExp}
                    </div>
                  </div>
                  <div className="flex-none text-right">
                    <div className="font-semibold text-emerald-300">+{entry.weekExp}</div>
                    <div className="text-[10px] text-brand-200/50">本周 XP</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </GlassCard>

      {showLogin && <LoginPromptModal onClose={() => setShowLogin(false)} />}
    </PageShell>
  );
}
