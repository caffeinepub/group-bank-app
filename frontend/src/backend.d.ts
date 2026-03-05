import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export interface Member {
    id: Principal;
    name: string;
    profilePhoto?: ExternalBlob;
    joiningDate: Time;
    mobile: string;
}
export interface Payment {
    memberId: Principal;
    paymentDate: Time;
    amount: bigint;
}
export interface UserProfile {
    name: string;
    profilePhoto?: ExternalBlob;
    joiningDate: Time;
    mobile: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMember(name: string, mobile: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllMembers(): Promise<Array<Member>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMember(memberId: Principal): Promise<Member | null>;
    getMemberBalance(memberId: Principal): Promise<{
        totalPaid: bigint;
        paymentCount: bigint;
    }>;
    getPayments(memberId: Principal): Promise<Array<Payment>>;
    getSummaryStats(): Promise<{
        totalAmountCollected: bigint;
        totalMembers: bigint;
    }>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    recordPayment(memberId: Principal, amount: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
