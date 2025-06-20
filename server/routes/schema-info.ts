import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { ApiResponse } from '../types';

export const getSchemaInfo = async (req: Request, res: Response) => {
  try {
    // Try to query known tables based on the project structure
    const tableQueries = [
      'users', 'ibos', 'performance_metrics', 'observable_behaviors', 
      'learning_objectives', 'cards', 'activity_blocks', 'sessions', 'session_cards'
    ];

    const schemaInfo: Record<string, any> = {};

    for (const tableName of tableQueries) {
      try {
        // Try to get the first row to understand the structure
        const { data, error } = await supabaseAdmin
          .from(tableName)
          .select('*')
          .limit(1);

        if (!error && data) {
          // Get the column names and types from the first row
          if (data.length > 0) {
            const sampleRow = data[0];
            const columns = Object.keys(sampleRow).map(key => ({
              column_name: key,
              sample_value: sampleRow[key],
              data_type: typeof sampleRow[key]
            }));
            schemaInfo[tableName] = {
              exists: true,
              columns: columns,
              sample_count: data.length
            };
          } else {
            schemaInfo[tableName] = {
              exists: true,
              columns: [],
              sample_count: 0
            };
          }
        } else {
          schemaInfo[tableName] = {
            exists: false,
            error: error?.message || 'Unknown error'
          };
        }
      } catch (tableError) {
        schemaInfo[tableName] = {
          exists: false,
          error: tableError instanceof Error ? tableError.message : 'Unknown error'
        };
      }
    }

    const response: ApiResponse<typeof schemaInfo> = {
      data: schemaInfo,
      message: "Database schema information retrieved",
      status: "ok"
    };

    res.json(response);
  } catch (error) {
    const errorResponse: ApiResponse<never> = {
      error: "Failed to retrieve schema information",
      message: error instanceof Error ? error.message : "Unknown error",
      status: "error"
    };
    res.status(500).json(errorResponse);
  }
};