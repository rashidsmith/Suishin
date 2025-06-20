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
      
      const response = await this.openaiClient.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
        temperature: 0.7
      });

      return response.choices[0]?.message?.content || 'No response generated';
    }

    if (selectedProvider === 'anthropic') {
      if (!this.anthropicKey || this.anthropicKey === 'your_key_here') {
        throw new Error('Anthropic API key not configured');
      }
      if (!this.anthropicClient) {
        throw new Error('Anthropic client not initialized');
      }
      
      const response = await this.anthropicClient.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
      });

      return response.content[0]?.text || 'No response generated';
    }

    throw new Error(`Unknown AI provider: ${selectedProvider}`);
  }

  async generateIBOs(generationParams) {
    const { personaContext, topic, businessGoals, aiProvider } = generationParams;
    
    const prompt = `You are an expert learning designer. Create complete Business Objectives with full hierarchy:

PERSONA: ${personaContext}
TOPIC: ${topic}  
BUSINESS GOALS: ${businessGoals}

Generate 3-4 Business Objectives, each with:
1. Business Objective Title
2. WIIFM (What's In It For Me)
3. Performance Metrics (2-3 per BO)
   - Observable Behaviors (2-3 per PM)
     - Learning Objectives (1-2 per OB)

Format as structured markdown with clear hierarchy.`;

    try {
      const response = await this.callAI(prompt, aiProvider);
      return {
        success: true,
        content: response,
        generationParams,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        generationParams
      };
    }
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