import { IAIProvider, AIRequestParams, AIResponse } from '../AIService';
import { config } from '../../config/env';

export class NVIDIAProvider implements IAIProvider {
  name = 'nvidia';
  private apiKey: string;

  constructor() {
    this.apiKey = config.ai.nvidiaKey || '';
  }

  // Common free/available models on NVIDIA NIM
  private models = [
    'mistralai/mistral-small-4-119b-2603',
    'meta/llama-3.1-405b-instruct',
    'meta/llama-3.1-70b-instruct',
    'google/gemma-2-27b-it',
    'mistralai/mixtral-8x7b-instruct-v0.1',
    'nvidia/llama-3.1-nemotron-70b-instruct'
  ];

  async generateResponse(params: AIRequestParams): Promise<AIResponse> {
    if (!this.apiKey) throw new Error('NVIDIA API Key not configured');

    const model = params.model || this.models[0];

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: params.systemPrompt },
          { role: 'user', content: params.userPrompt },
        ],
        temperature: params.temperature || 0.1,
        max_tokens: params.maxTokens || 16384,
        top_p: 1.0,
        // reasoning_effort is specific to some NVIDIA models
        reasoning_effort: model.includes('mistral') ? 'high' : undefined,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`NVIDIA API Error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
      },
      provider: this.name,
      model: model,
    };
  }
}
