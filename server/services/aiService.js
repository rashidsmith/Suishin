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
      console.log('[AI Service] Calling AI provider:', aiProvider);
      const response = await this.callAI(prompt, aiProvider);
      console.log('[AI Service] AI response received, length:', response?.length || 0);
      return {
        success: true,
        content: response,
        generationParams,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('[AI Service] Generation error:', error.message);
      return {
        success: false,
        error: error.message,
        generationParams
      };
    }
  }

  async refineIBOs(currentContent, refinementRequest, generationParams) {
    const { personaContext, topic, businessGoals, aiProvider } = generationParams;
    
    const prompt = `You are an expert learning designer. Refine the following IBOs based on the specific request:

ORIGINAL CONTEXT:
PERSONA: ${personaContext}
TOPIC: ${topic}  
BUSINESS GOALS: ${businessGoals}

CURRENT IBO CONTENT:
${currentContent}

REFINEMENT REQUEST:
${refinementRequest}

Please refine the IBOs according to the request while maintaining the structured hierarchy and ensuring alignment with the original context. Keep the same format but improve based on the specific refinement requested.`;

    try {
      console.log('[AI Service] Refining IBOs with request:', refinementRequest);
      const response = await this.callAI(prompt, aiProvider || 'openai');
      console.log('[AI Service] Refinement response received, length:', response?.length || 0);
      return {
        success: true,
        content: response,
        refinementRequest,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('[AI Service] Refinement error:', error.message);
      return {
        success: false,
        error: error.message,
        refinementRequest
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

  async generate4CActivities(iboContent, persona, modality, topic, businessGoals) {
    const provider = this.defaultProvider;
    
    if (!this.clients[provider]) {
      return { success: false, error: `${provider} client not available` };
    }

    try {
      console.log(`[AI Service] Generating 4C activities with provider: ${provider}`);
      
      const modalityGuidance = {
        onsite: "Design activities for in-person delivery with face-to-face interaction, group work, and hands-on materials.",
        virtual: "Create activities optimized for online delivery with digital tools, breakout rooms, and interactive elements.",
        hybrid: "Develop activities that work both in-person and virtually, with flexible implementation options."
      };

      const prompt = `You are an expert learning designer specializing in the 4C framework (Connection, Concept, Concrete Practice, Conclusion). 

Create engaging learning activities based on these requirements:

**Target Persona:** ${persona}
**Topic:** ${topic}
**Business Goals:** ${businessGoals}
**Delivery Modality:** ${modality}
**Modality Guidance:** ${modalityGuidance[modality] || modalityGuidance.virtual}

**Learning Objectives (from IBOs):**
${iboContent}

Please create a comprehensive 4C learning experience with the following structure:

## 1. CONNECTION (10-15 minutes)
- Activities to connect learners to the topic and each other
- Icebreakers, relevance questions, or scenario setting
- ${modality === 'virtual' ? 'Use polls, chat, or breakout rooms' : modality === 'onsite' ? 'Include physical movement or partner discussions' : 'Provide both virtual and in-person options'}

## 2. CONCEPT (20-30 minutes)
- Core knowledge and concept delivery
- Key principles, frameworks, or information
- ${modality === 'virtual' ? 'Interactive presentations with engagement features' : modality === 'onsite' ? 'Visual aids, demonstrations, or group exploration' : 'Multi-modal content delivery'}

## 3. CONCRETE PRACTICE (30-45 minutes)
- Hands-on application of learning
- Skill-building exercises, case studies, or simulations
- ${modality === 'virtual' ? 'Collaborative documents, virtual simulations, or peer feedback' : modality === 'onsite' ? 'Role-plays, physical exercises, or group projects' : 'Flexible practice activities'}

## 4. CONCLUSION (10-15 minutes)
- Reflection, summary, and next steps
- Action planning and commitment
- ${modality === 'virtual' ? 'Digital reflection tools or commitment sharing' : modality === 'onsite' ? 'Group sharing or written commitments' : 'Multiple reflection options'}

For each section, provide:
- Clear objectives
- Detailed activity instructions
- Time allocations
- Materials needed
- Facilitation tips specific to ${modality} delivery

Focus on activities that directly support the learning objectives and business goals for ${persona}.`;

      const result = await this.callAI(prompt, provider);
      
      if (result.success) {
        console.log(`[AI Service] 4C generation successful, content length: ${result.content.length}`);
        return { success: true, content: result.content };
      } else {
        console.error('[AI Service] 4C generation failed:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('[AI Service] 4C generation error:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new AIService();