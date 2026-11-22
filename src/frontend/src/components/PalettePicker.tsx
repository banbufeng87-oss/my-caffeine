import { BEAD_BY_CODE } from "@/lib/beads";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface PalettePickerProps {
  codes: string[];
  selected?: string;
  onPick: (code: string) => void;
  title: string;
  hint?: string;
}

export function PalettePicker({
  codes,
  selected,
  onPick,
  title,
  hint,
}: PalettePickerProps) {
  return (
    <div>
      <p className="text-sm font-semibold">{title}</p>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
      <div className="mt-2 grid grid-cols-6 gap-2 sm:grid-cols-8">
        {codes.map((code) => {
          const bead = BEAD_BY_CODE[code] ?? BEAD_BY_CODE["00"];
          const active = selected === code;
          return (
            <button
              key={code}
              type="button"
              data-ocid={`palette.color.${code}`}
              aria-pressed={active}
              aria-label={`${code} ${bead.name}`}
              onClick={() => onPick(code)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg p-1 outline-none transition-smooth focus-visible:ring-2 focus-visible:ring-ring",
                active ? "bg-primary/10 ring-1 ring-primary" : "hover:bg-muted",
              )}
            >
              <span
                className="grid size-8 place-items-center rounded-full border border-foreground/15"
                style={{ backgroundColor: bead.hex }}
              >
                {active && (
                  <Check
                    className="size-4"
                    style={{
                      color: bead.hex === "#FFFFFF" ? "#1C1C1C" : "#FFFFFF",
                    }}
                  />
                )}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {code}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
