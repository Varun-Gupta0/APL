import { Router } from 'express';
import {
  generateStoryController,
  generateCommentaryController,
  generateHeadlinesController,
  generatePreMatchStoryController,
} from '../controllers/story.controller';

const router = Router();

router.post('/generate-story', generateStoryController);
router.post('/generate-commentary', generateCommentaryController);
router.post('/generate-headlines', generateHeadlinesController);
router.post('/generate-pre-match', generatePreMatchStoryController);

export default router;
