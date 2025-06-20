import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

class AIService {
  constructor() {
    this.openaiKey = process.env.OPENAI_API_KEY;
    this.anthropicKey = process.env.ANTHROPIC_API_KEY;
    this.defaultProvider = process.env.AI_DEFAULT_PROVIDER || 'openai';
    
    // Initialize clients only if keys are available
    this.openaiClient = null;
    this.anthropicClient = null;
    
    this._initializeClients();
  }

  _initializeClients() {
    try {
      if (this.openaiKey && this.openaiKey !== 'your_key_here') {
        this.openaiClient = new OpenAI({
          apiKey: this.openaiKey
        });
      }
    } catch (error) {
      console.warn('Failed to initialize OpenAI client:', error.message);
    }

    try {
      if (this.anthropicKey && this.anthropicKey !== 'your_key_here') {
        this.anthropicClient = new Anthropic({
          apiKey: this.anthropicKey
        });
      }
    } catch (error) {
      console.warn('Failed to initialize Anthropic client:', error.message);
    }
  }

  async testConnection(provider = 'openai') {
    try {
      if (provider === 'openai') {
        if (!this.openaiKey || this.openaiKey === 'your_key_here') {
          return { 
            success: false, 
            error: 'OpenAI API key not configured', 
            provider: 'openai',
            configured: false
          };
        }

        if (!this.openaiClient) {
          return { 
            success: false, 
            error: 'OpenAI client not initialized', 
            provider: 'openai',
            configured: true
          };
        }

        // Test with a minimal request
        const response = await this.openaiClient.chat.completions.create({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: 'Test' }],
          max_tokens: 5
        });

        return { 
          success: true, 
          provider: 'openai',
          configured: true,
          model: 'gpt-4o',
          response: response.choices[0]?.message?.content || 'Connected'
        };
      }

      if (provider === 'anthropic') {
        if (!this.anthropicKey || this.anthropicKey === 'your_key_here') {
          return { 
            success: false, 
            error: 'Anthropic API key not configured', 
            provider: 'anthropic',
            configured: false
          };
        }

        if (!this.anthropicClient) {
          return { 
            success: false, 
            error: 'Anthropic client not initialized', 
            provider: 'anthropic',
            configured: true
          };
        }

        // Test with a minimal request
        const response = await this.anthropicClient.messages.create({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 5,
          messages: [{ role: 'user', content: 'Test' }]
        });

        return { 
          success: true, 
          provider: 'anthropic',
          configured: true,
          model: 'claude-3-sonnet-20240229',
          response: response.content[0]?.text || 'Connected'
        };
      }

      return { 
        success: false, 
        error: 'Unknown provider', 
        provider 
      };

    } catch (error) {
      return { 
        success: false, 
        error: error.message, 
        provider,
        configured: true
      };
    }
  }

  async callAI(prompt, provider = null) {
    const selectedProvider = provider || this.defaultProvider;

    if (selectedProvider === 'openai') {
      if (!this.openaiKey || this.openaiKey === 'your_key_here') {
        throw new Error('OpenAI API key not configured');
      }
      if (!this.openaiClient) {
        throw new Error('OpenAI client not initialized');
      }
      
      // Basic implementation - expand in next prompt
      throw new Error('OpenAI service implementation not yet complete');
    }

    if (selectedProvider === 'anthropic') {
      if (!this.anthropicKey || this.anthropicKey !== 'your_key_here') {
        throw new Error('Anthropic API key not configured');
      }
      if (!this.anthropicClient) {
        throw new Error('Anthropic client not initialized');
      }
      
      // Basic implementation - expand in next prompt
      throw new Error('Anthropic service implementation not yet complete');
    }

    throw new Error(`Unknown AI provider: ${selectedProvider}`);
  }

  getAvailableProviders() {
    const providers = [];
    
    if (this.openaiKey && this.openaiKey !== 'your_key_here' && this.openaiClient) {
      providers.push('openai');
    }
    
    if (this.anthropicKey && this.anthropicKey !== 'your_key_here' && this.anthropicClient) {
      providers.push('anthropic');
    }
    
    return providers;
  }

  getServiceStatus() {
    return {
      defaultProvider: this.defaultProvider,
      availableProviders: this.getAvailableProviders(),
      openai: {
        configured: !!(this.openaiKey && this.openaiKey !== 'your_key_here'),
        initialized: !!this.openaiClient
      },
      anthropic: {
        configured: !!(this.anthropicKey && this.anthropicKey !== 'your_key_here'),
        initialized: !!this.anthropicClient
      }
    };
  }
}

export default new AIService();