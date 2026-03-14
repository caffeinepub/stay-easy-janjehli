import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Booking,
  backendInterface as FullBackend,
  Room,
  ShoppingItem,
  StripeConfiguration,
  StripeSessionStatus,
} from "../backend.d";
import { useActor } from "./useActor";

function typed(actor: unknown): FullBackend {
  return actor as FullBackend;
}

export function useGetRooms() {
  const { actor, isFetching } = useActor();
  return useQuery<Room[]>({
    queryKey: ["rooms"],
    queryFn: async () => {
      if (!actor) return [];
      return typed(actor).getRooms();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetRoomById(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Room | null>({
    queryKey: ["room", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return typed(actor).getRoomById(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useSubmitBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      roomId: bigint;
      guestName: string;
      phone: string;
      checkIn: string;
      checkOut: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return typed(actor).submitBooking(
        params.roomId,
        params.guestName,
        params.phone,
        params.checkIn,
        params.checkOut,
        BigInt(Date.now()),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useGetBookings() {
  const { actor, isFetching } = useActor();
  return useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: async () => {
      if (!actor) return [];
      return typed(actor).getBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetContactPhone() {
  const { actor, isFetching } = useActor();
  return useQuery<string>({
    queryKey: ["contactPhone"],
    queryFn: async () => {
      if (!actor) return "+91 98765 43210";
      return typed(actor).getContactPhone();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateContactPhone() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (phoneNumber: string) => {
      if (!actor) throw new Error("Not connected");
      return typed(actor).updateContactPhone(phoneNumber);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contactPhone"] });
    },
  });
}

export function useUpdateRoom() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id: bigint;
      name: string;
      description: string;
      price: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return typed(actor).updateRoom(
        params.id,
        params.name,
        params.description,
        params.price,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room"] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsStripeConfigured() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isStripeConfigured"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isStripeConfigured();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreatePaymentSession() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (params: {
      items: ShoppingItem[];
      successUrl: string;
      cancelUrl: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      const url = await actor.createCheckoutSession(
        params.items,
        params.successUrl,
        params.cancelUrl,
      );
      window.location.href = url;
      return url;
    },
  });
}

export function useVerifyPaymentSession(sessionId: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<StripeSessionStatus | null>({
    queryKey: ["stripeSession", sessionId],
    queryFn: async () => {
      if (!actor || !sessionId) return null;
      return actor.getStripeSessionStatus(sessionId);
    },
    enabled: !!actor && !isFetching && !!sessionId,
    retry: false,
  });
}

export function useSetStripeConfiguration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (config: StripeConfiguration) => {
      if (!actor) throw new Error("Not connected");
      return actor.setStripeConfiguration(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isStripeConfigured"] });
    },
  });
}
