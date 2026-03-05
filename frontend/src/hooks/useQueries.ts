import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type Principal } from '@dfinity/principal';
import { type UserProfile } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllMembers() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllMembers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddMember() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, mobile }: { name: string; mobile: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addMember(name, mobile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['summaryStats'] });
    },
  });
}

export function useGetMember(memberId: Principal) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['member', memberId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMember(memberId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMemberBalance(memberId: Principal) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['memberBalance', memberId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMemberBalance(memberId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPayments(memberId: Principal) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['payments', memberId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPayments(memberId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRecordPayment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ memberId, amount }: { memberId: Principal; amount: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.recordPayment(memberId, amount);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['payments', variables.memberId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['memberBalance', variables.memberId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['summaryStats'] });
    },
  });
}

export function useGetSummaryStats() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['summaryStats'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSummaryStats();
    },
    enabled: !!actor && !isFetching,
  });
}
