import { supabaseAdmin } from '../config/supabase.js';
import { IStorage } from '../storage';
import { User as SchemaUser, InsertUser } from '../../shared/schema';
import { User } from '../../shared/types';

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error getting user:', error);
        return undefined;
      }

      return data;
    } catch (error) {
      console.error('Error in getUser:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', username) // Using email as username
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned - user not found
          return undefined;
        }
        console.error('Error getting user by username:', error);
        return undefined;
      }

      return data;
    } catch (error) {
      console.error('Error in getUserByUsername:', error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser | { username: string; password: string }): Promise<User> {
    try {
      // Handle both new InsertUser format and legacy format
      let userData;
      if ('username' in insertUser) {
        // Legacy format - map username to email
        userData = {
          email: insertUser.username,
          name: insertUser.username,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      } else {
        // New format
        userData = {
          email: insertUser.email,
          name: insertUser.name || null
        };
      }

      const { data, error } = await supabaseAdmin
        .from('users')
        .insert([userData])
        .select()
        .single();

      if (error) {
        console.error('Error creating user:', error);
        throw new Error(`Failed to create user: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in createUser:', error);
      throw error;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error getting all users:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      return [];
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const { error } = await supabaseAdmin
        .from('users')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting user:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteUser:', error);
      return false;
    }
  }
}