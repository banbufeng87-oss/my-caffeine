import { BEAD_BY_CODE } from "@/lib/beads";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";

interface MaterialsListProps {
  counts: Record<string, number>;
  total: number;
  onMapColor: (code: string) => void;
}

export function MaterialsList({
  counts,
  total,
  onMapColor,
}: MaterialsListProps) {
  const entries = Object.entries(counts)
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1]);
  const suggested = Math.ceil(total * 1.1);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-accent/15 px-2.5 py-1 font-mono text-xs font-semibold text-accent">
          {entries.length} 色
        </span>
        <span className="text-xs text-muted-foreground">
          点击颜色可整体替换
        </span>
      </div>

      <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {entries.map(([code, count]) => {
          const bead = BEAD_BY_CODE[code] ?? BEAD_BY_CODE["00"];
          return (
            <li key={code}>
              <button
                type="button"
                data-ocid={`materials.item.${code}`}
                onClick={() => onMapColor(code)}
                className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-smooth hover:bg-muted"
              >
                <span
                  className="size-6 shrink-0 rounded-full border border-foreground/15"
                  style={{ backgroundColor: bead.hex }}
                />
                <span className="min-w-0 flex-1 truncate text-sm">
                  <span className="font-mono text-xs text-muted-foreground">
                    {code}
                  </span>{" "}
                  {bead.name}
                </span>
                <span className="shrink-0 font-mono text-sm tabular-nums">
                  {count.toLocaleString("zh-CN")} 颗
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
        <p className="font-display text-base font-bold">
          总计{" "}
          <span className="font-mono tabular-nums">
            {total.toLocaleString("zh-CN")}
          </span>{" "}
          颗
        </p>
        <span className="flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-1 text-xs font-semibold text-accent">
          <Plus className="size-3" />
          建议购买{" "}
          <span className="font-mono tabular-nums">
            {suggested.toLocaleString("zh-CN")}
          </span>{" "}
          颗<span className="font-normal opacity-80">（含 10% 损耗）</span>
        </span>
      </div>
      <p className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground">
        <Minus className="size-3" />
        按实际用量 +10% 备货，避免中途缺色
      </p>
    </div>
  );
}

export function MaterialsSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: 6 }, (_, i) => `materials-skeleton-${i}`).map(
        (id) => (
          <div key={id} className="h-8 animate-pulse rounded-lg bg-muted" />
        ),
      )}
    </div>
  );
}
