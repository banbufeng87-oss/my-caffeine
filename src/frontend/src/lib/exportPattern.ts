import { BEAD_BY_CODE } from "@/lib/beads";
import { BOARD_SIZE } from "@/lib/pixelate";

interface RenderOptions {
  width: number;
  height: number;
  cells: string[];
  counts: Record<string, number>;
  total: number;
}

function hexToRgb(hex: string): [number, number, number] {
  return [
    Number.parseInt(hex.slice(1, 3), 16),
    Number.parseInt(hex.slice(3, 5), 16),
    Number.parseInt(hex.slice(5, 7), 16),
  ];
}

/** 生成可下载的图案 PNG（含编号与拼板辅助线） */
export function renderPatternImage({
  width,
  height,
  cells,
  counts,
  total,
}: RenderOptions): string {
  const cell = 24;
  const pad = 32;
  const legendRows = Math.ceil(Object.keys(counts).length / 4);
  const legendHeight = legendRows * 30 + 60;
  const canvas = document.createElement("canvas");
  canvas.width = width * cell + pad * 2;
  canvas.height = height * cell + pad * 2 + legendHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("无法生成图片");

  ctx.fillStyle = "#FBF8F2";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const code = cells[y * width + x] ?? "00";
      const bead = BEAD_BY_CODE[code] ?? BEAD_BY_CODE["00"];
      const px = pad + x * cell;
      const py = pad + y * cell;
      ctx.fillStyle = bead.hex;
      ctx.fillRect(px, py, cell, cell);
      ctx.strokeStyle = "rgba(0,0,0,0.12)";
      ctx.lineWidth = 1;
      ctx.strokeRect(px + 0.5, py + 0.5, cell - 1, cell - 1);
      const [r, g, b] = hexToRgb(bead.hex);
      const light = (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.62;
      ctx.fillStyle = light ? "rgba(0,0,0,0.72)" : "rgba(255,255,255,0.85)";
      ctx.font = "600 9px ui-monospace, monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(code, px + cell / 2, py + cell / 2);
    }
  }

  // 拼板辅助线
  ctx.strokeStyle = "rgba(30,30,30,0.55)";
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);
  for (let x = BOARD_SIZE; x < width; x += BOARD_SIZE) {
    ctx.beginPath();
    ctx.moveTo(pad + x * cell, pad);
    ctx.lineTo(pad + x * cell, pad + height * cell);
    ctx.stroke();
  }
  for (let y = BOARD_SIZE; y < height; y += BOARD_SIZE) {
    ctx.beginPath();
    ctx.moveTo(pad, pad + y * cell);
    ctx.lineTo(pad + width * cell, pad + y * cell);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  // 图例
  const legendTop = pad + height * cell + 24;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#2B2622";
  ctx.font = "700 16px system-ui, sans-serif";
  ctx.fillText(
    `拼豆图案 · ${width}×${height} · 共 ${total} 颗`,
    pad,
    legendTop,
  );
  ctx.font = "500 12px ui-monospace, monospace";
  Object.entries(counts).forEach(([code, count], index) => {
    const bead = BEAD_BY_CODE[code] ?? BEAD_BY_CODE["00"];
    const col = index % 4;
    const row = Math.floor(index / 4);
    const lx = pad + col * ((width * cell) / 4);
    const ly = legendTop + 30 + row * 30;
    ctx.fillStyle = bead.hex;
    ctx.fillRect(lx, ly - 8, 16, 16);
    ctx.strokeStyle = "rgba(0,0,0,0.2)";
    ctx.strokeRect(lx + 0.5, ly - 7.5, 15, 15);
    ctx.fillStyle = "#2B2622";
    ctx.fillText(`${code} ${bead.name} ${count}颗`, lx + 22, ly);
  });

  return canvas.toDataURL("image/png");
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
