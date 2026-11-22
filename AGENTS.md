# Project Guidance

## User Preferences

- 界面全部使用简体中文
- 设计干净、手机上好用
- 流程按上传、生成、清单三步走

## Accepted Requirements

- 支持拍照、相册选图与拖拽上传图片
- 网格尺寸 29×29、58×58、93×95 与自定义宽高，默认 58×58
- 颜色数量 8、12、17、24 色，默认 17 色
- 一键像素化并按拼豆标准色板归类生成图案预览
- 彩色格子内印颜色编号，黑白打印可区分
- 按 29×29 拼板绘制分界线并标注拼板数量
- 材料清单含编号、色块、颗数、总颗数与 +10% 购买建议
- 点格子改色与整色映射替换
- 图案可打印、可下载为图片
- 底部烫豆提示：5mm 豆、150–160°C 烫 10–15 秒
- 新增“适应屏幕”缩放档并默认按宽度完整显示整张图案
- 格子区域支持双向滚动与双指缩放
- 预览底部留足空间，悬浮按钮不遮挡格子
- 新增“图案模式 / 烫后效果”切换按钮
- 烫后效果模拟豆子熔合：缝隙变小、边缘圆润融合、表面带光泽

## Verified Commands

- **typecheck**: `pnpm typecheck`
- **fix**: `pnpm fix`
- **build**: `pnpm build`

## Learnings

- Frontend verified commands from src/frontend: pnpm typecheck, pnpm fix; backend from src/backend: mops check --fix, mops build; bindings from the repo root: pnpm bindgen.
- Biome flags keyless JSX fragments inside map; wrap cell content in a keyed span with className contents.
- Biome useSemanticElements rejects role=dialog on a div; use a native dialog element for the color picker sheet.
- OQL manual mode is required for records with array fields; declare each column via .payload.
- Enhanced migration forbids inline initializers on stable actor fields; pass a shared { var nextId } record to mixins instead of a derived state literal.
- Pattern generation runs entirely in the browser (src/frontend/src/lib/pixelate.ts and beads.ts); the backend stores saved patterns via savePattern, listPatterns, getPattern and deletePattern.
- Preview zoom lives in PatternPreview.tsx: ZOOM_LEVELS plus a fit-to-screen level; pinch zoom snaps to the fixed level array and re-anchors scroll around the gesture center.
- PatternGrid.tsx renders both the flat pattern mode and the melted/ironed preview mode; the melted mode hides color code labels and is preview-only, so exportPattern.ts output stays unchanged.
- Biome useSemanticElements rejects role=group on a div; use a native fieldset with an sr-only legend for toggle groups.
