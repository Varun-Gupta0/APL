// ============================================================
// ATHLETE//ZERO — Progression System
// XP, Level, Followers, Reputation tracking
// ============================================================

import type { Player, ProgressionUpdate } from '../types/index';
import { randInt, clamp } from '../utils/index';
import { MILESTONE_TITLES } from '../mock/data';
import { XP_PER_LEVEL } from '../config/index';
import { calculateLevel } from '../engines/player.engine';

// ---- XP Reward Formulas ----
export const calculateMatchXP = (
  playerRuns: number,
  playerWickets: number,
  won: boolean,
  isMVP: boolean,
  isPlayoff: boolean
): number => {
  let xp = 0;
  xp += playerRuns * 2; // 2 XP per run
  xp += playerWickets * 15; // 15 XP per wicket
  xp += won ? 100 : 25; // Win/loss bonus
  xp += isMVP ? 75 : 0; // MVP bonus
  xp += isPlayoff ? 50 : 0; // Playoff bonus
  return Math.round(xp);
};

// ---- Follower Growth Formulas ----
export const calculateFollowerGrowth = (
  playerRuns: number,
  won: boolean,
  currentFollowers: number,
  reputation: number
): number => {
  const baseGrowth = won ? randInt(2000, 12000) : randInt(200, 2000);
  const runBonus = Math.floor(playerRuns * 50);
  const repMultiplier = 1 + reputation / 200; // Up to 1.5x
  return Math.round((baseGrowth + runBonus) * repMultiplier);
};

// ---- Confidence Change Formula ----
export const calculateConfidenceChange = (won: boolean, playerRuns: number): number => {
  if (won && playerRuns >= 50) return randInt(8, 15);
  if (won) return randInt(3, 8);
  if (playerRuns >= 30) return randInt(-3, 2);
  return -randInt(3, 10);
};

// ---- Reputation Change Formula ----
export const calculateReputationChange = (won: boolean, isMVP: boolean): number => {
  if (won && isMVP) return randInt(6, 12);
  if (won) return randInt(2, 6);
  return -randInt(1, 4);
};

// ---- Milestone Checker ----
export const checkMilestone = (
  player: Player,
  xpBefore: number,
  xpAfter: number,
  followersAfter: number
): string | null => {
  // Level-based milestone titles
  const newLevel = calculateLevel(xpAfter);
  const milestone = MILESTONE_TITLES.slice()
    .reverse()
    .find((m) => newLevel >= m.minLevel);

  if (newLevel > calculateLevel(xpBefore)) {
    return `Level ${newLevel}: ${milestone?.title ?? 'Rising Star'}`;
  }

  // Follower milestones
  const followerMilestones = [10000, 50000, 100000, 500000, 1000000];
  for (const threshold of followerMilestones) {
    if (followersAfter >= threshold && player.followers < threshold) {
      return `${(threshold / 1000).toFixed(0)}K Followers Milestone!`;
    }
  }

  // Run milestones
  const runMilestones = [100, 250, 500, 1000, 2500];
  const newTotalRuns = player.totalRuns;
  for (const threshold of runMilestones) {
    if (newTotalRuns >= threshold && player.totalRuns < threshold) {
      return `${threshold} Career Runs Achievement Unlocked!`;
    }
  }

  return null;
};

// ---- Public API ----

/**
 * Calculate full progression update from a match result
 */
export const calculateProgression = (
  player: Player,
  playerRuns: number,
  playerWickets: number,
  won: boolean,
  isMVP: boolean = false,
  isPlayoff: boolean = false
): ProgressionUpdate => {
  const xpGained = calculateMatchXP(playerRuns, playerWickets, won, isMVP, isPlayoff);
  const xpTotal = player.xp + xpGained;

  const levelBefore = player.level;
  const levelAfter = calculateLevel(xpTotal);
  const leveledUp = levelAfter > levelBefore;

  const followersGained = calculateFollowerGrowth(playerRuns, won, player.followers, player.reputation);
  const followersTotal = player.followers + followersGained;

  const confidenceChange = calculateConfidenceChange(won, playerRuns);
  const reputationChange = calculateReputationChange(won, isMVP);

  const unlockedMilestone = checkMilestone(player, player.xp, xpTotal, followersTotal);

  const newTitle = leveledUp
    ? MILESTONE_TITLES.slice().reverse().find((m) => levelAfter >= m.minLevel)?.title ?? null
    : null;

  return {
    xpGained,
    xpTotal,
    levelBefore,
    levelAfter,
    leveledUp,
    followersGained,
    followersTotal,
    confidenceChange,
    reputationChange,
    unlockedMilestone,
    newTitle,
  };
};

/**
 * Get XP required for the next level
 */
export const getXPToNextLevel = (currentXP: number): { current: number; required: number; percentage: number } => {
  const level = calculateLevel(currentXP);
  const currentThreshold = XP_PER_LEVEL[level - 1] ?? 0;
  const nextThreshold = XP_PER_LEVEL[level] ?? XP_PER_LEVEL[XP_PER_LEVEL.length - 1];

  const progress = currentXP - currentThreshold;
  const required = nextThreshold - currentThreshold;
  const percentage = clamp(Math.round((progress / required) * 100), 0, 100);

  return { current: currentXP, required: nextThreshold, percentage };
};
