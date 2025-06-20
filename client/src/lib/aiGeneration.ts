import { apiRequest } from './queryClient';

export interface AIGenerationRequest {
  persona: {
    name: string;
    description: string;
    context: string;
    experience: string;
    motivations: string;
    constraints: string;
  };
  topic: string;
  modality: 'onsite' | 'virtual' | 'hybrid';
  businessGoals: string;
}

export interface GeneratedIBO {
  title: string;
  description: string;
  topic: string;
}

export interface Generated4CActivity {
  title: string;
  description: string;
  type: 'connection' | 'concept' | 'concrete_practice' | 'conclusion';
  estimated_duration: number;
  materials?: string[];
  considerations?: string[];
}

export interface AIGenerationResponse {
  ibos: GeneratedIBO[];
  activities: Generated4CActivity[];
  rationale: string;
}

export const buildPersonaSessionPrompt = (
  persona: AIGenerationRequest['persona'],
  topic: string,
  modality: string,
  businessGoals: string
) => {
  return `Design a ${modality} learning session for this persona:

PERSONA: ${persona.name}
Description: ${persona.description}
Context: ${persona.context}
Experience Level: ${persona.experience}
Motivations: ${persona.motivations}
Constraints: ${persona.constraints}

SESSION FOCUS: ${topic}
Business Goals: ${businessGoals}
Delivery: ${modality}

Generate a comprehensive learning session structure with:

1. 2-3 Relevant Intended Business Outcomes (IBOs) for this persona + topic combination
   - Each IBO should be specific, measurable, and aligned with the persona's context
   - Consider their experience level and constraints

2. 4C Activity structure optimized for ${modality} delivery:
   - Connection: How to engage this persona in ${modality} format (5-10 minutes)
   - Concept: How to teach new information effectively in ${modality} (15-25 minutes)
   - Concrete Practice: Hands-on activities that work for ${modality} (20-30 minutes)
   - Conclusion: Reflection/commitment activities for ${modality} (5-10 minutes)

For each activity, consider:
- The persona's constraints and learning preferences
- The limitations and opportunities of ${modality} delivery
- Practical materials or tools needed
- Engagement strategies specific to this persona

Provide a brief rationale explaining how this structure addresses the persona's specific needs and constraints.

Respond in JSON format with this structure:
{
  "ibos": [
    {
      "title": "IBO Title",
      "description": "Detailed description of the intended business outcome",
      "topic": "${topic}"
    }
  ],
  "activities": [
    {
      "title": "Activity Title",
      "description": "Detailed description of the activity",
      "type": "connection|concept|concrete_practice|conclusion",
      "estimated_duration": 15,
      "materials": ["List of materials needed"],
      "considerations": ["Special considerations for this persona and modality"]
    }
  ],
  "rationale": "Explanation of how this structure addresses the persona's needs"
}`;
};

export const generateSessionContent = async (request: AIGenerationRequest): Promise<AIGenerationResponse> => {
  const prompt = buildPersonaSessionPrompt(
    request.persona,
    request.topic,
    request.modality,
    request.businessGoals
  );

  try {
    const response = await fetch('/api/ai/generate-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        persona: request.persona,
        topic: request.topic,
        modality: request.modality,
        businessGoals: request.businessGoals
      }),
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to generate session content');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('AI Generation Error:', error);
    throw new Error('Failed to generate session content. Please try again.');
  }
};

export const createIBOsFromGenerated = async (generatedIBOs: GeneratedIBO[], personaId: string, userId: string) => {
  const createdIBOs = [];
  
  for (const iboData of generatedIBOs) {
    try {
      const response = await fetch('/api/ibos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: iboData.title,
          description: iboData.description,
          topic: iboData.topic,
          persona_id: personaId,
          user_id: userId
        }),
        credentials: 'include'
      });
      
      if (response.ok) {
        const result = await response.json();
        createdIBOs.push(result.data);
      }
    } catch (error) {
      console.error('Error creating IBO:', error);
    }
  }
  
  return createdIBOs;
};

export const createCardsFromGenerated = async (
  generatedActivities: Generated4CActivity[],
  activityBlockId: string
) => {
  const createdCards = [];
  
  for (let i = 0; i < generatedActivities.length; i++) {
    const activity = generatedActivities[i];
    try {
      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: activity.title,
          content: activity.description,
          activity_block_id: activityBlockId,
          card_type: activity.type,
          order_index: i,
          metadata: {
            estimated_duration: activity.estimated_duration,
            materials: activity.materials || [],
            considerations: activity.considerations || [],
            ai_generated: true
          }
        }),
        credentials: 'include'
      });
      
      if (response.ok) {
        const result = await response.json();
        createdCards.push(result.data);
      }
    } catch (error) {
      console.error('Error creating card:', error);
    }
  }
  
  return createdCards;
};