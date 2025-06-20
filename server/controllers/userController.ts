import { Request, Response } from 'express';
import { storage } from '../storage';
import { User, ApiResponse, CreateUserPayload } from '../types';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await storage.getAllUsers();
    const response: ApiResponse<User[]> = { 
      data: users, 
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

    // Check if user already exists
    const existingUser = await storage.getUserByUsername(email);
    if (existingUser) {
      const errorResponse: ApiResponse<never> = { 
        error: 'User already exists', 
        message: 'A user with this email already exists' 
      };
      return res.status(409).json(errorResponse);
    }

    // Create user with proper mapping for database storage
    const newUser: User = await storage.createUser({ 
      username: email,
      password: 'temp' // This will be ignored by DatabaseStorage
    });
    
    const response: ApiResponse<User> = { 
      data: newUser, 
      message: 'User created successfully' 
    };
    res.status(201).json(response);
  } catch (error) {
    console.error('Create user error:', error);
    const errorResponse: ApiResponse<never> = { 
      error: 'Failed to create user', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    };
    res.status(500).json(errorResponse);
  }
};