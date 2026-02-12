import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type {
  Order,
  QueuePosition,
  QueueSummary,
  OrderStatus,
  ArtifactContent,
  OriginMapDistrict,
  SocialImpactMetric,
  BookingRequestDto,
  BookingRequest,
  BookingStatus,
  PackageAddOn,
  Membership,
  LoyaltyReward,
  LoyaltyTransaction,
  UserProfile,
} from '../backend';
import { Principal } from '@dfinity/principal';

// User Profile queries
export function useGetCallerUserProfile() {
  const { actor, isFetching } = useActor();

  return useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
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

// Kitchen Queue Summary
export function useGetKitchenQueueSummary() {
  const { actor, isFetching } = useActor();

  return useQuery<QueueSummary>({
    queryKey: ['kitchenQueueSummary'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getKitchenQueueSummary();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });
}

// Order queries
export function useGetOrderQueuePosition(orderId: number) {
  const { actor, isFetching } = useActor();

  return useQuery<QueuePosition>({
    queryKey: ['orderQueuePosition', orderId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getOrderQueuePosition(BigInt(orderId));
    },
    enabled: !!actor && !isFetching && orderId > 0,
    refetchInterval: 5000,
  });
}

export function useGetClientOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['clientOrders'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getClientOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (deliverTo: string | null) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createOrder(deliverTo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientOrders'] });
      queryClient.invalidateQueries({ queryKey: ['kitchenQueueSummary'] });
    },
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: bigint; status: OrderStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateOrderStatus(orderId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOrdersQueue'] });
      queryClient.invalidateQueries({ queryKey: ['clientOrders'] });
      queryClient.invalidateQueries({ queryKey: ['orderQueuePosition'] });
      queryClient.invalidateQueries({ queryKey: ['kitchenQueueSummary'] });
    },
  });
}

// Artifact queries
export function useGetArtifactById(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<ArtifactContent>({
    queryKey: ['artifact', id],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getArtifactById(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useGetAllArtifacts() {
  const { actor, isFetching } = useActor();

  return useQuery<ArtifactContent[]>({
    queryKey: ['artifacts'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllArtifacts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateArtifact() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (artifact: ArtifactContent) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createArtifact(artifact);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artifacts'] });
    },
  });
}

export function useUpdateArtifact() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (artifact: ArtifactContent) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateArtifact(artifact);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artifacts'] });
    },
  });
}

// District queries
export function useGetAllDistricts() {
  const { actor, isFetching } = useActor();

  return useQuery<OriginMapDistrict[]>({
    queryKey: ['districts'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllDistricts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateDistrict() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (district: OriginMapDistrict) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createDistrict(district);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['districts'] });
    },
  });
}

export function useUpdateDistrict() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (district: OriginMapDistrict) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateDistrict(district);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['districts'] });
    },
  });
}

// Metrics queries
export function useGetCurrentMetrics() {
  const { actor, isFetching } = useActor();

  return useQuery<SocialImpactMetric[]>({
    queryKey: ['metrics'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCurrentMetrics();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateMetric() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (metric: SocialImpactMetric) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateMetric(metric);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
    },
  });
}

// Booking queries
export function useRequestBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: BookingRequestDto) => {
      if (!actor) throw new Error('Actor not available');
      return actor.requestBooking(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callerBookings'] });
    },
  });
}

export function useGetCallerBookings() {
  const { actor, isFetching } = useActor();

  return useQuery<BookingRequest[]>({
    queryKey: ['callerBookings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllBookings() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[Principal, BookingRequest[]]>>({
    queryKey: ['allBookings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateBookingStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, bookingId, status }: { user: string; bookingId: bigint; status: BookingStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateBookingStatus(Principal.fromText(user), bookingId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allBookings'] });
      queryClient.invalidateQueries({ queryKey: ['callerBookings'] });
    },
  });
}

// Package queries
export function useGetAvailablePackages() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['packages'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAvailablePackages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddPackage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ packageId, packageName }: { packageId: string; packageName: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addPackage(packageId, packageName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
    },
  });
}

export function useGetPackageAddOns() {
  const { actor, isFetching } = useActor();

  return useQuery<PackageAddOn[]>({
    queryKey: ['packageAddOns'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPackageAddOns();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddPackageAddOn() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (addOn: PackageAddOn) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addPackageAddOn(addOn);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packageAddOns'] });
    },
  });
}

// Membership queries
export function useGetCallerMembership() {
  const { actor, isFetching } = useActor();

  return useQuery<Membership | null>({
    queryKey: ['callerMembership'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerMembership();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateMembership() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, identityNumber, photoUrl }: { name: string; identityNumber: string | null; photoUrl: string | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createMembership(name, identityNumber, photoUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callerMembership'] });
    },
  });
}

export function useGetAllMemberships() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[Principal, Membership]>>({
    queryKey: ['allMemberships'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllMemberships();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useVerifyMembership() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, isVerified }: { user: string; isVerified: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.verifyMembership(Principal.fromText(user), isVerified);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allMemberships'] });
    },
  });
}

// Loyalty queries
export function useGetCurrentLoyaltyPoints() {
  const { actor, isFetching } = useActor();

  return useQuery<[bigint, { pointsBalance: bigint; transactions: LoyaltyTransaction[] }]>({
    queryKey: ['currentLoyaltyPoints'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCurrentLoyaltyPoints();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAwardLoyaltyPoints() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ points, description }: { points: bigint; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.awardLoyaltyPoints(points, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentLoyaltyPoints'] });
    },
  });
}

export function useRedeemLoyaltyPoints() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ rewardId, pointsCost }: { rewardId: string; pointsCost: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.redeemLoyaltyPoints(rewardId, pointsCost);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentLoyaltyPoints'] });
    },
  });
}

export function useGetLoyaltyRewards() {
  const { actor, isFetching } = useActor();

  return useQuery<LoyaltyReward[]>({
    queryKey: ['loyaltyRewards'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getLoyaltyRewards();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddLoyaltyReward() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reward: LoyaltyReward) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addLoyaltyReward(reward);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyaltyRewards'] });
    },
  });
}

// Admin queries
export function useGetAdminOrdersQueue() {
  const { actor, isFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['adminOrdersQueue'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAdminOrdersQueue();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAdminAnalytics() {
  const { actor, isFetching } = useActor();

  return useQuery<{
    totalOrders: bigint;
    totalUsers: bigint;
    totalBookings: bigint;
    totalMembers: bigint;
  }>({
    queryKey: ['adminAnalytics'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAdminAnalytics();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}
