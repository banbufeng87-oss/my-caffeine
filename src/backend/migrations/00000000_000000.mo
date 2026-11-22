import AccessControl "mo:caffeineai-authorization/access-control";
import Map "mo:core/Map";

module {
  public type OldActor = {};

  public type PatternColor = {
    code : Text;
    hex : Text;
    count : Nat;
  };

  public type StoredPattern = {
    id : Nat;
    owner : Principal;
    name : Text;
    gridWidth : Nat;
    gridHeight : Nat;
    colorCount : Nat;
    cells : [Text];
    colors : [PatternColor];
    totalBeads : Nat;
    createdAt : Int;
  };

  public type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    patterns : Map.Map<Nat, StoredPattern>;
    patternCounters : { var nextId : Nat };
  };

  public func migration(_ : OldActor) : NewActor {
    {
      accessControlState = AccessControl.initState();
      patterns = Map.empty();
      patternCounters = { var nextId = 0 };
    };
  };
};
