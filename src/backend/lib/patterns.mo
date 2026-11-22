import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Result "mo:core/Result";
import Time "mo:core/Time";
import Types "../types/patterns";

module {
  public type State = {
    patterns : Map.Map<Types.PatternId, Types.StoredPattern>;
    counters : { var nextId : Nat };
  };

  func toPattern(stored : Types.StoredPattern) : Types.Pattern {
    {
      id = stored.id;
      name = stored.name;
      gridWidth = stored.gridWidth;
      gridHeight = stored.gridHeight;
      colorCount = stored.colorCount;
      cells = stored.cells;
      colors = stored.colors;
      totalBeads = stored.totalBeads;
      createdAt = stored.createdAt;
    };
  };

  func toSummary(stored : Types.StoredPattern) : Types.PatternSummary {
    {
      id = stored.id;
      name = stored.name;
      gridWidth = stored.gridWidth;
      gridHeight = stored.gridHeight;
      colorCount = stored.colorCount;
      totalBeads = stored.totalBeads;
      createdAt = stored.createdAt;
    };
  };

  public func savePattern(state : State, caller : Principal, input : Types.PatternInput) : Result.Result<Types.Pattern, Types.PatternError> {
    if (caller.isAnonymous()) {
      return #err(#notAuthenticated);
    };
    if (input.gridWidth == 0 or input.gridHeight == 0) {
      return #err(#invalidInput("网格宽高必须大于 0"));
    };
    if (input.cells.size() != input.gridWidth * input.gridHeight) {
      return #err(#invalidInput("格子数量与网格尺寸不匹配"));
    };
    let id = state.counters.nextId;
    state.counters.nextId := id + 1;
    let stored : Types.StoredPattern = {
      id;
      owner = caller;
      name = input.name;
      gridWidth = input.gridWidth;
      gridHeight = input.gridHeight;
      colorCount = input.colorCount;
      cells = input.cells;
      colors = input.colors;
      totalBeads = input.totalBeads;
      createdAt = Time.now();
    };
    state.patterns.add(id, stored);
    #ok(toPattern(stored));
  };

  public func listPatterns(state : State, caller : Principal) : [Types.PatternSummary] {
    if (caller.isAnonymous()) {
      return [];
    };
    let mine = state.patterns.values().filter(func(p) = Principal.equal(p.owner, caller)).toArray();
    let sorted = mine.sort(func(a, b) = Nat.compare(b.id, a.id));
    sorted.map(func(p) = toSummary(p));
  };

  public func getPattern(state : State, caller : Principal, id : Types.PatternId) : Result.Result<Types.Pattern, Types.PatternError> {
    if (caller.isAnonymous()) {
      return #err(#notAuthenticated);
    };
    switch (state.patterns.get(id)) {
      case (?stored) {
        if (Principal.equal(stored.owner, caller)) {
          #ok(toPattern(stored));
        } else {
          #err(#notFound);
        };
      };
      case null { #err(#notFound) };
    };
  };

  public func deletePattern(state : State, caller : Principal, id : Types.PatternId) : Result.Result<(), Types.PatternError> {
    if (caller.isAnonymous()) {
      return #err(#notAuthenticated);
    };
    switch (state.patterns.get(id)) {
      case (?stored) {
        if (Principal.equal(stored.owner, caller)) {
          state.patterns.remove(id);
          #ok(());
        } else {
          #err(#notFound);
        };
      };
      case null { #err(#notFound) };
    };
  };
};
