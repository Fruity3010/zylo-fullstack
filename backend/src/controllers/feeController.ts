import { Response } from 'express';
import { AuthRequest, ApiResponse } from '../types';
import { supabase } from '../config/supabase';

export class FeeController {
  /**
   * Calculate daily fee based on errand budget
   * Bronze: 10% of budget
   * Silver: 8% of budget
   * Gold: 5% of budget
   */
  private static calculateDailyFee(budget: number, tier: string = 'bronze'): number {
    const feeRates = {
      bronze: 0.10,
      silver: 0.08,
      gold: 0.05
    };

    const rate = feeRates[tier as keyof typeof feeRates] || feeRates.bronze;
    return parseFloat((budget * rate).toFixed(2));
  }

  /**
   * POST /api/fees/errands/:id/calculate
   * Calculate and record daily fees for an errand
   */
  static async calculateErrandFees(req: AuthRequest, res: Response<ApiResponse>) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
          error: 'User not authenticated'
        });
      }

      const errandId = req.params.id;

      // Get errand details
      const { data: errand, error: errandError } = await supabase
        .from('errands')
        .select('*, sender:users!errands_sender_id_fkey(tier)')
        .eq('id', errandId)
        .single();

      if (errandError || !errand) {
        return res.status(404).json({
          success: false,
          message: 'Errand not found',
          error: 'The errand does not exist'
        });
      }

      // Check if user is the sender
      if (errand.sender_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden',
          error: 'Only the errand creator can view fees'
        });
      }

      // Calculate fees from creation date to now (or completion date)
      const startDate = new Date(errand.created_at);
      const endDate = errand.completed_at ? new Date(errand.completed_at) : new Date();
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

      const dailyFee = this.calculateDailyFee(errand.budget, errand.sender.tier);
      const totalFees = parseFloat((dailyFee * days).toFixed(2));

      res.json({
        success: true,
        message: 'Fees calculated successfully',
        data: {
          errand_id: errandId,
          budget: errand.budget,
          user_tier: errand.sender.tier,
          daily_fee: dailyFee,
          days_elapsed: days,
          total_fees: totalFees,
          total_cost: parseFloat((errand.budget + totalFees).toFixed(2)),
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString()
        }
      });
    } catch (error: any) {
      console.error('Calculate fees error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to calculate fees',
        error: error.message
      });
    }
  }

  /**
   * GET /api/fees/errands/:id
   * Get daily fee breakdown for an errand
   */
  static async getErrandFees(req: AuthRequest, res: Response<ApiResponse>) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
          error: 'User not authenticated'
        });
      }

      const errandId = req.params.id;

      // Check if user is involved in errand
      const { data: errand } = await supabase
        .from('errands')
        .select('sender_id, errander_id')
        .eq('id', errandId)
        .single();

      if (!errand || (errand.sender_id !== userId && errand.errander_id !== userId)) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden',
          error: 'You are not involved in this errand'
        });
      }

      // Get daily fee records
      const { data: fees, error } = await supabase
        .from('daily_fees')
        .select('*')
        .eq('errand_id', errandId)
        .order('date', { ascending: false });

      if (error) throw error;

      const totalFees = fees?.reduce((sum, fee) => sum + parseFloat(fee.fee_amount.toString()), 0) || 0;

      res.json({
        success: true,
        message: 'Daily fees retrieved successfully',
        data: {
          fees,
          total: parseFloat(totalFees.toFixed(2)),
          count: fees?.length || 0
        }
      });
    } catch (error: any) {
      console.error('Get errand fees error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get fees',
        error: error.message
      });
    }
  }

  /**
   * POST /api/fees/errands/:id/accrue
   * Manually accrue a daily fee for an errand (admin/automated use)
   */
  static async accrueDailyFee(req: AuthRequest, res: Response<ApiResponse>) {
    try {
      const errandId = req.params.id;
      const { date } = req.body;

      const feeDate = date || new Date().toISOString().split('T')[0];

      // Get errand details
      const { data: errand, error: errandError } = await supabase
        .from('errands')
        .select('*, sender:users!errands_sender_id_fkey(tier)')
        .eq('id', errandId)
        .single();

      if (errandError || !errand) {
        return res.status(404).json({
          success: false,
          message: 'Errand not found',
          error: 'The errand does not exist'
        });
      }

      // Only accrue fees for active errands
      if (errand.status === 'completed' || errand.status === 'cancelled') {
        return res.status(400).json({
          success: false,
          message: 'Errand not active',
          error: 'Cannot accrue fees for completed or cancelled errands'
        });
      }

      // Calculate daily fee
      const dailyFee = this.calculateDailyFee(errand.budget, errand.sender.tier);

      // Insert fee record (will fail if already exists for this date)
      const { data: fee, error: feeError } = await supabase
        .from('daily_fees')
        .insert({
          errand_id: errandId,
          date: feeDate,
          fee_amount: dailyFee
        })
        .select()
        .single();

      if (feeError) {
        if (feeError.code === '23505') { // Unique constraint violation
          return res.status(400).json({
            success: false,
            message: 'Fee already accrued',
            error: 'A fee has already been recorded for this date'
          });
        }
        throw feeError;
      }

      res.status(201).json({
        success: true,
        message: 'Daily fee accrued successfully',
        data: fee
      });
    } catch (error: any) {
      console.error('Accrue fee error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to accrue fee',
        error: error.message
      });
    }
  }

  /**
   * GET /api/fees/summary
   * Get fee summary for the current user's errands
   */
  static async getUserFeeSummary(req: AuthRequest, res: Response<ApiResponse>) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
          error: 'User not authenticated'
        });
      }

      // Get all errands created by user
      const { data: errands, error: errandsError } = await supabase
        .from('errands')
        .select('id, title, budget, status, created_at, completed_at')
        .eq('sender_id', userId);

      if (errandsError) throw errandsError;

      // Get fees for all errands
      const errandIds = errands?.map(e => e.id) || [];

      if (errandIds.length === 0) {
        return res.json({
          success: true,
          message: 'No errands found',
          data: {
            errands: [],
            total_fees: 0,
            total_budget: 0
          }
        });
      }

      const { data: fees, error: feesError } = await supabase
        .from('daily_fees')
        .select('*')
        .in('errand_id', errandIds);

      if (feesError) throw feesError;

      // Calculate totals per errand
      const errandSummaries = errands?.map(errand => {
        const errandFees = fees?.filter(f => f.errand_id === errand.id) || [];
        const totalFees = errandFees.reduce((sum, fee) => sum + parseFloat(fee.fee_amount.toString()), 0);

        return {
          ...errand,
          fees: errandFees,
          total_fees: parseFloat(totalFees.toFixed(2)),
          total_cost: parseFloat((errand.budget + totalFees).toFixed(2))
        };
      });

      const totalFees = errandSummaries?.reduce((sum, e) => sum + e.total_fees, 0) || 0;
      const totalBudget = errands?.reduce((sum, e) => sum + parseFloat(e.budget.toString()), 0) || 0;

      res.json({
        success: true,
        message: 'Fee summary retrieved successfully',
        data: {
          errands: errandSummaries,
          total_fees: parseFloat(totalFees.toFixed(2)),
          total_budget: parseFloat(totalBudget.toFixed(2)),
          total_cost: parseFloat((totalBudget + totalFees).toFixed(2))
        }
      });
    } catch (error: any) {
      console.error('Get fee summary error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get fee summary',
        error: error.message
      });
    }
  }
}
