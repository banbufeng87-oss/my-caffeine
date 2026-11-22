import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import OQL "mo:caffeineai-oql";
import Entity "mo:caffeineai-oql/Entity";
import Types "../types/patterns";

module {
  // 图案实体：每个用户只能查询自己的图案（scopedPerUser）。
  // StoredPattern 含数组字段（cells / colors），因此使用手动模式逐列声明。
  public func entity(patterns : Map.Map<Types.PatternId, Types.StoredPattern>) : Entity.Decl {
    OQL.Entity.manual<Types.StoredPattern>(
      "pattern",
      func () = patterns.values(),
      "Pattern",
      "id",
    )
      .sample({
        id = 0;
        owner = Principal.fromText("aaaaa-aa");
        name = "";
        gridWidth = 0;
        gridHeight = 0;
        colorCount = 0;
        cells = [];
        colors = [];
        totalBeads = 0;
        createdAt = 0;
      })
      .payload("id", func p = p.id)
      .payload("owner", func p = p.owner)
      .payload("name", func p = p.name)
      .payload("gridWidth", func p = p.gridWidth)
      .payload("gridHeight", func p = p.gridHeight)
      .payload("colorCount", func p = p.colorCount)
      .payload("cellCount", func p = p.cells.size())
      .payload("colorCodes", func p = p.colors.map(func c = c.code).values().join(","))
      .payload("totalBeads", func p = p.totalBeads)
      .payload("createdAt", func p = p.createdAt)
      .ownedBy("owner")
      .scopedPerUser()
      .build();
  };
};
