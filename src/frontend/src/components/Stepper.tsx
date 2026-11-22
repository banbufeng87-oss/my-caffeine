import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export type StepKey = "upload" | "generate" | "materials";

const STEPS: { key: StepKey; label: string }[] = [
  { key: "upload", label: "上传" },
  { key: "generate", label: "生成" },
  { key: "materials", label: "清单" },
];

export function Stepper({
  active,
  onSelect,
}: {
  active: StepKey;
  onSelect: (key: StepKey) => void;
}) {
  const activeIndex = STEPS.findIndex((s) => s.key === active);
  return (
    <nav aria-label="制作流程" className="flex items-center gap-1.5">
      {STEPS.map((step, index) => {
        const done = index < activeIndex;
        const current = index === activeIndex;
        return (
          <button
            key={step.key}
            type="button"
            data-ocid={`stepper.${step.key}.tab`}
            aria-current={current ? "step" : undefined}
            onClick={() => onSelect(step.key)}
            className={cn(
              "flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full px-2 text-sm font-semibold transition-smooth",
              current
                ? "bg-primary text-primary-foreground shadow-subtle"
                : done
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-secondary",
            )}
          >
            <span
              className={cn(
                "grid size-5 place-items-center rounded-full font-mono text-[11px]",
                current
                  ? "bg-primary-foreground/20"
                  : done
                    ? "bg-primary/15 text-primary"
                    : "bg-background/70",
              )}
            >
              {done ? <Check className="size-3" /> : index + 1}
            </span>
            {step.label}
          </button>
        );
      })}
    </nav>
  );
}
