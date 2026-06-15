import { useEffect, useMemo, useState } from "react";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Languages,
  BookOpen,
  Type,
  HelpCircle,
  Headphones,
  MessageSquare,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import PageShell from "../components/PageShell";
import { GlassCard } from "../components/GlassCard";
import { api } from "../lib/api";
import { cn } from "../lib/utils";

type FieldType = "text" | "number" | "boolean" | "textarea" | "array" | "json";

interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  width?: string;
}

interface ResourceConfig {
  key: string;
  label: string;
  icon: React.ElementType;
  resource: string;
  idKey: string;
  fields: FieldConfig[];
}

function useResources() {
  const { t } = useTranslation();
  return useMemo<ResourceConfig[]>(
    () => [
      {
        key: "languages",
        label: t("admin.resources.languages"),
        icon: Languages,
        resource: "languages",
        idKey: "code",
        fields: [
          { key: "code", label: t("admin.fields.code"), type: "text", required: true, width: "w-24" },
          { key: "name", label: t("admin.fields.name"), type: "text", required: true },
          { key: "native", label: t("admin.fields.native"), type: "text", required: true },
          { key: "flag", label: t("admin.fields.flag"), type: "text", required: true, width: "w-20" },
          { key: "tagline", label: t("admin.fields.tagline"), type: "text", required: true },
          { key: "levels", label: t("admin.fields.levels"), type: "array", required: true },
          { key: "status", label: t("admin.fields.status"), type: "text", required: true, width: "w-28" },
        ],
      },
      {
        key: "courses",
        label: t("admin.resources.courses"),
        icon: BookOpen,
        resource: "courses",
        idKey: "id",
        fields: [
          { key: "languageCode", label: t("admin.fields.languageCode"), type: "text", required: true, width: "w-24" },
          { key: "title", label: t("admin.fields.title"), type: "text", required: true },
          { key: "level", label: t("admin.fields.level"), type: "text", required: true, width: "w-24" },
          { key: "levelGroup", label: t("admin.fields.levelGroup"), type: "text", required: true, width: "w-24" },
          { key: "description", label: t("admin.fields.description"), type: "textarea", required: true },
          { key: "lessons", label: t("admin.fields.lessons"), type: "number", required: true, width: "w-20" },
          { key: "minutes", label: t("admin.fields.minutes"), type: "number", required: true, width: "w-20" },
          { key: "cover", label: t("admin.fields.cover"), type: "text", required: true },
          { key: "tags", label: t("admin.fields.tags"), type: "array" },
          { key: "vipOnly", label: t("admin.fields.vipOnly"), type: "boolean", width: "w-16" },
          { key: "courseOrder", label: t("admin.fields.courseOrder"), type: "number", width: "w-20" },
        ],
      },
      {
        key: "words",
        label: t("admin.resources.words"),
        icon: Type,
        resource: "words",
        idKey: "id",
        fields: [
          { key: "languageCode", label: t("admin.fields.languageCode"), type: "text", required: true, width: "w-24" },
          { key: "level", label: t("admin.fields.level"), type: "text", required: true, width: "w-24" },
          { key: "word", label: t("admin.fields.word"), type: "text", required: true },
          { key: "translation", label: t("admin.fields.translation"), type: "text", required: true },
          { key: "phonetic", label: t("admin.fields.phonetic"), type: "text" },
          { key: "exampleSentence", label: t("admin.fields.exampleSentence"), type: "textarea", required: true },
          { key: "vocabOrder", label: t("admin.fields.vocabOrder"), type: "number", width: "w-20" },
        ],
      },
      {
        key: "quizzes",
        label: t("admin.resources.quizzes"),
        icon: HelpCircle,
        resource: "quizzes",
        idKey: "id",
        fields: [
          { key: "languageCode", label: t("admin.fields.languageCode"), type: "text", required: true, width: "w-24" },
          { key: "level", label: t("admin.fields.level"), type: "text", required: true, width: "w-24" },
          { key: "question", label: t("admin.fields.question"), type: "textarea", required: true },
          { key: "options", label: t("admin.fields.options"), type: "array", required: true },
          { key: "answer", label: t("admin.fields.answer"), type: "number", required: true, width: "w-20" },
          { key: "explain", label: t("admin.fields.explain"), type: "textarea", required: true },
          { key: "quizOrder", label: t("admin.fields.quizOrder"), type: "number", width: "w-20" },
        ],
      },
      {
        key: "listening",
        label: t("admin.resources.listening"),
        icon: Headphones,
        resource: "listening",
        idKey: "id",
        fields: [
          { key: "languageCode", label: t("admin.fields.languageCode"), type: "text", required: true, width: "w-24" },
          { key: "level", label: t("admin.fields.level"), type: "text", required: true, width: "w-24" },
          { key: "title", label: t("admin.fields.title"), type: "text", required: true },
          { key: "script", label: t("admin.fields.script"), type: "textarea", required: true },
          { key: "blanks", label: t("admin.fields.blanks"), type: "json", required: true },
          { key: "listenOrder", label: t("admin.fields.listenOrder"), type: "number", width: "w-20" },
        ],
      },
      {
        key: "speaking",
        label: t("admin.resources.speaking"),
        icon: MessageSquare,
        resource: "speaking",
        idKey: "id",
        fields: [
          { key: "languageCode", label: t("admin.fields.languageCode"), type: "text", required: true, width: "w-24" },
          { key: "level", label: t("admin.fields.level"), type: "text", required: true, width: "w-24" },
          { key: "phrase", label: t("admin.fields.phrase"), type: "text", required: true },
          { key: "translation", label: t("admin.fields.translation"), type: "text", required: true },
          { key: "phonetic", label: t("admin.fields.phonetic"), type: "text" },
          { key: "speakOrder", label: t("admin.fields.speakOrder"), type: "number", width: "w-20" },
        ],
      },
    ],
    [t]
  );
}

export default function AdminPage() {
  const { t } = useTranslation();
  const RESOURCES = useResources();
  const [me, setMe] = useState<Record<string, unknown> | null>(null);
  const [loadingMe, setLoadingMe] = useState(true);
  const [activeTab, setActiveTab] = useState("languages");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .me()
      .then((res) => {
        if (!cancelled) setMe(res.user as Record<string, unknown>);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError((err as Error).message);
      })
      .finally(() => {
        if (!cancelled) setLoadingMe(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loadingMe) {
    return (
      <PageShell>
        <div className="flex items-center justify-center py-20 text-brand-200/70">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          {t("admin.loading")}
        </div>
      </PageShell>
    );
  }

  if (me?.role !== "admin") {
    return (
      <PageShell>
        <GlassCard className="py-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
            <X className="h-8 w-8 text-brand-200/60" />
          </div>
          <h2 className="font-display text-xl font-bold text-white">{t("admin.noPermissionTitle")}</h2>
          <p className="mt-2 text-sm text-brand-200/60">{t("admin.noPermissionDesc")}</p>
        </GlassCard>
      </PageShell>
    );
  }

  const config = RESOURCES.find((r) => r.key === activeTab) ?? RESOURCES[0];

  return (
    <PageShell title={t("admin.title")} subtitle={t("admin.subtitle")}>
      {error && (
        <div className="mb-4 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        {RESOURCES.map((r) => {
          const Icon = r.icon;
          const active = r.key === activeTab;
          return (
            <button
              key={r.key}
              onClick={() => setActiveTab(r.key)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm transition",
                active
                  ? "bg-gradient-to-r from-sky-400/30 to-fuchsia-400/30 text-white ring-1 ring-white/20"
                  : "bg-white/5 text-brand-200/80 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {r.label}
            </button>
          );
        })}
      </div>

      <ResourcePanel key={config.key} config={config} onError={setError} t={t} />
    </PageShell>
  );
}

function ResourcePanel({
  config,
  onError,
  t,
}: {
  config: ResourceConfig;
  onError: (msg: string | null) => void;
  t: (key: string, options?: Record<string, unknown>) => string;
}) {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("");
  const [level, setLevel] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    onError(null);
    try {
      const data = await api.adminList(config.resource, {
        language: language || undefined,
        level: level || undefined,
      });
      setItems(data);
    } catch (err: unknown) {
      onError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.resource]);

  const openCreate = () => {
    setEditingId(null);
    setForm({});
    setModalOpen(true);
  };

  const openEdit = (item: Record<string, unknown>) => {
    setEditingId(String(item[config.idKey]));
    const next: Record<string, unknown> = {};
    for (const f of config.fields) {
      const value = item[f.key];
      if (f.type === "array" && Array.isArray(value)) {
        next[f.key] = value.join("\n");
      } else if (f.type === "json") {
        next[f.key] = JSON.stringify(value ?? [], null, 2);
      } else if (f.type === "boolean") {
        next[f.key] = value ?? false;
      } else {
        next[f.key] = value ?? "";
      }
    }
    setForm(next);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm({});
  };

  const handleSave = async () => {
    const payload: Record<string, unknown> = {};
    for (const f of config.fields) {
      if (f.type === "array") {
        const raw = String(form[f.key] ?? "").trim();
        payload[f.key] = raw ? raw.split("\n").map((s) => s.trim()) : [];
      } else if (f.type === "json") {
        const raw = String(form[f.key] ?? "").trim();
        try {
          payload[f.key] = raw ? JSON.parse(raw) : [];
        } catch {
          onError(t("admin.errors.invalidJson", { label: f.label }));
          return;
        }
      } else if (f.type === "number") {
        const num = Number(form[f.key]);
        payload[f.key] = Number.isNaN(num) ? 0 : num;
      } else if (f.type === "boolean") {
        payload[f.key] = Boolean(form[f.key]);
      } else {
        payload[f.key] = form[f.key] ?? "";
      }
    }

    for (const f of config.fields) {
      if (f.required && (payload[f.key] === "" || payload[f.key] === undefined || payload[f.key] === null)) {
        onError(t("admin.errors.required", { label: f.label }));
        return;
      }
    }

    setSaving(true);
    onError(null);
    try {
      if (editingId) {
        await api.adminUpdate(config.resource, editingId, payload);
      } else {
        await api.adminCreate(config.resource, payload);
      }
      await load();
      closeModal();
    } catch (err: unknown) {
      onError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: Record<string, unknown>) => {
    const id = String(item[config.idKey]);
    if (!confirm(t("admin.confirmDelete", { label: config.label }))) return;
    onError(null);
    try {
      await api.adminDelete(config.resource, id);
      await load();
    } catch (err: unknown) {
      onError((err as Error).message);
    }
  };

  const visibleFields = useMemo(() => config.fields.filter((f) => f.type !== "textarea" && f.type !== "json"), [config.fields]);

  return (
    <>
      <GlassCard>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
              <Search className="h-4 w-4 text-brand-200/60" />
              <input
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder={t("admin.fields.languageCode")}
                className="bg-transparent text-sm text-white placeholder:text-brand-200/40 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
              <Search className="h-4 w-4 text-brand-200/60" />
              <input
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                placeholder={t("admin.fields.level")}
                className="bg-transparent text-sm text-white placeholder:text-brand-200/40 focus:outline-none"
              />
            </div>
            <button
              onClick={() => void load()}
              className="rounded-xl bg-white/5 px-3 py-2 text-sm text-brand-200/80 transition hover:bg-white/10 hover:text-white"
            >
              {t("admin.query")}
            </button>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-sky-400 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-fuchsia-500/30 transition hover:shadow-fuchsia-500/50"
          >
            <Plus className="h-4 w-4" />
            {t("admin.add")}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-brand-200/60">
                {visibleFields.map((f) => (
                  <th key={f.key} className={cn("px-3 py-3 font-medium", f.width)}>
                    {f.label}
                  </th>
                ))}
                <th className="px-3 py-3 text-right">{t("admin.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={visibleFields.length + 1} className="py-10 text-center text-brand-200/60">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={visibleFields.length + 1} className="py-10 text-center text-brand-200/60">
                    {t("admin.noData")}
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={String(item[config.idKey])} className="hover:bg-white/[0.02]">
                    {visibleFields.map((f) => (
                      <td key={f.key} className="px-3 py-3 text-brand-100">
                        <CellValue field={f} value={item[f.key]} t={t} />
                      </td>
                    ))}
                    <td className="px-3 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(item)}
                          className="rounded-lg bg-white/5 p-1.5 text-brand-200 transition hover:bg-white/10 hover:text-white"
                          title={t("admin.edit")}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => void handleDelete(item)}
                          className="rounded-lg bg-white/5 p-1.5 text-red-300 transition hover:bg-red-400/10"
                          title={t("admin.delete")}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#0b1324] p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-white">
                {editingId ? t("admin.editLabel", { label: config.label }) : t("admin.addLabel", { label: config.label })}
              </h3>
              <button
                onClick={closeModal}
                className="rounded-lg p-1 text-brand-200 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {config.fields.map((f) => (
                <div key={f.key}>
                  <label className="mb-1.5 block text-xs font-medium text-brand-200/80">
                    {f.label}
                    {f.required && <span className="ml-1 text-red-300">*</span>}
                  </label>
                  <FormInput field={f} value={form[f.key]} onChange={(v) => setForm((s) => ({ ...s, [f.key]: v }))} t={t} />
              </div>
            ))}
          </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="rounded-xl bg-white/5 px-4 py-2 text-sm text-brand-200 transition hover:bg-white/10 hover:text-white"
              >
                {t("admin.cancel")}
              </button>
              <button
                onClick={() => void handleSave()}
                disabled={saving}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-400 to-fuchsia-500 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-fuchsia-500/30 transition hover:shadow-fuchsia-500/50 disabled:opacity-60"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {t("admin.save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function CellValue({ field, value, t }: { field: FieldConfig; value: unknown; t: (key: string) => string }) {
  if (field.type === "boolean") {
    return <span>{value ? t("admin.enabled") : t("admin.disabled")}</span>;
  }
  if (field.type === "array") {
    const arr = Array.isArray(value) ? value : [];
    return (
      <span className="inline-flex max-w-[160px] flex-wrap gap-1">
        {arr.slice(0, 3).map((v, i) => (
          <span key={i} className="rounded bg-white/5 px-1.5 py-0.5 text-[11px]">
            {String(v)}
          </span>
        ))}
        {arr.length > 3 && <span className="text-[11px] text-brand-200/50">+{arr.length - 3}</span>}
      </span>
    );
  }
  if (field.type === "json") {
    return <span className="text-xs text-brand-200/60">{Array.isArray(value) ? `[${value.length}]` : "{}"}</span>;
  }
  const text = String(value ?? "");
  return <span className="max-w-[200px] truncate">{text}</span>;
}

function FormInput({
  field,
  value,
  onChange,
  t,
}: {
  field: FieldConfig;
  value: unknown;
  onChange: (val: unknown) => void;
  t: (key: string, options?: Record<string, unknown>) => string;
}) {
  if (field.type === "textarea") {
    return (
      <textarea
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-brand-200/40 focus:border-sky-400/50 focus:outline-none"
        placeholder={field.label}
      />
    );
  }
  if (field.type === "array") {
    return (
      <textarea
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-brand-200/40 focus:border-sky-400/50 focus:outline-none"
        placeholder={t("admin.arrayPlaceholder", { label: field.label })}
      />
    );
  }
  if (field.type === "json") {
    return (
      <textarea
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-sm text-white placeholder:text-brand-200/40 focus:border-sky-400/50 focus:outline-none"
        placeholder={t("admin.jsonPlaceholder", { label: field.label })}
      />
    );
  }
  if (field.type === "boolean") {
    return (
      <label className="inline-flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 rounded border-white/10 bg-white/5 text-sky-400 focus:ring-sky-400/50"
        />
        <span className="text-sm text-brand-200/70">{t("admin.enabled")}</span>
      </label>
    );
  }
  return (
    <input
      type={field.type === "number" ? "number" : "text"}
      value={String(value ?? "")}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-brand-200/40 focus:border-sky-400/50 focus:outline-none"
      placeholder={field.label}
    />
  );
}
