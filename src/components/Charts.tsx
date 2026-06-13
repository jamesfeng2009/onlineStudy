import { cn } from "../lib/utils";

// Simple responsive line / area chart with SVG.
export function LineChart({
  data,
  height = 180,
  color = "#38BDF8",
  label,
}: {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
  label?: string;
}) {
  const width = 600;
  const pad = { t: 16, r: 16, b: 28, l: 36 };
  const max = Math.max(10, ...data.map((d) => d.value));
  const n = data.length;
  const stepX = (width - pad.l - pad.r) / Math.max(1, n - 1);
  const stepY = (height - pad.t - pad.b) / max;

  const pts = data.map((d, i) => ({
    x: pad.l + i * stepX,
    y: height - pad.b - d.value * stepY,
    v: d.value,
    label: d.label,
  }));

  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath =
    `M${pad.l},${height - pad.b} ` +
    pts.map((p) => `L${p.x},${p.y}`).join(" ") +
    ` L${pad.l + (n - 1) * stepX},${height - pad.b} Z`;

  const yTicks = 4;
  return (
    <div className="w-full">
      {label && (
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-white">{label}</span>
          <span className="text-xs text-brand-200/60">
            {data[data.length - 1]?.label ?? ""}
          </span>
        </div>
      )}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="lineAreaG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.45" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {Array.from({ length: yTicks + 1 }).map((_, i) => {
          const y = pad.t + ((height - pad.t - pad.b) * i) / yTicks;
          return (
            <line
              key={i}
              x1={pad.l}
              x2={width - pad.r}
              y1={y}
              y2={y}
              stroke="rgba(255,255,255,0.06)"
              strokeDasharray="3 4"
            />
          );
        })}
        <path d={areaPath} fill="url(#lineAreaG)" />
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={3} fill={color} stroke="#020617" strokeWidth="2" />
            {(i === 0 || i === pts.length - 1 || i % Math.ceil(pts.length / 4) === 0) && (
              <text
                x={p.x}
                y={height - pad.b + 18}
                fill="rgba(186,230,253,0.6)"
                fontSize="10"
                textAnchor="middle"
              >
                {p.label}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

export function RadarChart({
  labels,
  values,
  size = 240,
  color = "#38BDF8",
}: {
  labels: string[];
  values: number[]; // 0-100
  size?: number;
  color?: string;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 30;
  const n = labels.length;
  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;

  const gridLevels = [0.25, 0.5, 0.75, 1];

  const point = (i: number, v: number) => {
    const a = angle(i);
    return {
      x: cx + Math.cos(a) * radius * (v / 100),
      y: cy + Math.sin(a) * radius * (v / 100),
    };
  };

  const polyPoints = values.map((v, i) => point(i, v));
  const polyPath =
    polyPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-auto w-full" preserveAspectRatio="xMidYMid meet">
      {gridLevels.map((lv, idx) => (
        <polygon
          key={idx}
          points={labels
            .map((_, i) => {
              const a = angle(i);
              return `${cx + Math.cos(a) * radius * lv},${cy + Math.sin(a) * radius * lv}`;
            })
            .join(" ")}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
      ))}
      {labels.map((_, i) => {
        const a = angle(i);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + Math.cos(a) * radius}
            y2={cy + Math.sin(a) * radius}
            stroke="rgba(255,255,255,0.08)"
          />
        );
      })}
      <polygon points={polyPath} fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2" />
      {polyPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3.5} fill={color} />
      ))}
      {labels.map((l, i) => {
        const a = angle(i);
        const x = cx + Math.cos(a) * (radius + 16);
        const y = cy + Math.sin(a) * (radius + 16);
        return (
          <text
            key={i}
            x={x}
            y={y}
            fontSize="11"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="rgba(186,230,253,0.8)"
          >
            {l}
          </text>
        );
      })}
    </svg>
  );
}

export function ProgressRing({
  value,
  size = 140,
  stroke = 10,
  color = "#38BDF8",
  label,
  centerLabel,
  centerHint,
}: {
  value: number; // 0-100
  size?: number;
  stroke?: number;
  color?: string;
  label?: string;
  centerLabel?: string;
  centerHint?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (c * Math.max(0, Math.min(100, value))) / 100;
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={stroke}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={color}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="font-display text-2xl font-bold text-white">{centerLabel ?? `${value}%`}</div>
          {centerHint && <div className="text-[10px] text-brand-200/70">{centerHint}</div>}
        </div>
      </div>
      {label && <div className="mt-3 text-xs text-brand-200/70">{label}</div>}
    </div>
  );
}

export function HorizontalBar({
  items,
  color = "#38BDF8",
}: {
  items: { label: string; value: number }[];
  color?: string;
}) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-brand-100">{item.label}</span>
            <span className="text-brand-200/60">{item.value}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className={cn("h-full rounded-full bg-gradient-to-r from-sky-400/80", color)}
              style={{
                width: `${(item.value / max) * 100}%`,
                background: `linear-gradient(90deg, ${color}, #f472b6)`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
