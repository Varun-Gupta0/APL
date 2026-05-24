import { Router } from 'express';
import {
  getRivalController,
  rivalResponseController,
  getAllRivalsController,
} from '../controllers/rival.controller';

const router = Router();

router.get('/rival', getRivalController);
router.get('/rivals', getAllRivalsController);
router.post('/rival-response', rivalResponseController);

export default router;
