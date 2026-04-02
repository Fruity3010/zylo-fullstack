import { Response } from 'express';
import { AuthRequest, ApiResponse } from '../types';
import { supabase } from '../config/supabase';

export class OfferController {
  /**
   * POST /api/offers/errands/:id/offers
   * Create a counter-offer on an errand
   */
  static async createOffer(req: AuthRequest, res: Response<ApiResponse>) {
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
      const { offered_price, message } = req.body;

      if (!offered_price || offered_price <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid offer price',
          error: 'Offer price must be greater than 0'
        });
      }

      // Check if errand exists and is open
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

      if (errand.status !== 'open') {
        return res.status(400).json({
          success: false,
          message: 'Errand not available',
          error: 'This errand is no longer accepting offers'
        });
      }

      // Can't make offer on own errand
      if (errand.sender_id === userId) {
        return res.status(400).json({
          success: false,
          message: 'Invalid action',
          error: 'You cannot make an offer on your own errand'
        });
      }

      // Check if user has errander role
      const { data: user } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (!user || (user.role !== 'errander' && user.role !== 'both')) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden',
          error: 'Only erranders can make offers'
        });
      }

      // Create or update offer (upsert)
      const { data: offer, error: offerError } = await supabase
        .from('errand_offers')
        .upsert({
          errand_id: errandId,
          errander_id: userId,
          offered_price,
          message,
          status: 'pending'
        }, {
          onConflict: 'errand_id,errander_id'
        })
        .select()
        .single();

      if (offerError) throw offerError;

      res.status(201).json({
        success: true,
        message: 'Offer created successfully',
        data: offer
      });
    } catch (error: any) {
      console.error('Create offer error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create offer',
        error: error.message
      });
    }
  }

  /**
   * GET /api/offers/errands/:id/offers
   * Get all offers for an errand
   */
  static async getErrandOffers(req: AuthRequest, res: Response<ApiResponse>) {
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

      // Check if user is the sender of this errand
      const { data: errand } = await supabase
        .from('errands')
        .select('sender_id')
        .eq('id', errandId)
        .single();

      if (!errand) {
        return res.status(404).json({
          success: false,
          message: 'Errand not found',
          error: 'The errand does not exist'
        });
      }

      // Use the detailed view with user info
      const { data: offers, error } = await supabase
        .from('errand_offers_detailed')
        .select('*')
        .eq('errand_id', errandId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.json({
        success: true,
        message: 'Offers retrieved successfully',
        data: offers
      });
    } catch (error: any) {
      console.error('Get errand offers error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get offers',
        error: error.message
      });
    }
  }

  /**
   * GET /api/offers/my-offers
   * Get all offers made by the current user
   */
  static async getMyOffers(req: AuthRequest, res: Response<ApiResponse>) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
          error: 'User not authenticated'
        });
      }

      const { data: offers, error } = await supabase
        .from('errand_offers')
        .select('*, errands(*)')
        .eq('errander_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.json({
        success: true,
        message: 'Your offers retrieved successfully',
        data: offers
      });
    } catch (error: any) {
      console.error('Get my offers error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get your offers',
        error: error.message
      });
    }
  }

  /**
   * PATCH /api/offers/:id/accept
   * Accept an offer (sender only)
   */
  static async acceptOffer(req: AuthRequest, res: Response<ApiResponse>) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
          error: 'User not authenticated'
        });
      }

      const offerId = req.params.id;

      // Get offer details
      const { data: offer, error: offerError } = await supabase
        .from('errand_offers')
        .select('*, errands(*)')
        .eq('id', offerId)
        .single();

      if (offerError || !offer) {
        return res.status(404).json({
          success: false,
          message: 'Offer not found',
          error: 'The offer does not exist'
        });
      }

      // Check if user is the sender
      if (offer.errands.sender_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden',
          error: 'Only the errand creator can accept offers'
        });
      }

      // Check if offer is still pending
      if (offer.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Offer not available',
          error: 'This offer has already been responded to'
        });
      }

      // Accept the offer
      const { error: updateOfferError } = await supabase
        .from('errand_offers')
        .update({
          status: 'accepted',
          responded_at: new Date().toISOString()
        })
        .eq('id', offerId);

      if (updateOfferError) throw updateOfferError;

      // Assign errand to the errander and update budget
      const { error: updateErrandError } = await supabase
        .from('errands')
        .update({
          errander_id: offer.errander_id,
          budget: offer.offered_price,
          status: 'assigned'
        })
        .eq('id', offer.errand_id);

      if (updateErrandError) throw updateErrandError;

      // All other pending offers for this errand will be auto-withdrawn by trigger

      res.json({
        success: true,
        message: 'Offer accepted successfully',
        data: { offer_id: offerId, errand_id: offer.errand_id }
      });
    } catch (error: any) {
      console.error('Accept offer error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to accept offer',
        error: error.message
      });
    }
  }

  /**
   * PATCH /api/offers/:id/reject
   * Reject an offer (sender only)
   */
  static async rejectOffer(req: AuthRequest, res: Response<ApiResponse>) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
          error: 'User not authenticated'
        });
      }

      const offerId = req.params.id;

      // Get offer details
      const { data: offer, error: offerError } = await supabase
        .from('errand_offers')
        .select('*, errands(*)')
        .eq('id', offerId)
        .single();

      if (offerError || !offer) {
        return res.status(404).json({
          success: false,
          message: 'Offer not found',
          error: 'The offer does not exist'
        });
      }

      // Check if user is the sender
      if (offer.errands.sender_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden',
          error: 'Only the errand creator can reject offers'
        });
      }

      // Check if offer is still pending
      if (offer.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Offer not available',
          error: 'This offer has already been responded to'
        });
      }

      // Reject the offer
      const { error: updateError } = await supabase
        .from('errand_offers')
        .update({
          status: 'rejected',
          responded_at: new Date().toISOString()
        })
        .eq('id', offerId);

      if (updateError) throw updateError;

      res.json({
        success: true,
        message: 'Offer rejected successfully',
        data: { offer_id: offerId }
      });
    } catch (error: any) {
      console.error('Reject offer error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to reject offer',
        error: error.message
      });
    }
  }

  /**
   * DELETE /api/offers/:id
   * Withdraw an offer (errander only)
   */
  static async withdrawOffer(req: AuthRequest, res: Response<ApiResponse>) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
          error: 'User not authenticated'
        });
      }

      const offerId = req.params.id;

      // Get offer details
      const { data: offer, error: offerError } = await supabase
        .from('errand_offers')
        .select('*')
        .eq('id', offerId)
        .single();

      if (offerError || !offer) {
        return res.status(404).json({
          success: false,
          message: 'Offer not found',
          error: 'The offer does not exist'
        });
      }

      // Check if user is the errander who made the offer
      if (offer.errander_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden',
          error: 'You can only withdraw your own offers'
        });
      }

      // Check if offer is still pending
      if (offer.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Offer cannot be withdrawn',
          error: 'Only pending offers can be withdrawn'
        });
      }

      // Withdraw the offer
      const { error: updateError } = await supabase
        .from('errand_offers')
        .update({ status: 'withdrawn' })
        .eq('id', offerId);

      if (updateError) throw updateError;

      res.json({
        success: true,
        message: 'Offer withdrawn successfully',
        data: { offer_id: offerId }
      });
    } catch (error: any) {
      console.error('Withdraw offer error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to withdraw offer',
        error: error.message
      });
    }
  }
}
