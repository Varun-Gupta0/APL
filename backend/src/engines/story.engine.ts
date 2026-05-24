// ============================================================
// ATHLETE//ZERO — AI Story Engine
// Generates the full narrative universe using Gemini AI
// ============================================================

import type { Player, MatchTimeline, StoryOutput } from '../types/index';
import { geminiGenerateJSON } from '../services/gemini.service';
import { buildStoryPrompt, buildHeadlinesPrompt } from '../prompts/index';
import { pickRandom, randInt } from '../utils/index';
import { ANALYST_TAKES, BREAKING_NEWS, SPONSOR_POOL } from '../mock/data';

// ---- Fallback Story Data ----
const FALLBACK_HEADLINES = [
  'ROOKIE SENSATION SETS THE STAGE ON FIRE',
  'THE NEXT LEGEND IS HERE — WORLD TAKES NOTICE',
  'IMPOSSIBLE JUST BECAME POSSIBLE',
  'CRICKET\'S FUTURE ARRIVED TONIGHT',
  'FROM UNKNOWN TO UNSTOPPABLE IN ONE MATCH',
];

const FALLBACK_COMMENTARY = [
  'WHAT A PLAYER! WHAT A MOMENT! WHAT A MATCH!',
  'THE STADIUM WILL NEVER FORGET THIS NIGHT!',
  'WHEN THEY SAID IT COULDN\'T BE DONE, THIS PLAYER DIDN\'T GET THE MEMO!',
];

const FALLBACK_FANS = [
  '🔥 I literally cannot breathe right now. This is incredible!',
  'Overrated? STILL overrated. Sorry not sorry.',
  'My heart is RACING. CRICKET IS THE GREATEST SPORT EVER!',
  'Bro carried like it was a video game 😭💀',
];

const FALLBACK_HASHTAGS = [
  '#AthletZero',
  '#CricketTwitter',
  '#IPL2025',
  '#LegendInMaking',
  '#NeverBetAgainstHim',
];

const generateFallbackStory = (player: Player): StoryOutput => {
  const sponsor = pickRandom(SPONSOR_POOL);

  return {
    headline: pickRandom(FALLBACK_HEADLINES),
    subheadline: `${player.name} just proved why they belong at the top. The world is watching.`,
    coach: `Keep the focus. Stay hungry. This is just the beginning of something special.`,
    rival: `I\'ve seen better on my worst day. Don\'t mistake a good performance for talent.`,
    fans: [...FALLBACK_FANS],
    commentary: [...FALLBACK_COMMENTARY],
    hashtags: [...FALLBACK_HASHTAGS],
    sponsor: `${sponsor.brand} offers ${sponsor.offerValue} — "${sponsor.tagline}"`,
    analystTake: pickRandom(ANALYST_TAKES).replace('{player}', player.name),
    breakingNews: pickRandom(BREAKING_NEWS).replace('{player}', player.name),
    viralTweet: `${player.name} just did THAT. In THAT match. Against THAT opponent. 🔥`,
    memeCaption: 'Doubters vs ${player.name}: *${player.name} wins*',
  };
};

// ---- Public API ----

/**
 * Generate the full story narrative for a player (with/without match context)
 */
export const generateStory = async (
  player: Player,
  matchTimeline?: MatchTimeline
): Promise<StoryOutput> => {
  const prompt = buildStoryPrompt(player, matchTimeline);

  const result = await geminiGenerateJSON<StoryOutput>(
    prompt,
    generateFallbackStory(player)
  );

  // Ensure all fields are populated (merge with fallback for any missing)
  const fallback = generateFallbackStory(player);
  return {
    headline: result.headline || fallback.headline,
    subheadline: result.subheadline || fallback.subheadline,
    coach: result.coach || fallback.coach,
    rival: result.rival || fallback.rival,
    fans: result.fans?.length ? result.fans : fallback.fans,
    commentary: result.commentary?.length ? result.commentary : fallback.commentary,
    hashtags: result.hashtags?.length ? result.hashtags : fallback.hashtags,
    sponsor: result.sponsor || fallback.sponsor,
    analystTake: result.analystTake || fallback.analystTake,
    breakingNews: result.breakingNews || fallback.breakingNews,
    viralTweet: result.viralTweet || fallback.viralTweet,
    memeCaption: result.memeCaption || fallback.memeCaption,
  };
};

/**
 * Generate batch headlines for a specific event
 */
export const generateHeadlines = async (
  playerName: string,
  event: string,
  count: number = 5
): Promise<string[]> => {
  const prompt = buildHeadlinesPrompt(playerName, event, count);

  const result = await geminiGenerateJSON<{ headlines: string[] }>(
    prompt,
    { headlines: FALLBACK_HEADLINES }
  );

  return result.headlines?.length ? result.headlines : FALLBACK_HEADLINES;
};

/**
 * Generate a quick pre-match narrative (no match result needed)
 */
export const generatePreMatchStory = async (
  player: Player,
  opponentName: string
): Promise<Pick<StoryOutput, 'headline' | 'coach' | 'rival' | 'fans' | 'hashtags' | 'breakingNews'>> => {
  const story = await generateStory(player);

  return {
    headline: `${player.name.toUpperCase()} vs ${opponentName.toUpperCase()} — THE RIVALRY MATCH`,
    coach: story.coach,
    rival: story.rival,
    fans: story.fans,
    hashtags: story.hashtags,
    breakingNews: `BREAKING: ${player.name} faces biggest test of career tonight against ${opponentName}`,
  };
};
