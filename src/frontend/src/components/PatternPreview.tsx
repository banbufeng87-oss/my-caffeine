import { BOARD_SIZE } from "@/lib/pixelate";
import { cn } from "@/lib/utils";
import {
  Download,
  Loader2,
  Maximize2,
  Printer,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { PatternGrid } from "./PatternGrid";

interface PatternPreviewProps {
  width: number;
  height: number;
  cells: string[];
  onCellClick: (index: number) => void;
  onDownload: () => void;
  onPrint: () => void;
  downloading: boolean;
}

/** 固定缩放档位（每格像素），索引 0 为“适应屏幕” */
const ZOOM_LEVELS = [10, 14, 18, 24];
const FIT = -1;
const MIN_ZOOM = 0;
const MAX_ZOOM = ZOOM_LEVELS.length - 1;
const MIN_CELL = 3;
const MAX_CELL = 40;

type PreviewMode = "pattern" | "fused";

export function PatternPreview({
  width,
  height,
  cells,
  onCellClick,
  onDownload,
  onPrint,
  downloading,
}: PatternPreviewProps) {
  const [zoom, setZoom] = useState<number>(FIT);
  const [mode, setMode] = useState<PreviewMode>("pattern");
  const [fitCell, setFitCell] = useState(10);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pinchRef = useRef<{ dist: number; cell: number } | null>(null);

  // 图案尺寸变化时回到“适应屏幕”
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset on size change only
  useEffect(() => {
    setZoom(FIT);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
      scrollRef.current.scrollLeft = 0;
    }
  }, [width, height]);

  // 按容器宽度计算“适应屏幕”的格子尺寸
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const measure = () => {
      const available = el.clientWidth - 24; // 减去内边距
      const next = Math.max(
        MIN_CELL,
        Math.min(MAX_CELL, Math.floor(available / width)),
      );
      setFitCell(next);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [width]);

  const cellSize = zoom === FIT ? fitCell : ZOOM_LEVELS[zoom];

  const zoomIn = () =>
    setZoom((z) => {
      const current = z === FIT ? MIN_ZOOM - 1 : z;
      return Math.min(MAX_ZOOM, current + 1);
    });
  const zoomOut = () =>
    setZoom((z) => {
      if (z === FIT) return FIT;
      return z - 1 < MIN_ZOOM ? FIT : z - 1;
    });

  // 双指捏合缩放，围绕手势中心，吸附到最近的固定档位
  const handleTouchMove = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      if (event.touches.length !== 2) return;
      const el = scrollRef.current;
      if (!el) return;
      const [a, b] = [event.touches[0], event.touches[1]];
      const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      if (!pinchRef.current) {
        pinchRef.current = { dist, cell: cellSize };
        return;
      }
      event.preventDefault();
      const ratio = dist / pinchRef.current.dist;
      const targetCell = Math.max(
        MIN_CELL,
        Math.min(MAX_CELL, pinchRef.current.cell * ratio),
      );
      // 吸附到最近的固定档位
      let nearest = MIN_ZOOM;
      for (let i = 1; i <= MAX_ZOOM; i += 1) {
        if (
          Math.abs(ZOOM_LEVELS[i] - targetCell) <
          Math.abs(ZOOM_LEVELS[nearest] - targetCell)
        ) {
          nearest = i;
        }
      }
      if (nearest === zoom) return;
      const nextCell = ZOOM_LEVELS[nearest];
      // 手势中心在内容坐标系中的位置
      const rect = el.getBoundingClientRect();
      const cx = (a.clientX + b.clientX) / 2 - rect.left + el.scrollLeft;
      const cy = (a.clientY + b.clientY) / 2 - rect.top + el.scrollTop;
      const contentX = cx / cellSize;
      const contentY = cy / cellSize;
      setZoom(nearest);
      pinchRef.current = { dist, cell: nextCell };
      requestAnimationFrame(() => {
        el.scrollLeft = contentX * nextCell - (cx - el.scrollLeft);
        el.scrollTop = contentY * nextCell - (cy - el.scrollTop);
      });
    },
    [cellSize, zoom],
  );

  const handleTouchEnd = () => {
    pinchRef.current = null;
  };

  const cols = Math.ceil(width / BOARD_SIZE);
  const rows = Math.ceil(height / BOARD_SIZE);

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <fieldset className="flex rounded-full bg-muted p-0.5">
          <legend className="sr-only">预览模式</legend>
          <button
            type="button"
            data-ocid="preview.mode.pattern.toggle"
            aria-pressed={mode === "pattern"}
            onClick={() => setMode("pattern")}
            className={cn(
              "h-8 rounded-full px-3 text-xs font-semibold transition-smooth",
              mode === "pattern"
                ? "bg-card text-foreground shadow-subtle"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            图案模式
          </button>
          <button
            type="button"
            data-ocid="preview.mode.fused.toggle"
            aria-pressed={mode === "fused"}
            onClick={() => setMode("fused")}
            className={cn(
              "h-8 rounded-full px-3 text-xs font-semibold transition-smooth",
              mode === "fused"
                ? "bg-card text-foreground shadow-subtle"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            烫后效果
          </button>
        </fieldset>

        <div className="flex items-center gap-1">
          <button
            type="button"
            data-ocid="preview.fit_button"
            aria-label="适应屏幕"
            aria-pressed={zoom === FIT}
            onClick={() => setZoom(FIT)}
            className={cn(
              "grid size-8 place-items-center rounded-full border transition-smooth",
              zoom === FIT
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-muted",
            )}
          >
            <Maximize2 className="size-4" />
          </button>
          <button
            type="button"
            data-ocid="preview.zoom_out_button"
            aria-label="缩小"
            disabled={zoom === FIT}
            onClick={zoomOut}
            className="grid size-8 place-items-center rounded-full border border-border text-muted-foreground transition-smooth hover:bg-muted disabled:opacity-40"
          >
            <ZoomOut className="size-4" />
          </button>
          <span className="w-12 text-center font-mono text-xs text-muted-foreground">
            {zoom === FIT ? "适应" : `${cellSize}px`}
          </span>
          <button
            type="button"
            data-ocid="preview.zoom_in_button"
            aria-label="放大"
            disabled={zoom === MAX_ZOOM}
            onClick={zoomIn}
            className="grid size-8 place-items-center rounded-full border border-border text-muted-foreground transition-smooth hover:bg-muted disabled:opacity-40"
          >
            <ZoomIn className="size-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        data-ocid="preview.canvas_target"
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="max-h-[60vh] touch-pan-x touch-pan-y overflow-auto overscroll-contain rounded-xl border border-border bg-muted/30 p-3 pb-6"
      >
        <div className="mx-auto w-max">
          <PatternGrid
            width={width}
            height={height}
            cells={cells}
            cellSize={cellSize}
            fused={mode === "fused"}
            onCellClick={mode === "pattern" ? onCellClick : undefined}
          />
        </div>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        {mode === "pattern"
          ? "点击任意格子可改色 · 双指捏合可缩放"
          : "烫后成品预览 · 不影响打印与下载"}
      </p>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-xs text-muted-foreground">
          {width}×{height} · {cols}×{rows} 模板 · 共 {cols * rows} 块
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            data-ocid="preview.print_button"
            onClick={onPrint}
            className="flex h-9 items-center gap-1.5 rounded-full border border-border px-3 text-xs font-semibold transition-smooth hover:bg-muted"
          >
            <Printer className="size-3.5" />
            打印图案
          </button>
          <button
            type="button"
            data-ocid="preview.download_button"
            onClick={onDownload}
            disabled={downloading}
            className="flex h-9 items-center gap-1.5 rounded-full bg-primary px-3 text-xs font-semibold text-primary-foreground transition-smooth hover:bg-primary/90 disabled:opacity-60"
          >
            {downloading ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Download className="size-3.5" />
            )}
            下载图片
          </button>
        </div>
      </div>
    </div>
  );
}
