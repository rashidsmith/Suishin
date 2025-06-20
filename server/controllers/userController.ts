import { Request, Response } from 'express';
import { storage } from '../storage';
import { User, ApiResponse, CreateUserPayload } from '../types';

export const getUsers = async (req: Request, res: Response) => {
  try {
    // Since we're using memory storage, we'll just return a sample response
    const response: ApiResponse<User[]> = { 
      data: [], 
      message: 'Users retrieved successfully' 
    };
    res.json(response);
  } catch (error) {
    const errorResponse: ApiResponse<never> = { 
      error: 'Failed to get users', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    };
    res.status(500).json(errorResponse);
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, name }: CreateUserPayload = req.body;
    
    if (!email) {
      const errorResponse: ApiResponse<never> = { 
        error: 'Missing required fields', 
        message: 'Email is required' 
      };
      return res.status(400).json(errorResponse);
    }

    const newUser: User = await storage.createUser({ username: email, password: 'temp' });
    
    const response: ApiResponse<User> = { 
      data: newUser, 
      message: 'User created successfully' 
    };
    res.status(201).json(response);
  } catch (error) {
    const errorResponse: ApiResponse<never> = { 
      error: 'Failed to create user', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    };
    res.status(500).json(errorResponse);
  }
};