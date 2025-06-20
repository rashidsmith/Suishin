import { Request, Response } from 'express';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateSessionContent = async (req: Request, res: Response) => {
  try {
    const { prompt, persona, topic, modality, businessGoals } = req.body;

    if (!prompt || !persona || !topic || !modality || !businessGoals) {
      return res.status(400).json({
        error: 'Missing required fields: prompt, persona, topic, modality, businessGoals'
      });
    }

    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert learning experience designer who creates comprehensive educational content tailored to specific personas and delivery modalities. Always respond with valid JSON that matches the requested structure."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000
    });

    const responseContent = completion.choices[0].message.content;
    
    if (!responseContent) {
      throw new Error('No content generated from OpenAI');
    }

    let generatedContent;
    try {
      generatedContent = JSON.parse(responseContent);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      throw new Error('Invalid JSON response from AI');
    }

    // Validate the response structure
    if (!generatedContent.ibos || !generatedContent.activities || !generatedContent.rationale) {
      throw new Error('Invalid response structure from AI');
    }

    // Ensure IBOs have required fields
    generatedContent.ibos = generatedContent.ibos.map((ibo: any) => ({
      title: ibo.title || 'Generated IBO',
      description: ibo.description || 'AI-generated intended business outcome',
      topic: ibo.topic || topic
    }));

    // Ensure activities have required fields and proper types
    generatedContent.activities = generatedContent.activities.map((activity: any, index: number) => ({
      title: activity.title || `Generated Activity ${index + 1}`,
      description: activity.description || 'AI-generated learning activity',
      type: ['connection', 'concept', 'concrete_practice', 'conclusion'].includes(activity.type) 
        ? activity.type 
        : ['connection', 'concept', 'concrete_practice', 'conclusion'][index % 4],
      estimated_duration: typeof activity.estimated_duration === 'number' 
        ? activity.estimated_duration 
        : 15,
      materials: Array.isArray(activity.materials) ? activity.materials : [],
      considerations: Array.isArray(activity.considerations) ? activity.considerations : []
    }));

    res.json({
      data: generatedContent,
      status: 'success',
      message: 'Session content generated successfully'
    });

  } catch (error: any) {
    console.error('AI Generation Error:', error);
    
    if (error.message?.includes('API key')) {
      return res.status(401).json({
        error: 'Invalid or missing OpenAI API key',
        message: 'Please check your OpenAI API key configuration'
      });
    }

    if (error.message?.includes('quota') || error.message?.includes('billing')) {
      return res.status(402).json({
        error: 'OpenAI API quota exceeded',
        message: 'Please check your OpenAI billing and usage limits'
      });
    }

    res.status(500).json({
      error: 'Failed to generate session content',
      message: error.message || 'An unexpected error occurred'
    });
  }
};

export const generateIBOSuggestions = async (req: Request, res: Response) => {
  try {
    const { persona, topic } = req.body;

    if (!persona || !topic) {
      return res.status(400).json({
        error: 'Missing required fields: persona, topic'
      });
    }

    const prompt = `Generate 3-5 specific Intended Business Outcomes (IBOs) for this scenario:

PERSONA: ${persona.name}
Context: ${persona.context}
Experience: ${persona.experience}
Topic: ${topic}

Each IBO should be:
- Specific and measurable
- Relevant to the persona's role and context
- Achievable given their experience level
- Directly related to the topic

Respond in JSON format:
{
  "ibos": [
    {
      "title": "Brief, clear IBO title",
      "description": "Detailed description of what success looks like",
      "topic": "${topic}"
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert in defining business outcomes for learning initiatives. Create specific, measurable IBOs."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.6,
      max_tokens: 1000
    });

    const responseContent = completion.choices[0].message.content;
    
    if (!responseContent) {
      throw new Error('No content generated from OpenAI');
    }

    const generatedContent = JSON.parse(responseContent);

    res.json({
      data: generatedContent,
      status: 'success',
      message: 'IBO suggestions generated successfully'
    });

  } catch (error: any) {
    console.error('IBO Generation Error:', error);
    res.status(500).json({
      error: 'Failed to generate IBO suggestions',
      message: error.message || 'An unexpected error occurred'
    });
  }
};