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
          name: insertUser.username
        };
      } else {
        // New format
        userData = {
          email: insertUser.email,
          name: insertUser.name || null
        };
      }

      // Simple insert with minimal fields - let Supabase handle defaults
      const { data, error } = await supabaseAdmin
        .from('users')
        .insert([userData])
        .select()
        .single();

      if (error) {
        console.error('Error creating user:', error);
        throw new Error(`Failed to create user: ${error.message}`);
      }

      // Convert database response to match our User interface
      // Handle whatever columns Supabase actually returns
      const user: User = {
        id: data.id || data.uuid || 'unknown',
        email: data.email,
        name: data.name || data.display_name || null,
        created_at: data.created_at || data.created || new Date().toISOString(),
        updated_at: data.updated_at || data.modified || data.created_at || new Date().toISOString()
      };

      return user;
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