import { Request } from 'express';

// User types
export type UserRole = 'sender' | 'errander' | 'both';
export type UserTier = 'bronze' | 'silver' | 'gold';
export type KYCStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  tier?: UserTier;
  completed_errands?: number;
  average_rating?: number;
  kyc_status?: KYCStatus;
  kyc_documents?: any;
  bvn?: string;
  nin?: string;
  created_at: string;
  updated_at: string;
}

// Errand types
export type ErrandCategory = 'fuel_energy' | 'courier_delivery' | 'office_work' | 'custom';
export type ErrandStatus = 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface Errand {
  id: string;
  sender_id: string;
  errander_id?: string;
  category: ErrandCategory;
  title: string;
  description: string;
  budget: number;
  pickup_location?: Location;
  destination_location: Location;
  status: ErrandStatus;
  image_urls?: string[];
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

// Offer types
export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn';

export interface ErrandOffer {
  id: string;
  errand_id: string;
  errander_id: string;
  offered_price: number;
  message?: string;
  status: OfferStatus;
  created_at: string;
  updated_at: string;
  responded_at?: string;
}

// Rating types
export interface Rating {
  id: string;
  errand_id: string;
  rater_id: string;
  rated_user_id: string;
  rating: number; // 1-5
  review?: string;
  created_at: string;
}

// Wallet & Payment types
export type TransactionType = 'deposit' | 'withdrawal' | 'hold' | 'release' | 'refund' | 'fee' | 'earning';
export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Wallet {
  id: string;
  user_id: string;
  available_balance: number;
  held_balance: number;
  total_earned: number;
  total_spent: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  wallet_id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  balance_after: number;
  description: string;
  reference?: string;
  errand_id?: string;
  metadata?: any;
  created_at: string;
}

export interface Payout {
  id: string;
  user_id: string;
  wallet_id: string;
  amount: number;
  bank_name: string;
  account_number: string;
  account_name: string;
  status: PayoutStatus;
  paystack_reference?: string;
  failure_reason?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface DailyFee {
  id: string;
  errand_id: string;
  date: string;
  fee_amount: number;
  created_at: string;
}

export interface TierHistory {
  id: string;
  user_id: string;
  previous_tier: UserTier;
  new_tier: UserTier;
  reason?: string;
  created_at: string;
}

// Payment request/response types
export interface PaymentInitialization {
  amount: number;
  email: string;
  reference?: string;
  errand_id?: string;
  metadata?: any;
}

export interface PaymentInitResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaymentVerification {
  status: boolean;
  message: string;
  data: {
    reference: string;
    amount: number;
    status: 'success' | 'failed';
    paid_at?: string;
  };
}

// Request types with authenticated user
export interface AuthRequest extends Request {
  user?: User;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
