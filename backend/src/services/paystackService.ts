import { PaymentInitialization, PaymentInitResponse, PaymentVerification } from '../types';

/**
 * Mock Paystack Service
 * Simulates Paystack payment gateway with instant success responses
 *
 * In production, replace these methods with actual Paystack API calls
 * using the 'paystack' npm package or axios requests to Paystack API
 */

export class PaystackService {
  private static readonly MOCK_BASE_URL = 'https://checkout.paystack.com';
  private static readonly MOCK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_test_mock_key';

  /**
   * Generate a unique payment reference
   */
  static generateReference(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `ZYLO_${timestamp}_${random}`.toUpperCase();
  }

  /**
   * Initialize a payment (Mock)
   * Returns a mock authorization URL for payment
   *
   * @param paymentData - Payment initialization data
   * @returns Mock payment initialization response
   */
  static async initializePayment(paymentData: PaymentInitialization): Promise<PaymentInitResponse> {
    // Generate reference if not provided
    const reference = paymentData.reference || this.generateReference();

    // Mock authorization URL (in production, this would be from Paystack)
    const authUrl = `${this.MOCK_BASE_URL}/${reference}`;
    const accessCode = `access_code_${Math.random().toString(36).substring(2, 15)}`;

    // Simulate API delay (remove in production)
    await new Promise(resolve => setTimeout(resolve, 100));

    // Return mock success response (matches Paystack format)
    return {
      status: true,
      message: 'Authorization URL created',
      data: {
        authorization_url: authUrl,
        access_code: accessCode,
        reference: reference
      }
    };
  }

  /**
   * Verify a payment (Mock)
   * Always returns success for testing
   *
   * @param reference - Payment reference to verify
   * @returns Mock payment verification response
   */
  static async verifyPayment(reference: string): Promise<PaymentVerification> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Mock successful verification
    // In production, this would make an actual API call to Paystack
    return {
      status: true,
      message: 'Verification successful',
      data: {
        reference: reference,
        amount: 0, // This would come from the actual payment
        status: 'success',
        paid_at: new Date().toISOString()
      }
    };
  }

  /**
   * Transfer funds to a bank account (Mock)
   * Simulates Paystack transfer/payout
   *
   * @param amount - Amount in kobo (divide by 100 for naira)
   * @param accountNumber - Recipient account number
   * @param bankCode - Recipient bank code
   * @param reason - Transfer reason/description
   * @returns Mock transfer response
   */
  static async initiateTransfer(
    amount: number,
    accountNumber: string,
    bankCode: string,
    reason: string
  ): Promise<{
    status: boolean;
    message: string;
    data: {
      reference: string;
      transfer_code: string;
      status: 'success' | 'pending';
    };
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const reference = this.generateReference();
    const transferCode = `TRF_${Math.random().toString(36).substring(2, 15)}`;

    // Mock instant success
    return {
      status: true,
      message: 'Transfer has been queued',
      data: {
        reference: reference,
        transfer_code: transferCode,
        status: 'success' // In reality, this might be 'pending'
      }
    };
  }

  /**
   * Resolve account number (Mock)
   * Verifies bank account details
   *
   * @param accountNumber - Account number to verify
   * @param bankCode - Bank code
   * @returns Mock account details
   */
  static async resolveAccountNumber(
    accountNumber: string,
    bankCode: string
  ): Promise<{
    status: boolean;
    message: string;
    data: {
      account_number: string;
      account_name: string;
      bank_id: number;
    };
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Mock account resolution
    return {
      status: true,
      message: 'Account number resolved',
      data: {
        account_number: accountNumber,
        account_name: 'Mock Account Name', // In production, this comes from the bank
        bank_id: parseInt(bankCode)
      }
    };
  }

  /**
   * Get list of supported banks (Mock)
   * Returns mock list of Nigerian banks
   */
  static async getBanks(): Promise<{
    status: boolean;
    message: string;
    data: Array<{ name: string; code: string; id: number }>;
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Mock Nigerian banks
    return {
      status: true,
      message: 'Banks retrieved',
      data: [
        { name: 'Access Bank', code: '044', id: 1 },
        { name: 'GTBank', code: '058', id: 2 },
        { name: 'First Bank', code: '011', id: 3 },
        { name: 'Zenith Bank', code: '057', id: 4 },
        { name: 'UBA', code: '033', id: 5 },
        { name: 'Kuda Bank', code: '50211', id: 6 },
        { name: 'Opay', code: '999992', id: 7 },
        { name: 'Palmpay', code: '999991', id: 8 }
      ]
    };
  }

  /**
   * Handle Paystack webhook (Mock)
   * Processes payment notifications
   *
   * @param payload - Webhook payload from Paystack
   * @param signature - Paystack signature for verification
   * @returns Whether the webhook is valid
   */
  static verifyWebhookSignature(payload: any, signature: string): boolean {
    // In production, verify the signature using:
    // const crypto = require('crypto');
    // const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY).update(JSON.stringify(payload)).digest('hex');
    // return hash === signature;

    // For mock, always return true
    return true;
  }

  /**
   * Convert amount to kobo (Paystack uses kobo)
   */
  static toKobo(naira: number): number {
    return Math.round(naira * 100);
  }

  /**
   * Convert amount from kobo to naira
   */
  static fromKobo(kobo: number): number {
    return kobo / 100;
  }
}

/*
 * PRODUCTION IMPLEMENTATION NOTES:
 *
 * 1. Install Paystack: npm install paystack
 *
 * 2. Initialize Paystack:
 *    const paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);
 *
 * 3. Replace initializePayment:
 *    const response = await paystack.transaction.initialize({
 *      email: paymentData.email,
 *      amount: PaystackService.toKobo(paymentData.amount),
 *      reference: paymentData.reference,
 *      metadata: paymentData.metadata
 *    });
 *
 * 4. Replace verifyPayment:
 *    const response = await paystack.transaction.verify(reference);
 *
 * 5. Replace initiateTransfer:
 *    const response = await paystack.transfer.create({
 *      source: 'balance',
 *      amount: amount,
 *      recipient: recipientCode,
 *      reason: reason
 *    });
 *
 * 6. Add proper error handling for all API calls
 *
 * 7. Set up webhook endpoint to receive real-time payment notifications
 */
