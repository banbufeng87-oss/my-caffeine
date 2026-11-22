import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import Expose "mo:caffeineai-oql/Expose";
import Map "mo:core/Map";
import PatternsLib "lib/patterns";
import PatternsOql "lib/patterns-oql";
import PatternsApi "mixins/patterns-api";
import ApiDocMixin "mixins/api-doc";
import Types "types/patterns";

actor {
  let accessControlState : AccessControl.AccessControlState;
  let patterns : Map.Map<Types.PatternId, Types.StoredPattern>;
  let patternCounters : { var nextId : Nat };

  include MixinAuthorization(accessControlState, null);
  include PatternsApi({ patterns; counters = patternCounters });
  include Expose({ entities = [PatternsOql.entity(patterns)] });
  include ApiDocMixin();
};
