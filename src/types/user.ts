export interface BankDetails {
    iban?: string;
    bic?: string;
    bankName?: string;
    routingNumber?: string;
    accountNumber?: string;
    clabe?: string;
    swift?: string;
}

export interface Address {
    street: string;
    city: string;
    state: string | null;
    zip: string;
}

export interface KYC {
    bank?: BankDetails;
    address?: Address;
}

export interface Category {
    _id: string;
    title: string;
}

export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string | null;
    phoneNumber: string | null;
    countryCode: string | null;
    role: 'buyer' | 'seller' | null;
    status: 'active' | 'inactive';
    isVerified: boolean;
    isDeleted: boolean;
    isKycCompleted: boolean;
    isPasswordSet: boolean;
    createdAt: string;
    updatedAt: string;
    businessId?: string;
    businessName?: string;
    country?: string;
    currency?: string;
    dob?: string;
    kyc?: KYC;
    // Categories can be strings (IDs) in list or Objects in details.
    categories: string[] | Category[];
    profilePic?: string; // Added from details response
}

export interface Meta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface GetAllUsersResponse {
    message: string;
    meta: Meta;
    data: User[];
}

export interface GetAllUsersParams {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isDeleted?: boolean;
    status?: string;
}
