import { useMemo, useState } from "react";
import type { GrammarPoint, Language, MistakeLogEntry } from "../types";
import { cefrRank } from "../lib/level-utils";

/**
 * Grammar dependency graph — small inline SVG renderer.
 *
 * Nodes are laid out left-to-right by CEFR rank (A1 leftmost, C2
 * rightmost). Arrows go from each prerequisite → the dependent
 * point. Node color encodes state:
 *   - red:    has wrong answers in the mistake log (易错)
 *   - blue:   no mistakes yet (default)
 *   - grey:   locked (a prerequisite hasn't been "seen" yet — for the
 *             MVP we treat any point at CEFR ≤ user's level as seen)
 *
 * Clicking a node opens a popover with summary + pitfalls.
 *
 * We deliberately avoid a graph layout library (react-flow, dagre,
 * etc.) to keep the bundle small. The simple rank-based layout is
 * fine for ≤ ~15 nodes per language.
 */

interface GrammarMapProps {
  language: Language;
  points: GrammarPoint[];
  mistakes: MistakeLogEntry[];
  /** Optional: highlight the grammar point of the current quiz. */
  highlightId?: string;
  /** Called when the user clicks a node. */
  onSelect?: (point: GrammarPoint) => void;
}

const NODE_W = 110;
const NODE_H = 44;
const GAP_X = 30;
const GAP_Y = 18;

export default function GrammarMap({ language, points, mistakes, highlightId, onSelect }: GrammarMapProps) {
  const [selectedId, setSelectedId] = useState<string | undefined>(highlightId);

  const mistakeMap = useMemo(() => {
    const m = new Map<string, MistakeLogEntry>();
    for (const e of mistakes) m.set(e.grammarPointId, e);
    return m;
  }, [mistakes]);

  // Lay out nodes: group by CEFR rank, stack within each column.
  const layout = useMemo(() => {
    const byRank = new Map<number, GrammarPoint[]>();
    for (const p of points) {
      const rank = cefrRank(language, p.level) || 1;
      if (!byRank.has(rank)) byRank.set(rank, []);
      byRank.get(rank)!.push(p);
    }
    const ranks = [...byRank.keys()].sort((a, b) => a - b);
    const positions = new Map<string, { x: number; y: number }>();
    const maxRowsInCol = Math.max(...[...byRank.values()].map((arr) => arr.length), 1);
    const colHeight = maxRowsInCol * (NODE_H + GAP_Y);
    let x = 0;
    for (const rank of ranks) {
      const col = byRank.get(rank)!;
      const startY = (colHeight - col.length * (NODE_H + GAP_Y)) / 2;
      col.forEach((p, i) => {
        positions.set(p.id, { x, y: startY + i * (NODE_H + GAP_Y) });
      });
      x += NODE_W + GAP_X;
    }
    const width = x;
    const height = colHeight + NODE_H;
    return { positions, width, height };
  }, [points, language]);

  const selected = points.find((p) => p.id === selectedId);

  if (points.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center text-xs text-brand-200/60">
        此语言暂无语法依赖图数据
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <svg
          width={layout.width}
          height={layout.height}
          className="block"
          style={{ minWidth: "100%" }}
        >
          {/* Arrows: prerequisite → dependent */}
          {points.flatMap((p) => {
            const to = layout.positions.get(p.id);
            if (!to) return [];
            return p.prerequisites.flatMap((prereqId) => {
              const from = layout.positions.get(prereqId);
              const prereq = points.find((q) => q.id === prereqId);
              if (!from || !prereq) return [];
              const x1 = from.x + NODE_W;
              const y1 = from.y + NODE_H / 2;
              const x2 = to.x;
              const y2 = to.y + NODE_H / 2;
              const mx = (x1 + x2) / 2;
              return (
                <path
                  key={`${prereqId}-${p.id}`}
                  d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
                  fill="none"
                  stroke="rgba(148, 163, 184, 0.35)"
                  strokeWidth={1.5}
                  markerEnd="url(#arrowhead)"
                />
              );
            });
          })}

          {/* Arrowhead marker */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="8"
              markerHeight="6"
              refX="7"
              refY="3"
              orient="auto"
            >
              <path d="M0,0 L8,3 L0,6 Z" fill="rgba(148, 163, 184, 0.5)" />
            </marker>
          </defs>

          {/* Nodes */}
          {points.map((p) => {
            const pos = layout.positions.get(p.id);
            if (!pos) return null;
            const mistake = mistakeMap.get(p.id);
            const isRed = !!mistake;
            const isHighlight = highlightId === p.id;
            const isSelected = selectedId === p.id;
            const fill = isRed
              ? "rgba(244, 63, 94, 0.18)"
              : isSelected
                ? "rgba(56, 189, 248, 0.22)"
                : "rgba(255, 255, 255, 0.05)";
            const stroke = isRed
              ? "rgba(251, 113, 133, 0.6)"
              : isHighlight
                ? "rgba(56, 189, 248, 0.8)"
                : "rgba(148, 163, 184, 0.3)";
            return (
              <g
                key={p.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setSelectedId(p.id);
                  onSelect?.(p);
                }}
              >
                <rect
                  width={NODE_W}
                  height={NODE_H}
                  rx={8}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={isHighlight ? 2 : 1}
                />
                <text
                  x={NODE_W / 2}
                  y={NODE_H / 2 - 4}
                  textAnchor="middle"
                  className="fill-white"
                  style={{ fontSize: 11, fontWeight: 600 }}
                >
                  {truncate(p.title, 12)}
                </text>
                <text
                  x={NODE_W / 2}
                  y={NODE_H / 2 + 10}
                  textAnchor="middle"
                  className="fill-brand-200"
                  style={{ fontSize: 9, opacity: 0.6 }}
                >
                  {p.level}{mistake ? ` · 错${mistake.wrongCount}` : ""}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected node detail */}
      {selected && (
        <div className="mt-3 rounded-lg border border-sky-400/20 bg-sky-400/5 p-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white">{selected.title}</span>
            <span className="text-brand-200/60">{selected.level}</span>
          </div>
          <div className="mt-1.5 text-brand-100/80">{selected.summary}</div>
          {selected.pitfalls.length > 0 && (
            <div className="mt-2">
              <div className="text-[10px] uppercase tracking-wider text-rose-300/70">易混点</div>
              <ul className="mt-1 space-y-1">
                {selected.pitfalls.map((p, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-rose-300 line-through">{p.wrong}</span>
                    <span className="text-brand-200/40">→</span>
                    <span className="text-emerald-300">{p.right}</span>
                    {p.note && <span className="text-[10px] text-brand-200/50">({p.note})</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {selected.prerequisites.length > 0 && (
            <div className="mt-2 text-[10px] text-brand-200/50">
              依赖: {selected.prerequisites
                .map((id) => points.find((p) => p.id === id)?.title ?? id)
                .join(", ")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}
