import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';

export const getAllPersonas = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('personas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching personas:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch personas',
        error: error.message
      });
    }

    res.json({
      status: 'ok',
      message: 'Personas retrieved successfully',
      data: data || []
    });
  } catch (error) {
    console.error('Error fetching personas:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getPersonaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('personas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching persona:', error);
      return res.status(404).json({
        status: 'error',
        message: 'Persona not found',
        error: error.message
      });
    }

    res.json({
      status: 'ok',
      message: 'Persona retrieved successfully',
      data
    });
  } catch (error) {
    console.error('Error fetching persona:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const createPersona = async (req: Request, res: Response) => {
  try {
    const { name, description, context, experience, motivations, constraints } = req.body;

    if (!name || !description || !context || !experience || !motivations || !constraints) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: name, description, context, experience, motivations, constraints'
      });
    }

    const { data, error } = await supabaseAdmin
      .from('personas')
      .insert([{
        name,
        description,
        context,
        experience,
        motivations,
        constraints
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating persona:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to create persona',
        error: error.message
      });
    }

    res.status(201).json({
      status: 'ok',
      message: 'Persona created successfully',
      data
    });
  } catch (error) {
    console.error('Error creating persona:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updatePersona = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, context, experience, motivations, constraints } = req.body;

    const updateData: any = { updated_at: new Date().toISOString() };
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (context !== undefined) updateData.context = context;
    if (experience !== undefined) updateData.experience = experience;
    if (motivations !== undefined) updateData.motivations = motivations;
    if (constraints !== undefined) updateData.constraints = constraints;

    const { data, error } = await supabaseAdmin
      .from('personas')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating persona:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to update persona',
        error: error.message
      });
    }

    res.json({
      status: 'ok',
      message: 'Persona updated successfully',
      data
    });
  } catch (error) {
    console.error('Error updating persona:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deletePersona = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('personas')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting persona:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to delete persona',
        error: error.message
      });
    }

    res.json({
      status: 'ok',
      message: 'Persona deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting persona:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};