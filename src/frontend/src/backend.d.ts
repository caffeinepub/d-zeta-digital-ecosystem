import type { Principal } from "@icp-sdk/core/principal";

export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;

export interface OriginMapDistrict {
    id: string;
    farmerPhotoUrl: string;
    featuredProduct: string;
    name: string;
    description: string;
}

export interface SocialImpactMetric {
    id: string;
    value: number;
    name: string;
}

export type Time = bigint;

export interface LoyaltyTransaction {
    id: bigint;
    description: string;
    timestamp: Time;
    isRedemption: boolean;
    points: bigint;
}

export interface BookingRequest {
    id: bigint;
    status: BookingStatus;
    zone: string;
    notes: string;
    dateTime: string;
}

export interface Artifact {
    id: string;
    title: string;
    audioUrl?: string;
    story: string;
}

export interface Order {
    id: bigint;
    status: OrderStatus;
    customer: Principal;
    timestamp: Time;
    deliverTo?: string;
}

export interface QueuePosition {
    totalOrders: bigint;
    position: bigint;
    estimatedWaitTime: Time;
}

export interface ArtifactContent {
    id: string;
    title: string;
    audioUrl?: string;
    story: string;
}

export interface DeliveryZone {
    name: string;
    description: string;
    zoneId: string;
}

export interface QueueSummary {
    totalOrders: bigint;
    estimatedWaitTime: Time;
}

export interface BookingRequestDto {
    zone: string;
    notes: string;
    dateTime: string;
}

export interface Membership {
    id: bigint;
    name: string;
    photoUrl?: string;
    identityNumber?: string;
    isVerified: boolean;
    isVip: boolean;
}

export interface LoyaltyReward {
    id: string;
    name: string;
    pointsCost: bigint;
}

export interface UserProfile {
    name: string;
    email?: string;
    phone?: string;
}

export interface PackageAddOn {
    id: string;
    name: string;
}

export enum BookingStatus {
    Rescheduled = "Rescheduled",
    RequestedAccess = "RequestedAccess",
    Waitlist = "Waitlist",
    CheckedIn = "CheckedIn",
    NoShow = "NoShow",
    Reservation = "Reservation",
    Default = "Default",
    Confirmed = "Confirmed",
    Denied = "Denied",
    Completed = "Completed",
    Expired = "Expired",
    Canceled = "Canceled"
}

export enum OrderStatus {
    Delivering = "Delivering",
    Reserved = "Reserved",
    Paid = "Paid",
    Default = "Default",
    Confirmed = "Confirmed",
    Ready = "Ready",
    Preparing = "Preparing",
    Cancelled = "Cancelled",
    Completed = "Completed"
}

export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}

export interface backendInterface {
    addLoyaltyReward(reward: LoyaltyReward): Promise<void>;
    addPackage(packageId: string, packageName: string): Promise<void>;
    addPackageAddOn(addOn: PackageAddOn): Promise<void>;
    awardLoyaltyPoints(points: bigint, description: string): Promise<{
        newBalance: string;
        transactions?: Array<LoyaltyTransaction>;
        current: {
            pointsBalance: bigint;
            transactions: Array<LoyaltyTransaction>;
        };
        points?: bigint;
    }>;
    createArtifact(artifact: ArtifactContent): Promise<void>;
    createDeliveryZone(zone: DeliveryZone): Promise<void>;
    createDistrict(district: OriginMapDistrict): Promise<void>;
    createMembership(name: string, identityNumber: string | null, photoUrl: string | null): Promise<{
        id?: bigint;
        name?: string;
        photoUrl?: string;
        identityNumber?: string;
        existing?: Membership;
        isVip?: boolean;
    }>;
    createOrder(deliverTo: string | null): Promise<bigint>;
    getAdminAnalytics(): Promise<{
        totalOrders: bigint;
        totalBookings: bigint;
        totalUsers: bigint;
        totalMembers: bigint;
    }>;
    getAdminOrdersQueue(): Promise<Array<Order>>;
    getAllArtifacts(): Promise<Array<ArtifactContent>>;
    getAllBookings(): Promise<Array<[Principal, Array<BookingRequest>]>>;
    getAllDistricts(): Promise<Array<OriginMapDistrict>>;
    getAllMemberships(): Promise<Array<[Principal, Membership]>>;
    getArtifactById(id: string): Promise<Artifact>;
    getAvailablePackages(): Promise<Array<string>>;
    getCallerBookings(): Promise<Array<BookingRequest>>;
    getCallerMembership(): Promise<Membership | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getClientOrders(): Promise<Array<Order>>;
    getCurrentLoyaltyPoints(): Promise<[bigint, {
            pointsBalance: bigint;
            transactions: Array<LoyaltyTransaction>;
        }]>;
    getCurrentMetrics(): Promise<Array<SocialImpactMetric>>;
    getDeliveryZones(): Promise<Array<DeliveryZone>>;
    getKitchenQueueSummary(): Promise<QueueSummary>;
    getLoyaltyRewards(): Promise<Array<LoyaltyReward>>;
    getOrderQueuePosition(orderId: bigint): Promise<QueuePosition>;
    getOriginMapForDistrict(districtId: string): Promise<OriginMapDistrict>;
    getPackageAddOns(): Promise<Array<PackageAddOn>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    redeemLoyaltyPoints(rewardId: string, pointsCost: bigint): Promise<void>;
    requestBooking(request: BookingRequestDto): Promise<BookingStatus>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    secureBootAdmin(firstAdmin: Principal, adminToken: string): Promise<boolean>;
    updateArtifact(artifact: ArtifactContent): Promise<void>;
    updateBookingStatus(user: Principal, bookingId: bigint, status: BookingStatus): Promise<void>;
    updateDeliveryZone(zone: DeliveryZone): Promise<void>;
    updateDistrict(district: OriginMapDistrict): Promise<void>;
    updateMetric(metric: SocialImpactMetric): Promise<void>;
    updateOrderStatus(orderId: bigint, status: OrderStatus): Promise<void>;
    verifyMembership(user: Principal, isVerified: boolean): Promise<void>;
}
