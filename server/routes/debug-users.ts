import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { ApiResponse } from '../types';

export const debugUsers = async (req: Request, res: Response) => {
  try {
    // First, try to get all users to see the actual structure
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('*')
      .limit(5);

    // Also try to get table info
    const { data: tableInfo, error: tableError } = await supabaseAdmin
      .rpc('get_table_columns', { table_name: 'users' })
      .single();

    const response: ApiResponse<{
      users: any;
      usersError: any;
      tableInfo: any;
      tableError: any;
    }> = {
      data: {
        users,
        usersError,
        tableInfo,
        tableError
      },
      message: "Debug information retrieved",
      status: "ok"
    };

    res.json(response);
  } catch (error) {
    const errorResponse: ApiResponse<never> = {
      error: "Failed to retrieve debug information",
      message: error instanceof Error ? error.message : "Unknown error",
      status: "error"
    };
    res.status(500).json(errorResponse);
  }
};