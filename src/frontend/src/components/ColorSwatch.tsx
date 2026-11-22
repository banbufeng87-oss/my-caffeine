import { BEAD_BY_CODE } from "@/lib/beads";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function ColorSwatch({
  code,
  size = "md",
  selected = false,
  onClick,
  label,
}: {
  code: string;
  size?: "sm" | "md";
  selected?: boolean;
  onClick?: () => void;
  label?: string;
}) {
  const bead = BEAD_BY_CODE[code] ?? BEAD_BY_CODE["00"];
  const dim = size === "sm" ? "size-6" : "size-8";
  const content = (
    <span
      className={cn(
        "grid place-items-center rounded-full border border-foreground/15",
        dim,
      )}
      style={{ backgroundColor: bead.hex }}
    >
      {selected && (
        <Check
          className="size-4"
          style={{ color: bead.hex === "#FFFFFF" ? "#1C1C1C" : "#FFFFFF" }}
        />
      )}
    </span>
  );
  if (!onClick) return content;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label ?? `颜色 ${code} ${bead.name}`}
      aria-pressed={selected}
      className={cn(
        "rounded-full p-0.5 outline-none transition-smooth focus-visible:ring-2 focus-visible:ring-ring",
        selected
          ? "ring-2 ring-primary ring-offset-2 ring-offset-card"
          : "hover:scale-105",
      )}
    >
      {content}
    </button>
  );
}
