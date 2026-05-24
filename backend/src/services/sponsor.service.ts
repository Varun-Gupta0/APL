// ============================================================
// ATHLETE//ZERO — Sponsor System Service
// ============================================================

import type { SponsorOffer } from '../types/index';
import { pickRandom, pickRandomN, randInt } from '../utils/index';
import { SPONSOR_POOL } from '../mock/data';

/**
 * Get sponsor offers based on player stats
 */
export const getSponsorOffers = (
  playerLevel: number,
  reputation: number,
  followers: number,
  matchResult: 'WIN' | 'LOSS' | 'TIED'
): SponsorOffer[] => {
  // More offers for winners with high reputation
  const offerCount =
    matchResult === 'WIN'
      ? Math.min(3, 1 + Math.floor(reputation / 30))
      : Math.min(1, Math.floor(reputation / 50));

  // Filter sponsors by eligibility
  const eligible = SPONSOR_POOL.filter((s) => {
    if (s.category === 'LUXURY') return reputation >= 60;
    if (s.isExclusive) return followers >= 50000 || playerLevel >= 5;
    return true;
  });

  const selected = pickRandomN(eligible.length > 0 ? eligible : SPONSOR_POOL, offerCount);

  // Adjust offer values based on follower count
  return selected.map((offer) => ({
    ...offer,
    offerValue: followers >= 100000
      ? offer.offerValue.replace('₹', '₹').replace(/\d+L/, (m) => `${parseInt(m) * 2}L`)
      : offer.offerValue,
  }));
};

/**
 * Get a single spotlight sponsor offer (post-match)
 */
export const getSpotlightOffer = (won: boolean): SponsorOffer => {
  if (won) {
    const premium = SPONSOR_POOL.filter((s) => s.isExclusive);
    return pickRandom(premium.length ? premium : SPONSOR_POOL);
  }
  const standard = SPONSOR_POOL.filter((s) => !s.isExclusive);
  return pickRandom(standard.length ? standard : SPONSOR_POOL);
};

/**
 * Get all sponsors (admin/debug)
 */
export const getAllSponsors = (): SponsorOffer[] => SPONSOR_POOL;
