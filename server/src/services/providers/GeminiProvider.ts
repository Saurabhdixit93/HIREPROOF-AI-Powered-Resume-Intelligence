import { IAIProvider, AIRequestParams, AIResponse } from '../AIService';
import { config } from '../../config/env';

export class GeminiProvider implements IAIProvider {
  name = 'gemini';
  private apiKey: string;

  constructor() {
    this.apiKey = config.ai.geminiKey || '';
  }

  async generateResponse(params: AIRequestParams): Promise<AIResponse> {
    if (!this.apiKey) throw new Error('Gemini API Key not configured');

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: params.systemPrompt }] },
        contents: [{ parts: [{ text: params.userPrompt }] }],
        generationConfig: {
          temperature: params.temperature || 0.7,
          maxOutputTokens: params.maxTokens,
          responseMimeType: params.responseFormat === 'json' ? 'application/json' : 'text/plain',
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Gemini API Error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    return {
      content: data.candidates[0].content.parts[0].text,
      usage: {
        promptTokens: data.usageMetadata?.promptTokenCount || 0,
        completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
        totalTokens: data.usageMetadata?.totalTokenCount || 0,
      },
      provider: this.name,
      model: 'gemini-1.5-flash',
    };
  }
}
