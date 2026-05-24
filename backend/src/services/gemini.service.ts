// ============================================================
// ATHLETE//ZERO — Centralized Gemini AI Service
// ============================================================

import { GoogleGenerativeAI } from '@google/generative-ai';
import { config, GEMINI_MODEL } from '../config/index';

let genAI: GoogleGenerativeAI | null = null;

const getClient = (): GoogleGenerativeAI => {
  if (!genAI) {
    if (!config.geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not configured. Add it to your .env file.');
    }
    genAI = new GoogleGenerativeAI(config.geminiApiKey);
  }
  return genAI;
};

/**
 * Call Gemini and parse structured JSON from the response.
 * Falls back to provided fallback data if API call fails.
 */
export const geminiGenerateJSON = async <T>(
  prompt: string,
  fallback: T
): Promise<T> => {
  try {
    const client = getClient();
    const model = client.getGenerativeModel({
      model: GEMINI_MODEL,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 1.0, // Max creativity for cinematic output
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Strip markdown code fences if present
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned) as T;
  } catch (err) {
    console.warn('[Gemini] API call failed, using fallback data:', (err as Error).message);
    return fallback;
  }
};

/**
 * Call Gemini and return raw text response.
 */
export const geminiGenerateText = async (
  prompt: string,
  fallback: string = ''
): Promise<string> => {
  try {
    const client = getClient();
    const model = client.getGenerativeModel({
      model: GEMINI_MODEL,
      generationConfig: {
        temperature: 1.0,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.warn('[Gemini] API call failed, using fallback:', (err as Error).message);
    return fallback;
  }
};

/**
 * Check if Gemini API is properly configured
 */
export const isGeminiConfigured = (): boolean => {
  return Boolean(config.geminiApiKey && config.geminiApiKey !== 'your_gemini_api_key_here');
};
