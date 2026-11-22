import { Layout } from "@/components/Layout";
import { MaterialsList } from "@/components/MaterialsList";
import { PalettePicker } from "@/components/PalettePicker";
import { PatternPreview } from "@/components/PatternPreview";
import { type StepKey, Stepper } from "@/components/Stepper";
import { UploadZone } from "@/components/UploadZone";
import { Button } from "@/components/ui/button";
import { BEAD_BY_CODE, BEAD_PALETTE } from "@/lib/beads";
import { downloadDataUrl, renderPatternImage } from "@/lib/exportPattern";
import {
  type PatternResult,
  countColors,
  loadImage,
  pixelate,
} from "@/lib/pixelate";
import { cn } from "@/lib/utils";
import { Loader2, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const GRID_PRESETS = [
  { label: "29×29", width: 29, height: 29 },
  { label: "58×58", width: 58, height: 58 },
  { label: "93×95", width: 93, height: 95 },
];
const COLOR_OPTIONS = [8, 12, 17, 24];
const MAX_DIMENSION = 200;

type GridMode = "29" | "58" | "93" | "custom";

interface EditTarget {
  kind: "cell" | "color";
  index?: number;
  code?: string;
}

export default function Home() {
  const [step, setStep] = useState<StepKey>("upload");
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [gridMode, setGridMode] = useState<GridMode>("58");
  const [customWidth, setCustomWidth] = useState("40");
  const [customHeight, setCustomHeight] = useState("40");
  const [colorCount, setColorCount] = useState(17);
  const [generating, setGenerating] = useState(false);
  const [pattern, setPattern] = useState<PatternResult | null>(null);
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [showAllColors, setShowAllColors] = useState(false);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const customWidthNum = Number.parseInt(customWidth, 10);
  const customHeightNum = Number.parseInt(customHeight, 10);
  const customValid =
    Number.isInteger(customWidthNum) &&
    Number.isInteger(customHeightNum) &&
    customWidthNum > 0 &&
    customHeightNum > 0 &&
    customWidthNum <= MAX_DIMENSION &&
    customHeightNum <= MAX_DIMENSION;
  const customError =
    gridMode === "custom" && !customValid
      ? `请输入 1–${MAX_DIMENSION} 之间的正整数宽高`
      : null;

  const activeGrid =
    gridMode === "custom"
      ? { width: customWidthNum, height: customHeightNum }
      : (GRID_PRESETS.find((p) => p.label.startsWith(gridMode)) ??
        GRID_PRESETS[1]);

  const handleFile = (next: File) => {
    if (!next.type.startsWith("image/")) {
      setUploadError("请选择图片文件（JPG、PNG、WebP 等）");
      return;
    }
    if (next.size > 20 * 1024 * 1024) {
      setUploadError("图片超过 20MB，请压缩后再上传");
      return;
    }
    if (next.size === 0) {
      setUploadError("图片读取失败，请换一张试试");
      return;
    }
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(next);
    objectUrlRef.current = url;
    setFileName(next.name);
    setPreviewUrl(url);
    setUploadError(null);
    setPattern(null);
    setEditTarget(null);
    setShowAllColors(false);
    setStep("generate");
  };

  const handleRemove = () => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = null;
    setFileName(null);
    setPreviewUrl(null);
    setPattern(null);
    setEditTarget(null);
    setShowAllColors(false);
    setStep("upload");
  };

  const handleGenerate = async () => {
    if (!previewUrl) {
      setUploadError("请先上传一张图片");
      setStep("upload");
      return;
    }
    if (customError) return;
    setGenerating(true);
    setNotice(null);
    setUploadError(null);
    try {
      const img = await loadImage(previewUrl);
      const result = pixelate(
        img,
        activeGrid.width,
        activeGrid.height,
        colorCount,
      );
      setPattern(result);
      setEditTarget(null);
      setStep("materials");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "生成失败，请重试");
    } finally {
      setGenerating(false);
    }
  };

  const applyColor = (code: string) => {
    if (!pattern || !editTarget) return;
    let cells = pattern.cells;
    if (editTarget.kind === "cell" && editTarget.index !== undefined) {
      cells = pattern.cells.map((c, i) => (i === editTarget.index ? code : c));
    } else if (editTarget.kind === "color" && editTarget.code) {
      const from = editTarget.code;
      cells = pattern.cells.map((c) => (c === from ? code : c));
    }
    const counts = countColors(cells);
    const used = new Set(cells);
    const palette = pattern.palette.some((p) => p.code === code)
      ? pattern.palette
      : [...pattern.palette, BEAD_BY_CODE[code]].filter(Boolean);
    setPattern({
      ...pattern,
      cells,
      counts,
      palette: palette.filter((bead) => used.has(bead.code)),
    });
    setEditTarget(null);
  };

  const handleDownload = () => {
    if (!pattern) return;
    setDownloading(true);
    try {
      const dataUrl = renderPatternImage({
        width: pattern.width,
        height: pattern.height,
        cells: pattern.cells,
        counts: pattern.counts,
        total: pattern.total,
      });
      downloadDataUrl(
        dataUrl,
        `拼豆图案-${pattern.width}x${pattern.height}.png`,
      );
    } catch {
      setNotice("图片生成失败，请重试");
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    if (!pattern) return;
    const win = window.open("", "_blank");
    if (!win) {
      setNotice("浏览器拦截了打印窗口，请允许弹窗后重试");
      return;
    }
    try {
      const dataUrl = renderPatternImage({
        width: pattern.width,
        height: pattern.height,
        cells: pattern.cells,
        counts: pattern.counts,
        total: pattern.total,
      });
      const doc = win.document;
      doc.title = "拼豆图案";
      const style = doc.createElement("style");
      style.textContent =
        "body{margin:0;display:flex;justify-content:center;padding:16px}img{max-width:100%;height:auto}@media print{body{padding:0}}";
      doc.head.appendChild(style);
      const image = doc.createElement("img");
      image.alt = "拼豆图案";
      image.onload = () => win.print();
      image.src = dataUrl;
      doc.body.appendChild(image);
    } catch {
      win.close();
      setNotice("打印失败，请重试");
    }
  };

  const usedCodes = pattern
    ? Object.keys(pattern.counts).filter((code) => pattern.counts[code] > 0)
    : [];
  const paletteCodes = showAllColors
    ? BEAD_PALETTE.map((bead) => bead.code)
    : usedCodes;

  return (
    <Layout>
      <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto max-w-3xl px-4 pb-3 pt-4">
          <div className="mb-3 flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="size-5" />
            </span>
            <div className="min-w-0">
              <h1 className="font-display text-xl font-bold tracking-tight">
                拼豆图案生成器
              </h1>
              <p className="text-xs text-muted-foreground">
                上传照片 · 一键生成 · 备齐材料
              </p>
            </div>
          </div>
          <Stepper active={step} onSelect={setStep} />
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-4 px-4 py-4">
        <section
          id="upload"
          className="animate-fade-up rounded-2xl border border-border bg-card p-4 shadow-subtle"
        >
          <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold tracking-tight">
            <span className="grid size-6 place-items-center rounded-full bg-primary/10 font-mono text-xs text-primary">
              1
            </span>
            上传原图
          </h2>
          <UploadZone
            previewUrl={previewUrl}
            fileName={fileName}
            error={uploadError}
            onFile={handleFile}
            onRemove={handleRemove}
          />
        </section>

        <section
          id="generate"
          className="animate-fade-up rounded-2xl border border-border bg-card p-4 shadow-subtle [animation-delay:60ms]"
        >
          <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold tracking-tight">
            <span className="grid size-6 place-items-center rounded-full bg-primary/10 font-mono text-xs text-primary">
              2
            </span>
            参数设置
          </h2>

          <div className="space-y-3">
            <div>
              <p className="mb-1.5 text-xs font-semibold tracking-widest text-muted-foreground">
                网格尺寸
              </p>
              <div className="flex flex-wrap gap-2">
                {GRID_PRESETS.map((preset) => {
                  const key = preset.label.split("×")[0] as GridMode;
                  const active = gridMode === key;
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      data-ocid={`params.grid.${key}.radio`}
                      aria-pressed={active}
                      onClick={() => setGridMode(key)}
                      className={cn(
                        "h-9 rounded-full px-3.5 font-mono text-sm transition-smooth",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground hover:bg-secondary",
                      )}
                    >
                      {preset.label}
                    </button>
                  );
                })}
                <button
                  type="button"
                  data-ocid="params.grid.custom.radio"
                  aria-pressed={gridMode === "custom"}
                  onClick={() => setGridMode("custom")}
                  className={cn(
                    "h-9 rounded-full px-3.5 text-sm transition-smooth",
                    gridMode === "custom"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-secondary",
                  )}
                >
                  自定义
                </button>
              </div>
              {gridMode === "custom" && (
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={MAX_DIMENSION}
                    value={customWidth}
                    data-ocid="params.custom_width.input"
                    aria-label="自定义宽度"
                    onChange={(e) => setCustomWidth(e.target.value)}
                    className="h-10 w-20 rounded-lg border border-input bg-background px-2 text-center font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <span className="text-muted-foreground">×</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={MAX_DIMENSION}
                    value={customHeight}
                    data-ocid="params.custom_height.input"
                    aria-label="自定义高度"
                    onChange={(e) => setCustomHeight(e.target.value)}
                    className="h-10 w-20 rounded-lg border border-input bg-background px-2 text-center font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <span className="text-xs text-muted-foreground">格</span>
                </div>
              )}
              {customError && (
                <p
                  role="alert"
                  data-ocid="params.custom.error_state"
                  className="mt-1.5 text-xs font-medium text-destructive"
                >
                  {customError}
                </p>
              )}
            </div>

            <div>
              <p className="mb-1.5 text-xs font-semibold tracking-widest text-muted-foreground">
                色彩数量
              </p>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((count) => (
                  <button
                    key={count}
                    type="button"
                    data-ocid={`params.colors.${count}.radio`}
                    aria-pressed={colorCount === count}
                    onClick={() => setColorCount(count)}
                    className={cn(
                      "h-9 min-w-12 rounded-full px-3 font-mono text-sm transition-smooth",
                      colorCount === count
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground hover:bg-secondary",
                    )}
                  >
                    {count} 色
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="button"
              data-ocid="generate.primary_button"
              disabled={!previewUrl || generating || !!customError}
              onClick={() => void handleGenerate()}
              className="h-12 w-full rounded-full text-base font-semibold"
            >
              {generating ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  正在生成…
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  一键生成
                </>
              )}
            </Button>
            {!previewUrl && (
              <p className="text-center text-xs text-muted-foreground">
                请先上传图片，再生成图案
              </p>
            )}
            {notice && (
              <p
                role="alert"
                data-ocid="generate.error_state"
                className="rounded-lg bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive"
              >
                {notice}
              </p>
            )}
          </div>
        </section>

        {generating && (
          <div
            data-ocid="preview.loading_state"
            className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card p-8 text-sm text-muted-foreground"
          >
            <Loader2 className="size-4 animate-spin" />
            正在把图片转成拼豆图案…
          </div>
        )}

        {pattern && !generating && (
          <>
            <section
              id="preview"
              className="animate-fade-up rounded-2xl border border-border bg-card p-4 shadow-elevated"
            >
              <h2 className="mb-3 font-display text-lg font-bold tracking-tight">
                图案预览
              </h2>
              <PatternPreview
                width={pattern.width}
                height={pattern.height}
                cells={pattern.cells}
                onCellClick={(index) => setEditTarget({ kind: "cell", index })}
                onDownload={handleDownload}
                onPrint={handlePrint}
                downloading={downloading}
              />
            </section>

            <section
              id="materials"
              className="animate-fade-up rounded-2xl border border-border bg-card p-4 shadow-subtle"
            >
              <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold tracking-tight">
                <span className="grid size-6 place-items-center rounded-full bg-primary/10 font-mono text-xs text-primary">
                  3
                </span>
                所需材料
              </h2>
              <MaterialsList
                counts={pattern.counts}
                total={pattern.total}
                onMapColor={(code) => setEditTarget({ kind: "color", code })}
              />
            </section>
          </>
        )}

        {!pattern && !generating && (
          <div
            data-ocid="preview.empty_state"
            className="rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center"
          >
            <p className="text-sm font-semibold">还没有生成图案</p>
            <p className="mt-1 text-xs text-muted-foreground">
              上传图片并点击「一键生成」，这里会显示图案预览与材料清单
            </p>
          </div>
        )}
      </div>

      {editTarget && pattern && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-foreground/40 p-0 sm:items-center sm:p-4">
          <dialog
            open
            aria-label="选择新颜色"
            data-ocid="palette.dialog"
            className="m-0 w-full max-w-md rounded-t-2xl border border-border bg-card p-4 text-foreground shadow-elevated sm:rounded-2xl"
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <div>
                <p className="font-display text-base font-bold">
                  {editTarget.kind === "cell"
                    ? "替换这一格的颜色"
                    : "整体替换颜色"}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {editTarget.kind === "cell"
                    ? "选择新颜色后，该格立即更新"
                    : `把 ${editTarget.code} ${BEAD_BY_CODE[editTarget.code ?? ""]?.name ?? ""} 全部换成新颜色`}
                </p>
              </div>
              <button
                type="button"
                data-ocid="palette.close_button"
                aria-label="关闭"
                onClick={() => setEditTarget(null)}
                className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-muted"
              >
                <X className="size-4" />
              </button>
            </div>
            <PalettePicker
              codes={paletteCodes}
              selected={editTarget.code}
              onPick={applyColor}
              title={showAllColors ? "全部拼豆色板" : "当前图案使用的颜色"}
              hint="点击颜色即可应用"
            />
            <button
              type="button"
              data-ocid="palette.toggle_all_button"
              onClick={() => setShowAllColors((v) => !v)}
              className="mt-3 w-full rounded-full border border-border py-2 text-xs font-semibold text-muted-foreground transition-smooth hover:bg-muted"
            >
              {showAllColors ? "只看当前图案的颜色" : "浏览全部拼豆色板"}
            </button>
          </dialog>
        </div>
      )}
    </Layout>
  );
}
