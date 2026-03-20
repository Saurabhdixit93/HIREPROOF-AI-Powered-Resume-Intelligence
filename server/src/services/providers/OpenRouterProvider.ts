import { IAIProvider, AIRequestParams, AIResponse } from '../AIService';
import { config } from '../../config/env';

export class OpenRouterProvider implements IAIProvider {
  name = 'openrouter';
  private apiKey: string;

  constructor() {
    this.apiKey = config.ai.openrouterKey || '';
  }

  async generateResponse(params: AIRequestParams): Promise<AIResponse> {
    if (!this.apiKey) throw new Error('OpenRouter API Key not configured');

    const model = params.model || 'minimax/minimax-m2.5:free';

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'HTTP-Referer': config.frontendUrl, // Required by OpenRouter
        'X-Title': 'AI Resume Builder',
      },
      body: JSON.stringify({
        model: model,
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
      throw new Error(`OpenRouter API Error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
        reasoningTokens: data.usage?.reasoning_tokens, // Special attribute mentioned by user
      },
      provider: this.name,
      model: model,
    };
  }
}
