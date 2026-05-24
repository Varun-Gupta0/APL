// ============================================================
// ATHLETE//ZERO — Rival Controller
// ============================================================

import { Request, Response } from 'express';
import {
  getRival,
  generateRivalTrashTalk,
  handleRivalResponse,
  getAllRivals,
  getRivalryIntensity,
} from '../engines/rival.engine';
import { getPlayer, generateDemoPlayer } from '../engines/player.engine';
import { getCurrentMatch } from '../engines/match.engine';
import { successResponse, errorResponse } from '../utils/index';

export const getRivalController = async (req: Request, res: Response): Promise<void> => {
  try {
    let player = getPlayer();
    if (!player) player = generateDemoPlayer();

    const match = getCurrentMatch();
    const rival = getRival(player.level);
    const intensityScore = getRivalryIntensity();

    // Generate fresh trash talk with AI
    const { ai = 'false' } = req.query;
    let trashTalk = rival.trashTalk;

    if (ai === 'true') {
      trashTalk = await generateRivalTrashTalk(
        rival.name,
        rival.personality,
        player.name,
        match?.timeline.playerRuns ?? 0,
        player.level
      );
    }

    res.json(
      successResponse({
        rival: { ...rival, trashTalk },
        rivalryIntensity: intensityScore,
        playerName: player.name,
        aiGenerated: ai === 'true',
      })
    );
  } catch (err) {
    res.status(500).json(errorResponse((err as Error).message));
  }
};

export const rivalResponseController = (req: Request, res: Response): void => {
  try {
    const { rivalId, response } = req.body;

    if (!rivalId || !response) {
      res.status(400).json(errorResponse('rivalId and response are required'));
      return;
    }

    const result = handleRivalResponse(rivalId, response);

    res.json(
      successResponse(result, 'Your response has been delivered. The drama escalates.')
    );
  } catch (err) {
    res.status(500).json(errorResponse((err as Error).message));
  }
};

export const getAllRivalsController = (_req: Request, res: Response): void => {
  res.json(successResponse({ rivals: getAllRivals() }));
};
