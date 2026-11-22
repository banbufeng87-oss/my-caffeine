import { type BeadColor, nearestBead, pickPalette } from "@/lib/beads";

export interface PatternResult {
  width: number;
  height: number;
  /** 每格颜色编号，长度 = width * height，行优先 */
  cells: string[];
  palette: BeadColor[];
  counts: Record<string, number>;
  total: number;
}

export const BOARD_SIZE = 29;

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("图片读取失败，请换一张试试"));
    img.src = src;
  });
}

/** 把图片按网格像素化，并归类到所选数量的拼豆色板 */
export function pixelate(
  img: HTMLImageElement,
  width: number,
  height: number,
  colorCount: number,
): PatternResult {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("当前浏览器不支持图片处理");

  // 居中裁切为网格比例，避免图案被拉伸
  const targetRatio = width / height;
  const srcRatio = img.naturalWidth / img.naturalHeight;
  let sx = 0;
  let sy = 0;
  let sw = img.naturalWidth;
  let sh = img.naturalHeight;
  if (srcRatio > targetRatio) {
    sw = img.naturalHeight * targetRatio;
    sx = (img.naturalWidth - sw) / 2;
  } else {
    sh = img.naturalWidth / targetRatio;
    sy = (img.naturalHeight - sh) / 2;
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);
  const data = ctx.getImageData(0, 0, width, height).data;

  const samples: [number, number, number][] = [];
  for (let i = 0; i < data.length; i += 4) {
    samples.push([data[i], data[i + 1], data[i + 2]]);
  }

  // 按出现频率挑选候选色，再在色板中取最接近的 N 色
  const buckets = new Map<
    string,
    { rgb: [number, number, number]; n: number }
  >();
  for (const rgb of samples) {
    const key = `${rgb[0] >> 4}-${rgb[1] >> 4}-${rgb[2] >> 4}`;
    const entry = buckets.get(key);
    if (entry) {
      entry.n += 1;
    } else {
      buckets.set(key, { rgb, n: 1 });
    }
  }
  const targets = [...buckets.values()]
    .sort((a, b) => b.n - a.n)
    .slice(0, Math.max(colorCount * 3, colorCount))
    .map((b) => b.rgb);

  const palette = pickPalette(targets, colorCount);
  const cells = samples.map((rgb) => nearestBead(rgb, palette).code);

  // 去掉未被使用的颜色，保证色板与清单一致
  const used = new Set(cells);
  const finalPalette = palette.filter((bead) => used.has(bead.code));

  const counts: Record<string, number> = {};
  for (const code of cells) {
    counts[code] = (counts[code] ?? 0) + 1;
  }

  return {
    width,
    height,
    cells,
    palette: finalPalette,
    counts,
    total: cells.length,
  };
}

export function countColors(cells: string[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const code of cells) {
    counts[code] = (counts[code] ?? 0) + 1;
  }
  return counts;
}

export function boardLabel(width: number, height: number): string {
  const cols = Math.ceil(width / BOARD_SIZE);
  const rows = Math.ceil(height / BOARD_SIZE);
  return `${cols}×${rows} 模板 · 共 ${cols * rows} 块`;
}
