import { IAIProvider, AIRequestParams, AIResponse } from '../AIService';
import { config } from '../../config/env';

export class AnthropicProvider implements IAIProvider {
  name = 'anthropic';
  private apiKey: string;

  constructor() {
    this.apiKey = config.ai.anthropicKey || '';
  }

  async generateResponse(params: AIRequestParams): Promise<AIResponse> {
    if (!this.apiKey) throw new Error('Anthropic API Key not configured');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20240620',
        system: params.systemPrompt,
        messages: [{ role: 'user', content: params.userPrompt }],
        max_tokens: params.maxTokens || 1024,
        temperature: params.temperature || 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Anthropic API Error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    return {
      content: data.content[0].text,
      usage: {
        promptTokens: data.usage.input_tokens,
        completionTokens: data.usage.output_tokens,
        totalTokens: data.usage.input_tokens + data.usage.output_tokens,
      },
      provider: this.name,
      model: 'claude-3-5-sonnet',
    };
  }
}
