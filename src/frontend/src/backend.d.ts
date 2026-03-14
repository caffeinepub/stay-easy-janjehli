import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Booking {
    id: bigint;
    checkIn: string;
    createdAt: bigint;
    guestName: string;
    checkOut: string;
    phone: string;
    roomId: bigint;
}
export interface Room {
    id: bigint;
    pricePerNight: bigint;
    name: string;
    description: string;
    amenities: Array<string>;
    available: boolean;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getBookings(): Promise<Array<Booking>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactPhone(): Promise<string>;
    getRoomById(id: bigint): Promise<Room>;
    getRooms(): Promise<Array<Room>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitBooking(roomId: bigint, guestName: string, phone: string, checkIn: string, checkOut: string, createdAt: bigint): Promise<bigint>;
    updateContactPhone(phoneNumber: string): Promise<void>;
    updateRoom(id: bigint, name: string, description: string, price: bigint): Promise<void>;
}
