// ============================================================
// ATHLETE//ZERO — Social Feed Controller
// ============================================================

import { Request, Response } from 'express';
import { generateSocialFeed, getMockSocialFeed, getFanReactions } from '../engines/social.engine';
import { getPlayer, generateDemoPlayer } from '../engines/player.engine';
import { getCurrentMatch } from '../engines/match.engine';
import { successResponse, errorResponse } from '../utils/index';

export const getSocialFeedController = async (req: Request, res: Response): Promise<void> => {
  try {
    let player = getPlayer();
    if (!player) player = generateDemoPlayer();

    const match = getCurrentMatch();
    const { ai = 'false', sentiment = 'mixed' } = req.query;

    const matchSummary = match
      ? `${player.name} scored ${match.timeline.playerRuns} runs in a ${match.timeline.result} against ${match.context.opponentName}`
      : `${player.name} is a rising cricket star entering their first IPL season`;

    const validSentiment = ['mixed', 'positive', 'negative'].includes(sentiment as string)
      ? (sentiment as 'mixed' | 'positive' | 'negative')
      : 'mixed';

    // Pull emotional momentum from match if available
    const hypeScore = match?.timeline.hypeScore ?? 50;
    const clutchFactor = match?.timeline.clutchFactor ?? 50;

    // Use AI if requested, otherwise instant mock
    const feed =
      ai === 'true'
        ? await generateSocialFeed(player.name, matchSummary, validSentiment, hypeScore, clutchFactor)
        : getMockSocialFeed(player.name, validSentiment, hypeScore, clutchFactor);

    res.json(
      successResponse({
        feed,
        playerName: player.name,
        aiGenerated: ai === 'true',
      })
    );
  } catch (err) {
    res.status(500).json(errorResponse((err as Error).message));
  }
};

export const getFanReactionsController = (req: Request, res: Response): void => {
  try {
    let player = getPlayer();
    if (!player) player = generateDemoPlayer();

    const count = parseInt((req.query.count as string) || '6', 10);
    const reactions = getFanReactions(player.name, Math.min(count, 20));

    res.json(
      successResponse({
        reactions,
        count: reactions.length,
        playerName: player.name,
      })
    );
  } catch (err) {
    res.status(500).json(errorResponse((err as Error).message));
  }
};
