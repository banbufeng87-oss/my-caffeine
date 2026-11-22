mixin () {
  public query func getApiDoc() : async Text {
    "# 拼豆图案生成器后端 API\n" #
    "\n" #
    "本后端负责保存、列出、读取与删除用户自己的拼豆图案。图案的像素化与配色在浏览器端完成，后端只存储生成结果。\n" #
    "\n" #
    "## 认证与授权\n" #
    "\n" #
    "- 所有方法都通过 Internet Identity 识别调用者。\n" #
    "- `savePattern`、`getPattern`、`deletePattern` 需要已登录（非匿名）调用者；匿名调用返回 `#err(#notAuthenticated)`。\n" #
    "- `listPatterns` 对匿名调用者返回空数组 `[]`。\n" #
    "- 每个用户只能访问自己保存的图案：`getPattern` 与 `deletePattern` 对他人图案返回 `#err(#notFound)`，`listPatterns` 只返回调用者自己的图案。\n" #
    "- 前端固定了 Internet Identity 的 derivation origin（发布在 `/.well-known/ii-derivation-origin`）。已持有用户 Internet Identity 授权的 agent 会针对该 origin 派生正确的 per-app principal（例如 `icp identity link web <name> --app <host>`）。该委托在过期前拥有用户在本应用中的完整权限。\n" #
    "- 本应用不要求注册审批：任何已登录调用者都可直接使用上述方法。\n" #
    "\n" #
    "## 方法\n" #
    "\n" #
    "### savePattern(input : PatternInput) : Result<Pattern, PatternError>\n" #
    "保存一份图案并返回带 `id` 与 `createdAt` 的完整图案。\n" #
    "- `input.name`：图案名称。\n" #
    "- `input.gridWidth` / `input.gridHeight`：网格宽高，必须大于 0。\n" #
    "- `input.colorCount`：颜色数量。\n" #
    "- `input.cells`：每格颜色编号的扁平数组，长度必须等于 `gridWidth * gridHeight`，按行优先排列。\n" #
    "- `input.colors`：所用颜色列表，每项含 `code`（编号）、`hex`（色值，如 `#FF0000`）、`count`（颗数）。\n" #
    "- `input.totalBeads`：总颗数。\n" #
    "- 校验失败返回 `#err(#invalidInput(消息))`。\n" #
    "\n" #
    "### listPatterns() : [PatternSummary]\n" #
    "返回当前用户保存的图案摘要，按保存时间从新到旧排列（内部按 id 降序）。\n" #
    "\n" #
    "### getPattern(id : Nat) : Result<Pattern, PatternError>\n" #
    "按图案标识返回完整图案数据，供重新打开查看。\n" #
    "\n" #
    "### deletePattern(id : Nat) : Result<(), PatternError>\n" #
    "删除当前用户自己的图案。删除不可撤销；重复删除同一 id 返回 `#err(#notFound)`。\n" #
    "\n" #
    "## 单位与编码\n" #
    "\n" #
    "- `createdAt` 为纳秒级时间戳（`Int`，来自 `Time.now()`）。\n" #
    "- `id` 为自增 `Nat`。\n" #
    "- `hex` 为 `#RRGGBB` 形式的十六进制色值字符串。\n" #
    "- `cells` 中每个元素是颜色编号字符串，与 `colors[].code` 对应。\n" #
    "\n" #
    "## 错误\n" #
    "\n" #
    "`PatternError` 变体：\n" #
    "- `#notAuthenticated`：调用者未登录。\n" #
    "- `#notFound`：图案不存在或不属于调用者。\n" #
    "- `#invalidInput(Text)`：输入校验失败，附带中文说明。\n" #
    "\n" #
    "## 重试与幂等\n" #
    "\n" #
    "- `savePattern` 非幂等：每次调用都会创建新图案并分配新 id，重试会产生重复图案。\n" #
    "- `deletePattern` 幂等性有限：首次成功，重复调用返回 `#notFound`。\n" #
    "- 查询方法（`listPatterns`、`getPattern`）为只读，可安全重复调用。\n" #
    "\n" #
    "## OQL\n" #
    "\n" #
    "后端通过 `schema()` 与 `execute()` 暴露 `pattern` 表，按用户隔离（scopedPerUser），每个用户只能查询自己的图案。"
  };
};
