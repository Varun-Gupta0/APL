// ============================================================
// ATHLETE//ZERO — Story / AI Controller
// ============================================================

import { Request, Response } from 'express';
import { generateStory, generateHeadlines, generatePreMatchStory } from '../engines/story.engine';
import { getPlayer, generateDemoPlayer } from '../engines/player.engine';
import { getCurrentMatch } from '../engines/match.engine';
import { generateCommentary } from '../engines/commentary.engine';
import { successResponse, errorResponse, pickRandom } from '../utils/index';
import { OPPONENT_TEAMS } from '../config/index';

export const generateStoryController = async (req: Request, res: Response): Promise<void> => {
  try {
    let player = getPlayer();
    if (!player) player = generateDemoPlayer();

    const match = getCurrentMatch();
    const story = await generateStory(player, match?.timeline);

    res.json(
      successResponse({ story, playerName: player.name, aiGenerated: true })
    );
  } catch (err) {
    res.status(500).json(errorResponse((err as Error).message));
  }
};

export const generateCommentaryController = async (req: Request, res: Response): Promise<void> => {
  try {
    let player = getPlayer();
    if (!player) player = generateDemoPlayer();

    const { events = [], phase = 'DEATH', count = 10 } = req.body;

    const commentary = await generateCommentary(
      player.name,
      events.length > 0 ? events : ['Enormous six into the crowd', 'Wicket falls — huge moment'],
      phase,
      Number(count)
    );

    res.json(successResponse({ commentary, playerName: player.name, aiGenerated: true }));
  } catch (err) {
    res.status(500).json(errorResponse((err as Error).message));
  }
};

export const generateHeadlinesController = async (req: Request, res: Response): Promise<void> => {
  try {
    let player = getPlayer();
    if (!player) player = generateDemoPlayer();

    const { event = 'stunning match-winning performance', count = 5 } = req.body;

    const headlines = await generateHeadlines(player.name, event, Number(count));

    res.json(successResponse({ headlines, playerName: player.name, aiGenerated: true }));
  } catch (err) {
    res.status(500).json(errorResponse((err as Error).message));
  }
};

export const generatePreMatchStoryController = async (req: Request, res: Response): Promise<void> => {
  try {
    let player = getPlayer();
    if (!player) player = generateDemoPlayer();

    const { opponentName = pickRandom(OPPONENT_TEAMS) } = req.body;

    const story = await generatePreMatchStory(player, opponentName);

    res.json(successResponse({ story, playerName: player.name, opponentName, aiGenerated: true }));
  } catch (err) {
    res.status(500).json(errorResponse((err as Error).message));
  }
};
