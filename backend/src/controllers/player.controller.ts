// ============================================================
// ATHLETE//ZERO — Player Controller
// ============================================================

import { Request, Response } from 'express';
import {
  createPlayer,
  getPlayer,
  generateDemoPlayer,
} from '../engines/player.engine';
import { getXPToNextLevel } from '../services/progression.service';
import { successResponse, errorResponse } from '../utils/index';
import type { CreatePlayerDTO } from '../types/index';

export const createPlayerController = (req: Request, res: Response): void => {
  try {
    const dto = req.body as CreatePlayerDTO;

    if (!dto.name || !dto.role || !dto.personality) {
      res.status(400).json(errorResponse('Missing required fields: name, role, personality'));
      return;
    }

    const player = createPlayer(dto);
    const xpProgress = getXPToNextLevel(player.xp);

    res.status(201).json(
      successResponse(
        { player, xpProgress },
        `Welcome to ATHLETE//ZERO, ${player.name}! Your career begins NOW.`
      )
    );
  } catch (err) {
    res.status(500).json(errorResponse((err as Error).message));
  }
};

export const getPlayerController = (req: Request, res: Response): void => {
  try {
    const player = getPlayer();

    if (!player) {
      // Return a demo player if none exists
      const demo = generateDemoPlayer();
      const xpProgress = getXPToNextLevel(demo.xp);
      res.json(successResponse({ player: demo, xpProgress, isDemo: true }));
      return;
    }

    const xpProgress = getXPToNextLevel(player.xp);
    res.json(successResponse({ player, xpProgress }));
  } catch (err) {
    res.status(500).json(errorResponse((err as Error).message));
  }
};
