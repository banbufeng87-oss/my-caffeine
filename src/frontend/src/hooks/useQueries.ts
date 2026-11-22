import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useListPatterns() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["patterns"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPatterns();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSavePattern() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      input: Parameters<NonNullable<typeof actor>["savePattern"]>[0],
    ) => {
      if (!actor) throw new Error("后端尚未就绪");
      return actor.savePattern(input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["patterns"] });
    },
  });
}

export function useDeletePattern() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("后端尚未就绪");
      return actor.deletePattern(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["patterns"] });
    },
  });
}
