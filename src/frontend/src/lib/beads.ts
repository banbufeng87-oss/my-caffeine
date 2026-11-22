export interface BeadColor {
  code: string;
  name: string;
  hex: string;
}

/** 拼豆标准色板（按色相分组，编号与常见拼豆色卡一致） */
export const BEAD_PALETTE: BeadColor[] = [
  { code: "01", name: "中国红", hex: "#C8322B" },
  { code: "02", name: "珊瑚粉", hex: "#F08A7E" },
  { code: "03", name: "樱花粉", hex: "#F6C6CE" },
  { code: "04", name: "玫红", hex: "#D6336C" },
  { code: "05", name: "酒红", hex: "#8C2B3A" },
  { code: "06", name: "橘红", hex: "#E4572E" },
  { code: "07", name: "南瓜橙", hex: "#EE8B3A" },
  { code: "08", name: "浅灰", hex: "#C9C9C4" },
  { code: "09", name: "深灰", hex: "#6E6E6A" },
  { code: "10", name: "柠檬黄", hex: "#F7D64A" },
  { code: "11", name: "奶油黄", hex: "#FBE9A8" },
  { code: "12", name: "芒果黄", hex: "#F2B33D" },
  { code: "13", name: "橄榄绿", hex: "#8A9A3B" },
  { code: "14", name: "草绿", hex: "#5FA83F" },
  { code: "15", name: "薄荷绿", hex: "#A8DDB5" },
  { code: "16", name: "墨绿", hex: "#2F6B4F" },
  { code: "17", name: "天蓝", hex: "#6FB7E0" },
  { code: "18", name: "湖蓝", hex: "#2E8FB8" },
  { code: "19", name: "藏青", hex: "#2B3A67" },
  { code: "20", name: "薰衣草紫", hex: "#B49BD6" },
  { code: "21", name: "葡萄紫", hex: "#6B4A8C" },
  { code: "22", name: "浅棕", hex: "#C89B6E" },
  { code: "23", name: "焦糖棕", hex: "#A9713F" },
  { code: "24", name: "米白", hex: "#F3EAD8" },
  { code: "25", name: "肤色", hex: "#F2C9A8" },
  { code: "26", name: "深肤", hex: "#C98F63" },
  { code: "27", name: "雾霾蓝", hex: "#9FB4C7" },
  { code: "28", name: "抹茶绿", hex: "#C3D68A" },
  { code: "29", name: "砖红", hex: "#A64B3C" },
  { code: "30", name: "香芋紫", hex: "#D9C2E0" },
  { code: "31", name: "青柠", hex: "#D6E86B" },
  { code: "32", name: "孔雀蓝", hex: "#1F7A8C" },
  { code: "33", name: "玫瑰金", hex: "#E0A899" },
  { code: "34", name: "沙色", hex: "#E3D3B8" },
  { code: "35", name: "咖啡色", hex: "#5A3A28" },
  { code: "36", name: "雾粉", hex: "#E8B4B8" },
  { code: "37", name: "青灰", hex: "#8FA6A0" },
  { code: "38", name: "芥末黄", hex: "#C9A227" },
  { code: "39", name: "深蓝", hex: "#1D3557" },
  { code: "40", name: "浅粉紫", hex: "#EBC7E8" },
  { code: "41", name: "松石绿", hex: "#3FB6A8" },
  { code: "42", name: "暖白", hex: "#FBF7EF" },
  { code: "43", name: "浅蓝", hex: "#BBDDF2" },
  { code: "44", name: "深紫", hex: "#4A2E63" },
  { code: "45", name: "橙棕", hex: "#B5651D" },
  { code: "46", name: "灰绿", hex: "#7C8B7A" },
  { code: "47", name: "桃粉", hex: "#F7B2A3" },
  { code: "48", name: "冰蓝", hex: "#D6ECF5" },
  { code: "49", name: "深红棕", hex: "#6E2B22" },
  { code: "50", name: "浅黄绿", hex: "#E4EDB8" },
  { code: "51", name: "蓝紫", hex: "#5B6BB5" },
  { code: "52", name: "浅咖", hex: "#D8BFA3" },
  { code: "53", name: "青绿", hex: "#2E9E8F" },
  { code: "54", name: "杏色", hex: "#F5D3A8" },
  { code: "55", name: "紫红", hex: "#9B2C5A" },
  { code: "56", name: "石板灰", hex: "#4A4E52" },
  { code: "57", name: "浅薄荷", hex: "#D3EFE3" },
  { code: "58", name: "金棕", hex: "#8C6A3F" },
  { code: "59", name: "雾紫", hex: "#A99BC4" },
  { code: "60", name: "浅橙", hex: "#F8C08A" },
  { code: "61", name: "深青", hex: "#1F5F5B" },
  { code: "62", name: "粉紫", hex: "#E3A6C8" },
  { code: "63", name: "黄绿", hex: "#B5C94A" },
  { code: "64", name: "浅珊瑚", hex: "#FBC4B0" },
  { code: "65", name: "深橄榄", hex: "#5C6B2F" },
  { code: "66", name: "雾蓝灰", hex: "#A9B8C4" },
  { code: "67", name: "浅紫", hex: "#CDB8E8" },
  { code: "68", name: "暖灰", hex: "#B8AFA4" },
  { code: "69", name: "深棕", hex: "#3E2A1E" },
  { code: "70", name: "浅绿", hex: "#9FD8A8" },
  { code: "71", name: "蓝绿", hex: "#4FA3A5" },
  { code: "72", name: "浅杏", hex: "#FBE0C4" },
  { code: "73", name: "紫罗兰", hex: "#7E5BA6" },
  { code: "74", name: "浅灰蓝", hex: "#C7D3DC" },
  { code: "75", name: "深玫红", hex: "#A61E4D" },
  { code: "76", name: "浅棕黄", hex: "#E0C08A" },
  { code: "77", name: "墨蓝", hex: "#22304A" },
  { code: "78", name: "浅青", hex: "#B7E3DE" },
  { code: "79", name: "橙黄", hex: "#F5A623" },
  { code: "80", name: "浅玫瑰", hex: "#F2C4C4" },
  { code: "81", name: "深绿", hex: "#1F4D3A" },
  { code: "82", name: "浅天蓝", hex: "#A9D6F0" },
  { code: "83", name: "浅紫灰", hex: "#C9C2D6" },
  { code: "84", name: "浅黄", hex: "#FBF0B8" },
  { code: "85", name: "深橙", hex: "#C25A1E" },
  { code: "86", name: "浅粉", hex: "#FADCE2" },
  { code: "87", name: "灰蓝", hex: "#6C7F94" },
  { code: "88", name: "浅橄榄", hex: "#C8D19B" },
  { code: "89", name: "深紫红", hex: "#5E1F3D" },
  { code: "90", name: "浅灰绿", hex: "#D5DED2" },
  { code: "91", name: "浅蓝紫", hex: "#C3CBE8" },
  { code: "92", name: "浅棕红", hex: "#D9A08A" },
  { code: "93", name: "深灰蓝", hex: "#3B4A5A" },
  { code: "94", name: "浅黄橙", hex: "#FAD9A0" },
  { code: "95", name: "浅青绿", hex: "#CBE9D8" },
  { code: "96", name: "浅紫粉", hex: "#E8D0E8" },
  { code: "97", name: "浅棕灰", hex: "#C4B5A5" },
  { code: "98", name: "浅蓝绿", hex: "#BFE0E4" },
  { code: "99", name: "曜石黑", hex: "#1C1C1C" },
  { code: "00", name: "纯白色", hex: "#FFFFFF" },
];

export const BEAD_BY_CODE: Record<string, BeadColor> = Object.fromEntries(
  BEAD_PALETTE.map((c) => [c.code, c]),
);

export function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace("#", "");
  return [
    Number.parseInt(value.slice(0, 2), 16),
    Number.parseInt(value.slice(2, 4), 16),
    Number.parseInt(value.slice(4, 6), 16),
  ];
}

/** 相对亮度，用于决定格子编号用深色还是浅色文字 */
export function isLightColor(hex: string): boolean {
  const [r, g, b] = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.62;
}

/** 在色板中挑选与目标色最接近的 N 种颜色（加权 RGB 距离） */
export function pickPalette(
  targets: [number, number, number][],
  count: number,
): BeadColor[] {
  const chosen: BeadColor[] = [];
  const used = new Set<string>();
  for (const target of targets) {
    let best: BeadColor | null = null;
    let bestDist = Number.POSITIVE_INFINITY;
    for (const bead of BEAD_PALETTE) {
      if (used.has(bead.code)) continue;
      const [r, g, b] = hexToRgb(bead.hex);
      const dr = r - target[0];
      const dg = g - target[1];
      const db = b - target[2];
      const dist = 2 * dr * dr + 4 * dg * dg + 3 * db * db;
      if (dist < bestDist) {
        bestDist = dist;
        best = bead;
      }
    }
    if (best) {
      chosen.push(best);
      used.add(best.code);
    }
    if (chosen.length >= count) break;
  }
  return chosen;
}

export function nearestBead(
  rgb: [number, number, number],
  palette: BeadColor[],
): BeadColor {
  let best = palette[0];
  let bestDist = Number.POSITIVE_INFINITY;
  for (const bead of palette) {
    const [r, g, b] = hexToRgb(bead.hex);
    const dr = r - rgb[0];
    const dg = g - rgb[1];
    const db = b - rgb[2];
    const dist = 2 * dr * dr + 4 * dg * dg + 3 * db * db;
    if (dist < bestDist) {
      bestDist = dist;
      best = bead;
    }
  }
  return best;
}
