import { Router } from 'express';
import { createPlayerController, getPlayerController } from '../controllers/player.controller';

const router = Router();

router.post('/create-player', createPlayerController);
router.get('/player', getPlayerController);

export default router;
