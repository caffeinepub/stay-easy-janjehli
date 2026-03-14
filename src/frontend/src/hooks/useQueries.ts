import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Booking, Room } from "../backend.d";
import { useActor } from "./useActor";

export function useGetRooms() {
  const { actor, isFetching } = useActor();
  return useQuery<Room[]>({
    queryKey: ["rooms"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRooms();
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
      return actor.getRoomById(id);
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
      return actor.submitBooking(
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
      return actor.getBookings();
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
      return actor.getContactPhone();
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
      return actor.updateContactPhone(phoneNumber);
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
      return actor.updateRoom(
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
