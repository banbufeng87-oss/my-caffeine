import Result "mo:core/Result";
import PatternsLib "../lib/patterns";
import Types "../types/patterns";

mixin (state : PatternsLib.State) {
  public shared ({ caller }) func savePattern(input : Types.PatternInput) : async Result.Result<Types.Pattern, Types.PatternError> {
    PatternsLib.savePattern(state, caller, input);
  };

  public query ({ caller }) func listPatterns() : async [Types.PatternSummary] {
    PatternsLib.listPatterns(state, caller);
  };

  public query ({ caller }) func getPattern(id : Types.PatternId) : async Result.Result<Types.Pattern, Types.PatternError> {
    PatternsLib.getPattern(state, caller, id);
  };

  public shared ({ caller }) func deletePattern(id : Types.PatternId) : async Result.Result<(), Types.PatternError> {
    PatternsLib.deletePattern(state, caller, id);
  };
};
