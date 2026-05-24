import { Router } from 'express';
import {
  getSocialFeedController,
  getFanReactionsController,
} from '../controllers/social.controller';

const router = Router();

router.get('/social-feed', getSocialFeedController);
router.get('/fan-reactions', getFanReactionsController);

export default router;
