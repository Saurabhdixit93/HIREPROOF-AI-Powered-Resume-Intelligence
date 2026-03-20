import { IAIProvider, AIRequestParams, AIResponse } from '../AIService';
import { config } from '../../config/env';

export class OpenAIProvider implements IAIProvider {
  name = 'openai';
  private apiKey: string;

  constructor() {
    this.apiKey = config.ai.openaiKey || '';
  }

  async generateResponse(params: AIRequestParams): Promise<AIResponse> {
    if (!this.apiKey) throw new Error('OpenAI API Key not configured');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: params.systemPrompt },
          { role: 'user', content: params.userPrompt },
        ],
        temperature: params.temperature || 0.7,
        max_tokens: params.maxTokens,
        response_format: params.responseFormat === 'json' ? { type: 'json_object' } : undefined,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API Error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      usage: {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens,
      },
      provider: this.name,
      model: 'gpt-4o',
    };
  }
}
