export interface AIRequestParams {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
  responseFormat?: 'text' | 'json';
  model?: string;
}

export interface AIResponse {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    reasoningTokens?: number;
  };
  provider: string;
  model: string;
}

export interface IAIProvider {
  name: string;
  generateResponse(params: AIRequestParams): Promise<AIResponse>;
}

import { OpenAIProvider } from './providers/OpenAIProvider';
import { AnthropicProvider } from './providers/AnthropicProvider';
import { GeminiProvider } from './providers/GeminiProvider';
import { OpenRouterProvider } from './providers/OpenRouterProvider';
import { NVIDIAProvider } from './providers/NVIDIAProvider';

class AIService {
  private providers: Map<string, IAIProvider> = new Map();
  private providerOrder: string[] = ['openai', 'anthropic', 'gemini', 'openrouter', 'nvidia'];

  constructor() {
    this.providers.set('openai', new OpenAIProvider());
    this.providers.set('anthropic', new AnthropicProvider());
    this.providers.set('gemini', new GeminiProvider());
    this.providers.set('openrouter', new OpenRouterProvider());
    this.providers.set('nvidia', new NVIDIAProvider());
  }

  registerProvider(provider: IAIProvider) {
    this.providers.set(provider.name, provider);
  }

  async generate(params: AIRequestParams, preferredProvider?: string): Promise<AIResponse> {
    const providersToTry = preferredProvider 
      ? [preferredProvider, ...this.providerOrder.filter(p => p !== preferredProvider)]
      : this.providerOrder;

    let lastError: Error | null = null;

    for (const providerName of providersToTry) {
      const provider = this.providers.get(providerName);
      if (!provider) continue;

      try {
        return await this.executeWithRetry(provider, params);
      } catch (error) {
        console.error(`Error with ${providerName}, trying next provider...`, error);
        lastError = error as Error;
      }
    }

    throw new Error(`All AI providers failed. Last error: ${lastError?.message}`);
  }

  private async executeWithRetry(provider: IAIProvider, params: AIRequestParams, retries = 2): Promise<AIResponse> {
    for (let i = 0; i <= retries; i++) {
      try {
        return await provider.generateResponse(params);
      } catch (error) {
        if (i === retries) throw error;
        const delay = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        console.log(`Retrying ${provider.name} (attempt ${i + 1})...`);
      }
    }
    throw new Error('Retry failed'); // Should not reach here
  }
}

export const aiService = new AIService();
