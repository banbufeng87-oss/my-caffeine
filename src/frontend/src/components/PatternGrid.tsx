import { BEAD_BY_CODE, isLightColor } from "@/lib/beads";
import { BOARD_SIZE } from "@/lib/pixelate";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface PatternGridProps {
  width: number;
  height: number;
  cells: string[];
  /** 每格像素尺寸 */
  cellSize: number;
  showNumbers?: boolean;
  /** 烫后效果：豆子熔合、圆润、带光泽 */
  fused?: boolean;
  onCellClick?: (index: number) => void;
  className?: string;
}

export function PatternGrid({
  width,
  height,
  cells,
  cellSize,
  showNumbers = true,
  fused = false,
  onCellClick,
  className,
}: PatternGridProps) {
  const rows = useMemo(() => {
    const result: { index: number; code: string }[][] = [];
    for (let y = 0; y < height; y += 1) {
      const row: { index: number; code: string }[] = [];
      for (let x = 0; x < width; x += 1) {
        const index = y * width + x;
        row.push({ index, code: cells[index] ?? "00" });
      }
      result.push(row);
    }
    return result;
  }, [width, height, cells]);

  const fontSize = Math.max(4, Math.min(cellSize * 0.42, 11));
  const showCellNumbers = showNumbers && !fused && cellSize >= 9;
  // 烫后效果：豆子略微放大并圆角，相邻同色豆子边缘融合成一片
  const beadInset = fused ? -cellSize * 0.06 : 0;
  const beadRadius = fused ? Math.max(2, cellSize * 0.42) : 0;

  return (
    <div
      className={cn("relative inline-block", className)}
      style={{ width: width * cellSize, height: height * cellSize }}
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${width}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${height}, ${cellSize}px)`,
        }}
      >
        {rows.map((row) =>
          row.map(({ index, code }) => {
            const bead = BEAD_BY_CODE[code] ?? BEAD_BY_CODE["00"];
            const light = isLightColor(bead.hex);
            const content = (
              <span className="contents" key="content">
                <span
                  className={cn("absolute", fused ? "bead-fused" : "inset-0")}
                  style={
                    fused
                      ? {
                          inset: beadInset,
                          borderRadius: beadRadius,
                          backgroundColor: bead.hex,
                        }
                      : { backgroundColor: bead.hex }
                  }
                />
                {showCellNumbers && (
                  <span
                    className="relative font-mono leading-none"
                    style={{
                      fontSize,
                      color: light ? "#1C1C1C" : "#FFFFFF",
                      opacity: 0.85,
                    }}
                  >
                    {code}
                  </span>
                )}
              </span>
            );
            const shared = {
              className: cn(
                "relative grid place-items-center outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring",
                fused && "z-0",
              ),
              style: { width: cellSize, height: cellSize },
            };
            return onCellClick ? (
              <button
                key={index}
                type="button"
                data-ocid={`pattern.cell.${index}`}
                aria-label={`第 ${Math.floor(index / width) + 1} 行第 ${(index % width) + 1} 列，颜色 ${code} ${bead.name}`}
                onClick={() => onCellClick(index)}
                {...shared}
              >
                {content}
              </button>
            ) : (
              <div key={index} {...shared}>
                {content}
              </div>
            );
          }),
        )}
      </div>
      {/* 29×29 拼板辅助线（烫后效果下隐藏，只呈现成品外观） */}
      {!fused &&
        Array.from(
          { length: Math.ceil(width / BOARD_SIZE) - 1 },
          (_, i) => `board-v-${i}`,
        ).map((id, i) => (
          <span
            key={id}
            aria-hidden="true"
            className="pointer-events-none absolute top-0 bottom-0 border-l-2 border-dashed border-foreground/45"
            style={{ left: (i + 1) * BOARD_SIZE * cellSize }}
          />
        ))}
      {!fused &&
        Array.from(
          { length: Math.ceil(height / BOARD_SIZE) - 1 },
          (_, i) => `board-h-${i}`,
        ).map((id, i) => (
          <span
            key={id}
            aria-hidden="true"
            className="pointer-events-none absolute left-0 right-0 border-t-2 border-dashed border-foreground/45"
            style={{ top: (i + 1) * BOARD_SIZE * cellSize }}
          />
        ))}
    </div>
  );
}
