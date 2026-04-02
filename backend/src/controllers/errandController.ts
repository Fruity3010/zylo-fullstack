import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest, ApiResponse, ErrandCategory } from '../types';
import { WalletService } from '../services/walletService';

/**
 * Create a new errand
 * POST /errands
 */
export const createErrand = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const {
      category,
      title,
      description,
      budget,
      pickup_location,
      destination_location,
      image_urls
    } = req.body;

    // Validate required fields
    if (!category || !title || !description || !budget || !destination_location) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        error: 'Category, title, description, budget, and destination_location are required'
      });
    }

    // Validate category
    const validCategories: ErrandCategory[] = ['fuel_energy', 'courier_delivery', 'office_work', 'custom'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category',
        error: 'Category must be fuel_energy, courier_delivery, office_work, or custom'
      });
    }

    // Create errand
    const { data: errand, error } = await supabase
      .from('errands')
      .insert({
        sender_id: req.user.id,
        category,
        title,
        description,
        budget,
        pickup_location,
        destination_location,
        image_urls: image_urls || [],
        status: 'open'
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create errand',
        error: error.message
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Errand created successfully',
      data: { errand }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get all errands (with optional filters)
 * GET /errands
 */
export const getErrands = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const { status, category, sender_id, errander_id } = req.query;

    let query = supabase
      .from('errands')
      .select('*, sender:users!sender_id(id, full_name, email)')
      .order('created_at', { ascending: false });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    if (category) {
      query = query.eq('category', category);
    }
    if (sender_id) {
      query = query.eq('sender_id', sender_id);
    }
    if (errander_id) {
      query = query.eq('errander_id', errander_id);
    }

    const { data: errands, error } = await query;

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch errands',
        error: error.message
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Errands retrieved successfully',
      data: { errands }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get a single errand by ID
 * GET /errands/:id
 */
export const getErrandById = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;

    const { data: errand, error } = await supabase
      .from('errands')
      .select('*, sender:users!sender_id(id, full_name, email, phone), errander:users!errander_id(id, full_name, email, phone)')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({
        success: false,
        message: 'Errand not found',
        error: error.message
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Errand retrieved successfully',
      data: { errand }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Update an errand
 * PATCH /errands/:id
 */
export const updateErrand = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const { id } = req.params;
    const updates = req.body;

    // Check if errand exists and user is the owner
    const { data: existingErrand, error: fetchError } = await supabase
      .from('errands')
      .select('sender_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingErrand) {
      return res.status(404).json({
        success: false,
        message: 'Errand not found'
      });
    }

    if (existingErrand.sender_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this errand'
      });
    }

    // Update errand
    const { data: errand, error } = await supabase
      .from('errands')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update errand',
        error: error.message
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Errand updated successfully',
      data: { errand }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Delete an errand
 * DELETE /errands/:id
 */
export const deleteErrand = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const { id } = req.params;

    // Check if errand exists and user is the owner
    const { data: existingErrand, error: fetchError } = await supabase
      .from('errands')
      .select('sender_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingErrand) {
      return res.status(404).json({
        success: false,
        message: 'Errand not found'
      });
    }

    if (existingErrand.sender_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this errand'
      });
    }

    // Delete errand
    const { error } = await supabase
      .from('errands')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete errand',
        error: error.message
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Errand deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Apply to an errand (errander applies to complete the task)
 * POST /errands/:id/apply
 */
export const applyToErrand = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const { id } = req.params;

    // Check if user is an errander
    if (req.user.role === 'sender') {
      return res.status(403).json({
        success: false,
        message: 'Only erranders can apply to errands'
      });
    }

    // Check if errand exists and is open
    const { data: errand, error: fetchError } = await supabase
      .from('errands')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !errand) {
      return res.status(404).json({
        success: false,
        message: 'Errand not found'
      });
    }

    if (errand.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'Errand is not available',
        error: 'This errand is no longer accepting applications'
      });
    }

    // Check if sender has sufficient balance to hold
    const senderBalance = await WalletService.getBalance(errand.sender_id);
    if (senderBalance.available < errand.budget) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient sender balance',
        error: 'The sender must fund their wallet before you can accept this errand'
      });
    }

    // Hold funds in escrow
    await WalletService.holdFunds(
      errand.sender_id,
      errand.budget,
      id,
      `Escrow hold for errand: ${errand.title}`
    );

    // Update errand to assign errander
    const { data: updatedErrand, error } = await supabase
      .from('errands')
      .update({
        errander_id: req.user.id,
        status: 'assigned'
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      // Refund the held funds if assignment fails
      await WalletService.refundHeldFunds(errand.sender_id, errand.budget, id);
      return res.status(500).json({
        success: false,
        message: 'Failed to apply to errand',
        error: error.message
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Successfully applied to errand. Funds have been held in escrow.',
      data: { errand: updatedErrand }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Complete an errand (release payment to errander)
 * POST /errands/:id/complete
 */
export const completeErrand = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const { id } = req.params;

    // Get errand details
    const { data: errand, error: fetchError } = await supabase
      .from('errands')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !errand) {
      return res.status(404).json({
        success: false,
        message: 'Errand not found'
      });
    }

    // Only sender or errander can complete
    if (errand.sender_id !== req.user.id && errand.errander_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to complete this errand'
      });
    }

    if (errand.status !== 'in_progress' && errand.status !== 'assigned') {
      return res.status(400).json({
        success: false,
        message: 'Errand cannot be completed',
        error: 'Only errands that are in progress or assigned can be completed'
      });
    }

    if (!errand.errander_id) {
      return res.status(400).json({
        success: false,
        message: 'No errander assigned',
        error: 'This errand has no errander to pay'
      });
    }

    // Release payment from escrow to errander
    await WalletService.releaseFunds(
      errand.sender_id,
      errand.errander_id,
      errand.budget,
      id
    );

    // Mark errand as completed
    const { data: completedErrand, error } = await supabase
      .from('errands')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to complete errand',
        error: error.message
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Errand completed successfully. Payment has been released to the errander.',
      data: { errand: completedErrand }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Cancel an errand (refund held funds)
 * POST /errands/:id/cancel
 */
export const cancelErrand = async (req: AuthRequest, res: Response<ApiResponse>) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const { id } = req.params;
    const { reason } = req.body;

    // Get errand details
    const { data: errand, error: fetchError } = await supabase
      .from('errands')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !errand) {
      return res.status(404).json({
        success: false,
        message: 'Errand not found'
      });
    }

    // Only sender can cancel
    if (errand.sender_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the errand creator can cancel'
      });
    }

    if (errand.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed errand'
      });
    }

    if (errand.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Errand is already cancelled'
      });
    }

    // If errand is assigned, refund held funds
    if (errand.status === 'assigned' || errand.status === 'in_progress') {
      await WalletService.refundHeldFunds(
        errand.sender_id,
        errand.budget,
        id
      );
    }

    // Mark errand as cancelled
    const { data: cancelledErrand, error } = await supabase
      .from('errands')
      .update({
        status: 'cancelled'
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to cancel errand',
        error: error.message
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Errand cancelled successfully. Funds have been refunded.',
      data: { errand: cancelledErrand, reason }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
