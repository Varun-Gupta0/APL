// ============================================================
// ATHLETE//ZERO — Rival System Engine
// Generates dramatic AI rivals with personality and trash talk
// ============================================================

import type { Rival, RivalResponse } from '../types/index';
import { pickRandom, randInt, now } from '../utils/index';
import { RIVAL_POOL } from '../mock/data';
import { geminiGenerateJSON } from '../services/gemini.service';
import { buildRivalPrompt } from '../prompts/index';

// ---- Crowd Reactions to Rival Exchange ----
const CROWD_REACTIONS_TO_RESPONSE = {
  AGGRESSIVE: [
    '🔥 THE CROWD GOES INSANE AT THIS EXCHANGE!',
    '😱 THE TENSION IS PALPABLE — NOBODY IS SITTING DOWN!',
    '🎭 RIVALRY AT ITS FINEST! THIS JUST GOT PERSONAL!',
  ],
  CALM: [
    '🤫 THE SILENCE SPEAKS VOLUMES.',
    '😎 COOL AS ICE. THE CROWD RESPECTS IT.',
    '🧊 CALCULATED RESPONSE. THE MIND GAMES BEGIN.',
  ],
  SHOWMAN: [
    '🎪 THE CROWD EATS IT UP! WHAT A SPECTACLE!',
    '📸 CAMERAS EVERYWHERE — THIS IS GOING VIRAL!',
    '🌟 THE STAGE IS SET FOR THE GREATEST RIVALRY OF THE SEASON!',
  ],
};

const RIVAL_REACTIONS = [
  'So predictable. See you on the pitch.',
  'Words are cheap. Let\'s see what you\'ve got.',
  '😂 That\'s cute. Really.',
  'The cameras caught that. The scoreboard will answer.',
  'Bold talk for someone at your level.',
  'I\'ve heard better from rookies at the nets.',
];

const MEDIA_HEADLINES_FROM_RIVAL = [
  'Rivalry Escalates: {player} vs {rival} — A War of Words Before The Battle',
  'Trash Talk Level: ULTRA — {rival} Fires Back At {player}',
  'EXCLUSIVE: {rival} Says "{player} Needs At Least 5 More Seasons"',
  'Cricket Or Reality TV? {player} And {rival} Meltdown Grips Nation',
  '{rival} Calls Out {player}: "I Don\'t Lose Sleep Over Rookies"',
];

// ---- In-memory rival state ----
let activeRival: Rival | null = null;
let rivalIntensity = 50;

// ---- Public API ----

/**
 * Get or generate a rival for the current player
 */
export const getRival = (playerLevel: number = 1): Rival => {
  if (activeRival) return activeRival;

  // Pick rival based on player level
  const eligibleRivals = RIVAL_POOL.filter((r) => {
    if (playerLevel <= 3) return r.tier === 'REGIONAL';
    if (playerLevel <= 8) return r.tier === 'REGIONAL' || r.tier === 'NATIONAL';
    return true;
  });

  activeRival = pickRandom(eligibleRivals) ?? RIVAL_POOL[0];
  rivalIntensity = randInt(45, 80);

  return activeRival;
};

/**
 * Generate AI-powered rival trash talk (with mock fallback)
 */
export const generateRivalTrashTalk = async (
  rivalName: string,
  rivalPersonality: string,
  playerName: string,
  playerRuns: number,
  playerLevel: number
): Promise<string[]> => {
  const playerStats = `${playerRuns} runs, Level ${playerLevel}`;
  const prompt = buildRivalPrompt(rivalName, rivalPersonality, playerName, playerStats);

  const result = await geminiGenerateJSON<{ trashTalk: string[] }>(
    prompt,
    { trashTalk: [] }
  );

  if (result.trashTalk && result.trashTalk.length > 0) {
    return result.trashTalk;
  }

  // Fallback to mock
  return activeRival?.trashTalk ?? RIVAL_POOL[0].trashTalk;
};

/**
 * Handle player's response to rival trash talk
 */
export const handleRivalResponse = (
  rivalId: string,
  playerResponse: string
): RivalResponse => {
  const rival = RIVAL_POOL.find((r) => r.id === rivalId) ?? RIVAL_POOL[0];
  const intensityChange = randInt(-5, 20); // Responses usually increase rivalry

  rivalIntensity = Math.min(100, Math.max(0, rivalIntensity + intensityChange));

  const reactions = CROWD_REACTIONS_TO_RESPONSE[rival.personality as keyof typeof CROWD_REACTIONS_TO_RESPONSE]
    ?? CROWD_REACTIONS_TO_RESPONSE.AGGRESSIVE;

  const headline = pickRandom(MEDIA_HEADLINES_FROM_RIVAL)
    .replace('{player}', playerResponse.split(' ')[0] || 'Player')
    .replace('{rival}', rival.name);

  return {
    rivalId,
    playerResponse,
    rivalReaction: pickRandom(RIVAL_REACTIONS),
    intensityChange,
    crowdReaction: pickRandom(reactions),
    mediaHeadline: headline,
  };
};

/**
 * Get current rivalry intensity (0-100)
 */
export const getRivalryIntensity = (): number => rivalIntensity;

/**
 * Set rivalry intensity (for match context)
 */
export const setRivalryIntensity = (intensity: number): void => {
  rivalIntensity = Math.min(100, Math.max(0, intensity));
};

/**
 * Get all available rivals
 */
export const getAllRivals = (): Rival[] => RIVAL_POOL;

/**
 * Reset rival state (for new player session)
 */
export const resetRivalState = (): void => {
  activeRival = null;
  rivalIntensity = 50;
};
