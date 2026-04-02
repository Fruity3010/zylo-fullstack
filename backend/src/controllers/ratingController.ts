import { Response } from 'express';
import { AuthRequest, ApiResponse } from '../types';
import { supabase } from '../config/supabase';

export class RatingController {
  /**
   * POST /api/ratings/errands/:id/rate
   * Rate a user after errand completion
   */
  static async createRating(req: AuthRequest, res: Response<ApiResponse>) {
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
      const { rating, review } = req.body;

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Invalid rating',
          error: 'Rating must be between 1 and 5'
        });
      }

      // Get errand details
      const { data: errand, error: errandError } = await supabase
        .from('errands')
        .select('*')
        .eq('id', errandId)
        .single();

      if (errandError || !errand) {
        return res.status(404).json({
          success: false,
          message: 'Errand not found',
          error: 'The errand does not exist'
        });
      }

      // Check if errand is completed
      if (errand.status !== 'completed') {
        return res.status(400).json({
          success: false,
          message: 'Errand not completed',
          error: 'You can only rate completed errands'
        });
      }

      // Determine who to rate
      let ratedUserId: string;

      if (errand.sender_id === userId) {
        // Sender is rating the errander
        if (!errand.errander_id) {
          return res.status(400).json({
            success: false,
            message: 'No errander assigned',
            error: 'This errand has no errander to rate'
          });
        }
        ratedUserId = errand.errander_id;
      } else if (errand.errander_id === userId) {
        // Errander is rating the sender
        ratedUserId = errand.sender_id;
      } else {
        return res.status(403).json({
          success: false,
          message: 'Forbidden',
          error: 'You are not involved in this errand'
        });
      }

      // Check if already rated
      const { data: existingRating } = await supabase
        .from('ratings')
        .select('id')
        .eq('errand_id', errandId)
        .eq('rater_id', userId)
        .single();

      if (existingRating) {
        return res.status(400).json({
          success: false,
          message: 'Already rated',
          error: 'You have already rated this errand'
        });
      }

      // Create rating
      const { data: newRating, error: ratingError } = await supabase
        .from('ratings')
        .insert({
          errand_id: errandId,
          rater_id: userId,
          rated_user_id: ratedUserId,
          rating,
          review
        })
        .select()
        .single();

      if (ratingError) throw ratingError;

      // The database trigger will automatically update the user's average rating

      res.status(201).json({
        success: true,
        message: 'Rating submitted successfully',
        data: newRating
      });
    } catch (error: any) {
      console.error('Create rating error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create rating',
        error: error.message
      });
    }
  }

  /**
   * GET /api/ratings/users/:id
   * Get ratings for a specific user
   */
  static async getUserRatings(req: AuthRequest, res: Response<ApiResponse>) {
    try {
      const targetUserId = req.params.id;

      const { data: ratings, error } = await supabase
        .from('ratings')
        .select('*, rater:users!ratings_rater_id_fkey(id, full_name, avatar_url), errands(title, category)')
        .eq('rated_user_id', targetUserId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calculate statistics
      const totalRatings = ratings?.length || 0;
      const averageRating = totalRatings > 0
        ? ratings!.reduce((sum, r) => sum + r.rating, 0) / totalRatings
        : 0;

      const ratingDistribution = {
        5: ratings?.filter(r => r.rating === 5).length || 0,
        4: ratings?.filter(r => r.rating === 4).length || 0,
        3: ratings?.filter(r => r.rating === 3).length || 0,
        2: ratings?.filter(r => r.rating === 2).length || 0,
        1: ratings?.filter(r => r.rating === 1).length || 0
      };

      res.json({
        success: true,
        message: 'Ratings retrieved successfully',
        data: {
          ratings,
          statistics: {
            total: totalRatings,
            average: parseFloat(averageRating.toFixed(2)),
            distribution: ratingDistribution
          }
        }
      });
    } catch (error: any) {
      console.error('Get user ratings error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get ratings',
        error: error.message
      });
    }
  }

  /**
   * GET /api/ratings/my-ratings
   * Get ratings given by the current user
   */
  static async getMyGivenRatings(req: AuthRequest, res: Response<ApiResponse>) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
          error: 'User not authenticated'
        });
      }

      const { data: ratings, error } = await supabase
        .from('ratings')
        .select('*, rated_user:users!ratings_rated_user_id_fkey(id, full_name, avatar_url), errands(title, category)')
        .eq('rater_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.json({
        success: true,
        message: 'Your ratings retrieved successfully',
        data: ratings
      });
    } catch (error: any) {
      console.error('Get my ratings error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get your ratings',
        error: error.message
      });
    }
  }

  /**
   * GET /api/ratings/errands/:id
   * Get ratings for a specific errand
   */
  static async getErrandRatings(req: AuthRequest, res: Response<ApiResponse>) {
    try {
      const errandId = req.params.id;

      const { data: ratings, error } = await supabase
        .from('ratings')
        .select('*, rater:users!ratings_rater_id_fkey(id, full_name, avatar_url, role), rated_user:users!ratings_rated_user_id_fkey(id, full_name, avatar_url, role)')
        .eq('errand_id', errandId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.json({
        success: true,
        message: 'Errand ratings retrieved successfully',
        data: ratings
      });
    } catch (error: any) {
      console.error('Get errand ratings error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get errand ratings',
        error: error.message
      });
    }
  }

  /**
   * GET /api/ratings/check/:errandId
   * Check if current user has rated an errand
   */
  static async checkRatingStatus(req: AuthRequest, res: Response<ApiResponse>) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
          error: 'User not authenticated'
        });
      }

      const errandId = req.params.errandId;

      const { data: rating } = await supabase
        .from('ratings')
        .select('*')
        .eq('errand_id', errandId)
        .eq('rater_id', userId)
        .single();

      res.json({
        success: true,
        message: 'Rating status checked',
        data: {
          has_rated: !!rating,
          rating: rating || null
        }
      });
    } catch (error: any) {
      console.error('Check rating status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to check rating status',
        error: error.message
      });
    }
  }
}
