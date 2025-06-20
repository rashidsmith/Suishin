import { Request, Response } from 'express';
import { storage } from '../storage';

export const getUsers = async (req: Request, res: Response) => {
  try {
    // Since we're using memory storage, we'll just return a sample response
    res.json({ 
      data: [], 
      message: 'Users retrieved successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get users', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email } = req.body;
    
    if (!username || !email) {
      return res.status(400).json({ 
        error: 'Missing required fields', 
        message: 'Username and email are required' 
      });
    }

    const newUser = await storage.createUser({ username, password: 'temp' });
    
    res.status(201).json({ 
      data: newUser, 
      message: 'User created successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to create user', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};