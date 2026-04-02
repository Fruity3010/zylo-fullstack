import { Response } from 'express';
import { AuthRequest, ApiResponse } from '../types';
import { WalletService } from '../services/walletService';
import { PaystackService } from '../services/paystackService';
import { supabase } from '../config/supabase';

export class PaymentController {
  /**
   * GET /api/payments/wallet
   * Get user's wallet balance and info
   */
  static async getWallet(req: AuthRequest, res: Response<ApiResponse>) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
          error: 'User not authenticated'
        });
      }

      const wallet = await WalletService.getOrCreateWallet(userId);
      const balance = await WalletService.getBalance(userId);

      res.json({
        success: true,
        message: 'Wallet retrieved successfully',
        data: {
          wallet,
          balance
        }
      });
    } catch (error: any) {
      console.error('Get wallet error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get wallet',
        error: error.message
      });
    }
  }

  /**
   * POST /api/payments/initialize
   * Initialize a payment (deposit funds to wallet)
   */
  static async initializePayment(req: AuthRequest, res: Response<ApiResponse>) {
    try {
      const userId = req.user?.id;
      const userEmail = req.user?.email;

      if (!userId || !userEmail) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
          error: 'User not authenticated'
        });
      }

      const { amount, errand_id } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid amount',
          error: 'Amount must be greater than 0'
        });
      }

      // Initialize payment with Paystack (mock)
      const paymentResponse = await PaystackService.initializePayment({
        email: userEmail,
        amount: amount,
        errand_id,
        metadata: {
          user_id: userId,
          purpose: errand_id ? 'errand_payment' : 'wallet_topup'
        }
      });

      res.json({
        success: true,
        message: 'Payment initialized successfully',
        data: paymentResponse.data
      });
    } catch (error: any) {
      console.error('Initialize payment error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to initialize payment',
        error: error.message
      });
    }
  }

  /**
   * POST /api/payments/verify/:reference
   * Verify a payment and credit user's wallet
   */
  static async verifyPayment(req: AuthRequest, res: Response<ApiResponse>) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
          error: 'User not authenticated'
        });
      }

      const { reference } = req.params;

      // Verify payment with Paystack (mock)
      const verification = await PaystackService.verifyPayment(reference);

      if (!verification.status || verification.data.status !== 'success') {
        return res.status(400).json({
          success: false,
          message: 'Payment verification failed',
          error: 'Payment was not successful'
        });
      }

      // Credit user's wallet
      const amount = verification.data.amount;
      const transaction = await WalletService.deposit(
        userId,
        amount,
        'Wallet top-up via Paystack',
        reference
      );

      res.json({
        success: true,
        message: 'Payment verified and wallet credited',
        data: {
          verification: verification.data,
          transaction
        }
      });
    } catch (error: any) {
      console.error('Verify payment error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to verify payment',
        error: error.message
      });
    }
  }

  /**
   * POST /api/payments/webhook
   * Handle Paystack webhook notifications
   */
  static async handleWebhook(req: AuthRequest, res: Response) {
    try {
      const signature = req.headers['x-paystack-signature'] as string;
      const payload = req.body;

      // Verify webhook signature
      const isValid = PaystackService.verifyWebhookSignature(payload, signature);
      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: 'Invalid webhook signature'
        });
      }

      const event = payload.event;
      const data = payload.data;

      // Handle different webhook events
      switch (event) {
        case 'charge.success':
          // Payment successful, credit wallet
          const userId = data.metadata?.user_id;
          if (userId) {
            await WalletService.deposit(
              userId,
              PaystackService.fromKobo(data.amount),
              'Wallet top-up via Paystack',
              data.reference
            );
          }
          break;

        case 'transfer.success':
          // Payout successful, update payout status
          const { data: payout } = await supabase
            .from('payouts')
            .update({
              status: 'completed',
              completed_at: new Date().toISOString()
            })
            .eq('paystack_reference', data.reference)
            .select()
            .single();
          break;

        case 'transfer.failed':
          // Payout failed, update status and refund
          const { data: failedPayout } = await supabase
            .from('payouts')
            .update({
              status: 'failed',
              failure_reason: data.reason || 'Transfer failed'
            })
            .eq('paystack_reference', data.reference)
            .select()
            .single();

          if (failedPayout) {
            // Refund the amount to user's wallet
            await WalletService.deposit(
              failedPayout.user_id,
              failedPayout.amount,
              'Refund for failed payout',
              data.reference
            );
          }
          break;

        default:
          console.log('Unhandled webhook event:', event);
      }

      res.json({ success: true });
    } catch (error: any) {
      console.error('Webhook error:', error);
      res.status(500).json({
        success: false,
        message: 'Webhook processing failed',
        error: error.message
      });
    }
  }

  /**
   * GET /api/payments/transactions
   * Get user's transaction history
   */
  static async getTransactions(req: AuthRequest, res: Response<ApiResponse>) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
          error: 'User not authenticated'
        });
      }

      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const type = req.query.type as any;

      const transactions = await WalletService.getTransactions(userId, limit, offset, type);

      res.json({
        success: true,
        message: 'Transactions retrieved successfully',
        data: transactions
      });
    } catch (error: any) {
      console.error('Get transactions error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get transactions',
        error: error.message
      });
    }
  }

  /**
   * POST /api/payments/withdraw
   * Request a payout to bank account
   */
  static async requestPayout(req: AuthRequest, res: Response<ApiResponse>) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
          error: 'User not authenticated'
        });
      }

      const { amount, bank_name, account_number, account_name } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid amount',
          error: 'Amount must be greater than 0'
        });
      }

      if (!bank_name || !account_number || !account_name) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields',
          error: 'Bank name, account number, and account name are required'
        });
      }

      // Check if user has sufficient balance
      const balance = await WalletService.getBalance(userId);
      if (balance.available < amount) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient balance',
          error: 'You do not have enough funds to withdraw'
        });
      }

      // Get user's wallet
      const wallet = await WalletService.getOrCreateWallet(userId);
      if (!wallet) {
        return res.status(500).json({
          success: false,
          message: 'Wallet not found',
          error: 'Failed to get wallet'
        });
      }

      // Deduct from wallet
      await WalletService.withdraw(
        userId,
        amount,
        `Withdrawal to ${bank_name} - ${account_number}`,
        PaystackService.generateReference()
      );

      // Initiate transfer with Paystack (mock)
      const transferResponse = await PaystackService.initiateTransfer(
        PaystackService.toKobo(amount),
        account_number,
        '044', // Mock bank code
        'Zylo payout'
      );

      // Create payout record
      const { data: payout, error: payoutError } = await supabase
        .from('payouts')
        .insert({
          user_id: userId,
          wallet_id: wallet.id,
          amount,
          bank_name,
          account_number,
          account_name,
          status: 'processing',
          paystack_reference: transferResponse.data.reference
        })
        .select()
        .single();

      if (payoutError) throw payoutError;

      // For mock, instantly mark as completed
      const { data: completedPayout } = await supabase
        .from('payouts')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', payout.id)
        .select()
        .single();

      res.json({
        success: true,
        message: 'Payout initiated successfully',
        data: completedPayout
      });
    } catch (error: any) {
      console.error('Request payout error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process payout',
        error: error.message
      });
    }
  }

  /**
   * GET /api/payments/payouts
   * Get user's payout history
   */
  static async getPayouts(req: AuthRequest, res: Response<ApiResponse>) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
          error: 'User not authenticated'
        });
      }

      const { data: payouts, error } = await supabase
        .from('payouts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.json({
        success: true,
        message: 'Payouts retrieved successfully',
        data: payouts
      });
    } catch (error: any) {
      console.error('Get payouts error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get payouts',
        error: error.message
      });
    }
  }

  /**
   * GET /api/payments/banks
   * Get list of supported banks
   */
  static async getBanks(req: AuthRequest, res: Response<ApiResponse>) {
    try {
      const banksResponse = await PaystackService.getBanks();

      res.json({
        success: true,
        message: 'Banks retrieved successfully',
        data: banksResponse.data
      });
    } catch (error: any) {
      console.error('Get banks error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get banks',
        error: error.message
      });
    }
  }
}
