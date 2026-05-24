// ============================================================
// ATHLETE//ZERO — Player State Engine
// In-memory store + CRUD operations for player state
// ============================================================

import { v4 as uuidv4 } from 'uuid';
import type {
  Player,
  CreatePlayerDTO,
  BattingStyle,
  BowlingStyle,
  PlayerRole,
  Personality,
  Specialty,
} from '../types/index';
import { randInt, pickRandom, now } from '../utils/index';

// ---- In-Memory Player Store ----
let currentPlayer: Player | null = null;

/**
 * Create a new player with calculated starter stats
 */
export const createPlayer = (dto: CreatePlayerDTO): Player => {
  // Personality-based stat bonuses
  const personalityBonus: Record<Personality, Partial<Player>> = {
    AGGRESSIVE: { confidence: 80, fitness: 70, reputation: 40 },
    CALM: { confidence: 65, fitness: 75, reputation: 50 },
    SHOWMAN: { confidence: 85, fitness: 65, reputation: 60, followers: 25000 },
    UNDERDOG: { confidence: 55, fitness: 80, reputation: 20 },
    VETERAN: { confidence: 75, fitness: 60, reputation: 70 },
  };

  // Specialty-based XP bonus
  const specialtyXP: Record<Specialty, number> = {
    BIG_HITTER: 50,
    SPIN_WIZARD: 60,
    PACE_KING: 55,
    CLUTCH_PLAYER: 80,
    STREET_FIGHTER: 40,
    ANCHOR: 65,
  };

  const bonus = personalityBonus[dto.personality];

  const player: Player = {
    id: uuidv4(),
    name: dto.name,
    role: dto.role,
    battingStyle: dto.battingStyle,
    bowlingStyle: dto.bowlingStyle,
    personality: dto.personality,
    specialty: dto.specialty,
    level: 1,
    xp: specialtyXP[dto.specialty],
    followers: bonus.followers ?? randInt(5000, 15000),
    confidence: bonus.confidence ?? randInt(55, 75),
    fitness: bonus.fitness ?? randInt(65, 80),
    reputation: bonus.reputation ?? randInt(20, 45),
    totalMatches: 0,
    totalRuns: 0,
    totalWickets: 0,
    createdAt: now(),
  };

  currentPlayer = player;
  console.log(`[PlayerEngine] Player created: ${player.name} (${player.id})`);
  return player;
};

/**
 * Get the current active player
 */
export const getPlayer = (): Player | null => currentPlayer;

/**
 * Update player stats (partial update)
 */
export const updatePlayer = (updates: Partial<Player>): Player => {
  if (!currentPlayer) throw new Error('No active player found');

  currentPlayer = {
    ...currentPlayer,
    ...updates,
    // Ensure numeric fields stay within valid ranges
    confidence: Math.min(100, Math.max(0, updates.confidence ?? currentPlayer.confidence)),
    fitness: Math.min(100, Math.max(0, updates.fitness ?? currentPlayer.fitness)),
    reputation: Math.min(100, Math.max(0, updates.reputation ?? currentPlayer.reputation)),
    followers: Math.max(0, updates.followers ?? currentPlayer.followers),
  };

  return currentPlayer;
};

/**
 * Apply post-match stat changes to player
 */
export const applyMatchResults = (
  runsScored: number,
  wicketsTaken: number,
  won: boolean,
  xpEarned: number,
  followersGained: number,
  confidenceChange: number,
  reputationChange: number
): Player => {
  if (!currentPlayer) throw new Error('No active player found');

  const updates: Partial<Player> = {
    totalMatches: currentPlayer.totalMatches + 1,
    totalRuns: currentPlayer.totalRuns + runsScored,
    totalWickets: currentPlayer.totalWickets + wicketsTaken,
    xp: currentPlayer.xp + xpEarned,
    followers: currentPlayer.followers + followersGained,
    confidence: currentPlayer.confidence + confidenceChange,
    reputation: currentPlayer.reputation + reputationChange,
    fitness: Math.max(40, currentPlayer.fitness - randInt(5, 15)), // Fatigue
  };

  // Level up check
  const newLevel = calculateLevel(updates.xp!);
  if (newLevel > currentPlayer.level) {
    updates.level = newLevel;
    console.log(`[PlayerEngine] LEVEL UP! ${currentPlayer.name} is now level ${newLevel}`);
  }

  return updatePlayer(updates);
};

/**
 * Calculate player level from XP
 */
export const calculateLevel = (xp: number): number => {
  const thresholds = [0, 100, 250, 500, 900, 1500, 2300, 3300, 4600, 6200, 10000];
  let level = 1;
  for (let i = 1; i < thresholds.length; i++) {
    if (xp >= thresholds[i]) level = i + 1;
    else break;
  }
  return Math.min(level, 15);
};

/**
 * Generate a demo player for testing
 */
export const generateDemoPlayer = (): Player => {
  return createPlayer({
    name: 'Aryan Sharma',
    role: 'ALL_ROUNDER',
    battingStyle: 'RIGHT_HAND',
    bowlingStyle: 'MEDIUM',
    personality: 'AGGRESSIVE',
    specialty: 'CLUTCH_PLAYER',
  });
};
