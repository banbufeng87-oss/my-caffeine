import Common "common";

module {
  public type PatternId = Common.PatternId;
  public type Timestamp = Common.Timestamp;

  // 一种拼豆颜色：编号、色值（如 "#FF0000"）、颗数
  public type PatternColor = {
    code : Text;
    hex : Text;
    count : Nat;
  };

  // 保存图案的输入
  public type PatternInput = {
    name : Text;
    gridWidth : Nat;
    gridHeight : Nat;
    colorCount : Nat;
    // 每格颜色编号，长度 = gridWidth * gridHeight，按行优先排列
    cells : [Text];
    colors : [PatternColor];
    totalBeads : Nat;
  };

  // 完整图案数据
  public type Pattern = {
    id : PatternId;
    name : Text;
    gridWidth : Nat;
    gridHeight : Nat;
    colorCount : Nat;
    cells : [Text];
    colors : [PatternColor];
    totalBeads : Nat;
    createdAt : Timestamp;
  };

  // 图案列表摘要
  public type PatternSummary = {
    id : PatternId;
    name : Text;
    gridWidth : Nat;
    gridHeight : Nat;
    colorCount : Nat;
    totalBeads : Nat;
    createdAt : Timestamp;
  };

  // 内部存储记录
  public type StoredPattern = {
    id : PatternId;
    owner : Principal;
    name : Text;
    gridWidth : Nat;
    gridHeight : Nat;
    colorCount : Nat;
    cells : [Text];
    colors : [PatternColor];
    totalBeads : Nat;
    createdAt : Timestamp;
  };

  public type PatternError = {
    #notAuthenticated;
    #notFound;
    #invalidInput : Text;
  };
};
