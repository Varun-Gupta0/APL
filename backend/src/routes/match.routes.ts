import { Router } from 'express';
import {
  startMatchController,
  getMatchEventsController,
  getCommentaryController,
  getOverSummariesController,
  getMomentumController,
  getMatchNarrativeController,
} from '../controllers/match.controller';

const router = Router();

// Core simulation
router.post('/start-match', startMatchController);

// Event streams
router.get('/match-events', getMatchEventsController);         // ?over=N &highlightsOnly=true
router.get('/match-overs', getOverSummariesController);        // ?act=LAST_OVER_CHAOS
router.get('/match-momentum', getMomentumController);
router.get('/match-narrative', getMatchNarrativeController);

// Commentary
router.get('/commentary', getCommentaryController);

export default router;
