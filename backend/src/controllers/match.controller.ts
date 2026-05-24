// ============================================================
// ATHLETE//ZERO — Match Controller (v2 — Cinematic Engine)
// ============================================================

import { Request, Response } from 'express';
import {
  startMatch,
  getCurrentMatch,
  getMatchEvents,
  getMatchHighlights,
  getOverSummaries,
  getMomentumGraph,
  getOverEvents,
  getMatchNarrative,
} from '../engines/match.engine';
import {
  getPlayer,
  applyMatchResults,
  generateDemoPlayer,
} from '../engines/player.engine';
import { calculateProgression } from '../services/progression.service';
import { generateCommentary, generatePreMatchCommentary } from '../engines/commentary.engine';
import { getSponsorOffers } from '../services/sponsor.service';
import { successResponse, errorResponse, pickRandom } from '../utils/index';
import { VENUES, OPPONENT_TEAMS } from '../config/index';
import type { MatchContext } from '../types/index';

export const startMatchController = async (req: Request, res: Response): Promise<void> => {
  try {
    let player = getPlayer();
    if (!player) player = generateDemoPlayer();

    const {
      opponentName = pickRandom(OPPONENT_TEAMS),
      opponentDifficulty = 5,
      rivalryIntensity = 50,
      venue = pickRandom(VENUES),
      matchType = 'T20',
      isPlayoffMatch = false,
    } = req.body;

    const context: MatchContext = {
      playerId: player.id,
      opponentName,
      opponentDifficulty: Math.min(10, Math.max(1, Number(opponentDifficulty))),
      rivalryIntensity: Math.min(100, Math.max(0, Number(rivalryIntensity))),
      venue,
      matchType,
      isPlayoffMatch,
    };

    // Run cinematic simulation with player personality for drama tuning
    const matchState = startMatch(context, player.name, player.personality);
    const { timeline } = matchState;

    // Calculate progression
    const isMVP = timeline.playerRuns >= 50 || timeline.playerWickets >= 3;
    const progression = calculateProgression(
      player,
      timeline.playerRuns,
      timeline.playerWickets,
      timeline.result === 'WIN',
      isMVP,
      isPlayoffMatch
    );

    // Apply results to player state
    const updatedPlayer = applyMatchResults(
      timeline.playerRuns,
      timeline.playerWickets,
      timeline.result === 'WIN',
      progression.xpGained,
      progression.followersGained,
      progression.confidenceChange,
      progression.reputationChange
    );

    // Sponsor offers based on performance
    const sponsors = getSponsorOffers(
      updatedPlayer.level,
      updatedPlayer.reputation,
      updatedPlayer.followers,
      timeline.result
    );

    // Pre-match commentary (instant, no AI)
    const preMatchCommentary = generatePreMatchCommentary(player.name, opponentName);

    res.json(
      successResponse(
        {
          match: {
            id: matchState.id,
            context: matchState.context,
            result: timeline.result,
            winType: timeline.winType,
            winMargin: timeline.winMargin,
            score: `${timeline.finalScore}/${timeline.finalWickets}`,
            target: timeline.targetScore,
            playerRuns: timeline.playerRuns,
            playerWickets: timeline.playerWickets,
            playerStrikeRate: timeline.playerStrikeRate,
            totalSixes: timeline.totalSixes,
            totalFours: timeline.totalFours,
            narrativeArc: timeline.narrativeArc,
            mvpMoment: timeline.mvpMoment,
            mvpBall: timeline.mvpBall,
            dramaticMoments: timeline.dramaticMoments,
            peakMomentum: timeline.peakMomentum,
            highestCrowdEnergy: timeline.highestCrowdEnergy,
            hypeScore: timeline.hypeScore,
            pressureIndex: timeline.pressureIndex,
            clutchFactor: timeline.clutchFactor,
            confidenceSwings: timeline.confidenceSwings,
            startedAt: matchState.startedAt,
            completedAt: matchState.completedAt,
          },
          highlights: getMatchHighlights().slice(0, 10),
          momentumGraph: getMomentumGraph(),
          overSummaries: getOverSummaries(),
          progression,
          updatedPlayer,
          sponsors,
          preMatchCommentary,
          xpEarned: matchState.xpEarned,
          followersGained: matchState.followersGained,
        },
        `${timeline.result === 'WIN' ? '🏆 VICTORY' : '💔 DEFEAT'} — ${player.name}: ${timeline.playerRuns} runs (SR: ${timeline.playerStrikeRate}) | ${timeline.winType.replace(/_/g, ' ')}`
      )
    );
  } catch (err) {
    res.status(500).json(errorResponse((err as Error).message));
  }
};

export const getMatchEventsController = (req: Request, res: Response): void => {
  try {
    const match = getCurrentMatch();
    if (!match) {
      res.status(404).json(errorResponse('No active match found. Start a match first.'));
      return;
    }

    const { over, highlightsOnly } = req.query;
    let events = over
      ? getOverEvents(parseInt(over as string, 10))
      : getMatchEvents();

    if (highlightsOnly === 'true') {
      events = events.filter((e) => e.isHighlight);
    }

    res.json(
      successResponse({
        events,
        totalEvents: events.length,
        score: `${match.timeline.finalScore}/${match.timeline.finalWickets}`,
        result: match.timeline.result,
        winType: match.timeline.winType,
        playerRuns: match.timeline.playerRuns,
      })
    );
  } catch (err) {
    res.status(500).json(errorResponse((err as Error).message));
  }
};

export const getOverSummariesController = (req: Request, res: Response): void => {
  try {
    const match = getCurrentMatch();
    if (!match) {
      res.status(404).json(errorResponse('No active match found.'));
      return;
    }

    const { act } = req.query;
    let overs = getOverSummaries();

    if (act) {
      overs = overs.filter((o) => o.act === act);
    }

    res.json(
      successResponse({
        overs,
        totalOvers: overs.length,
        score: `${match.timeline.finalScore}/${match.timeline.finalWickets}`,
      })
    );
  } catch (err) {
    res.status(500).json(errorResponse((err as Error).message));
  }
};

export const getMomentumController = (req: Request, res: Response): void => {
  try {
    const match = getCurrentMatch();
    if (!match) {
      res.status(404).json(errorResponse('No active match found.'));
      return;
    }

    res.json(
      successResponse({
        momentumGraph: getMomentumGraph(),
        peakMomentum: match.timeline.peakMomentum,
        highestCrowdEnergy: match.timeline.highestCrowdEnergy,
        result: match.timeline.result,
        winType: match.timeline.winType,
      })
    );
  } catch (err) {
    res.status(500).json(errorResponse((err as Error).message));
  }
};

export const getMatchNarrativeController = (req: Request, res: Response): void => {
  try {
    const match = getCurrentMatch();
    if (!match) {
      res.status(404).json(errorResponse('No active match found.'));
      return;
    }

    res.json(
      successResponse({
        narrative: getMatchNarrative(),
        dramaticMoments: match.timeline.dramaticMoments,
        mvpMoment: match.timeline.mvpMoment,
        mvpBall: match.timeline.mvpBall,
        result: match.timeline.result,
        winType: match.timeline.winType,
        winMargin: match.timeline.winMargin,
      })
    );
  } catch (err) {
    res.status(500).json(errorResponse((err as Error).message));
  }
};

export const getCommentaryController = async (req: Request, res: Response): Promise<void> => {
  try {
    let player = getPlayer();
    if (!player) player = generateDemoPlayer();

    const match = getCurrentMatch();

    const recentEvents = match
      ? match.timeline.events
          .filter((e) => e.isHighlight)
          .slice(-5)
          .map((e) => e.cinematic)
      : ['Player arrives at crease', 'Crowd buzzing with anticipation'];

    const phase = match
      ? match.timeline.overs[match.timeline.overs.length - 1]?.phase ?? 'DEATH'
      : 'DEATH';

    const hypeScore = match?.timeline.hypeScore ?? 50;
    const clutchFactor = match?.timeline.clutchFactor ?? 50;

    const commentary = await generateCommentary(player.name, recentEvents, phase, 10, hypeScore, clutchFactor);

    res.json(successResponse({ commentary, playerName: player.name }));
  } catch (err) {
    res.status(500).json(errorResponse((err as Error).message));
  }
};
