// ============================================================
// ATHLETE//ZERO — Commentary Engine
// Generates IPL-style explosive cinematic commentary
// ============================================================

import { v4 as uuidv4 } from 'uuid';
import type { CommentaryLine } from '../types/index';
import {
  pickRandom,
  pickRandomN,
  randInt,
  now,
} from '../utils/index';
import { geminiGenerateJSON } from '../services/gemini.service';
import { buildCommentaryPrompt } from '../prompts/index';
import { COMMENTARY_TEMPLATES } from '../mock/data';

// ---- Fallback Commentary Library ----
const DRAMATIC_OPENERS = [
  "LADIES AND GENTLEMEN — THE STADIUM HOLDS ITS BREATH!",
  "THIS IS THE MOMENT THEY'LL TALK ABOUT FOR DECADES!",
  "UNBELIEVABLE! ABSOLUTELY UNBELIEVABLE SCENES HERE!",
  "THE CROWD IS ON THEIR FEET — ALL 60,000 OF THEM!",
  "IF YOU'RE NOT WATCHING THIS, YOU'RE MISSING HISTORY!",
];

const CROWD_REACTIONS = [
  "🏟️ THE ROAR IS DEAFENING — THE STADIUM IS SHAKING!",
  "📢 60,000 VOICES SCREAMING AS ONE!",
  "🎉 PANDEMONIUM IN THE STANDS! COMPLETE PANDEMONIUM!",
  "🔊 THE DECIBEL METER HAS MAXED OUT!",
  "🌊 WAVE AFTER WAVE OF EMOTION SWEEPING THE GROUND!",
];

const ANALYST_LINES = [
  "That's elite-level execution under maximum pressure.",
  "I've been covering cricket for 20 years — that was special.",
  "The composure. The audacity. You can't teach that.",
  "When the game needed a hero, one stepped forward.",
  "That shot will be on highlight reels for years.",
];

const TENSION_BUILDERS = [
  "CAN THEY HOLD THEIR NERVE? THE NEXT BALL IS EVERYTHING!",
  "THE EQUATION: IMPOSSIBLE. THE PLAYER: UNDETERRED.",
  "EIGHT RUNS NEEDED. TWO OVERS. ONE PLAYER. LET'S GO!",
  "THE PRESSURE COOKER IS ABOUT TO EXPLODE!",
  "HISTORY ON THE LINE WITH EVERY SINGLE DELIVERY!",
];

// ---- Mock Commentary Generator (fallback) ----
const generateMockCommentary = (
  playerName: string,
  matchPhase: string,
  count: number = 10,
  hypeScore: number = 50,
  clutchFactor: number = 50
): CommentaryLine[] => {
  const lines: CommentaryLine[] = [];

  const allLines = [
    ...DRAMATIC_OPENERS.map((t) => ({ text: t, tone: 'HYPE' as const, intensity: randInt(8, 10) })),
    ...CROWD_REACTIONS.map((t) => ({ text: t, tone: 'CELEBRATORY' as const, intensity: randInt(7, 9) })),
    ...ANALYST_LINES.map((t) => ({ text: t, tone: 'DRAMATIC' as const, intensity: randInt(6, 8) })),
    ...TENSION_BUILDERS.map((t) => ({ text: t, tone: 'TENSE' as const, intensity: randInt(8, 10) })),
    ...COMMENTARY_TEMPLATES.SIX.map((t) => ({
      text: t.replace('{player}', playerName),
      tone: 'HYPE' as const,
      intensity: randInt(9, 10),
    })),
    ...COMMENTARY_TEMPLATES.CLUTCH_MOMENT.map((t) => ({
      text: t,
      tone: 'DRAMATIC' as const,
      intensity: randInt(8, 10),
    })),
  ];

  const selected = pickRandomN(allLines, count);
  const intensityBoost = (hypeScore > 80 || clutchFactor > 80) ? 2 : 0;

  return selected.map((line) => ({
    id: uuidv4(),
    text: line.text,
    tone: line.tone,
    intensity: Math.min(10, line.intensity + intensityBoost),
    timestamp: now(),
  }));
};

// ---- Public API ----

/**
 * Generate commentary using Gemini AI with fallback to mock
 */
export const generateCommentary = async (
  playerName: string,
  recentEvents: string[],
  matchPhase: string = 'DEATH',
  count: number = 10,
  hypeScore: number = 50,
  clutchFactor: number = 50
): Promise<CommentaryLine[]> => {
  const prompt = buildCommentaryPrompt(playerName, recentEvents, matchPhase, hypeScore, clutchFactor);

  const fallback = { commentary: [] };

  const result = await geminiGenerateJSON<{ commentary: Array<{ text: string; tone: string; intensity: number }> }>(
    prompt,
    fallback
  );

  if (result.commentary && result.commentary.length > 0) {
    return result.commentary.map((c) => ({
      id: uuidv4(),
      text: c.text,
      tone: c.tone as CommentaryLine['tone'],
      intensity: c.intensity,
      timestamp: now(),
    }));
  }

  // Fallback to mock
  return generateMockCommentary(playerName, matchPhase, count, hypeScore, clutchFactor);
};

/**
 * Generate instant commentary for a specific event type
 */
export const getEventCommentary = (eventType: keyof typeof COMMENTARY_TEMPLATES): string => {
  const templates = COMMENTARY_TEMPLATES[eventType];
  if (!templates) return 'An incredible moment unfolds!';
  return pickRandom(templates);
};

/**
 * Generate a full pre-match commentary sequence
 */
export const generatePreMatchCommentary = (playerName: string, rivalName: string): CommentaryLine[] => {
  const lines = [
    `WELCOME TO THE BIGGEST MATCH OF ${playerName.toUpperCase()}'S YOUNG CAREER!`,
    `${rivalName.toUpperCase()} STANDS ACROSS THE FIELD — THE RIVALRY IS REAL!`,
    `THE AIR IS ELECTRIC. THE STAKES HAVE NEVER BEEN HIGHER!`,
    `THIS CITY HAS BEEN WAITING FOR THIS MOMENT ALL SEASON!`,
    `ONE OF THEM WALKS AWAY A LEGEND. THE OTHER — A FOOTNOTE. LET'S BEGIN!`,
  ];

  return lines.map((text, i) => ({
    id: uuidv4(),
    text,
    tone: i % 2 === 0 ? 'HYPE' : 'DRAMATIC',
    intensity: 8 + i,
    timestamp: now(),
  }));
};
