import { supabase } from '../config/supabase';
import { Wallet, Transaction, TransactionType } from '../types';

export class WalletService {
  /**
   * Get user's wallet (creates one if doesn't exist)
   */
  static async getOrCreateWallet(userId: string): Promise<Wallet | null> {
    const { data: wallet, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code === 'PGRST116') {
      // Wallet doesn't exist, create one
      const { data: newWallet, error: createError } = await supabase
        .from('wallets')
        .insert({ user_id: userId })
        .select()
        .single();

      if (createError) throw createError;
      return newWallet;
    }

    if (error) throw error;
    return wallet;
  }

  /**
   * Get wallet balance
   */
  static async getBalance(userId: string): Promise<{ available: number; held: number; total: number }> {
    const wallet = await this.getOrCreateWallet(userId);
    if (!wallet) throw new Error('Failed to get wallet');

    return {
      available: Number(wallet.available_balance),
      held: Number(wallet.held_balance),
      total: Number(wallet.available_balance) + Number(wallet.held_balance)
    };
  }

  /**
   * Add funds to wallet (deposit)
   */
  static async deposit(
    userId: string,
    amount: number,
    description: string,
    reference?: string,
    errandId?: string,
    metadata?: any
  ): Promise<Transaction> {
    const wallet = await this.getOrCreateWallet(userId);
    if (!wallet) throw new Error('Wallet not found');

    // Update wallet balance
    const newBalance = Number(wallet.available_balance) + amount;
    const { error: updateError } = await supabase
      .from('wallets')
      .update({ available_balance: newBalance })
      .eq('id', wallet.id);

    if (updateError) throw updateError;

    // Create transaction record
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .insert({
        wallet_id: wallet.id,
        user_id: userId,
        type: 'deposit',
        amount: amount,
        balance_after: newBalance,
        description,
        reference,
        errand_id: errandId,
        metadata
      })
      .select()
      .single();

    if (txError) throw txError;
    return transaction;
  }

  /**
   * Hold funds in escrow (when errand is accepted)
   */
  static async holdFunds(
    userId: string,
    amount: number,
    errandId: string,
    description: string
  ): Promise<Transaction> {
    const wallet = await this.getOrCreateWallet(userId);
    if (!wallet) throw new Error('Wallet not found');

    const availableBalance = Number(wallet.available_balance);
    if (availableBalance < amount) {
      throw new Error('Insufficient balance');
    }

    // Move from available to held
    const { error: updateError } = await supabase
      .from('wallets')
      .update({
        available_balance: availableBalance - amount,
        held_balance: Number(wallet.held_balance) + amount
      })
      .eq('id', wallet.id);

    if (updateError) throw updateError;

    // Create transaction record
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .insert({
        wallet_id: wallet.id,
        user_id: userId,
        type: 'hold',
        amount: amount,
        balance_after: availableBalance - amount,
        description,
        errand_id: errandId
      })
      .select()
      .single();

    if (txError) throw txError;
    return transaction;
  }

  /**
   * Release held funds (pay errander when errand is completed)
   */
  static async releaseFunds(
    senderUserId: string,
    erranderUserId: string,
    amount: number,
    errandId: string
  ): Promise<{ senderTx: Transaction; erranderTx: Transaction }> {
    // Get both wallets
    const senderWallet = await this.getOrCreateWallet(senderUserId);
    const erranderWallet = await this.getOrCreateWallet(erranderUserId);

    if (!senderWallet || !erranderWallet) throw new Error('Wallets not found');

    const senderHeld = Number(senderWallet.held_balance);
    if (senderHeld < amount) {
      throw new Error('Insufficient held balance');
    }

    // Release from sender's held balance
    const { error: senderError } = await supabase
      .from('wallets')
      .update({
        held_balance: senderHeld - amount,
        total_spent: Number(senderWallet.total_spent) + amount
      })
      .eq('id', senderWallet.id);

    if (senderError) throw senderError;

    // Add to errander's available balance
    const erranderAvailable = Number(erranderWallet.available_balance);
    const { error: erranderError } = await supabase
      .from('wallets')
      .update({
        available_balance: erranderAvailable + amount,
        total_earned: Number(erranderWallet.total_earned) + amount
      })
      .eq('id', erranderWallet.id);

    if (erranderError) throw erranderError;

    // Create transaction records for both users
    const { data: senderTx, error: senderTxError } = await supabase
      .from('transactions')
      .insert({
        wallet_id: senderWallet.id,
        user_id: senderUserId,
        type: 'release',
        amount: -amount,
        balance_after: Number(senderWallet.available_balance),
        description: `Payment released for errand completion`,
        errand_id: errandId
      })
      .select()
      .single();

    if (senderTxError) throw senderTxError;

    const { data: erranderTx, error: erranderTxError } = await supabase
      .from('transactions')
      .insert({
        wallet_id: erranderWallet.id,
        user_id: erranderUserId,
        type: 'earning',
        amount: amount,
        balance_after: erranderAvailable + amount,
        description: `Earned from errand completion`,
        errand_id: errandId
      })
      .select()
      .single();

    if (erranderTxError) throw erranderTxError;

    return { senderTx, erranderTx };
  }

  /**
   * Refund held funds (if errand is cancelled)
   */
  static async refundHeldFunds(
    userId: string,
    amount: number,
    errandId: string
  ): Promise<Transaction> {
    const wallet = await this.getOrCreateWallet(userId);
    if (!wallet) throw new Error('Wallet not found');

    const heldBalance = Number(wallet.held_balance);
    if (heldBalance < amount) {
      throw new Error('Insufficient held balance');
    }

    // Move from held back to available
    const { error: updateError } = await supabase
      .from('wallets')
      .update({
        held_balance: heldBalance - amount,
        available_balance: Number(wallet.available_balance) + amount
      })
      .eq('id', wallet.id);

    if (updateError) throw updateError;

    // Create transaction record
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .insert({
        wallet_id: wallet.id,
        user_id: userId,
        type: 'refund',
        amount: amount,
        balance_after: Number(wallet.available_balance) + amount,
        description: `Refund for cancelled errand`,
        errand_id: errandId
      })
      .select()
      .single();

    if (txError) throw txError;
    return transaction;
  }

  /**
   * Withdraw funds from wallet
   */
  static async withdraw(
    userId: string,
    amount: number,
    description: string,
    reference?: string
  ): Promise<Transaction> {
    const wallet = await this.getOrCreateWallet(userId);
    if (!wallet) throw new Error('Wallet not found');

    const availableBalance = Number(wallet.available_balance);
    if (availableBalance < amount) {
      throw new Error('Insufficient balance');
    }

    // Deduct from available balance
    const newBalance = availableBalance - amount;
    const { error: updateError } = await supabase
      .from('wallets')
      .update({ available_balance: newBalance })
      .eq('id', wallet.id);

    if (updateError) throw updateError;

    // Create transaction record
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .insert({
        wallet_id: wallet.id,
        user_id: userId,
        type: 'withdrawal',
        amount: -amount,
        balance_after: newBalance,
        description,
        reference
      })
      .select()
      .single();

    if (txError) throw txError;
    return transaction;
  }

  /**
   * Get transaction history
   */
  static async getTransactions(
    userId: string,
    limit: number = 50,
    offset: number = 0,
    type?: TransactionType
  ): Promise<Transaction[]> {
    let query = supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  /**
   * Get transaction by ID
   */
  static async getTransaction(transactionId: string): Promise<Transaction | null> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single();

    if (error) throw error;
    return data;
  }
}
