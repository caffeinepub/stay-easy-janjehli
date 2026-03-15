import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Booking,
  backendInterface as FullBackend,
  MenuItem,
  Room,
  ShoppingItem,
  StripeConfiguration,
  StripeSessionStatus,
  TaxiOption,
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

export function useAddRoom() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      name: string;
      description: string;
      pricePerNight: bigint;
      amenities: string[];
      photoUrl: string | null;
    }) => {
      if (!actor) throw new Error("Not connected");
      return typed(actor).addRoom(
        params.name,
        params.description,
        params.pricePerNight,
        params.amenities,
        params.photoUrl,
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["rooms"] }),
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
      photoUrl: string | null;
    }) => {
      if (!actor) throw new Error("Not connected");
      return typed(actor).updateRoom(
        params.id,
        params.name,
        params.description,
        params.price,
        params.photoUrl,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room"] });
    },
  });
}

export function useDeleteRoom() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return typed(actor).deleteRoom(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["rooms"] }),
  });
}

// Taxi
export function useGetTaxiOptions() {
  const { actor, isFetching } = useActor();
  return useQuery<TaxiOption[]>({
    queryKey: ["taxiOptions"],
    queryFn: async () => {
      if (!actor) return [];
      return typed(actor).getTaxiOptions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddTaxiOption() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      route: string;
      price: bigint;
      description: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return typed(actor).addTaxiOption(
        params.route,
        params.price,
        params.description,
      );
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["taxiOptions"] }),
  });
}

export function useUpdateTaxiOption() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id: bigint;
      route: string;
      price: bigint;
      description: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return typed(actor).updateTaxiOption(
        params.id,
        params.route,
        params.price,
        params.description,
      );
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["taxiOptions"] }),
  });
}

export function useDeleteTaxiOption() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return typed(actor).deleteTaxiOption(id);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["taxiOptions"] }),
  });
}

// Restaurant Menu
export function useGetMenuItems() {
  const { actor, isFetching } = useActor();
  return useQuery<MenuItem[]>({
    queryKey: ["menuItems"],
    queryFn: async () => {
      if (!actor) return [];
      return typed(actor).getMenuItems();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddMenuItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      name: string;
      price: bigint;
      category: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return typed(actor).addMenuItem(
        params.name,
        params.price,
        params.category,
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["menuItems"] }),
  });
}

export function useUpdateMenuItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id: bigint;
      name: string;
      price: bigint;
      category: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return typed(actor).updateMenuItem(
        params.id,
        params.name,
        params.price,
        params.category,
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["menuItems"] }),
  });
}

export function useDeleteMenuItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return typed(actor).deleteMenuItem(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["menuItems"] }),
  });
}

// Bookings
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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookings"] }),
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
      if (!actor) return "+91 99999 88888";
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
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["contactPhone"] }),
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return typed(actor).isCallerAdmin();
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
      return typed(actor).isStripeConfigured();
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
      const url = await typed(actor).createCheckoutSession(
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
      return typed(actor).getStripeSessionStatus(sessionId);
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
      return typed(actor).setStripeConfiguration(config);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["isStripeConfigured"] }),
  });
}
