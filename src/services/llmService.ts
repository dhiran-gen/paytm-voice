// LLM Gateway Service supporting Google Gemini, OpenAI, and custom OpenAI-compatible endpoints

import { LLMConfig } from '../types';

const DEFAULT_CONFIG: LLMConfig = {
  provider: 'GEMINI',
  apiKey: (import.meta as any).env?.VITE_GEMINI_API_KEY || (import.meta as any).env?.VITE_OPENAI_API_KEY || '',
  geminiModel: 'gemini-2.0-flash',
  openaiModel: 'gpt-4o-mini',
  temperature: 0.2,
  useFallbackIfKeyMissing: true,
};

// Local storage key for persistent user configuration
const LLM_CONFIG_STORAGE_KEY = 'admission_intel_llm_config';

export function getStoredLLMConfig(): LLMConfig {
  try {
    const raw = localStorage.getItem(LLM_CONFIG_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Failed to load LLM config from localStorage:', e);
  }
  return DEFAULT_CONFIG;
}

export function saveLLMConfig(config: LLMConfig): void {
  try {
    localStorage.setItem(LLM_CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save LLM config:', e);
  }
}

export interface GenerateTextOptions {
  systemPrompt?: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
}

export async function testLLMConnection(config: LLMConfig): Promise<{ success: boolean; message: string }> {
  try {
    if (!config.apiKey && !config.customEndpoint) {
      return { success: false, message: 'API Key is empty.' };
    }

    if (config.provider === 'GEMINI') {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.geminiModel}:generateContent?key=${config.apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Respond with "OK" if you can hear me.' }] }],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { 
          success: false, 
          message: errorData?.error?.message || `HTTP ${response.status}: ${response.statusText}` 
        };
      }
      return { success: true, message: `Connected successfully to Google Gemini (${config.geminiModel})!` };
    } else {
      // OpenAI or Custom OpenAI
      const endpoint = config.customEndpoint || 'https://api.openai.com/v1/chat/completions';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model: config.provider === 'CUSTOM_OPENAI' ? config.customModelName || 'default' : config.openaiModel,
          messages: [{ role: 'user', content: 'Respond with "OK"' }],
          max_tokens: 10,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { 
          success: false, 
          message: errorData?.error?.message || `HTTP ${response.status}: ${response.statusText}` 
        };
      }
      return { success: true, message: `Connected successfully to OpenAI endpoint!` };
    }
  } catch (err: any) {
    return { success: false, message: err.message || 'Network error occurred while contacting LLM.' };
  }
}

export async function callLLM(options: GenerateTextOptions, customConfig?: LLMConfig): Promise<string> {
  const config = customConfig || getStoredLLMConfig();

  // If no API key is provided and fallback is enabled, throw or route to fallback
  if (!config.apiKey && !config.customEndpoint) {
    throw new Error('NO_API_KEY');
  }

  try {
    if (config.provider === 'GEMINI') {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.geminiModel}:generateContent?key=${config.apiKey}`;
      
      const contents: any[] = [];
      if (options.systemPrompt) {
        contents.push({
          role: 'user',
          parts: [{ text: `[SYSTEM INSTRUCTIONS]\n${options.systemPrompt}\n\n[USER TASK]\n${options.userPrompt}` }]
        });
      } else {
        contents.push({
          role: 'user',
          parts: [{ text: options.userPrompt }]
        });
      }

      const generationConfig: any = {
        temperature: options.temperature ?? config.temperature ?? 0.2,
        maxOutputTokens: options.maxTokens ?? 4096,
      };

      if (options.jsonMode) {
        generationConfig.responseMimeType = 'application/json';
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson?.error?.message || `Gemini API Error: ${response.statusText}`);
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      return text;
    } else {
      // OpenAI / Custom OpenAI
      const endpoint = config.customEndpoint || 'https://api.openai.com/v1/chat/completions';
      const messages: any[] = [];
      if (options.systemPrompt) {
        messages.push({ role: 'system', content: options.systemPrompt });
      }
      messages.push({ role: 'user', content: options.userPrompt });

      const body: any = {
        model: config.provider === 'CUSTOM_OPENAI' ? config.customModelName || 'gpt-4o-mini' : config.openaiModel,
        messages,
        temperature: options.temperature ?? config.temperature ?? 0.2,
        max_tokens: options.maxTokens ?? 4096,
      };

      if (options.jsonMode) {
        body.response_format = { type: 'json_object' };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson?.error?.message || `OpenAI API Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data?.choices?.[0]?.message?.content || '';
    }
  } catch (error: any) {
    console.warn('LLM direct call failed:', error);
    throw error;
  }
}

/**
 * Safely parse JSON from LLM response (handling markdown code fences)
 */
export function extractJSONFromLLMResponse<T = any>(rawText: string): T {
  let cleaned = rawText.trim();
  // Strip ```json ... ``` or ``` ... ```
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  cleaned = cleaned.trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    // Attempt regex matching to extract the first balanced JSON object
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error(`Failed to parse valid JSON from LLM output: ${err}\nRaw text was:\n${rawText}`);
  }
}
